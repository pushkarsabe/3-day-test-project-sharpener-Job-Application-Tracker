const Company = require('../model/company');
require('dotenv').config();

exports.postAddnewCompany = async (req, res, next) => {
    try {
        const name = req.body.name;
        const companySize = req.body.companySize;
        const companyType = req.body.companyType;
        const location = req.body.location;
        const website = req.body.website;
        const linkedIn = req.body.linkedIn;
        const yearFounded = req.body.yearFounded;
        const notes = req.body.notes;
        console.log('name = ' + name);
        console.log('companySize = ' + companySize);
        console.log('companyType = ' + companyType);
        console.log('location = ' + location);
        console.log('website = ' + website);
        console.log('linkedIn = ' + linkedIn);
        console.log('yearFounded = ' + yearFounded);
        console.log('notes = ' + notes);

        const newCompany = await Company.create({
            name: name,
            companySize: companySize,
            companyType: companyType,
            location: location,
            website: website,
            linkedIn: linkedIn,
            yearFounded: yearFounded,
            notes: notes,
            userId: req.user.id
        });

        if (!newCompany) {
            return res.status(404).json({ message: 'Company not craeted' });
        }

        res.status(200).json({ message: 'Company created', newCompany: newCompany })
    } catch (err) {
        console.log("post add Company error = ", err);
        res.status(500).json({
            error: err,
        })
    }
}

exports.getCompanyData = async (req, res) => {
    try {
        let userid = req.params.id;
        console.log("getCompanyData userid = ", userid);
        let singleCompanyData = await Company.findOne({
            where: { id: userid }
        });
        // console.log("singleCompanyData = ", singleCompanyData);
        res.status(200).json({ message: 'success', singleCompanyData: singleCompanyData });
    }
    catch (err) {
        console.error('Error fetching Company data:', err);
        res.status(500).json({ message: 'Failed to get Company data' });
    }
}

exports.getAllCompanyData = async (req, res) => {
    try {
        let allCompanyData = await Company.findAll(
            {
                where:
                {
                    userId: req.user.id,
                    isDeleted: false
                }
            });
        res.status(200).json({ message: 'success', allCompanyData: allCompanyData });
    }
    catch (err) {
        console.error('Error fetching all Company data:', err);
        res.status(500).json({ message: 'Failed to get all Company data' });
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const userid = req.params.id;
        console.log("updateCompany...userid = ", userid);
        const { name, companySize, companyType, location, website, linkedIn, yearFounded, notes } = req.body;
        console.log('name = ' + name);
        console.log('companySize = ' + companySize);
        console.log('companyType = ' + companyType);
        console.log('location = ' + location);

        console.log('website = ' + website);
        console.log('linkedIn = ' + linkedIn);
        console.log('yearFounded = ' + yearFounded);
        console.log('notes = ' + notes);

        let oneCompany = await Company.findOne({ where: { id: userid } });

        if (!oneCompany) {
            return res.status(404).json({ message: "one Company not found" });
        }
        //update if the user sends the data
        const updatedData = {};
        if (name) updatedData.name = name;
        if (companySize) updatedData.companySize = companySize;
        if (companyType) updatedData.companyType = companyType;
        if (location) updatedData.location = location;
        if (website) updatedData.website = website;
        if (linkedIn) updatedData.linkedIn = linkedIn;
        if (yearFounded) updatedData.yearFounded = yearFounded;
        if (notes) updatedData.notes = notes;

        await oneCompany.update(updatedData);

        res.status(200).json({
            message: "Company updated successfully",
            job: updatedData
        });
    }
    catch (err) {
        console.error('Error fetching Company data:', err);
        res.status(500).json({ message: 'An error occurred while updating Company data', error: err })
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const userid = req.params.id;
        console.log('deleteCompany userid = ', userid);
        let companyData = await Company.findOne({ where: { id: userid } });

        if (!companyData) {
            return res.status(404).json({ message: 'Company not found' });
        }
        await Company.update({ isDeleted: true }, { where: { id: userid } });

        res.status(200).json({ message: 'Company marked as deleted' });
    }
    catch (err) {
        console.error('Error delete Company data:', err);
        res.status(500).json({ message: 'Failed to delete Company data' })
    }
}

exports.searchCompany = async (req, res) => {
    try {
        console.log('searchCompany userid = ', req.user.id);
        let companyName = req.params.companyName;
        console.log('companyName = ', companyName);
        let allCompany = await Company.findAll({
            where: {
                userId: req.user.id,
                isDeleted: false
            }
        })
        // console.log('allCompany = ' ,allCompany);

        let filteredCompany = allCompany.filter(company => {
            return company.name.toLowerCase().includes(companyName) ||
                company.location.toLowerCase().includes(companyName);
        })

        res.status(200).json({ message: 'search Company data', filteredCompany: filteredCompany });

    }
    catch (err) {
        console.error('Error search Company data:', err);
        res.status(500).json({ message: 'Failed to search Company data' })
    }
}