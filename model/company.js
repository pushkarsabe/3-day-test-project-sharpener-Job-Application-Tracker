const Sequelize = require('sequelize');
const sequelize = require('../util/db');

let Company = sequelize.define('company', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    companySize: {
        type: Sequelize.STRING,
        allowNull: true
    },
    companyType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    website: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    linkedIn: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    yearFounded: {
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

module.exports = Company;