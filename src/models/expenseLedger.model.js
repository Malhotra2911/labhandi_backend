const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const ExpenseLedger = sequelize.define(tbl.TBL_EXPENSE_LEDGER, {
    id : {
        type: Sequelize.INTEGER(50),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    LedgerNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    MobileNo : {
        type: Sequelize.STRING(20),
        trim: true,
        allowNull: true
    },
    Name : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    FatherName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    City : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    PinCode : {
        type: Sequelize.STRING(10),
        trim: true,
        allowNull: true
    },
    State : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Country : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Email : {
        type: Sequelize.STRING(255),
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
    OpeningBalance : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    TotalAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true,
        defaultValue: 0
    },
    DepositedAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true,
        defaultValue: 0
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
});

module.exports = ExpenseLedger;