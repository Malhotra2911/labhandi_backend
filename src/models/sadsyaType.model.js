const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const SadsyaType = sequelize.define(tbl.TBL_SADSYA_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sadsyaType_hi : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    sadsyaType_en : {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = SadsyaType