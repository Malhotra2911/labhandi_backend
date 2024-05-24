const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Boli = sequelize.define(tbl.TBL_BOLI, {
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
    MobileNo : {
        type: Sequelize.STRING(12),
        trim: true,
        allowNull: false,
    },
    Name : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Email : {
        type: Sequelize.STRING(250),
        allowNull: true
    },
    Address : {
        type: Sequelize.TEXT,
        trim: true,
        allowNull: true
    },
    Unit : {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true
    },
    BoliAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    PendingAmount : {
        type: Sequelize.FLOAT(10, 2),
        trim: true,
        allowNull: true
    },
    Date : {
        type: Sequelize.DATEONLY,
        trim: true,
        allowNull: true,
    },
    Time : {
        type: Sequelize.TIME,
        trim: true,
        allowNull: true
    },
    ADDED_BY : {
        type: Sequelize.INTEGER(50),
        trim: true,
        allowNull: true
    },
    BoliStatus : {
        type: Sequelize.STRING(150),
        trim: true,
        allowNull: true
    },
    active : {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true,
        allowNull: true
    }
})

module.exports = Boli;