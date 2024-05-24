const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const OccasionType = sequelize.define(tbl.TBL_OCCASION_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    occasionType_hi : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    occasionType_en : {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = OccasionType