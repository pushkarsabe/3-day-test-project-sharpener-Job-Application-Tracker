const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const contactController = require('../controller/contact');

//to post new contact rgistration
router.post('/add-contact', auth.authenticate, contactController.postAddnewContact);
//to get a single contact
router.get('/single-contact-data/:id', auth.authenticate, contactController.getContactData);
//get all contact data for the logged in user
router.get('/contact-data', auth.authenticate, contactController.getAllContactData);
//update contact record
router.put('/contact-update/:id', auth.authenticate, contactController.updateContact);

module.exports = router;