const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Department = sequelize.define(tbl.TBL_DEPARTMENT, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    department_code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    departmentName_hi : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: false
    },
    departmentName_en : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Department;