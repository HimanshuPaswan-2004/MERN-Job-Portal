import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
  },
  description: {
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
  location: {
    type: String,
  },
  logo: {
    type: String,
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
