const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Stock = sequelize.define(tbl.TBL_STOCK, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    DepartmentCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    DepartmentName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ItemCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    ItemName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    UOM : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Quantity : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    }
});

module.exports = Stock