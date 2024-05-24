const tbl = require('./TableName');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-connection');

const RelationshipType = sequelize.define(tbl.TBL_RELATIONSHIP_TYPE, {
    id : {
        type: Sequelize.INTEGER(50),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    relationshipType_hi : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    relationshipType_en : {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    status : {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = RelationshipType