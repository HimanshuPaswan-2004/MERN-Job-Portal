import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Company.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});

        const hashedPassword = await bcrypt.hash("password123", 10);

        // Create 2 Recruiters
        const recruiter1 = await User.create({
            fullname: "John Recruiter",
            email: "recruiter@test.com",
            phoneNumber: "9876543210",
            password: hashedPassword,
            role: "recruiter",
            profile: { bio: "HR at Tech Corp" }
        });

        const recruiter2 = await User.create({
            fullname: "Sarah HR",
            email: "sarah@test.com",
            phoneNumber: "9876543211",
            password: hashedPassword,
            role: "recruiter",
            profile: { bio: "Talent Acquisition at Global Solutions" }
        });

        // Create 3 Students
        const student1 = await User.create({
            fullname: "Alice Student",
            email: "student@test.com",
            phoneNumber: "9988776655",
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Aspiring Software Engineer",
                skills: ["React", "Node.js", "MongoDB"],
                resume: "https://example.com/resume.pdf",
                resumeOriginalName: "Alice_Resume.pdf"
            }
        });

        const student2 = await User.create({
            fullname: "Bob Learner",
            email: "bob@test.com",
            phoneNumber: "9988776656",
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Data Science Enthusiast",
                skills: ["Python", "Machine Learning", "SQL"],
            }
        });

        const student3 = await User.create({
            fullname: "Charlie Dev",
            email: "charlie@test.com",
            phoneNumber: "9988776657",
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Full Stack Developer",
                skills: ["Angular", "Express", "Docker"],
            }
        });

        // Create Companies
        const company1 = await Company.create({
            name: "Tech Solutions Inc",
            description: "Leading software development company.",
            website: "https://techsolutions.com",
            location: "Bangalore",
            userId: recruiter1._id,
            logo: "https://github.com/shadcn.png"
        });

        const company2 = await Company.create({
            name: "Innovate AI",
            description: "Building the future with AI.",
            website: "https://innovateai.com",
            location: "Pune",
            userId: recruiter1._id,
            logo: "https://github.com/shadcn.png"
        });

        const company3 = await Company.create({
            name: "CloudScale",
            description: "Cloud infrastructure for the modern web.",
            website: "https://cloudscale.com",
            location: "Hyderabad",
            userId: recruiter2._id,
            logo: "https://github.com/shadcn.png"
        });

        const company4 = await Company.create({
            name: "Fintech Pro",
            description: "Next-gen payment solutions.",
            website: "https://fintechpro.com",
            location: "Mumbai",
            userId: recruiter2._id,
            logo: "https://github.com/shadcn.png"
        });

        // Create Jobs
        const jobsData = [
            {
                title: "Frontend Developer",
                description: "Looking for a skilled React developer to build modern web apps.",
                requirements: "React, Redux, TailwindCSS",
                salary: 12,
                location: "Bangalore",
                jobType: "Full Time",
                experienceLevel: 2,
                position: 3,
                company: company1._id,
                created_by: recruiter1._id
            },
            {
                title: "Backend Engineer",
                description: "Join our core infrastructure team to build scalable microservices.",
                requirements: "Node.js, Express, MongoDB",
                salary: 15,
                location: "Pune",
                jobType: "Full Time",
                experienceLevel: 3,
                position: 2,
                company: company2._id,
                created_by: recruiter1._id
            },
            {
                title: "UI/UX Designer",
                description: "Design intuitive user interfaces for our AI tools.",
                requirements: "Figma, Adobe XD",
                salary: 8,
                location: "Remote",
                jobType: "Part Time",
                experienceLevel: 1,
                position: 1,
                company: company2._id,
                created_by: recruiter1._id
            },
            {
                title: "DevOps Engineer",
                description: "Manage our cloud deployment and CI/CD pipelines.",
                requirements: "AWS, Docker, Kubernetes, Jenkins",
                salary: 20,
                location: "Hyderabad",
                jobType: "Full Time",
                experienceLevel: 4,
                position: 1,
                company: company3._id,
                created_by: recruiter2._id
            },
            {
                title: "Data Scientist",
                description: "Analyze large datasets and build predictive models.",
                requirements: "Python, TensorFlow, Scikit-Learn",
                salary: 18,
                location: "Remote",
                jobType: "Full Time",
                experienceLevel: 3,
                position: 2,
                company: company3._id,
                created_by: recruiter2._id
            },
            {
                title: "Mobile App Developer",
                description: "Develop cross-platform apps using React Native.",
                requirements: "React Native, JavaScript, Firebase",
                salary: 10,
                location: "Bangalore",
                jobType: "Contract",
                experienceLevel: 2,
                position: 4,
                company: company1._id,
                created_by: recruiter1._id
            },
            {
                title: "Security Analyst",
                description: "Ensure the security of our payment gateways.",
                requirements: "Cybersecurity, Penetration Testing, OWASP",
                salary: 14,
                location: "Mumbai",
                jobType: "Full Time",
                experienceLevel: 3,
                position: 1,
                company: company4._id,
                created_by: recruiter2._id
            },
            {
                title: "Product Manager",
                description: "Lead product development lifecycle.",
                requirements: "Agile, Jira, Product Strategy",
                salary: 25,
                location: "Pune",
                jobType: "Full Time",
                experienceLevel: 5,
                position: 1,
                company: company2._id,
                created_by: recruiter1._id
            }
        ];

        const createdJobs = await Job.insertMany(jobsData);

        // Create Applications
        const app1 = await Application.create({
            job: createdJobs[0]._id, // Frontend Developer
            applicant: student1._id,
            status: "pending"
        });
        const app2 = await Application.create({
            job: createdJobs[1]._id, // Backend Engineer
            applicant: student1._id,
            status: "accepted"
        });
        const app3 = await Application.create({
            job: createdJobs[4]._id, // Data Scientist
            applicant: student2._id,
            status: "pending"
        });
        const app4 = await Application.create({
            job: createdJobs[0]._id, // Frontend Developer (Charlie also applies)
            applicant: student3._id,
            status: "pending"
        });

        // Push applications to jobs
        const job0 = await Job.findById(createdJobs[0]._id);
        job0.applications.push(app1._id, app4._id);
        await job0.save();

        const job1 = await Job.findById(createdJobs[1]._id);
        job1.applications.push(app2._id);
        await job1.save();

        const job4 = await Job.findById(createdJobs[4]._id);
        job4.applications.push(app3._id);
        await job4.save();

        console.log("Mock data with more jobs and users added successfully!");
        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("Error seeding DB:", error);
        mongoose.connection.close();
        process.exit(1);
    }
}

seedDB();
