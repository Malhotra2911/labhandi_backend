const tbl = require('./TableName');
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BhojnalayHead = sequelize.define(tbl.TBL_BHOJNALAY_HEAD, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    price : {
        type: Sequelize.FLOAT(10, 2),
        allowNull: true
    },
    remark : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = BhojnalayHead