const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const JobTracker = sequelize.define('jobTracker', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    jobDescription: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    postedDate: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    savedDate: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    deadlineDate: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    appliedDate: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    followUpDate: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    resumes: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    coverLetter: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    jobPosition: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    company: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    minimumSalary: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    maximumSalary: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    currency: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    salaryPayPeriod: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    location: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    excitement: {
        type: Sequelize.STRING,
        allowNull: true,
    },

});

module.exports = JobTracker;