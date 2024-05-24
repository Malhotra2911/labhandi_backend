const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const PaymentIn = sequelize.define(tbl.TBL_PAYMENT_IN, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    purchaseOrderNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    supplierCode : {
        type: Sequelize.STRING(255),
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
    paymentType : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    paymentMode : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    paymentAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    paymentDate : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    }
});

module.exports = PaymentIn