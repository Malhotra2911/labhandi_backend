const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const CustomWhatsapp = sequelize.define(tbl.TBL_CUSTOM_WHATSAPP, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    message : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    media : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    }
});

module.exports = CustomWhatsapp;