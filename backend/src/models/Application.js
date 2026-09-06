import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Shortlisted', 'Rejected', 'Hired'],
    default: 'Applied',
  },
  resume: {
    type: String, // URL to uploaded resume file
  },
  coverLetter: {
    type: String,
  }
}, {
  timestamps: true,
});

// Prevent multiple applications to the same job by the same user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
