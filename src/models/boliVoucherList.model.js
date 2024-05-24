const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BoliVoucherList = sequelize.define(tbl.TBL_BOLI_VOUCHER_LIST, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Boli_id : {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    Type : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    BoliAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    Remark : {
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

module.exports = BoliVoucherList;