const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const InventoryList = sequelize.define(tbl.TBL_INVENTORY_LIST, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    InventoryId : {
        type: Sequelize.INTEGER(50),
        allowNull: false
    },
    MaterialCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    MaterialName : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    UOM : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    OpeningStock : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true,
        defaultValue: 0
    },
    AdjustStock : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true,
        defaultValue: 0
    },
    Quantity : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Amount : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    }
});

module.exports = InventoryList