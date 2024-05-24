const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BoliUnit = sequelize.define(tbl.TBL_BOLIUNIT, {
    id: {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    boliUnit_hi: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    boliUnit_en: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
})

module.exports = BoliUnit;