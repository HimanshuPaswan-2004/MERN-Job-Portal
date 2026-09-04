import Job from '../models/Job.js';
import Company from '../models/Company.js';

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
      title,
      company,
      recruiter: req.user._id,
      description,
      location,
      jobType,
      experienceLevel,
      salary,
      skills,
      responsibilities,
      requirements,
      vacancies,
      remote,
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
    
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary['max'] = { $gte: Number(minSalary) };
      if (maxSalary) query.salary['min'] = { $lte: Number(maxSalary) };
    }

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
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
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
