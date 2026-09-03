import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a job location'],
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'remote'],
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', '1-2 years', '2-4 years', '5+ years'],
    required: true,
  },
  salary: {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    }
  },
  skills: {
    type: [String],
    required: true,
  },
  responsibilities: {
    type: [String],
  },
  requirements: {
    type: [String],
  },
  vacancies: {
    type: Number,
    default: 1,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'expired'],
    default: 'active',
  }
}, {
  timestamps: true,
});

// Text index for search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
