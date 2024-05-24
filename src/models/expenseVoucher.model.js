const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const ExpenseVoucher = sequelize.define(tbl.TBL_EXPENSE_VOUCHER, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    expenseDate : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    voucherNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    paymentMode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    LedgerNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    LedgerName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    amount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    narration : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    },
    modeOfExpense : {
        type: Sequelize.INTEGER(50), // received - 1, payment - 2, journal - 3, contra - 4
        trim: true,
        allowNull: true
    }
});

module.exports = ExpenseVoucher;