const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BankName = sequelize.define(tbl.TBL_BANK_NAME, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    bankCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    bankName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = BankName;