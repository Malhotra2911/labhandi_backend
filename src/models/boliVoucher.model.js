const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BoliVoucher = sequelize.define(tbl.TBL_BOLI_VOUCHER, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Boli_id : {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    BoliAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
});

module.exports = BoliVoucher;