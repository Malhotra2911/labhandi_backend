const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const GateEntryList = sequelize.define(tbl.TBL_GATE_ENTRY_LIST, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    gateEntryId : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    },
    itemNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    itemName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    departmentCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    departmentName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    UOM : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    orderQuantity : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    acceptedQuantity : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    returnQuantity : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    }
});

module.exports = GateEntryList