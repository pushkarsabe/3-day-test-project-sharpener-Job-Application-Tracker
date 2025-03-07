const JobTracker = require('../model/jobTracker');
const User = require('../model/user');
const cloudinary = require('../config/cloudinary');
const sendEmail = require('../config/emailService');
const schedule = require('node-schedule');

exports.postAddnewJob = async (req, res, next) => {
    // console.log("Received files:", req.files);
    try {
        let resumeUrl = null;
        let coverLetterUrl = null;

        const uploadToCloudinary = (file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "documents" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                ).end(file.buffer);
            });
        };


        if (req.files && req.files.resumes) {
            resumeUrl = await uploadToCloudinary(req.files.resumes[0]);
        }

        if (req.files && req.files.coverLetter) {
            coverLetterUrl = await uploadToCloudinary(req.files.coverLetter[0]);
        }

        // Create new job entry
        const newJob = await JobTracker.create({
            jobDescription: req.body.jobDescription,
            notes: req.body.notes,
            postedDate: req.body.postedDate,
            savedDate: req.body.savedDate,
            deadlineDate: req.body.deadlineDate,
            appliedDate: req.body.appliedDate,
            followUpDate: req.body.followUpDate,
            resumes: resumeUrl,
            coverLetter: coverLetterUrl,
            jobPosition: req.body.jobPosition,
            company: req.body.company,
            minimumSalary: req.body.minimumSalary,
            maximumSalary: req.body.maximumSalary,
            currency: req.body.currency,
            salaryPayPeriod: req.body.salaryPayPeriod,
            location: req.body.location,
            status: req.body.status,
            excitement: req.body.excitement,
            userId: req.user.id
        });

        if (!newJob) {
            return res.status(400).json({ message: "Job not created" });
        }

        if (req.body.followUpDate) {
            const followUpDate = new Date(req.body.followUpDate);
            let userid = req.user.id;
            let user = await User.findOne({ where: { id: userid } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            let userEmail = user.email;
            console.log("userEmail = ", userEmail);

            if (followUpDate > new Date()) {
                schedule.scheduleJob(followUpDate, async () => {
                    console.log(`Sending follow-up email to ${userEmail}`);
                    await sendEmail(userEmail, "Follow-up Reminder", "Reminder: It's time to follow up on your job application.", "");
                })
            }
        }
        res.status(201).json({ message: "Job created", newJob });

    } catch (err) {
        console.error("Post add job error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getJobData = async (req, res) => {
    try {
        let userid = req.params.id;
        console.log("getJobData userid = ", userid);
        let singleJobData = await JobTracker.findOne({
            where: { id: userid }
        });
        // console.log("singleJobData = ", singleJobData);
        res.status(200).json({ message: 'success', singleJobData: singleJobData });
    }
    catch (err) {
        console.error('Error fetching job data:', err);
        res.status(500).json({ message: 'Failed to get job data' });
    }
}

exports.getAllJobData = async (req, res) => {
    try {
        let allJobData = await JobTracker.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ message: 'success', allJobData: allJobData, isDeleted: false });
    }
    catch (err) {
        console.error('Error fetching all job data:', err);
        res.status(500).json({ message: 'Failed to get all job data' });
    }
}

exports.updateJob = async (req, res) => {
    try {
        const userid = req.params.id;
        console.log("updateJob...userid = ", userid);
        const { jobDescription, notes, postedDate, savedDate, deadlineDate, appliedDate, followUpDate, resumes, coverLetter, jobPosition, company, minimumSalary, maximumSalary, currency, salaryPayPeriod, location, status, excitement } = req.body;
        console.log('jobDescription = ' + jobDescription);
        console.log('notes = ' + notes);
        console.log('postedDate = ' + postedDate);
        console.log('savedDate = ' + savedDate);
        console.log('deadlineDate = ' + deadlineDate);
        console.log('appliedDate = ' + appliedDate);
        console.log('followUpDate = ' + followUpDate);
        console.log('resumes = ' + resumes);
        console.log('coverLetter = ' + coverLetter);
        console.log('jobPosition = ' + jobPosition);
        console.log('company = ' + company);
        console.log('minimumSalary = ' + minimumSalary);
        console.log('maximumSalary = ' + maximumSalary);
        console.log('currency = ' + currency);
        console.log('salaryPayPeriod = ' + salaryPayPeriod);
        console.log('location = ' + location);
        console.log('status = ' + status);
        console.log('excitement = ' + excitement);

        let job = await JobTracker.findOne({ where: { id: userid } });

        if (!job) {
            return res.status(404).json({ message: "job not found" });
        }
        //update if the user sends the data
        const updatedData = {};
        if (jobDescription) updatedData.jobDescription = jobDescription;
        if (notes) updatedData.notes = notes;
        if (postedDate) updatedData.postedDate = postedDate;
        if (savedDate) updatedData.savedDate = savedDate;
        if (deadlineDate) updatedData.deadlineDate = deadlineDate;
        if (appliedDate) updatedData.appliedDate = appliedDate;
        if (followUpDate) updatedData.followUpDate = followUpDate;
        if (resumes) updatedData.resumes = resumes;
        if (coverLetter) updatedData.coverLetter = coverLetter;
        if (jobPosition) updatedData.jobPosition = jobPosition;
        if (company) updatedData.company = company;
        if (minimumSalary) updatedData.minimumSalary = minimumSalary;
        if (maximumSalary) updatedData.maximumSalary = maximumSalary;
        if (currency) updatedData.currency = currency;
        if (salaryPayPeriod) updatedData.salaryPayPeriod = salaryPayPeriod;
        if (location) updatedData.location = location;
        if (status) updatedData.status = status;
        if (excitement) updatedData.excitement = excitement;

        await job.update(updatedData);

        res.status(200).json({
            message: "job updated successfully",
            job: updatedData
        });
    }
    catch (err) {
        console.error('Error fetching job data:', err);
        res.status(500).json({ message: 'An error occurred while updating job data', error: err })
    }
}
exports.deleteJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobId = req.params.id;
        console.log('deleteJob userId =', userId, 'jobId =', jobId);

        let jobData = await JobTracker.findOne({
            where: { id: jobId, userId: userId, isDeleted: false }
        });

        if (!jobData) {
            return res.status(404).json({ message: 'Job not found or already deleted' });
        }

        const [updatedCount] = await JobTracker.update(
            { isDeleted: true },
            { where: { id: jobId, userId: userId } }
        );
        console.error('updatedCount:', updatedCount);

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Job not found or update failed' });
        }

        res.status(200).json({ message: 'Job marked as deleted' });
    }
    catch (err) {
        console.error('Error delete Job data:', err);
        res.status(500).json({ message: 'Failed to delete Job data' });
    }
};
