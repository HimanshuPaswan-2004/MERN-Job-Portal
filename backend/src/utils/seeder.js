import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env file!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Users
    const recruiterUser = await User.create({
      name: 'TechNova HR',
      email: 'hr@technova.com',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 9876543210',
      location: 'Bangalore, India',
    });

    const candidateUser = await User.create({
      name: 'Rahul Sharma',
      email: 'candidate@example.com',
      password: 'password123',
      role: 'candidate',
      phone: '+91 9123456789',
      location: 'Bangalore, India',
      tagline: 'Full Stack MERN Developer | React & Node.js Specialist',
      bio: 'Passionate software engineer with 3+ years of experience building modern web applications with React, Node.js, Express, and MongoDB.',
      skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git'],
      education: [
        {
          institution: 'BMS College of Engineering',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science',
          startYear: 2019,
          endYear: 2023,
        },
      ],
      experience: [
        {
          company: 'InnoTech Labs',
          position: 'Frontend Developer',
          startDate: new Date('2023-06-01'),
          currentlyWorking: true,
          description: 'Building responsive user interfaces with React and Tailwind CSS.',
        },
      ],
      preferredJobType: 'Full Time',
      expectedSalary: '12 - 15 LPA',
    });

    const candidate2 = await User.create({
      name: 'Priya Verma',
      email: 'priya@example.com',
      password: 'password123',
      role: 'candidate',
      phone: '+91 9876123456',
      location: 'Delhi, India',
      tagline: 'Frontend Developer & UI/UX Enthusiast',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma'],
    });

    console.log('Created Users (Candidate & Recruiter).');

    // 2. Create Company
    const company = await Company.create({
      name: 'TechNova Solutions',
      description: 'TechNova Solutions is a fast-growing technology services company specializing in modern cloud architecture, AI solutions, and full-stack web applications for enterprise clients worldwide.',
      shortDescription: 'Enterprise IT Services & Web Solutions Provider',
      fullDescription: 'TechNova Solutions empowers organizations to accelerate digital transformation through cutting-edge technology platforms.',
      website: 'https://technova.example.com',
      industry: 'IT Services & Consulting',
      companySize: '201-500 employees',
      foundedYear: 2018,
      companyType: 'Private',
      country: 'India',
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Indiranagar 100ft Road, Bangalore',
      location: 'Bangalore, Karnataka, India',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200',
      status: 'Active',
      createdBy: recruiterUser._id,
    });

    const company2 = await Company.create({
      name: 'CloudScale Labs',
      description: 'CloudScale Labs develops scalable cloud-native infrastructure software and microservice frameworks.',
      shortDescription: 'Cloud Infrastructure & DevOps Products',
      website: 'https://cloudscale.example.com',
      industry: 'Software Product',
      companySize: '50-200 employees',
      foundedYear: 2021,
      country: 'India',
      city: 'Hyderabad',
      state: 'Telangana',
      location: 'Hyderabad, Telangana, India',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200',
      status: 'Active',
      createdBy: recruiterUser._id,
    });

    console.log('Created Companies.');

    // 3. Create Jobs
    const job1 = await Job.create({
      title: 'Senior MERN Stack Engineer',
      company: company._id,
      recruiter: recruiterUser._id,
      description: 'We are seeking an experienced Senior MERN Stack Engineer to lead our core product development. You will architect scalable Node.js microservices and craft high-performance React frontends.',
      responsibilities: [
        'Design and develop high-throughput RESTful APIs using Node.js and Express.',
        'Build responsive, intuitive frontend components using React 18, Hooks, and Redux/Context.',
        'Optimize MongoDB schema designs and query performance.',
        'Collaborate with product managers and designers to launch new features.',
      ],
      requirements: [
        '3+ years of experience with MongoDB, Express, React, and Node.js.',
        'Solid understanding of JavaScript/TypeScript ES6+, async programming, and state management.',
        'Experience with Cloud services (AWS/GCP), Docker, and CI/CD pipelines is a plus.',
      ],
      skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript', 'AWS'],
      location: 'Bangalore, India',
      city: 'Bangalore',
      country: 'India',
      jobType: 'full-time',
      experienceLevel: '2-4 years',
      workMode: 'Hybrid',
      vacancies: 3,
      salary: { min: 1400000, max: 2200000 },
      salaryText: '₹14 - 22 LPA',
      remote: false,
      status: 'active',
    });

    const job2 = await Job.create({
      title: 'Frontend Developer (React)',
      company: company._id,
      recruiter: recruiterUser._id,
      description: 'Join TechNova as a Frontend Developer. You will be responsible for creating slick, interactive user interfaces for our global SaaS platform.',
      responsibilities: [
        'Develop clean, maintainable React components using Tailwind CSS.',
        'Integrate REST APIs and manage client-side state smoothly.',
        'Ensure cross-browser compatibility and responsive UI layouts.',
      ],
      requirements: [
        '1-3 years of hands-on experience with React.js and modern CSS frameworks.',
        'Strong knowledge of HTML5, CSS3, JavaScript, and Web Performance optimization.',
      ],
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux', 'REST API'],
      location: 'Bangalore, India',
      city: 'Bangalore',
      country: 'India',
      jobType: 'full-time',
      experienceLevel: '1-2 years',
      workMode: 'On-site',
      vacancies: 2,
      salary: { min: 800000, max: 1400000 },
      salaryText: '₹8 - 14 LPA',
      remote: false,
      status: 'active',
    });

    const job3 = await Job.create({
      title: 'Backend Developer (Node.js & Microservices)',
      company: company2._id,
      recruiter: recruiterUser._id,
      description: 'CloudScale Labs is looking for a Backend Engineer to build robust cloud microservices and high-concurrency data pipelines.',
      responsibilities: [
        'Architect REST APIs and WebSockets for real-time data streaming.',
        'Maintain MongoDB and PostgreSQL database schemas and indexing.',
        'Implement authentication, authorization, and API security protocols.',
      ],
      requirements: [
        '2+ years of backend development experience with Node.js and Express.',
        'Good grasp of relational and NoSQL databases.',
      ],
      skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Redis'],
      location: 'Hyderabad, India',
      city: 'Hyderabad',
      country: 'India',
      jobType: 'full-time',
      experienceLevel: '2-4 years',
      workMode: 'Remote',
      vacancies: 4,
      salary: { min: 1200000, max: 1800000 },
      salaryText: '₹12 - 18 LPA',
      remote: true,
      status: 'active',
    });

    console.log('Created Jobs.');

    // 4. Create Applications
    await Application.create({
      job: job1._id,
      applicant: candidateUser._id,
      status: 'In Review',
      coverLetter: 'I am excited to apply for the Senior MERN Stack Engineer role at TechNova. My experience in React and Node.js aligns perfectly with your requirements.',
    });

    await Application.create({
      job: job2._id,
      applicant: candidateUser._id,
      status: 'Shortlisted',
      coverLetter: 'I have strong skills in building responsive React applications with Tailwind CSS.',
    });

    await Application.create({
      job: job1._id,
      applicant: candidate2._id,
      status: 'Applied',
      coverLetter: 'I would love to contribute my frontend expertise to your flagship product.',
    });

    console.log('Created Sample Applications.');
    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Recruiter Login: hr@technova.com / password123');
    console.log('Candidate Login: candidate@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
