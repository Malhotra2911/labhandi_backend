const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const PurchaseOrder = sequelize.define(tbl.TBL_PURCHASE_ORDER, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    purchaseRequisitonNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    purchaseOrderNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    departmentCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    departmentName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    city : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    state : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    pincode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    purchaseOrderDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    deliveryDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    mobileNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    contactPerson : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    contactName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    }
});

module.exports = PurchaseOrder