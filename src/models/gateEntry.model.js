const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const GateEntry = sequelize.define(tbl.TBL_GATE_ENTRY, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    date : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    time : {
        type: Sequelize.TIME,
        allowNull: true
    },
    gateEntryNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    purchaseOrderNo : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierName : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        allowNull: true
    }
});

module.exports = GateEntry