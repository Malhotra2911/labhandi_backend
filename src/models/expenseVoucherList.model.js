const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const ExpenseVoucherList = sequelize.define(tbl.TBL_EXPENSE_VOUCHER_LIST, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    voucherId : {
        type: Sequelize.INTEGER(50),
        allowNull: false
    },
    Type : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    voucherNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    amount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    }
});

module.exports = ExpenseVoucherList;