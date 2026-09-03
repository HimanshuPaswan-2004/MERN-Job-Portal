import Company from '../models/Company.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Recruiter
export const createCompany = async (req, res, next) => {
  try {
    const { name, description, website, industry, companySize, location } = req.body;
    
    let logoUrl = '';
    
    // Check if file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jobportal_companies',
      });
      logoUrl = result.secure_url;
      // Remove file from local storage after uploading
      fs.unlinkSync(req.file.path);
    }

    const company = await Company.create({
      name,
      description,
      website,
      industry,
      companySize,
      location,
      logo: logoUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in recruiter's companies
// @route   GET /api/companies/my
// @access  Private/Recruiter
export const getMyCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Recruiter
export const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    // Ensure the user owns the company
    if (company.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this company');
    }

    let logoUrl = company.logo;
    
    // Check if new file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jobportal_companies',
      });
      logoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedData = { ...req.body };
    if (req.file) updatedData.logo = logoUrl;

    company = await Company.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Recruiter
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    // Ensure the user owns the company
    if (company.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this company');
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
