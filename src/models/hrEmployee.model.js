const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const HrEmployee = sequelize.define(tbl.TBL_HR_EMPLOYEE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    employeeID : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    AadharNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    ContactNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    employeeStatus : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    Email : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    department : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    joiningDate : {
        type : Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    deactiveDate : {
        type : Sequelize.DATEONLY,
        trim: true,
        allowNull: true
    },
    employeeType : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    employeePhoto : {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    city : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    state : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    employeeSalary : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    designation : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    BankName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    BankBranch : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    IFSC_Code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    AccountNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    AccountHolderName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    }
});

module.exports = HrEmployee;