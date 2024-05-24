const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const Family = sequelize.define(tbl.TBL_FAMILY, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
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
    FathersName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Age : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    },
    AadharNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    PanNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Email : {
        type: Sequelize.STRING(250),
        trim: true,
        allowNull: true
    },
    SadsyaType : {
        type: Sequelize.TEXT,
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
    },
    OccasionType : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Status : {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true
    },
    Remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
});

module.exports = Family;