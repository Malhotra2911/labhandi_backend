const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const EmployeeSalary = sequelize.define(tbl.TBL_EMPLOYEE_SALARY, {
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
    year : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    month : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    amountPaid : {
        type: Sequelize.FLOAT(10, 2),
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

module.exports = EmployeeSalary;