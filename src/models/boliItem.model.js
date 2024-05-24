const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const boliItem = sequelize.define(tbl.TBL_BOLI_ITEM, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Name : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true,
    },
    Boli_id : {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    BoliAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    PendingAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    ModeOfPayment : {
        type: Sequelize.STRING(50),
        trim: true,
        allowNull: true
    },
    PayAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    ChequeNo : {
        type: Sequelize.STRING(150),
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
    PaymentStatus : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    Remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
})

module.exports = boliItem;