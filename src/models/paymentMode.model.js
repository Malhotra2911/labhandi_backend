const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const PaymentMode = sequelize.define(tbl.TBL_PAYMENT_MODE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    paymentModeCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    paymentMode : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = PaymentMode;