const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const BoliHead = sequelize.define(tbl.TBL_BOLIHEAD, {
    id: {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    boliHead_hi: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    boliHead_en: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue:true
    }
});

module.exports = BoliHead;