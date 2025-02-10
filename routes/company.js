const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const companyController = require('../controller/company');

//to post new company rgistration
router.post('/add', auth.authenticate, companyController.postAddnewCompany);
//to get a single company
router.get('/data/:id', auth.authenticate, companyController.getCompanyData);
//get all company data for the logged in user
router.get('/data', auth.authenticate, companyController.getAllCompanyData);
//update company record
router.put('/update/:id', auth.authenticate, companyController.updateCompany);
//delete the company
router.delete('/delete/:id', auth.authenticate, companyController.deleteCompany);

module.exports = router;