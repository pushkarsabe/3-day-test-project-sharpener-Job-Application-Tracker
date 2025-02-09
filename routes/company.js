const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const companyController = require('../controller/company');

//to post new company rgistration
router.post('/add-company', auth.authenticate, companyController.postAddnewCompany);
//to get a single company
router.get('/single-company-data/:id', auth.authenticate, companyController.getCompanyData);
//get all company data for the logged in user
router.get('/company-data', auth.authenticate, companyController.getAllCompanyData);
//update company record
router.put('/company-update/:id', auth.authenticate, companyController.updateCompany);

module.exports = router;