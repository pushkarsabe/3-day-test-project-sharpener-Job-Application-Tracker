const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const contactController = require('../controller/contact');

//to post new contact rgistration
router.post('/add', auth.authenticate, contactController.postAddnewContact);
//to get a single contact
router.get('/data/:id', auth.authenticate, contactController.getContactData);
//get all contact data for the logged in user
router.get('/data', auth.authenticate, contactController.getAllContactData);
//update contact record
router.put('/update/:id', auth.authenticate, contactController.updateContact);
//delete the contact
router.delete('/delete/:id', auth.authenticate, contactController.deleteContact);

module.exports = router;