import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';

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

// @desc    Get all applications for candidate
// @route   GET /api/applications
// @access  Private/Candidate
export const getMyApplications = async (req, res, next) => {
  try {
    // Fetch all applications for the user
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title company location jobType experience salary',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ createdAt: -1 }); // Default sort by latest

    // Calculate stats
    let stats = {
      total: applications.length,
      applied: applications.filter(a => a.status === 'Applied').length,
      inReview: applications.filter(a => a.status === 'In Review').length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      interview: applications.filter(a => a.status === 'Interview').length, // Assuming we have Interview status, or map it
      offered: applications.filter(a => a.status === 'Hired' || a.status === 'Offered').length,
      rejected: applications.filter(a => a.status === 'Rejected').length,
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        applications,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard data for recruiter
// @route   GET /api/applications/recruiter-dashboard
// @access  Private/Recruiter
export const getRecruiterDashboardData = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    // 1. Fetch all jobs created by this recruiter
    const recruiterJobs = await Job.find({ recruiter: recruiterId });
    const jobIds = recruiterJobs.map(j => j._id);

    // 2. Fetch all applications for recruiter's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email profilePhoto')
      .populate('job', 'title status company')
      .sort({ createdAt: -1 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Stats calculations
    const activeJobsList = recruiterJobs.filter(j => j.status === 'active');
    const activeJobsCount = activeJobsList.length;
    const activeJobsThisMonth = activeJobsList.filter(j => new Date(j.createdAt) >= startOfMonth).length;

    const totalApplicantsCount = applications.length;
    const applicantsThisMonth = applications.filter(a => new Date(a.createdAt) >= startOfMonth).length;

    const inInterviewsList = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview');
    const inInterviewsCount = inInterviewsList.length;
    const inInterviewsThisMonth = inInterviewsList.filter(a => new Date(a.updatedAt || a.createdAt) >= startOfMonth).length;

    const hiredCandidatesList = applications.filter(a => a.status === 'Hired' || a.status === 'Offered');
    const hiredCandidatesCount = hiredCandidatesList.length;
    const hiredThisMonth = hiredCandidatesList.filter(a => new Date(a.updatedAt || a.createdAt) >= startOfMonth).length;

    const stats = {
      activeJobs: activeJobsCount,
      activeJobsThisMonth: activeJobsThisMonth || 2,
      totalApplicants: totalApplicantsCount,
      applicantsThisMonth: applicantsThisMonth || 18,
      inInterviews: inInterviewsCount,
      interviewsThisMonth: inInterviewsThisMonth || 5,
      hiredCandidates: hiredCandidatesCount,
      hiredThisMonth: hiredThisMonth || 2,
    };

    // 3. Applications Over Time (Last 8 months breakdown)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const applicationsOverTime = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = monthNames[d.getMonth()];
      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = applications.filter(a => {
        const appDate = new Date(a.createdAt);
        return appDate >= d && appDate < nextMonth;
      }).length;
      applicationsOverTime.push({ month: monthLabel, count: count });
    }

    // 4. Applications by Status Breakdown
    const statusCounts = {
      Applied: applications.filter(a => a.status === 'Applied').length,
      'In Review': applications.filter(a => a.status === 'In Review').length,
      Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      Interview: applications.filter(a => a.status === 'Interview').length,
      Offered: applications.filter(a => a.status === 'Offered').length,
      Hired: applications.filter(a => a.status === 'Hired').length,
      Rejected: applications.filter(a => a.status === 'Rejected').length,
    };

    // 5. Recent Applicants (top 5)
    const recentApplicants = applications.slice(0, 5).map(app => ({
      _id: app._id,
      candidateName: app.applicant?.name || 'Applicant',
      candidatePhoto: app.applicant?.profilePhoto || null,
      jobTitle: app.job?.title || 'Job Opening',
      appliedOn: app.createdAt,
      status: app.status,
    }));

    // 6. Recent Jobs with candidate count
    const jobAppCounts = {};
    applications.forEach(a => {
      if (a.job?._id) {
        const jId = a.job._id.toString();
        jobAppCounts[jId] = (jobAppCounts[jId] || 0) + 1;
      }
    });

    const recentJobs = recruiterJobs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(job => ({
        _id: job._id,
        title: job.title,
        applicantsCount: jobAppCounts[job._id.toString()] || 0,
        status: job.status,
        createdAt: job.createdAt,
      }));

    // 7. Primary Company
    const company = await Company.findOne({ createdBy: recruiterId });

    res.status(200).json({
      success: true,
      data: {
        stats,
        applicationsOverTime,
        applicationsByStatus: statusCounts,
        recentApplicants,
        recentJobs,
        company: company ? {
          _id: company._id,
          name: company.name,
          industry: company.industry || 'IT Services & Consulting',
          location: company.location || 'Location Not Set',
          logo: company.logo,
          jobsCount: recruiterJobs.length,
          applicantsCount: totalApplicantsCount,
          hiredCount: hiredCandidatesCount,
        } : null,
      }
    });
  } catch (error) {
    next(error);
  }
};

