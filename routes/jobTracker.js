const express = require('express');
const auth = require('../middleware/auth');
const jobTrackerController = require('../controller/jobTracker');
const uploadFields = require('../config/fileUpload');
let router = express.Router();

//to post new charity rgistration
router.post('/add', auth.authenticate, uploadFields, jobTrackerController.postAddnewJob);
//to get a single charity
router.get('/data/:id', auth.authenticate, jobTrackerController.getJobData);
//get all charity data for the logged in user
router.get('/data', auth.authenticate, jobTrackerController.getAllJobData);
//update charity record
router.put('/update/:id', auth.authenticate, jobTrackerController.updateJob);
//delete the job
router.delete('/delete/:id', auth.authenticate, jobTrackerController.deleteJob);

module.exports = router;;
