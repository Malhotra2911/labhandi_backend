const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const TrustType = sequelize.define(tbl.TBL_TRUST_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    trustType_hi : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    trustType_en : {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = TrustType;