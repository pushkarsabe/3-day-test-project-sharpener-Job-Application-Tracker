const Sequelize = require('sequelize');
const sequalize = require('../util/db');

const Contact = sequalize.define('contact', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    jobTitle: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    companyName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    linkedIn: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    twitter: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    relationship: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    goal: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dateSaved: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    lastContacted: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    followUp: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }

});

module.exports = Contact;