const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const PurchaseOrderList = sequelize.define(tbl.TBL_PURCHASE_ORDER_LIST, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    purchaseOrderId : {
        type: Sequelize.INTEGER(50),
        allowNull: false
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
    HSN : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    UOM : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    quantity : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    price : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    },
    discount : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    },
    GST : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    },
    total : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    }
});

module.exports = PurchaseOrderList