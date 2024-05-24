const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const EmployeeStatus = sequelize.define(tbl.TBL_EMPLOYEE_STATUS, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeStatus_code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    employeeStatus : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    }
});

module.exports = EmployeeStatus;