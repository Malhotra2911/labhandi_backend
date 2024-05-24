const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Designation = sequelize.define(tbl.TBL_DESIGNATION, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    designationCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    en_designation : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    hi_designation : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Designation;