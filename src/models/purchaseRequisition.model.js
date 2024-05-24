const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const PurchaseRequisition = sequelize.define(tbl.TBL_PURCHASE_REQUISITION, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    purchaseRequisitionNo : {
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
    purchaseRequisitionDate : {
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
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    approver1 : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    approver2 : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    approver3 : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    approver4 : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    isApprover1 : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isApprover2 : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isApprover3 : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isApprover4 : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    }
});

module.exports = PurchaseRequisition;