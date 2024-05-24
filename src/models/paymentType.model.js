const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const PaymentType = sequelize.define(tbl.TBL_PAYMENT_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    paymentTypeCode : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    paymentTypeName : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = PaymentType;