const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const DisableDharamshala = sequelize.define(tbl.TBL_DISABLE_DHARAMSHALA, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    dharamshala : {
        type: Sequelize.STRING(255),
        trim: true,
        allowNull: true
    },
    fromDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    toDate : {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
});

module.exports = DisableDharamshala;