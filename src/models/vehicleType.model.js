const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const VehicleType = sequelize.define(tbl.TBL_VEHICLE_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    vehicleType_hi : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    vehicleType_en : {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = VehicleType;