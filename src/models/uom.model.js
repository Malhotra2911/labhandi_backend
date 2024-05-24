const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const UOM = sequelize.define(tbl.TBL_UOM, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    UOMCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    UOM : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = UOM