const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const EmployeeLeave = sequelize.define(tbl.TBL_EMPLOYEE_LEAVE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeId : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    employeeName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    startDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    endDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    department_code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    department : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    designation : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    leaveType : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Status : {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true,
        defaultValue: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
});

module.exports = EmployeeLeave;