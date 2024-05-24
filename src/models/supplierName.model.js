const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const SupplierName = sequelize.define(tbl.TBL_SUPPLIER_NAME, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    supplierCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierName_en : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    supplierName_hi : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = SupplierName