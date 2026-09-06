import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/Candidate
export const applyForJob = async (req, res, next) => {
  try {
    const { resume, coverLetter } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existingApplication) {
      res.status(400);
      throw new Error('You have already applied for this job');
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resume || req.user.resume,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard data for candidate
// @route   GET /api/applications/dashboard
// @access  Private/Candidate
export const getDashboardData = async (req, res, next) => {
  try {
    // 1. Stats
    const applications = await Application.find({ applicant: req.user._id });
    
    let stats = {
      total: applications.length,
      inReview: applications.filter(a => a.status === 'In Review').length,
      interviews: applications.filter(a => a.status === 'Shortlisted').length, // Assuming shortlisted means interview
      offers: applications.filter(a => a.status === 'Hired').length,
    };

    // 2. Recent Applications
    const recentApplications = await Application.find({ applicant: req.user._id })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate({
        path: 'job',
        select: 'title company location jobType salary',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      });

    // 3. Recommended Jobs (Simple match based on user skills, or just active jobs if no skills)
    let recommendedQuery = { status: 'active' };
    if (req.user.skills && req.user.skills.length > 0) {
      recommendedQuery.skills = { $in: req.user.skills };
    }
    
    // Find jobs user hasn't applied to yet
    const appliedJobIds = applications.map(a => a.job);
    recommendedQuery._id = { $nin: appliedJobIds };

    const recommendedJobs = await Job.find(recommendedQuery)
      .populate('company', 'name logo')
      .limit(3)
      .sort({ createdAt: -1 });

    // 4. Latest Jobs
    const latestJobs = await Job.find({ status: 'active', _id: { $nin: appliedJobIds } })
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentApplications,
        recommendedJobs,
        latestJobs
      }
    });
  } catch (error) {
    next(error);
  }
};
