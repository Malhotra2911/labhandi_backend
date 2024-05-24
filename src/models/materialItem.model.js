const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const MaterialItem = sequelize.define(tbl.TBL_MATERIAL_ITEM, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    MaterialId : {
        type: Sequelize.INTEGER(50),
        allowNull: false,
    },
    ItemName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ItemNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Quantity : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    },
    Amount : {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    SupplierCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    SupplierName : {
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
    }
});

module.exports = MaterialItem;