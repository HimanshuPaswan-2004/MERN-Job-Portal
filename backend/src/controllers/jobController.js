import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
export const createJob = async (req, res, next) => {
  try {
    const { title, company, description, location, jobType, experienceLevel, salary, skills, responsibilities, requirements, vacancies, remote } = req.body;

    // Verify company ownership
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      res.status(404);
      throw new Error('Company not found');
    }
    
    if (companyExists.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to post jobs for this company');
    }

    const job = await Job.create({
      ...req.body,
      recruiter: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with search/filters)
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, experienceLevel, minSalary, maxSalary, page = 1, limit = 10, sortBy = 'latest' } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    
    if (jobType) {
      const types = jobType.split(',').map(t => t.trim());
      query.jobType = { $in: types };
    }
    
    if (experienceLevel) {
      const levels = experienceLevel.split(',').map(t => t.trim());
      query.experienceLevel = { $in: levels };
    }
    
    if (minSalary) query['salary.max'] = { $gte: Number(minSalary) };
    if (maxSalary) query['salary.min'] = { $lte: Number(maxSalary) };

    let sortOption = { createdAt: -1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };
    else if (sortBy === 'salary') sortOption = { 'salary.min': -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry')
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOption);

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalJobs,
          totalPages: Math.ceil(totalJobs / Number(limit)),
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description website industry location companySize')
      .populate('recruiter', 'name');

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/my
// @access  Private/Recruiter
export const getMyJobs = async (req, res, next) => {
  try {
    const { search, status, jobType, location, company, sortBy } = req.query;

    // Fetch all recruiter jobs for summary statistics calculation
    const allRecruiterJobs = await Job.find({ recruiter: req.user._id }).populate('company', 'name logo');

    const totalJobs = allRecruiterJobs.length;
    const activeJobs = allRecruiterJobs.filter(j => j.status === 'active').length;
    const pausedJobs = allRecruiterJobs.filter(j => j.status === 'paused').length;
    const closedJobs = allRecruiterJobs.filter(j => j.status === 'closed').length;

    // Extract unique companies & locations for filter dropdown options
    const companies = Array.from(new Set(allRecruiterJobs.map(j => j.company?.name).filter(Boolean)));
    const locations = Array.from(new Set(allRecruiterJobs.map(j => j.location).filter(Boolean)));

    // Construct filter query for job list
    const query = { recruiter: req.user._id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { skills: { $in: [searchRegex] } }
      ];
    }

    if (status && status.toLowerCase() !== 'all status' && status.toLowerCase() !== 'all') {
      query.status = status.toLowerCase();
    }

    if (jobType && jobType.toLowerCase() !== 'all types' && jobType.toLowerCase() !== 'all') {
      query.jobType = jobType.toLowerCase();
    }

    if (location && location.toLowerCase() !== 'all locations' && location.toLowerCase() !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (company && company.toLowerCase() !== 'all companies' && company.toLowerCase() !== 'all') {
      const targetCompany = allRecruiterJobs.find(j => j.company?.name === company || j.company?._id?.toString() === company);
      if (targetCompany?.company?._id) {
        query.company = targetCompany.company._id;
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };

    let jobs = await Job.find(query)
      .populate('company', 'name logo')
      .sort(sortOptions);

    // Compute application stats per job using Application model
    const jobIds = jobs.map(j => j._id);
    const appStatsArr = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: '$job',
          totalApplicants: { $sum: 1 },
          inReviewCount: {
            $sum: { $cond: [{ $eq: ['$status', 'In Review'] }, 1, 0] }
          },
          interviewsCount: {
            $sum: { $cond: [{ $in: ['$status', ['Shortlisted', 'Hired']] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = {};
    appStatsArr.forEach(stat => {
      statsMap[stat._id.toString()] = {
        totalApplicants: stat.totalApplicants,
        inReviewCount: stat.inReviewCount,
        interviewsCount: stat.interviewsCount
      };
    });

    const jobsWithStats = jobs.map(job => {
      const jObj = job.toObject();
      jObj.stats = statsMap[job._id.toString()] || {
        totalApplicants: 0,
        inReviewCount: 0,
        interviewsCount: 0
      };
      return jObj;
    });

    if (sortBy === 'most_applicants' || sortBy === 'most applicants') {
      jobsWithStats.sort((a, b) => b.stats.totalApplicants - a.stats.totalApplicants);
    }

    res.status(200).json({
      success: true,
      summary: {
        totalJobs,
        activeJobs,
        pausedJobs,
        closedJobs
      },
      companies,
      locations,
      data: jobsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
// @access  Private/Recruiter
export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job status updated',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this job');
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate stats (total jobs, companies)
// @route   GET /api/jobs/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments({ status: 'active' });
    const totalCompanies = await Company.countDocuments();
    // In a real app we might count successful hires or users
    const successfulHires = 1250000; // Mocked for marketing

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalCompanies,
        successfulHires
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar jobs based on skills or category
// @route   GET /api/jobs/:id/similar
// @access  Public
export const getSimilarJobs = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Find jobs with overlapping skills or same category, but exclude the current job
    const similarJobs = await Job.find({
      _id: { $ne: job._id }, // Exclude current job
      status: 'active',
      $or: [
        { skills: { $in: job.skills } },
        { jobType: job.jobType }
      ]
    })
      .populate('company', 'name logo location industry')
      .limit(4)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: similarJobs,
    });
  } catch (error) {
    next(error);
  }
};
