const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const boliPayment = sequelize.define(tbl.TBL_BOLI_PAYMENT, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Name : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Boli_id : {
        type : Sequelize.STRING(255),
        allowNull: false
    },
    Type : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Unit : {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true
    },
    PaidAmount : {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    PrintAmount : {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    NameOfBank : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    PaymentId : {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true
    },
    Remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Date : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    Time : {
        type: Sequelize.TIME,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
})

module.exports = boliPayment;