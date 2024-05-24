const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const ExpenseHead = sequelize.define(tbl.TBL_EXPENSE_HEAD, {
    id: {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    expenseHead_hi: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    expenseHead_en: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue:true
    }
});

module.exports = ExpenseHead;