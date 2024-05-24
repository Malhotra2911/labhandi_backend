const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const FamilyMembers = sequelize.define(tbl.TBL_FAMILY_MEMBERS, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    familyId : {
        type: Sequelize.INTEGER(50),
        allowNull: false
    },
    MobileNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Name : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    RelationshipType : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Email : {
        type: Sequelize.STRING(250),
        trim: true,
        allowNull: true
    },
    DateOfBirth : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    DateOfOccasion : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    }
});

module.exports = FamilyMembers;