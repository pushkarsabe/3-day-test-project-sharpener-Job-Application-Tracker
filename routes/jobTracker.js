const express = require('express');
const auth = require('../middleware/auth');
const jobTrackerController = require('../controller/jobTracker');

let router = express.Router();

//to post new charity rgistration
router.post('/add-job', auth.authenticate, jobTrackerController.postAddnewJob);
//to get a single charity
router.get('/single-job-data/:id', auth.authenticate, jobTrackerController.getJobData);
//get all charity data for the logged in user
router.get('/job-data', auth.authenticate, jobTrackerController.getAllJobData);
//update charity record
router.put('/charity-update/:id', auth.authenticate, jobTrackerController.updateJob);

module.exports = router;;
