const Contact = require('../model/contact');
require('dotenv').config();

exports.postAddnewContact = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const jobTitle = req.body.jobTitle;
        const companyName = req.body.companyName;
        const email = req.body.email;
        const linkedIn = req.body.linkedIn;
        const twitter = req.body.twitter;
        const location = req.body.location;
        const phoneNumber = req.body.phoneNumber;
        const goal = req.body.goal;
        const status = req.body.status;
        const dateSaved = req.body.dateSaved;
        const lastContacted = req.body.lastContacted;
        const followUp = req.body.followUp;
        const notes = req.body.notes;
        console.log('firstName = ' + firstName);
        console.log('lastName = ' + lastName);
        console.log('jobTitle = ' + jobTitle);
        console.log('companyName = ' + companyName);
        console.log('email = ' + email);
        console.log('linkedIn = ' + linkedIn);
        console.log('twitter = ' + twitter);
        console.log('location = ' + location);
        console.log('goal = ' + goal);
        console.log('status = ' + status);
        console.log('phoneNumber = ' + phoneNumber);
        console.log('dateSaved = ' + dateSaved);
        console.log('lastContacted = ' + lastContacted);
        console.log('followUp = ' + followUp);
        console.log('notes = ' + notes);
        const newContact = await Contact.create({
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            companyName: companyName,
            email: email,
            linkedIn: linkedIn,
            twitter: twitter,
            location: location,
            goal: goal,
            status: status,
            phoneNumber: phoneNumber,
            dateSaved: dateSaved,
            lastContacted: lastContacted,
            followUp: followUp,
            notes: notes,
        });

        if (!newContact) {
            return res.status(404).json({ message: 'contact not craeted' });
        }

        res.status(200).json({ message: 'contact created', newContact: newContact })
    } catch (err) {
        console.log("post add contact error = ", err);
        res.status(500).json({
            error: err,
        })
    }
}

exports.getContactData = async (req, res) => {
    try {
        let userid = req.params.id;
        console.log("getContactData userid = ", userid);
        let singleContactData = await Contact.findAll({
            where: { id: userid }
        });
        // console.log("singleContactData = ", singleContactData);
        res.status(200).json({ message: 'success', singleContactData: singleContactData });
    }
    catch (err) {
        console.error('Error fetching Contact data:', err);
        res.status(500).json({ message: 'Failed to get contact data' });
    }
}

exports.getAllContactData = async (req, res) => {
    try {
        let allContactData = await Contact.findAll({ where: { id: req.user.id } });
        res.status(200).json({ message: 'success', allContactData: allContactData });
    }
    catch (err) {
        console.error('Error fetching all Contact data:', err);
        res.status(500).json({ message: 'Failed to get all Contact data' });
    }
}

exports.updateContact = async (req, res) => {
    try {
        const userid = req.params.id;
        console.log("updateJob...userid = ", userid);
        const { firstName, lastName, jobTitle, companyName, email, linkedIn, location, goal, status, phoneNumber, dateSaved, lastContacted, followUp, notes } = req.body;
        console.log('firstName = ' + firstName);
        console.log('lastName = ' + lastName);
        console.log('jobTitle = ' + jobTitle);
        console.log('companyName = ' + companyName);
        console.log('email = ' + email);
        console.log('linkedIn = ' + linkedIn);
        console.log('twitter = ' + twitter);
        console.log('location = ' + location);
        console.log('goal = ' + goal);
        console.log('status = ' + status);
        console.log('phoneNumber = ' + phoneNumber);
        console.log('dateSaved = ' + dateSaved);
        console.log('lastContacted = ' + lastContacted);
        console.log('followUp = ' + followUp);
        console.log('notes = ' + notes);

        let oneContact = await Contact.findOne({ where: { id: userid } });

        if (!oneContact) {
            return res.status(404).json({ message: "one Contact not found" });
        }
        //update if the user sends the data
        const updatedData = {};
        if (firstName) updatedData.firstName = firstName;
        if (lastName) updatedData.lastName = lastName;
        if (jobTitle) updatedData.jobTitle = jobTitle;
        if (companyName) updatedData.companyName = companyName;
        if (email) updatedData.email = email;
        if (linkedIn) updatedData.linkedIn = linkedIn;
        if (twitter) updatedData.twitter = twitter;
        if (location) updatedData.location = location;
        if (goal) updatedData.goal = goal;
        if (status) updatedData.status = status;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;
        if (dateSaved) updatedData.dateSaved = dateSaved;
        if (lastContacted) updatedData.lastContacted = lastContacted;
        if (followUp) updatedData.followUp = followUp;
        if (notes) updatedData.notes = notes;

        await Contact.update(updatedData);

        res.status(200).json({
            message: "Contact updated successfully",
            contact: updatedData
        });
    }
    catch (err) {
        console.error('Error fetching Contact data:', err);
        res.status(500).json({ message: 'An error occurred while updating Contact data', error: err })
    }
}


exports.deleteContact = async (req, res) => {
    try {
        const userid = req.params.id;
        console.log('deleteContact userid = ', userid);
        let contactData = await Contact.findOne({ where: { id: userid } });

        if (!contactData) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        await Contact.update({ isDeleted: true }, { where: { id: userid } });

        res.status(200).json({ message: 'Contact marked as deleted' });
    }
    catch (err) {
        console.error('Error delete Contact data:', err);
        res.status(500).json({ message: 'Failed to delete Contact data' })
    }
}