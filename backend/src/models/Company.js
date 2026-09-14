import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
  },
  description: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  fullDescription: {
    type: String,
  },
  website: {
    type: String,
  },
  industry: {
    type: String,
  },
  companySize: {
    type: String,
  },
  foundedYear: {
    type: String,
  },
  companyType: {
    type: String,
  },
  country: {
    type: String,
    default: 'India',
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  location: {
    type: String,
  },
  logo: {
    type: String,
  },
  linkedin: {
    type: String,
    default: '',
  },
  twitter: {
    type: String,
    default: '',
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);

export default Company;
