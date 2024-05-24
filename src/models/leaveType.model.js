const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const LeaveType = sequelize.define(tbl.TBL_LEAVE_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    leaveType_code : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    leaveType_hi : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: false
    },
    leaveType_en : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = LeaveType;