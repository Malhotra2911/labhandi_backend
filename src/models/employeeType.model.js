const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const EmployeeType = sequelize.define(tbl.TBL_EMPLOYEE_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeType_code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    employeeType_hi : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: false
    },
    employeeType_en : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = EmployeeType;