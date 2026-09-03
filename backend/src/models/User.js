import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    required: [true, 'Please specify role as candidate or recruiter'],
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  education: [
    {
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number,
    }
  ],
  experience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      currentlyWorking: Boolean,
      description: String,
    }
  ],
  resume: {
    type: String,
  }
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
