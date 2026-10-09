import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          user
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Optional fields - allow setting to empty string to clear
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.location !== undefined) user.location = req.body.location;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.gender !== undefined && req.body.gender) user.gender = req.body.gender;
      if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
      if (req.body.github !== undefined) user.github = req.body.github;
      if (req.body.portfolio !== undefined) user.portfolio = req.body.portfolio;
      if (req.body.tagline !== undefined) user.tagline = req.body.tagline;
      if (req.body.preferredJobType !== undefined && req.body.preferredJobType) user.preferredJobType = req.body.preferredJobType;
      if (req.body.expectedSalary !== undefined) user.expectedSalary = req.body.expectedSalary;
      if (req.body.profilePhoto !== undefined && req.body.profilePhoto) user.profilePhoto = req.body.profilePhoto;
      
      // Handle dateOfBirth - allow clearing with empty string
      if (req.body.dateOfBirth !== undefined) {
        user.dateOfBirth = req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null;
      }
      
      // Update arrays - allow clearing with empty array
      if (Array.isArray(req.body.skills)) user.skills = req.body.skills;
      if (Array.isArray(req.body.education)) user.education = req.body.education;
      if (Array.isArray(req.body.experience)) user.experience = req.body.experience;
      if (req.body.resume !== undefined && req.body.resume) user.resume = req.body.resume;

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
