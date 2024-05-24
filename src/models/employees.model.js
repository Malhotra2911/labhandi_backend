const tbl = require("./TableName");
const Sequelize = require("sequelize");
const sequelize = require("../db/db-connection");

const Employees = sequelize.define(tbl.TBL_EMPLOYEES, {
  id: {
    type: Sequelize.INTEGER(50),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Username: {
    type: Sequelize.STRING(50),
    unique:true,
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  Mobile: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },

  Address: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  Password: {
    type: Sequelize.STRING(150),
    allowNull: false,
  },
  Role: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  Rid: {
    type: Sequelize.INTEGER(50),
    allowNull: true,
  },
  role_id: {
    type: Sequelize.INTEGER(50),
    allowNull: false,
  },
  Status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isRequest: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  signature: {
    type: Sequelize.STRING(255),
    allowNull:true
  },
  profile_image:{
    type: Sequelize.STRING(255),
    allowNull:true
  },
  manualDonation : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  electronicDonation : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  roomBooking : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  boli : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  vehiclePass : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  materialPass : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  store : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  expense : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  directory : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  hr : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  trust : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  admin : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  donation : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  approver : {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Employees;
