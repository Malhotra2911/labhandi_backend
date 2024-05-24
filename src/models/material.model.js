const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const Material = sequelize.define(tbl.TBL_MATERIAL, {
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
    VehicleName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    VehicleNo : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Name : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    MobileNo : {
        type: Sequelize.INTEGER(20),
        trim: true,
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    VehicleType : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    OrderNo : {
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
});

module.exports = Material;