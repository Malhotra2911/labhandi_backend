const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const ItemHead = sequelize.define(tbl.TBL_ITEM_HEAD, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    itemCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    itemNameHindi : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    itemNameEnglish : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    }
});

module.exports = ItemHead