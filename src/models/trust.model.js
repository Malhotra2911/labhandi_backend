const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const Trust = sequelize.define(tbl.TBL_TRUST, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Date : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    Time : {
        type: Sequelize.TIME,
        trim: true,
        allowNull: true
    },
    TrustCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    TrustName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    MainTrustName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    TrustType : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    MobileNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Email : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Location : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    TrustAddress : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    State : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    City : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    PinCode : {
        type: Sequelize.INTEGER(7),
        trim: true,
        allowNull: true
    },
    NameOfBank : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    AccountDetails : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    IFSC_Code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    PAN_Number : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    GST : {
        type: Sequelize.STRING(255),
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
})

module.exports = Trust;