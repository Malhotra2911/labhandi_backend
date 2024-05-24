const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Invoice = sequelize.define(tbl.TBL_INVOICE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    invoiceNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    invoiceDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    invoiceAmount : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    },
    invoiceUpload : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    }
});

module.exports = Invoice