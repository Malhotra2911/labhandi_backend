const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Bhojnalay = sequelize.define(tbl.TBL_BHOJNALAY, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    DateOfBooking : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    Time : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    ReceiptNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Name : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    MobileNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Type : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    NoOfPerson : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    TotalAmount : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    },
    Remark : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    },
    PAYMENT_ID: {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true,
    },
    PAYMENT_STATUS: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Bhojnalay