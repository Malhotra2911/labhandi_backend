const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const EmployeeAttendance = sequelize.define(tbl.TBL_EMPLOYEE_ATTENDANCE, {
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
    attendanceDate : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    inTime : {
        type: Sequelize.TIME,
        allowNull: true
    },
    outTime : {
        type: Sequelize.TIME,
        allowNull: true
    },
    totalHours : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    },
    remark : {
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

module.exports = EmployeeAttendance;