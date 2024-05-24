const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BoliGroup = sequelize.define(tbl.TBL_BOLI_GROUP, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
});

module.exports = BoliGroup;