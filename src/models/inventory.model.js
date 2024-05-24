const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Inventory = sequelize.define(tbl.TBL_INVENTORY, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Date : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    Time : {
        type: Sequelize.TIME,
        allowNull: true
    },
    FromDepartmentCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    FromDepartmentName : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    ToDepartmentCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    ToDepartmentName : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    SupplierCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    SupplierName : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
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
});

module.exports = Inventory