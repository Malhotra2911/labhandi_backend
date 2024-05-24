const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
const sequelizes = require("../db/db-connection");
const { VoucherCollection } = require(".");
const { voucherController } = require("../controllers");
const uploadimage = require("../middlewares/imageupload");
const db = require("../models");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const {sendSms} = require("../utils/Sendsms");
const httpStatus = require("http-status");
const { request } = require("http");
const constants = require('./../utils/constants')
let ejs = require("ejs");
let path = require("path");
const puppeteer = require('puppeteer');
const { ToWords } = require('to-words');
const {sendWhatsappSms, sendOnlineWhatsappSms} = require("../utils/SendWhatsappSms");
// const { chromium } = require('playwright');
let pdf = require("html-pdf");
const fs = require('fs');

db.donationModel.hasMany(db.donationItem, {
  foreignKey: "donationId",
  as: "itemDetails",
});
db.donationItem.belongsTo(db.donationModel, {
  foreignKey: "donationId",
  as: "donationDetail",
});

/// electric donation relationship
db.ElecDonationModel.hasMany(db.ElecDonationItem, {
  foreignKey: "donationId",
  as: "elecItemDetails",
});
db.ElecDonationItem.belongsTo(db.ElecDonationModel, {
  foreignKey: "donationId",
  as: "elecDonationDetail",
});

/// electric donation relationship

//manual
db.ManualDonation.hasMany(db.ManualDonationItem, {
  foreignKey: "donationId",
  as: "manualItemDetails",
});
db.ManualDonationItem.belongsTo(db.ManualDonation, {
  foreignKey: "donationId",
  as: "manualDonationDetail",
});
//manual

const TblDonation = db.donationModel;
const TblDonationItem = db.donationItem;
const itemList = db.itemList;
const TblNewDonation = db.newDonationModel;
const TblelecDonation = db.ElecDonationModel;
const TblelecDonationItem = db.ElecDonationItem;
const TblEmployees = db.employees;
const TblDonationTypes = db.donationTypes;
const TblVouchers = db.Vouchers;
const TblUsers = db.userModel;
const TblmanualDonation = db.ManualDonation;
const TblmanualDonationItem = db.ManualDonationItem;
const TblAdmin = db.admin;
const TblCancelVoucher = db.cancelVouchers;
const TblCheckin = db.Checkin;
const TblDharmasal = db.dharmashala;
const TblRoom = db.Rooms;
const TblFacility = db.facility;
const TblBoliLedger = db.boliLedger;
const TblExpenseLedger = db.expenseLedger;

class DonationCollaction {
  addNewDonation = async (req, receipt) => {
    const {
      NAME,
      MODE_OF_DONATION,
      AMOUNT,
      MobileNo,
      GENDER,
      CHEQUE_NO,
      DATE_OF_CHEQUE,
      NAME_OF_BANK,
      PAYMENT_ID,
      DATE_OF_DAAN,
      TIME_OF_DAAN,
      TYPE,
      REMARK,
      ADDRESS,
      PAN_CARD_No,
      LedgerNo
    } = req.body;
    // console.log(receipt)
    let IMG = "";

    let active = "";

    let donationType = "ONLINE";

    if (MODE_OF_DONATION == 2) {
      const { chequeImg } = req.files;
      donationType = "CHEQUE";
      active = "0";
      IMG = uploadimage(chequeImg);
    }
    
    let RECEIPT_NO = `${receipt}`;
    const userId = req.user.id;
    let user = await TblUsers.findOne({
      where: {
        id: userId,
      },
    });

    let result = null;
    result = await TblNewDonation.create({
      NAME,
      RECEIPT_NO,
      MODE_OF_DONATION: donationType,
      AMOUNT,
      CHEQUE_NO,
      GENDER,
      MobileNo,
      DATE_OF_CHEQUE,
      TIME_OF_DAAN,
      NAME_OF_BANK,
      PAYMENT_ID,
      TYPE,
      ADDRESS,
      REMARK,
      IMG,
      active,
      DATE_OF_DAAN,
      ADDED_BY: userId,
      PAN_CARD_No,
      LedgerNo
    }).catch((err) => {
      // console.log(err);
    });
    if (!result) {
      return null;
    }
    return result;
  };

  editNewDonation = async (req) => {
    try {
      const { RECEIPT_NO, PAYMENT_ID } = req.body;
      const data = await TblNewDonation.update(
        { PAYMENT_ID : PAYMENT_ID },
        {
          where : {
          RECEIPT_NO : RECEIPT_NO
          }
        }
      );
      return data;      
    } catch (error) {
        throw error
    }
  };

  adddonation = async (req, receiptNo) => {
    const {
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      donation_item,
    } = req.body;
    const userId = req.user.id;
    const result = await TblDonation.create({
      name,
      phoneNo,
      receiptNo,
      address,
      new_member,
      donation_date,
      donation_time,
      created_by: userId,
    })
      .then(async (res) => {
        let final = [];
        donation_item.forEach((e) => {
          final.push({
            donationId: res.id,
            itemId: e.item,
            amount: e.amount,
            remark: e.remark,
          });
        });
        await TblDonationItem.bulkCreate(final).then((resp) => {
          res.dataValues["item_details"] = resp;
        });
        return {
          status: 1,
          message: "Created Successfully",
          data: res.dataValues,
        };
      })
      .catch((err) => {
        return {
          status: 1,
          message: "Something wrong!",
          data: res.err,
        };
      });
    return result;
  };

  delDonation = async (req) => {
    let { id, mode } = req.query;

    if (mode == 2) {
      mode = "CHEQUE";
    } else {
      mode = "ONLINE";
    }

    console.log(mode, id);
    const result = await TblNewDonation.destroy({
      where: {
        id: id,
        MODE_OF_DONATION: mode,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, "err");
        return {
          status: 1,
          message: "Something wrong!",
        };
      });
    return result;
  };

  editDonation = async (req) => {
    const {
      NAME,
      MODE_OF_DONATION,
      AMOUNT,
      CHEQUE_NO,
      DATE_OF_CHEQUE,
      NAME_OF_BANK,
      PAYMENT_ID,
      DATE_OF_DAAN,
      TYPE,
      REMARK,
      ADDRESS,
      ID,
    } = req.body;

    let mode;
    let IMG = "";

    if (MODE_OF_DONATION == 1) {
      mode = "ONLINE";
    } else {
      const { chequeImg } = req.files;

      IMG = uploadimage(chequeImg);
      mode = "CHEQUE";
    }

    let result = await TblNewDonation.update(
      {
        NAME: NAME,
        AMOUNT: AMOUNT,
        CHEQUE_NO: CHEQUE_NO,
        DATE_OF_CHEQUE: DATE_OF_CHEQUE,
        NAME_OF_BANK: NAME_OF_BANK,
        PAYMENT_ID: PAYMENT_ID,
        DATE_OF_DAAN: DATE_OF_DAAN,
        TYPE: TYPE,
        REMARK: REMARK,
        ADDRESS: ADDRESS,
        IMG: IMG,
      },

      {
        where: {
          id: ID,
          MODE_OF_DONATION: mode,
        },
      }
    );
    return result;
  };

  searchDonation = async (req) => {
    const {
      name,
      date,
      phone,
      fromDate,
      toDate,
      modeOfDonation,
      fromVoucher,
      toVoucher,
    } = req.query;

    const {
      type,
      user
    } = req.body;

    let whereClause = {};
    let include = [];
    let whereClauseInc = {};

    let from = new Date(fromDate);
    let to = new Date(toDate);

    if (name) {
      whereClause.name = { [Op.regexp]: `^${name}.*` };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (date) {
      whereClause.donation_date = date;
      // whereClause.modeOfDonation = modeOfDonation;
    }
    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [from, to] };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (fromVoucher && toVoucher) {
      whereClause.voucherNo = { [Op.between]: [fromVoucher, toVoucher] };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (phone) {
      whereClause.phoneNo = { [Op.regexp]: `^${phone}.*` };
      // whereClause.modeOfDonation = modeOfDonation;
    }
    
    if (user) {
      const userArray = Array.isArray(user) ? user : [];
      whereClause.created_by = { [Op.in]: userArray };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (type) {
      const typeArray = Array.isArray(type) ? type : [];
      whereClauseInc.type = { [Op.in]: typeArray };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (modeOfDonation) {
      whereClause.modeOfDonation = modeOfDonation;
    }

    include = [
      {
        model: TblelecDonationItem,
        as: "elecItemDetails",
        where: whereClauseInc,
      },
    ];
    console.log(whereClause);

    let data = await TblelecDonation.findAll({
      where: whereClause,
      include: include,
    });

    const promises = data.map(async (elecDonation) => {
      const isAdmin = elecDonation.isAdmin;
      const createdByUser = elecDonation.created_by;

      if (isAdmin) {
        // Retrieve signature of admin from tbl_admins
        const admin = await TblAdmin.findOne({
          where: {
            id: createdByUser,
          },
        });
        return {
          ...elecDonation?.toJSON(),
          createdBySignature: admin?.signature,
          createdBy: admin?.name || "",
          elecItemDetails: elecDonation.elecItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      } else {
        // Retrieve signature of employee from tbl_employees
        const employee = await TblEmployees.findOne({
          where: {
            id: createdByUser,
          },
        });

        // Add signature to each elec donation item
        return {
          ...elecDonation.toJSON(),
          createdBySignature: employee?.signature || "",
          createdBy: employee?.Username || "",
          elecItemDetails: elecDonation?.elecItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      }
    });

    let result = await Promise.all(promises);

    return result;
  };

  manualsearchDonation = async (req) => {
    const {
      name,
      date,
      fromDate,
      toDate,
      phone,
      modeOfDonation,
      fromRecp,
      toRecp,
    } = req.query;

    const {
      user,
      type
    } = req.body;

    let from = new Date(fromDate);
    let to = new Date(toDate);

    let whereClause = {};
    let include = [];
    let whereClauseInc = {};

    if (name) {
      whereClause.name = { [Op.regexp]: `^${name}.*` };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (date) {
      whereClause.donation_date = date;
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [from, to] };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (fromRecp && toRecp) {
      whereClause.ReceiptNo = { [Op.between]: [fromRecp, toRecp] };
      // whereClause.modeOfDonation = modeOfDonation;
    }
    if (phone) {
      whereClause.phoneNo = { [Op.regexp]: `^${phone}.*` };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (user) {
      const userArray = Array.isArray(user) ? user : [];
      whereClause.created_by = { [Op.in]: userArray };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (type) {
      const typeArray = Array.isArray(type) ? type : [];
      whereClauseInc.type = { [Op.in]: typeArray };
      // whereClause.modeOfDonation = modeOfDonation;
    }

    if (modeOfDonation) {
      whereClause.modeOfDonation = modeOfDonation;
    }

    include = [
      {
        model: TblmanualDonationItem,
        as: "manualItemDetails",
        where: whereClauseInc,
      },
    ];
    console.log(whereClause);

    let data = await TblmanualDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_manual_donation.id"],
    });

    const promises = data?.map(async (manualdonation) => {
      const isAdmin = manualdonation.isAdmin;
      const createdByUser = manualdonation.created_by;
      console.log(isAdmin, createdByUser);
      if (isAdmin) {
        // Retrieve signature of admin from tbl_admins
        const admin = await TblAdmin.findOne({
          where: {
            id: createdByUser,
          },
        });

        // Add signature to each elec donation item
        return {
          ...manualdonation.toJSON(),
          createdBySignature: admin.signature || "",
          CreatedBy: admin.name,
          manualItemDetails: manualdonation.manualItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      } else {
        // Retrieve signature of employee from tbl_employees
        const employee = await TblEmployees.findOne({
          where: {
            id: createdByUser,
          },
        });

        // Add signature to each elec donation item
        return {
          ...manualdonation.toJSON(),
          createdBySignature: employee?.signature || "",
          CreatedBy: employee?.Username || "",
          manualItemDetails: manualdonation?.manualItemDetails?.map((item) => ({
            ...item.toJSON(),
          })),
        };
      }
    });

    let result = await Promise.all(promises);

    return result;
  };

  searchAllDonation = async (req) => {
    const { employeeid, fromDate, toDate, fromVoucher, toVoucher, type } =
      req.query;
    let whereClause = {};
    const include = [
      {
        model: TblelecDonationItem,
        as: "elecItemDetails",
        attributes: [
          "id",
          "donationId",
          "type",
          "amount",
          "ChequeNo",
          "branch",
          "BankName",
          "transactionNo",
          "ChequeDate",
          "remark",
          "size",
          "itemType",
          "quantity",
          "approxValue",
          "createdAt",
          "updatedAt",
        ],
      },
    ];

    if (employeeid) {
      whereClause.created_by = employeeid;
    }

    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [fromDate, toDate] };
    }

    if (fromVoucher && toVoucher) {
      whereClause.voucherNo = { [Op.between]: [fromVoucher, toVoucher] };
    }

    if (type) {
      include[0].where = { [Op.or]: [{ type }, { itemType: type }] };
    }

    const donations = await TblelecDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_elec_donation.id"],
    });

    return donations;
  };

  searchmanualAllDonation = async (req) => {
    const { employeeid, fromDate, toDate, fromReceipt, toReceipt, type } =
      req.query;
    let whereClause = {};
    const include = [
      {
        model: TblmanualDonationItem,
        as: "manualItemDetails",
        attributes: [
          "id",
          "donationId",
          "type",
          "amount",
          "ChequeNo",
          "branch",
          "BankName",
          "transactionNo",
          "ChequeDate",
          "remark",
          "size",
          "itemType",
          "quantity",
          "approxValue",
          "createdAt",
          "updatedAt",
        ],
      },
    ];

    if (employeeid) {
      whereClause.created_by = employeeid;
    }

    if (fromDate && toDate) {
      whereClause.donation_date = { [Op.between]: [fromDate, toDate] };
    }

    if (fromReceipt && toReceipt) {
      whereClause.ReceiptNo = { [Op.between]: [fromReceipt, toReceipt] };
    }

    if (type) {
      include[0].where = { [Op.or]: [{ type }, { itemType: type }] };
    }

    const donations = await TblmanualDonation.findAll({
      where: whereClause,
      include: include,
      group: ["tbl_manual_donation.id"],
    });

    return donations;
  };

  delElecDonation = async (req) => {
    let id = req.query.id;
    console.log(id);

    let deleteReq = await TblelecDonation.destroy({
      where: {
        id: id,
      },
    })
      .then(async (res) => {
        await TblelecDonationItem.destroy({
          where: {
            donationId: id,
          },
        });
        return {
          status: 1,
          message: "deleted successfully",
        };
      })
      .catch((err) => {
        return {
          status: 1,
          message: "Something went wrong",
        };
      });
    return deleteReq;
  };

  checkVoucherNumberExists = async (voucherNo) => {
    let checkVoucherNumber = await TblelecDonation.findOne({
      where: {
        voucherNo: voucherNo,
      },
    });
    return checkVoucherNumber;
  };

  addElecDonation = async (req, voucherNo, receipt, assv) => {
    try {
      const existData = await TblelecDonation.findOne({
        where : {
          voucherNo : voucherNo 
        }
      });
      if(existData) {
        return "Voucher Number Already Exist"
      }

      const {
        gender,
        name,
        phoneNo,
        address,
        new_member,
        modeOfDonation,
        donation_date,
        donation_time,
        donation_item,
        LedgerNo
      } = req.body;

      const userId = req.user.id;
      console.log(userId);
      console.log("voucherCOMING", voucherNo);

      const ReceiptNo = `${receipt}`;

      let vD = await TblVouchers.findOne({
        where: {
          status: true,
          assign: userId,
        },
      });

      const result = await TblelecDonation.create({
        name,
        gender,
        phoneNo,
        address,
        voucherNo,
        ReceiptNo,
        new_member,
        modeOfDonation,
        donation_date,
        donation_time,
        donation_item,
        created_by: userId,
        isAdmin: req.user.isAdmin,
        LedgerNo
      })
        .then(async (res) => {
          let ElecDonationItems = [];
          donation_item.forEach((e) => {
            if (modeOfDonation === 1) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                transactionNo: e.transactionNo,
                BankName: e.BankName,
              });
            } else if (modeOfDonation === 2) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
              });
            } else if (modeOfDonation === 3) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                ChequeNo: e.ChequeNo,
                branch: e.Branch,
                BankName: e.BankName,
                ChequeDate: e.ChequeDate,
              });
            } else if (modeOfDonation === 4) {
              ElecDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                itemType: e.itemType,
                size: e.size,
                unit: e.unit,
                quantity: e.quantity,
                approxValue: e.approxValue,
              });
            }
          });
          await TblelecDonationItem.bulkCreate(ElecDonationItems).then(
            async (resp) => {
              let incr = Number(voucherNo) + 1;
              let newvoucherNo = parseInt(incr).toLocaleString("en-US", {
                minimumIntegerDigits: 4,
                useGrouping: false,
              });
              let whereCondition = req?.voucherId? {id:req.voucherId} : {
                status: true,
                assign: userId,
              }
              let update = incr> req?.to ? {status : constants.voucherStatus.exhausted }:{voucher : newvoucherNo}
              await TblVouchers.update(
                update,
                {
                  where: whereCondition,
                }
              );

              res.dataValues["elecItemDetails"] = resp;
            }
          );
          return {
            status: 1,
            message: "Created Successfully",
            data: res.dataValues,
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            status: 1,
            message: "Something wrong!",
            data: err,
          };
        });
      if(LedgerNo) {
        const extractedPart = LedgerNo.split("/");
        if (LedgerNo && extractedPart[0] == 'LEDGER') {
          const boliLedgerData = await TblBoliLedger.findOne({
              where : {
                  LedgerNo : LedgerNo
              }
          });
          const updatedAmount = parseFloat(boliLedgerData.DepositedAmount) + parseFloat(donation_item[0].amount);
          await TblBoliLedger.update(
              {
                  DepositedAmount : updatedAmount
              },
              {
                  where : {
                      LedgerNo : LedgerNo
                  }
              }
          );
        }
        if (LedgerNo && extractedPart[0] == 'EXPENSE') {
          const boliLedgerData = await TblExpenseLedger.findOne({
              where : {
                  LedgerNo : LedgerNo
              }
          });
          const updatedAmount = parseFloat(boliLedgerData.DepositedAmount) + parseFloat(donation_item[0].amount);
          await TblExpenseLedger.update(
              {
                  DepositedAmount : updatedAmount
              },
              {
                  where : {
                      LedgerNo : LedgerNo
                  }
              }
          );
        }
      }
      return result;
    } catch (err) {
      console.log(err);
      return {
        status: 1,
        message: err,
      };
    }
  };

  addManuaDonation = async (req) => {
    try {
      const {
        gender,
        name,
        phoneNo,
        address,
        new_member,
        modeOfDonation,
        donation_date,
        ReceiptNo,
        donation_time,
        donation_item,
        LedgerNo
      } = req.body;

      const userId = req.user.id;
      console.log(userId);
      
      if(await this.checkReceipt(ReceiptNo)===true){
        return "Receipt Already Exists";       
      }

      const data = await TblmanualDonation.findOne({
        where : {
          ReceiptNo : ReceiptNo
        }
      });
      if(data) {
        return "Receipt No. Already Exist"
      }

      const result = await TblmanualDonation.create({
        name,
        gender,
        phoneNo,
        address,
        ReceiptNo,
        new_member,
        modeOfDonation,
        donation_date,
        donation_time,
        donation_item,
        created_by: userId,
        isAdmin: req.user.isAdmin,
        LedgerNo
      })
        .then(async (res) => {
          let manualDonationItems = [];
          donation_item.forEach((e) => {
            if (modeOfDonation === 1) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                transactionNo: e.transactionNo,
                BankName: e.BankName,
              });
            } else if (modeOfDonation === 2) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
              });
            } else if (modeOfDonation === 3) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                ChequeNo: e.ChequeNo,
                branch: e.Branch,
                BankName: e.BankName,
                ChequeDate: e.ChequeDate,
              });
            } else if (modeOfDonation === 4) {
              manualDonationItems.push({
                donationId: res.id,
                type: e.type,
                amount: e.amount,
                remark: e.remark,
                itemType: e.itemType,
                size: e.size,
                unit: e.unit,
                quantity: e.quantity,
                approxValue: e.approxValue,
              });
            }
          });
          await TblmanualDonationItem.bulkCreate(manualDonationItems).then(
            async (resp) => {
              res.dataValues["manualItemDetails"] = resp;
            }
          );
          return {
            status: 1,
            message: "Created Successfully",
            data: res.dataValues,
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            status: 1,
            message: "Something wrong!",
            data: err,
          };
        });
        if(LedgerNo) {
          const extractedPart = LedgerNo.split("/");
          if (LedgerNo && extractedPart[0] == 'LEDGER') {
            const boliLedgerData = await TblBoliLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                }
            });
            const updatedAmount = parseFloat(boliLedgerData.DepositedAmount) + parseFloat(donation_item[0].amount);
            await TblBoliLedger.update(
                {
                    DepositedAmount : updatedAmount
                },
                {
                    where : {
                        LedgerNo : LedgerNo
                    }
                }
            );
          }
          if (LedgerNo && extractedPart[0] == 'EXPENSE') {
            const boliLedgerData = await TblExpenseLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                }
            });
            const updatedAmount = parseFloat(boliLedgerData.DepositedAmount) + parseFloat(donation_item[0].amount);
            await TblExpenseLedger.update(
                {
                    DepositedAmount : updatedAmount
                },
                {
                    where : {
                        LedgerNo : LedgerNo
                    }
                }
            );
          }
        }
      return result;
    } catch (err) {
      return {
        status: 1,
        message: err,
      };
    }
  };

  editElecDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
      gender
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: "4",
    };
    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
        gender : gender
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            transactionNo: e.transactionNo,
            BankName: e.BankName,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editcashDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: "4",
    };

    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editChequeDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: 3,
    };
    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            ChequeNo: e.chequeNo,
            branch: e.Branch,
            BankName: e.BankName,
            ChequeDate: e.ChequeDate,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editItemDonation = async (req) => {
    let data;
    const {
      id,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
userId==1? whereClause =  {
  id: id,
  // modeOfDonation: "4",
}:whereClause= {
  // created_by: userId,
  id: id,
  //  modeOfDonation: "4",
};
    await TblelecDonation.update(
      {
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblelecDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            itemType: e.itemType,
            size: e.size,
            unit: e.unit,
            quantity: e.quantity,
            approxValue: e.approxValue,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualElecDonation = async (req) => {
    let data;
    const {
      id,
      ReceiptNo,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: 1,
    };

    await TblmanualDonation.update(
      {
        ReceiptNo: ReceiptNo,
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            transactionNo: e.transactionNo,
            BankName: e.BankName,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualcashDonation = async (req) => {
    let data;
    const {
      id,
      ReceiptNo,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: 2,
    };

    await TblmanualDonation.update(
      {
        ReceiptNo: ReceiptNo,
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualChequeDonation = async (req) => {
    let data;
    const {
      id,
      ReceiptNo,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: 3,
    };

    await TblmanualDonation.update(
      {
        name: name,
        ReceiptNo: ReceiptNo,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where:whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            ChequeNo: e.chequeNo,
            branch: e.Branch,
            BankName: e.BankName,
            ChequeDate: e.ChequeDate,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });

    return {
      status: true,
      message: "updated Successfully",
    };
  };

  editManualItemDonation = async (req) => {
    let data;
    const {
      id,
      ReceiptNo,
      name,
      phoneNo,
      address,
      new_member,
      donation_date,
      donation_time,
      modeOfDonation,
      donation_item,
    } = req.body;

    const userId = req.user.id;
    let whereClause = {}
    userId==1? whereClause =  {
      id: id,
      // modeOfDonation: "4",
    }:whereClause= {
      // created_by: userId,
      id: id,
      // modeOfDonation: "4",
    };
    await TblmanualDonation.update(
      {
        ReceiptNo: ReceiptNo,
        name: name,
        phoneNo: phoneNo,
        address: address,
        new_member: new_member,
        donation_date: donation_date,
        donation_time: donation_time,
      },
      {
        where: whereClause,
      }
    ).then(async (res) => {
      donation_item.forEach(async (e) => {
        data = await TblmanualDonationItem.update(
          {
            type: e.type,
            amount: e.amount,
            remark: e.remark,
            itemType: e.itemType,
            size: e.size,
            unit: e.unit,
            quantity: e.quantity,
            approxValue: e.approxValue,
          },

          {
            where: {
              donationId: id,
              id: e.id,
            },
          }
        );
      });
    });
    return {
      status: true,
      message: "updated Successfully",
    };
  };

  getElecDonation = async (req) => {
    const { type, id } = req.query;
    const userId = req.user.id;
    let data;
    let whereClause = {};
    let result;
    if (type) {
      whereClause.modeOfDonation = type;
    }
    if (id) {
      whereClause.id = id;
    }
    data = await TblelecDonation.findAll({
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
        },
      ],
      where: whereClause,
      order: [["donation_date", "DESC"]],
    });

    // const promises = data.map(async (elecDonation) => {
    //   const isAdmin = elecDonation.isAdmin;
    //   const user = elecDonation.created_by;

  const userIds = data.map((elecDonation) => elecDonation.created_by);
  const userMap = new Map();

  // Fetch user details in bulk
  const userPromises = Promise.all([
    TblAdmin.findAll({ where: { id: userIds } }),
    TblEmployees.findAll({ where: { id: userIds } }),
  ]);

  const [adminUsers, employeeUsers] = await userPromises;

  adminUsers.forEach((admin) => {
    userMap.set(admin.id, {
      signature: admin.signature,
      createdBy: admin.name,
    });
  });

  employeeUsers.forEach((employee) => {
    userMap.set(employee.id, {
      signature: employee.signature,
      createdBy: employee.Username,
    });
  });

  result = data.map((elecDonation) => {
    const userDetails = userMap.get(elecDonation.created_by);
    return {
      ...elecDonation.toJSON(),
      createdBySignature: userDetails?.signature || "",
      createdBy: userDetails?.createdBy || "",
      elecItemDetails: elecDonation.elecItemDetails.map((item) => ({
        ...item.toJSON(),
      })),
    };
  });

  return result;

    //   if (isAdmin) {
    //     // Retrieve signature of admin from tbl_admins
    //     const admin = await TblAdmin.findOne({
    //       where: {
    //         id: user,
    //       },
    //     });
    //     return {
    //       ...elecDonation?.toJSON(),
    //       createdBySignature: admin?.signature,
    //       createdBy: admin?.name || "",
    //       elecItemDetails: elecDonation.elecItemDetails.map((item) => ({
    //         ...item.toJSON(),
    //       })),
    //     };
    //   } else {
    //     // Retrieve signature of employee from tbl_employees
    //     const employee = await TblEmployees.findOne({
    //       where: {
    //         id: user,
    //       },
    //     });

    //     // Add signature to each elec donation item
    //     return {
    //       ...elecDonation.toJSON(),
    //       createdBySignature: employee?.signature || "",
    //       createdBy: employee?.Username || "",
    //       elecItemDetails: elecDonation?.elecItemDetails.map((item) => ({
    //         ...item.toJSON(),
    //       })),
    //     };
    //   }
    // });

    // result = await Promise.all(promises);

    // return result;
  };

  getElecDonationbyId = async (req) => {
    try{
    let id = req.query.id;
    const userID = req.user.id;
    let data = await TblelecDonation.findOne({
      where: { id: id },
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
        }
      ],
    });
    let creator = await TblEmployees.findOne({
      where: { id: data.created_by },
      attributes: ["id", "Username","signature"],
    });
  
    // Add the creator's name to the result object

    data.dataValues.creator_name = creator;
    // data.dataValues.signature = creator.signature;
    return data;
  }catch(error){
    throw error
  }
  };

  getLastID = async () => {
    const lastID = await TblDonation.findOne({
      order: [["id", "DESC"]],
      attributes: ["id"],
    });
    return lastID ? lastID.id : 1;
  };

  getElecLastID = async () => {
    const lastID = await TblelecDonation.count();
    return lastID;
  };

  NewgetVoucherEach = async (id) => {
    const result = db.ElecDonationModel.findAll({
      where: {
        created_by: id,
      },
      attributes:['id','voucherNo','created_by'],
      order: [
        ["voucherNo", "DESC"],
      ],
    });
    return result;
  };


  newassignedvoucher = async (id) => {
    const result = db.Vouchers.findAll({
      where: {
        assign: id,
      },
      order: [
        ["id", "DESC"],
      ],
    });
    return result;
  };

  donationRecord = async (req) => {
    const userId = req.user.id;
    const record = await TblDonation.findAll({
      where: { created_by: userId },
      attributes: [
        "id",
        "receiptNo",
        "name",
        "phoneNo",
        "address",
        "new_member",
        "donation_date",
        "donation_time",
      ],
      include: [
        {
          model: TblDonationItem,
          as: "itemDetails",
          attributes: ["itemId", "amount", "remark"],
        },
      ],
    });
    return record;
  };

  newDonationRecord = async (req) => {
    let record;
    const userId = req.user.id;
    const { NAME, AMOUNT, PAYMENT_ID, fromDate, toDate, PAYMENT_STATUS } = req.query;
    let searchObj = {};
    searchObj.ADDED_BY = userId

    if (NAME) {
      searchObj.NAME = NAME;
    }

    if (AMOUNT) {
      searchObj.AMOUNT = AMOUNT;
    }

    if (PAYMENT_ID) {
      searchObj.PAYMENT_ID = PAYMENT_ID;
    }

    if (fromDate && toDate) {
      searchObj.DATE_OF_DAAN = {
        [Op.between] : [ fromDate, toDate ]
      }
    }

    if(PAYMENT_STATUS) {
      searchObj.PAYMENT_STATUS = PAYMENT_STATUS
    }

    record = await TblNewDonation.findAll({
      where: searchObj,
      order: [["DATE_OF_DAAN", "DESC"]]
    }).then(async (results) => {
      let users = await TblUsers.findAll({
        attributes: ["signature", "id"],
      });
      console.log(users);
      let admins = await TblAdmin.findOne({
        attributes: ["signature"],
      });

      let finalResults = results.map((item) => {
        let user = users?.find((user) => user?.id === item.ADDED_BY);
        return {
          ...item.toJSON(),
          signature: user ? user.signature : "",
          adminSignature: admins ? admins.signature : "",
        };
      });
      return finalResults;
    });
    return record;
  };

  allDonationRecord = async (req) => {
    let record;
    let { id, order } = req.query;
    if (id) {
      record = await TblNewDonation.findAll({
        where: {
          id: id,
        },
      }).then(async (results) => {
        let users = await TblUsers.findAll({
          attributes: ["signature", "id"],
        });
        console.log(users);
        let admins = await TblAdmin.findOne({
          attributes: ["signature"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user?.id === item.ADDED_BY);
          return {
            ...item.toJSON(),
            signature: user ? user?.signature : "",
            adminSignature: admins ? admins?.signature : "",
          };
        });
        return finalResults;
      });

      return record;
    } else if (order) {
      record = await TblNewDonation.findAll({
        where: {
          RECEIPT_NO: order,
        },
      }).then(async (results) => {
        let users = await TblUsers.findAll({
          attributes: ["signature", "id"],
        });
        console.log(users);
        let admins = await TblAdmin.findOne({
          attributes: ["signature"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user?.id === item.ADDED_BY);
          return {
            ...item.toJSON(),
            signature: user ? user?.signature : "",
            adminSignature: admins ? admins?.signature : "",
          };
        });
        return finalResults;
      });

      return record;
    }

    record = await TblNewDonation.findAll({
      order: [
        ["DATE_OF_DAAN", "DESC"],
        ["TIME_OF_DAAN", "DESC"],
      ],
    }).then(async (results) => {
      console.log(results);
      let users = await TblUsers.findAll({
        attributes: ["signature", "id"],
      });
      let admins = await TblAdmin.findOne({
        attributes: ["signature"],
      });

      let finalResults = results.map((item) => {
        let user = users.find((user) => user?.id === item.ADDED_BY);
        return {
          ...item.toJSON(),
          signature: user ? user.signature : "",
          adminSignature: admins ? admins.signature : "",
        };
      });

      return finalResults;
    });
    return record;
  };

  getItemList = async () => {
    const list = await itemList
      .findAll({
        attributes: ["id", "item_name"],
        where: { is_deleted: null },
        order: ["donation_date", "DESC"],
      })
      .then((res) => {
        console.log(res);
      })
      .catch((er) => {
        console.log(er);
      });
    return list;
  };

  checkDonationType = async (req) => {
    let { type_en, type_hi, modeOfType, itemType_en, itemType_hi } = req.body;
    let type;
    if (modeOfType == "1") {
      type = await TblDonationTypes.findAll({
        where: {
          [Op.or]: [{ type_en: type_en }, { type_hi: type_hi }],
        },
      });
      return type;
    }
    if (modeOfType == "2") {
      type = await TblDonationTypes.findAll({
        where: {
          [Op.or]: [
            {
              itemType_en: itemType_en,
            },
            { itemType_hi: itemType_hi },
          ],
        },
      });
      return type;
    }
  };

  addDonationType = async (req) => {
    const { type_en, type_hi, modeOfType, itemType_en, itemType_hi } = req.body;
    let data;

    if (modeOfType == 1) {
      data = await TblDonationTypes.create({
        type_en,
        type_hi,
        modeOfType,
      });
    } else if (modeOfType == 2) {
      data = await TblDonationTypes.create({
        itemType_en,
        itemType_hi,
        modeOfType,
      });
    }

    return data;
  };

  getDonationType = async (req) => {
    let { type } = req.query;
    let data;
    if (type == 1) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 1,
          status: 1,
        },
        attributes: ["id", "type_en", "type_hi", "status"],
      });
    } else if (type == 2) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 2,
          status: 1,
        },
        attributes: ["id", "itemType_en", "itemType_hi", "status"],
      });
    }
    return data;
  };

  getAdminDonationType = async (req) => {
    let { type } = req.query;
    let data;
    if (type == 1) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 1,
        },
        attributes: ["id", "type_en", "type_hi", "status"],
      });
    } else if (type == 2) {
      data = await TblDonationTypes.findAll({
        where: {
          modeOfType: 2,
        },
        attributes: ["id", "itemType_en", "itemType_hi", "status"],
      });
    }
    return data;
  };

  getAllocatedVoucherList = async (req) => {
    let { userId,from,to } = req.query;

    let whereClause = {};

    if (userId) {
      whereClause.assign = userId;
      whereClause.from = from;
      whereClause.to = to
    }

    const voucherRanges = await TblVouchers.findAll({
      where: whereClause,
      attributes: ["from", "to", "assign", "name"],
    });

    // Create a list of all voucher numbers between the minimum and maximum numbers
    const voucherNumbers = voucherRanges.flatMap((range) =>
      Array.from(
        { length: range.to - range.from + 1 },
        (_, index) => range.from + index
      )
    );

    // Find all donations
    const donations = await TblelecDonation.findAll();

    // Extract the voucher numbers from the donations
    const donationNumbers = donations.map((donation) =>
      parseInt(donation.voucherNo)
    );

    // Find all cancelled vouchers
    const cancelledVouchers = await TblCancelVoucher.findAll();

    // Extract the voucher numbers from the cancelled vouchers
    const cancelledNumbers = cancelledVouchers.map((voucher) =>
      parseInt(voucher.voucherNo)
    );

    // Create a list of vouchers with their allocation status
    const voucherList = voucherNumbers.map((voucherNumber) => {
      let voucherRange =
        voucherRanges.find(
          (range) => range.from <= voucherNumber && range.to >= voucherNumber
        ) || {};

      const cancelledVoucher = cancelledVouchers.find(
        (voucher) => voucher.voucherNo === voucherNumber
      );

      const status = cancelledNumbers.includes(voucherNumber)
        ? "cancelled"
        : donationNumbers.includes(voucherNumber)
        ? "allocated"
        : "unallocated";
      return {
        voucherNo: voucherNumber.toString().padStart(4, "0"),
        status,
        rsn: cancelledVoucher ? cancelledVoucher.rsn : "",
        assign: voucherRange.assign || null,
        name: voucherRange.name || null,
      };
    });

    return voucherList;
  };

  delDonationType = async (req) => {
    let { id, type } = req.query;
    let data;
    if (type == "1") {
      data = await TblDonationTypes.destroy({
        where: {
          id: id,
          modeOfType: 1,
        },
      });
    } else if (type == "2") {
      data = await TblDonationTypes.destroy({
        where: {
          id: id,
          modeOfType: 2,
        },
      });
    }

    return data;
  };

  changeDonationType = async (req) => {
    const { id, status, type } = req.body;
    console.log(req.body);
    let data;

    if (status == "1") {
      await TblDonationTypes.update(
        {
          status: 1,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfType: type,
          },
        }
      )
        .then((res) => {
          if (res[0] === 1) {
            data = {
              status: true,
              message: "Successfully changed status",
            };
          } else {
            data = {
              status: false,
              message: "failed to change status",
            };
          }
        })
        .catch((err) => {
          console.log(err);
          data = {
            status: false,
            message: "failed to change status",
          };
        });
    }
    if (status == "0") {
      await TblDonationTypes.update(
        {
          status: 0,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfType: type,
          },
        }
      )
        .then((res) => {
          if (res[0] === 1) {
            data = {
              status: true,
              message: "Successfully change status",
            };
          } else {
            data = {
              status: false,
              message: "something went wrong",
            };
          }
        })
        .catch((err) => {
          console.log(err);
          data = {
            status: false,
            message: "failed to change status",
          };
        });
    }
    console.log(data);
    return data;
  };

  EditDonationType = async (req) => {
    let { id, type_en, type_hi, modeOfType, itemType_en, itemType_hi } =
      req.body;
    let data;
    if (modeOfType == "1") {
      data = await TblDonationTypes.update(
        { type_en: type_en, type_hi: type_hi },
        {
          where: {
            id: id,
            modeOfType: modeOfType,
          },
        }
      );
    } else if (modeOfType == "2") {
      data = await TblDonationTypes.update(
        { itemType_en: itemType_en, itemType_hi: itemType_hi },
        {
          where: {
            id: id,
            modeOfType: modeOfType,
          },
        }
      );
    }

    return data;
  };

  ChangeChequeStatus = async (req) => {
    const { status, id, rsn, PAYMENT_ID } = req.body;
    console.log(req.body);
    ///status 0 == false ///status 1 === true means active
    let data;

    if (status == 1) {
      data = await TblNewDonation.update(
        {
          active: "1",
          PAYMENT_ID: PAYMENT_ID,
          rsn: "",
        },
        {
          where: {
            id: id,
            MODE_OF_DONATION: "CHEQUE",
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    } else if (status == 0) {
      data = await TblNewDonation.update(
        {
          active: "0",
          rsn: rsn,
        },
        {
          where: {
            id: id,
            MODE_OF_DONATION: "CHEQUE",
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    }
    console.log(data);
    return data;
  };

  ChangeElecStatus = async (req) => {
    const { status, id, rsn, type } = req.body;
    console.log(req.body);
    ///status 0 == false ///status 1 === true means active
    let data;

    if (status == 1) {
      data = await TblelecDonation.update(
        {
          isActive: true,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    } else if (status == 0) {
      data = await TblelecDonation.update(
        {
          isActive: false,
          rsn: rsn,
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    }
    console.log(data);
    return data;
  };

  ChangemanualDonation = async (req) => {
    const { status, id, rsn, type } = req.body;
    console.log(req.body);
    ///status 0 == false ///status 1 === true means active
    let data;

    if (status == 1) {
      console.log("enmtere");
      data = await TblmanualDonation.update(
        {
          isActive: true,
          rsn: "",
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    } else if (status == 0) {
      console.log("enmtere");
      data = await TblmanualDonation.update(
        {
          isActive: false,
          rsn: rsn,
        },
        {
          where: {
            id: id,
            modeOfDonation: type,
          },
        }
      ).catch((err) => {
        console.log(err);
      });
    }
    console.log(data, "data");
    return data;
  };

  savePaymentDetails = async (req) => {
    let result = "";
    console.log(req.body);
    result = await TblNewDonation.update(
      {
        PAYMENT_ID: req.body.PAYMENT_ID,
        PAYMENT_STATUS: req.body.PAYMENT_STATUS == "Success" ? 1 : 0,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    if(req.body.PAYMENT_STATUS == "Success" && req.body.LedgerNo) {
      const extractedPart = req.body.LedgerNo.split("/");
        if (req.body.LedgerNo && extractedPart[0] == 'LEDGER') {
          const boliLedgerData = await TblBoliLedger.findOne({
              where : {
                  LedgerNo : req.body.LedgerNo
              }
          });
          const updatedAmount = parseFloat(boliLedgerData.DepositedAmount) + parseFloat(req.body.AMOUNT);
          await TblBoliLedger.update(
              {
                  DepositedAmount : updatedAmount
              },
              {
                  where : {
                      LedgerNo : req.body.LedgerNo
                  }
              }
          );
        }
    }
    return result;
  };

  getuserBynum = async (req) => {
    let user = await TblelecDonation.findOne({
      where: {
        phoneNo: req.query.mobile,
      },
      order: [['id', 'DESC']]
    });

    return user;
  };

  getuserBynumManual = async (req) => {
    let user = await TblmanualDonation.findOne({
      where: {
        phoneNo: req.query.mobile,
      },
      order: [['id', 'DESC']]
    });

    return user;
  };

  donationReport = async (req) => {
    let { fromDate, toDate, user } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    try {
      let whereClause = {};

      if (fromDate && toDate) {
        whereClause = {
          donation_date: {
            [Op.between]: [from, to],
          },
        };
      }
      if (user) {
        whereClause.created_by = user;
      }

      const donations = await TblelecDonation.findAll({
        where: whereClause,
        include: [
          {
            model: TblelecDonationItem,
            as: "elecItemDetails",
            attributes: ["type"],
          },
        ],
        attributes: [
          "modeOfDonation",
          "created_by",
          "elecItemDetails.type",
          [
            TblelecDonation.sequelize.literal(`COUNT(tbl_elec_donation.id)`),
            "count",
          ],

          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 1 THEN elecItemDetails.amount END)`
            ),
            "electric_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 2 THEN elecItemDetails.amount END)`
            ),
            "cash_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 3 THEN elecItemDetails.amount END)`
            ),
            "cheque_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 4 THEN elecItemDetails.amount END)`
            ),
            "item_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(IFNULL(CASE WHEN modeOfDonation = 1 THEN elecItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 2 THEN elecItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 3 THEN elecItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 4 THEN elecItemDetails.amount END, 0))`
            ),
            "total_amount",
          ],
        ],
        group: ["elecItemDetails.type", "tbl_elec_donation.created_by"],

        raw: true,
      });

      // Calculate the total count of all users
      const totalCount = donations.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate the total amount of all users
      const totalAmount = donations.reduce(
        (acc, curr) => acc + curr.total_amount,
        0
      );

      console.log(totalCount, totalAmount);
      const result = [
        {
          totalCount,
          totalAmount,
          donations,
        },
      ];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  manualdonationReport = async (req) => {
    let { fromDate, toDate, user } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    try {
      let whereClause = {};

      if (fromDate && toDate) {
        whereClause = {
          donation_date: {
            [Op.between]: [from, to],
          },
        };
      }

      if (user) {
        whereClause.created_by = user;
      }

      const donations = await TblmanualDonation.findAll({
        where: whereClause,
        include: [
          {
            model: TblmanualDonationItem,
            as: "manualItemDetails",
            attributes: ["type"],
          },
        ],
        attributes: [
          "modeOfDonation",
          "created_by",
          "manualItemDetails.type",
          [
            TblmanualDonation.sequelize.literal(
              `COUNT(tbl_manual_donation.id)`
            ),
            "count",
          ],

          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 1 THEN manualItemDetails.amount END)`
            ),
            "manualtric_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 2 THEN manualItemDetails.amount END)`
            ),
            "cash_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 3 THEN manualItemDetails.amount END)`
            ),
            "cheque_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(CASE WHEN modeOfDonation = 4 THEN manualItemDetails.amount END)`
            ),
            "item_amount",
          ],
          [
            TblDonationItem.sequelize.literal(
              `SUM(IFNULL(CASE WHEN modeOfDonation = 1 THEN manualItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 2 THEN manualItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 3 THEN manualItemDetails.amount END, 0) + IFNULL(CASE WHEN modeOfDonation = 4 THEN manualItemDetails.amount END, 0))`
            ),
            "total_amount",
          ],
        ],
        group: ["manualItemDetails.type", "tbl_manual_donation.created_by"],

        raw: true,
      });
      console.log(donations);

      // Calculate the total count of all users
      const totalCount = donations.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate the total amount of all users
      const totalAmount = donations.reduce(
        (acc, curr) => acc + curr.total_amount,
        0
      );

      console.log(totalCount, totalAmount);
      const result = [
        {
          totalCount,
          totalAmount,
          donations,
        },
      ];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  onlineDonationReport = async (req) => {
    let { fromDate, toDate, user } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    try {
      let whereClause = {};

      if (fromDate && toDate) {
        whereClause = {
          DATE_OF_DAAN: {
            [Op.between]: [from, to],
          },
        };
      }

      if (user) {
        whereClause.ADDED_BY = user;
      }

      const donations = await TblNewDonation.findAll({
        where: whereClause,

        attributes: [
          "MODE_OF_DONATION",
          "ADDED_BY",
          "tbl_donations.TYPE",
          [
            TblNewDonation.sequelize.literal(`COUNT(tbl_donations.id)`),
            "count",
          ],

          [
            TblNewDonation.sequelize.literal(
              `SUM(CASE WHEN MODE_OF_DONATION = "ONLINE" THEN tbl_donations.AMOUNT END)`
            ),
            "online_amount",
          ],
          [
            TblNewDonation.sequelize.literal(
              `SUM(CASE WHEN MODE_OF_DONATION = "CHEQUE" THEN tbl_donations.AMOUNT END)`
            ),
            "cheque_amount",
          ],

          [
            TblNewDonation.sequelize.literal(
              `SUM(IFNULL(CASE WHEN MODE_OF_DONATION = "ONLINE" THEN tbl_donations.AMOUNT END, 0) + IFNULL(CASE WHEN MODE_OF_DONATION = "CHEQUE" THEN tbl_donations.amount END, 0 ))`
            ),
            "total_amount",
          ],
        ],
        group: ["tbl_donations.TYPE", "tbl_donations.ADDED_BY"],

        raw: true,
      });
      console.log(donations);

      // Calculate the total count of all users
      const totalCount = donations.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate the total amount of all users
      const totalAmount = donations.reduce(
        (acc, curr) => acc + curr.total_amount,
        0
      );

      console.log(totalCount, totalAmount);
      const result = [
        {
          totalCount,
          totalAmount,
          donations,
        },
      ];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  userDonationAmount = async (req) => {
    const { from, to, userId } = req.query;
    let res;
    let whereClause = {};

    let fromDate = new Date(from);
    let toDate = new Date(to);

    if (from && to) {
      whereClause.donation_date = {
        [Op.between]: [fromDate, toDate],
      };
    }

    if (userId) {
      whereClause.created_by = userId;
    }

    res = await TblelecDonation.findAll({
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
          attributes: [],
        },
      ],
      where: whereClause,
      group: ["tbl_elec_donation.created_by"],
      attributes: [
        "created_by",
        "donation_date",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "totalDonationAmount",
        ],
      ],
    })
      .then(async (results) => {
        let userIds = results.map((item) => item.created_by);
        let users = await TblEmployees.findAll({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
          attributes: ["id", "Username"],
        });

        let finalResults = results.map((item) => {
          let user = users.find((user) => user.id === item.created_by);
          return {
            ...item.toJSON(),
            name: user ? user.Username : "",
          };
        });

        return finalResults;
      })
      .catch((error) => {
        console.log(error, "err");
        return error;
      });

    return res;
  };

  manualuserDonationAmount = async (req) => {
    const { from, to, userId } = req.query;
    let res;
    let whereClause = {};

    let fromDate = new Date(from);
    let toDate = new Date(to);

    if (from && to) {
      whereClause.donation_date = {
        [Op.between]: [fromDate, toDate],
      };
    }

    if (userId) {
      whereClause.created_by = userId;
    }

    res = await TblmanualDonation.findAll({
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
          attributes: [],
        },
      ],
      where: whereClause,
      group: ["tbl_manual_donation.created_by"],
      attributes: [
        "created_by",
        "donation_date",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "totalDonationAmount",
        ],
      ],
    })
      .then(async (results) => {
        let userIds = results.map((item) => item.created_by);
        let users = await TblEmployees.findAll({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
          attributes: ["id", "Username"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user.id === item.created_by);
          return {
            ...item.toJSON(),
            name: user ? user?.Username : "",
          };
        });

        return finalResults;
      })
      .catch((error) => {
        console.log(error, "err");
        return error;
      });

    return res;
  };

  onlineuserDonationAmount = async (req) => {
    const { from, to, userId, type } = req.query;
    let res;
    let whereClause = {};

    let fromDate = new Date(from);
    let toDate = new Date(to);

    if (from && to) {
      whereClause.DATE_OF_DAAN = {
        [Op.between]: [fromDate, toDate],
      };
    }

    if (userId) {
      whereClause.ADDED_BY = userId;
    }

    if (type) {
      whereClause.MODE_OF_DONATION = type;
    }
    console.log(whereClause);

    res = await TblNewDonation.findAll({
      where: whereClause,
      group: ["tbl_donations.ADDED_BY", "tbl_donations.MODE_OF_DONATION"],
      attributes: [
        "ADDED_BY",
        "MODE_OF_DONATION",
        [
          TblNewDonation.sequelize.fn(
            "SUM",
            TblNewDonation.sequelize.col("tbl_donations.AMOUNT")
          ),
          "totalDonationAmount",
        ],
      ],
    })
      .then(async (results) => {
        let userIds = results?.map((item) => item.created_by);
        let users = await TblUsers.findAll({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
          attributes: ["id", "name"],
        });

        let finalResults = results?.map((item) => {
          let user = users?.find((user) => user.id === item.created_by);
          return {
            ...item.toJSON(),
            name: user ? user?.name : "",
          };
        });

        return finalResults;
      })
      .catch((error) => {
        console.log(error, "err");
        return error;
      });

    return res;
  };

  getConsReport = async (req) => {
    let { fromDate, toDate} = req.query;
    
    let {type, user} = req.body;
    console.log('user --------->>>> :', user,  type);
    let whereClause = {};
    let whereClause1 = '';
    if (user && user.length) {
      if(user.length===1){
        whereClause1 = whereClause1 + `WHERE created_by=${user[0]}`;
      }
      else{
        let userWhereCondition = 'WHERE (created_by='
        for(let i = 0; i <= user.length-1 ; i++){
          console.log(i," ",typeof(i), " ", user.length-1," ", typeof(user.length-1) )
          if(i!==user.length-1){
            userWhereCondition = userWhereCondition + user[i] + " OR created_by="
          }
          else{
            userWhereCondition = userWhereCondition + user[i]+')'
          }
        }
        whereClause1 = whereClause1 + userWhereCondition;
      }      
    }
    if (type && type.length) {
      whereClause.TYPE = type;

      let typeWrappedInQuotes = type.map(typeEle=>{
        return `'${typeEle}'`
      })
      typeWrappedInQuotes = typeWrappedInQuotes.join(',')
      whereClause1 = whereClause1 + `${user ? ' AND' : 'WHERE'} TYPE IN (${typeWrappedInQuotes})`;
    }
    if (fromDate && toDate) {
      whereClause.DATE_OF_DAAN = { [Op.between]: [fromDate, toDate] };
      whereClause1 = whereClause1 + `${user || type ? ' AND' : 'WHERE'} DATE(donation_date) BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    const groupByModeOfDonation = (data, donationType) => {
      let dataElecOrManObj = {}
      for (let employee of data) {
        let key = employee.Username + "_" + donationType + "_" + employee.created_by;
        if (dataElecOrManObj[key]) {
          console.log("entering here", employee.modeOfDonation, "   ", employee.total_amount)
          if (dataElecOrManObj[key].donationType === 'electric') {
            dataElecOrManObj[key].bank_TOTAL_AMOUNT = employee.modeOfDonation === '1' ? employee.total_amount : dataElecOrManObj[key].bank_TOTAL_AMOUNT;
            dataElecOrManObj[key].cash_TOTAL_AMOUNT = employee.modeOfDonation === '2' ? employee.total_amount : dataElecOrManObj[key].cash_TOTAL_AMOUNT;
            dataElecOrManObj[key].cheque_TOTAL_AMOUNT = employee.modeOfDonation === '3' ? employee.total_amount : dataElecOrManObj[key].cheque_TOTAL_AMOUNT;
            dataElecOrManObj[key].item_TOTAL_AMOUNT = employee.modeOfDonation === '4' ? employee.total_amount : dataElecOrManObj[key].item_TOTAL_AMOUNT;
          }
          if (dataElecOrManObj[key].donationType === 'manual') {
            dataElecOrManObj[key].bank_TOTAL_AMOUNT = employee.modeOfDonation === '1' ? employee.total_amount : dataElecOrManObj[key].bank_TOTAL_AMOUNT;
            dataElecOrManObj[key].cash_TOTAL_AMOUNT = employee.modeOfDonation === '2' ? employee.total_amount : dataElecOrManObj[key].cash_TOTAL_AMOUNT;
            dataElecOrManObj[key].cheque_TOTAL_AMOUNT = employee.modeOfDonation === '3' ? employee.total_amount : dataElecOrManObj[key].cheque_TOTAL_AMOUNT;
            dataElecOrManObj[key].item_TOTAL_AMOUNT = employee.modeOfDonation === '4' ? employee.total_amount : dataElecOrManObj[key].item_TOTAL_AMOUNT;
          }
        }
        else {
          if (donationType === 'electric') {
            dataElecOrManObj[key] = {
              employeeName: employee.Username,
              donationType: 'electric',
              bank_TOTAL_AMOUNT: employee.modeOfDonation === '1' ? employee.total_amount : 0,
              cash_TOTAL_AMOUNT: employee.modeOfDonation === '2' ? employee.total_amount : 0,
              cheque_TOTAL_AMOUNT: employee.modeOfDonation === '3' ? employee.total_amount : 0,
              item_TOTAL_AMOUNT: employee.modeOfDonation === '4' ? employee.total_amount : 0
            }
          }
          if (donationType === 'manual') {
            dataElecOrManObj[key] = {
              employeeName: employee.Username,
              donationType: 'manual',
              bank_TOTAL_AMOUNT: employee.modeOfDonation === '1' ? employee.total_amount : 0,
              cash_TOTAL_AMOUNT: employee.modeOfDonation === '2' ? employee.total_amount : 0,
              cheque_TOTAL_AMOUNT: employee.modeOfDonation === '3' ? employee.total_amount : 0,
              item_TOTAL_AMOUNT: employee.modeOfDonation === '4' ? employee.total_amount : 0
            }
          }
        }

      }

      return Object.values(dataElecOrManObj);


    }

    let tbl_elec_donations_result = await sequelizes.query(`SELECT modeOfDonation,created_by,type,Username, SUM(amount) AS total_amount FROM tbl_elec_donations INNER JOIN tbl_elec_donation_items ON tbl_elec_donation_items.donationId=tbl_elec_donations.id INNER JOIN tbl_employees ON tbl_elec_donations.created_by=tbl_employees.id ${whereClause1} AND isActive=true GROUP BY modeOfDonation,created_by ORDER BY Username;`, {
      nest: true,
      type: QueryTypes.SELECT,
      raw: true
    });

    let tbl_manual_donations_result = await sequelizes.query(`SELECT modeOfDonation,created_by,type,Username, SUM(amount) AS total_amount FROM tbl_manual_donations INNER JOIN tbl_manual_donation_items ON tbl_manual_donation_items.donationId=tbl_manual_donations.id INNER JOIN tbl_employees ON tbl_manual_donations.created_by=tbl_employees.id ${whereClause1} GROUP BY modeOfDonation,created_by ORDER BY Username;`, { // AND isActive=true
      nest: true,
      type: QueryTypes.SELECT,
      raw: true
    });

    tbl_elec_donations_result = groupByModeOfDonation(tbl_elec_donations_result, 'electric');
    tbl_manual_donations_result = groupByModeOfDonation(tbl_manual_donations_result, 'manual');
    // tbl_donations_result = groupByModeOfDonation(tbl_donations_result, 'online');


    const result = tbl_elec_donations_result.concat(tbl_manual_donations_result);
    return result;
  };

  centralizeduserDonationAmount = async (req) => {
    let { fromDate, toDate } = req.query;
    let {type,user} = req.body;
    console.log('req.body------>>>>> :', req.body);
    let whereClause = {};
    let whereClause1 = '';
    if (user && user.length) {
      if(user.length===1){
        whereClause1 = whereClause1 + `WHERE created_by=${user[0]}`;
      }
      else{
        let userWhereCondition = 'WHERE (created_by='
        for(let i = 0; i <= user.length-1 ; i++){
          console.log(i," ",typeof(i), " ", user.length-1," ", typeof(user.length-1) )
          if(i!==user.length-1){
            userWhereCondition = userWhereCondition + user[i] + " OR created_by="
          }
          else{
            userWhereCondition = userWhereCondition + user[i]+')'
          }
        }
        whereClause1 = whereClause1 + userWhereCondition;
      }      
    }
    console.log("type 11111----->>>", type);
    if (type && type.length) {
      whereClause.TYPE = type;

      let typeWrappedInQuotes = type.map(typeEle=>{
        return `'${typeEle}'`
      })
      typeWrappedInQuotes = typeWrappedInQuotes.join(',')
      whereClause1 = whereClause1 + `${user ? ' AND' : 'WHERE'} TYPE IN (${typeWrappedInQuotes})`;
    }
    if (fromDate && toDate) {
      whereClause.DATE_OF_DAAN = { [Op.between]: [fromDate, toDate] };
      whereClause1 = whereClause1 + `${user || type ? ' AND' : 'WHERE'} DATE(donation_date) BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    let tbl_donations_result = await TblNewDonation.findAll({
      attributes: [
        "MODE_OF_DONATION",
        "TYPE",
        [TblNewDonation.sequelize.literal("SUM(AMOUNT)"), "TOTAL_AMOUNT"],
      ],
      // where: whereClause,
      group: ["MODE_OF_DONATION", "TYPE"],
      raw: true,
      where:whereClause,
      nest: true
    });

    const groupByModeOfDonation = (data, donationType) => {
      let dataElecOrManObj = {}
      for (let employee of data) {
        let key = employee.type;
        // if(donationType ==='online'){
        //   key = employee.TYPE;
        // }
        if (dataElecOrManObj[key]) {
          if (dataElecOrManObj[key].donationType === 'electric') {
            dataElecOrManObj[key].bank_TOTAL_AMOUNT = employee.modeOfDonation === '1' ? dataElecOrManObj[key].bank_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].bank_TOTAL_AMOUNT;
            dataElecOrManObj[key].cash_TOTAL_AMOUNT = employee.modeOfDonation === '2' ? dataElecOrManObj[key].cash_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].cash_TOTAL_AMOUNT;
            dataElecOrManObj[key].cheque_TOTAL_AMOUNT = employee.modeOfDonation === '3' ? dataElecOrManObj[key].cheque_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].cheque_TOTAL_AMOUNT;
            dataElecOrManObj[key].item_TOTAL_AMOUNT = employee.modeOfDonation === '4' ? dataElecOrManObj[key].item_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].item_TOTAL_AMOUNT;
          }
          if (dataElecOrManObj[key].donationType === 'manual') {
            dataElecOrManObj[key].bank_TOTAL_AMOUNT = employee.modeOfDonation === '1' ? dataElecOrManObj[key].bank_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].bank_TOTAL_AMOUNT;
            dataElecOrManObj[key].cash_TOTAL_AMOUNT = employee.modeOfDonation === '2' ? dataElecOrManObj[key].cash_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].cash_TOTAL_AMOUNT;
            dataElecOrManObj[key].cheque_TOTAL_AMOUNT = employee.modeOfDonation === '3' ? dataElecOrManObj[key].cheque_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].cheque_TOTAL_AMOUNT;
            dataElecOrManObj[key].item_TOTAL_AMOUNT = employee.modeOfDonation === '4' ? dataElecOrManObj[key].item_TOTAL_AMOUNT + employee.total_amount : dataElecOrManObj[key].item_TOTAL_AMOUNT;
          }
          // if (dataElecOrManObj[key].donationType === 'online') {
          //   dataElecOrManObj[key].cheque = employee.MODE_OF_DONATION === 'CHEQUE' ? dataElecOrManObj[key].cheque + employee.TOTAL_AMOUNT : dataElecOrManObj[key].cheque;
          //   dataElecOrManObj[key].online = employee.MODE_OF_DONATION === 'ONLINE' ? dataElecOrManObj[key].online + employee.TOTAL_AMOUNT : dataElecOrManObj[key].online;
          // }
        }
        else {
          if (donationType === 'electric') {
            dataElecOrManObj[key] = {
              type: employee.type,
              donationType: 'electric',
              bank_TOTAL_AMOUNT: employee.modeOfDonation === '1' ? employee.total_amount : 0,
              cash_TOTAL_AMOUNT: employee.modeOfDonation === '2' ? employee.total_amount : 0,
              cheque_TOTAL_AMOUNT: employee.modeOfDonation === '3' ? employee.total_amount : 0,
              item_TOTAL_AMOUNT: employee.modeOfDonation === '4' ? employee.total_amount : 0
            }
          }
          if (donationType === 'manual') {
            dataElecOrManObj[key] = {
              type: employee.type,
              donationType: 'manual',
              bank_TOTAL_AMOUNT: employee.modeOfDonation === '1' ? employee.total_amount : 0,
              cash_TOTAL_AMOUNT: employee.modeOfDonation === '2' ? employee.total_amount : 0,
              cheque_TOTAL_AMOUNT: employee.modeOfDonation === '3' ? employee.total_amount : 0,
              item_TOTAL_AMOUNT: employee.modeOfDonation === '4' ? employee.total_amount : 0
            }
          }
          // if (donationType === 'online') {
          //   console.log(employee.TYPE)
          //   dataElecOrManObj[key] = {
          //     type: employee.TYPE,
          //     donationType: "online",
          //     cheque: employee.MODE_OF_DONATION === 'CHEQUE' ? employee.TOTAL_AMOUNT : 0,
          //     online: employee.MODE_OF_DONATION === 'ONLINE' ? employee.TOTAL_AMOUNT : 0,                          
          //   }
          // }
        }

      }

      return Object.values(dataElecOrManObj);


    }

    let tbl_elec_donations_result = await sequelizes.query(`SELECT modeOfDonation,created_by,type,Username, SUM(amount) AS total_amount FROM tbl_elec_donations INNER JOIN tbl_elec_donation_items ON tbl_elec_donation_items.donationId=tbl_elec_donations.id INNER JOIN tbl_employees ON tbl_elec_donations.created_by=tbl_employees.id ${whereClause1} AND isActive=true GROUP BY modeOfDonation,type;`, {
      nest: true,
      type: QueryTypes.SELECT,
      raw: true
    });

    let tbl_manual_donations_result = await sequelizes.query(`SELECT modeOfDonation,created_by,type,Username, SUM(amount) AS total_amount FROM tbl_manual_donations INNER JOIN tbl_manual_donation_items ON tbl_manual_donation_items.donationId=tbl_manual_donations.id INNER JOIN tbl_employees ON tbl_manual_donations.created_by=tbl_employees.id ${whereClause1}  GROUP BY modeOfDonation,type;`, {   //AND isActive=true
      nest: true,
      type: QueryTypes.SELECT,
      raw: true
    });

    tbl_elec_donations_result = groupByModeOfDonation(tbl_elec_donations_result, 'electric');
    tbl_manual_donations_result = groupByModeOfDonation(tbl_manual_donations_result, 'manual');
    // tbl_donations_result = groupByModeOfDonation(tbl_donations_result, 'online');

    let result = tbl_elec_donations_result.concat(tbl_manual_donations_result);
    // result = result.concat(tbl_donations_result);
    return result;
  };

  getOnlineReport = async (req) => {
    let { fromDate, toDate } = req.query;
    let { type } = req.body;
    let whereClause = {};
    if (type && type.length) {
      whereClause.TYPE = type;

      let typeWrappedInQuotes = type.map(typeEle=>{
        return `'${typeEle}'`
      })
      typeWrappedInQuotes = typeWrappedInQuotes.join(',');
    }
    if (fromDate && toDate) {
      whereClause.DATE_OF_DAAN = { [Op.between]: [fromDate, toDate] };
    }

    whereClause.PAYMENT_STATUS = { [Op.eq]: 1 };
    let tbl_donations_result = await TblNewDonation.findAll({
      attributes: [
        "MODE_OF_DONATION",
        "TYPE",
        [TblNewDonation.sequelize.literal("SUM(AMOUNT)"), "TOTAL_AMOUNT"],
      ],
      // where: whereClause,
      group: ["MODE_OF_DONATION", "TYPE"],
      raw: true,
      where: whereClause,
      nest: true
    });

    const groupByModeOfDonation = (data) => {
      let dataElecOrManObj = {}
      for (let employee of data) {
        const key = employee.TYPE;        
        if (dataElecOrManObj[key]) {
            dataElecOrManObj[key].cheque = employee.MODE_OF_DONATION === 'CHEQUE' ? dataElecOrManObj[key].cheque + employee.TOTAL_AMOUNT : dataElecOrManObj[key].cheque;
            dataElecOrManObj[key].online = employee.MODE_OF_DONATION === 'ONLINE' ? dataElecOrManObj[key].online + employee.TOTAL_AMOUNT : dataElecOrManObj[key].online;          
        }
        else {
            dataElecOrManObj[key] = {
              type: employee.TYPE,
              donationType: "online",
              cheque: employee.MODE_OF_DONATION === 'CHEQUE' ? employee.TOTAL_AMOUNT : 0,
              online: employee.MODE_OF_DONATION === 'ONLINE' ? employee.TOTAL_AMOUNT : 0,                          
            }          
        }
      }
      return Object.values(dataElecOrManObj);
    }
    tbl_donations_result = groupByModeOfDonation(tbl_donations_result);
    return tbl_donations_result;
  };

  employeeChangePass = async (req) => {
    let userId = req.user.id;
    let user;
    let { oldPass, newPass } = req.body;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(newPass, salt);
    console.log(hashencrypt);
    let check = await TblEmployees.findOne({
      where: {
        id: userId,
      },
    });

    if (!check) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your not Authorized ");
    }

    let passMatch = await bcrypt.compare(oldPass, check.Password);
    console.log(passMatch);
    if (!passMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your password is incorrect");
    }

    if (passMatch) {
      console.log("paswords match");
      user = await TblEmployees.update(
        {
          Password: hashencrypt,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    }

    return user;
  };

  adminChangePass = async (req) => {
    let userId = req.user.id;
    let user;
    let { oldPass, newPass } = req.body;

    const salt = bcrypt.genSaltSync(12);
    const hashencrypt = bcrypt.hashSync(newPass, salt);
    console.log(hashencrypt);
    let check = await TblAdmin.findOne({
      where: {
        id: userId,
      },
    });

    if (!check) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your not Authorized ");
    }

    let passMatch = await bcrypt.compare(oldPass, check.password);
    console.log(passMatch);
    if (!passMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your password is incorrect");
    }

    if (passMatch) {
      console.log("paswords match");
      user = await TblAdmin.update(
        {
          password: hashencrypt,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    }

    return user;
  };

  getManualDonation = async (req) => {
    const { type, id } = req.query;
    let data;
    let whereClause = {};
    let result;
    if (type) {
      whereClause.modeOfDonation = type;
    }

    if (id) {
      whereClause.id = id;
    }

    data = await TblmanualDonation.findAll({
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
        },
      ],
      where: whereClause,
      order: [["donation_date", "DESC"]],
    });

    const promises = data?.map(async (manualdonation) => {
      const isAdmin = manualdonation.isAdmin;
      const user = manualdonation.created_by;
      console.log(isAdmin, user);
      if (isAdmin) {
        // Retrieve signature of admin from tbl_admins
        const admin = await TblAdmin.findOne({
          where: {
            id: user,
          },
        });

        // Add signature to each elec donation item
        return {
          ...manualdonation.toJSON(),
          createdBySignature: admin.signature || "",
          CreatedBy: admin.name,
          manualItemDetails: manualdonation.manualItemDetails.map((item) => ({
            ...item.toJSON(),
          })),
        };
      } else {
        // Retrieve signature of employee from tbl_employees
        const employee = await TblEmployees.findOne({
          where: {
            id: user,
          },
        });

        // Add signature to each elec donation item
        return {
          ...manualdonation.toJSON(),
          createdBySignature: employee?.signature || "",
          CreatedBy: employee?.Username || "",
          manualItemDetails: manualdonation?.manualItemDetails?.map((item) => ({
            ...item.toJSON(),
          })),
        };
      }
    });

    result = await Promise.all(promises);

    return result;
  };

  cancelEachVoucher = async (req) => {
    let result;
    let cancelledVoucher = await TblCancelVoucher.create(req.body)
      .then((res) => {
        const data = TblVouchers.update({voucher: req.body.voucherNo + 1}, {
          where : {
            from : { [Op.lte] : req.body.voucherNo },
            to : { [Op.gt] : req.body.voucherNo } 
          }
        })
        result = {
          status: "success",
          message: "Voucher Cancelled SuccessFully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: "Failed",
          message: "Voucher failed to  cancel",
        };
      });
    if (!result) {
      result = {
        status: "Failed",
        message: "Something went wrong !",
      };
    }

    return result;
  };

  getCancelledVoucher = async (voucher) => {
    let data = await TblCancelVoucher.findOne({
      where: {
        voucherNo: voucher,
      },
    });

    return data;
  };

  searchManual = async (req) => {
    const { search, type } = req.query;

    const where = {
      [Op.or]: [
        { name: { [Op.regexp]: `^${search}.*` } },
        { phoneNo: { [Op.regexp]: `^${search}.*` } },
        { ReceiptNo: { [Op.regexp]: `^${search}.*` } },
        { address: { [Op.regexp]: `^${search}.*` } },
        { donation_date: { [Op.regexp]: `^${search}.*` } },
        { "$manualItemDetails.amount$": { [Op.regexp]: `^${search}.*` } },
        {
          "$manualItemDetails.transactionNo$": { [Op.regexp]: `^${search}.*` },
        },
        { "$manualItemDetails.ChequeNo$": { [Op.regexp]: `^${search}.*` } },
      ],
    };

    if (type) {
      where["modeOfDonation"] = { [Op.regexp]: `^${type}.*` };
    }

    try {
      const donations = await TblmanualDonation.findAll({
        where,
        include: [
          {
            model: TblmanualDonationItem,
            as: "manualItemDetails",
          },
        ], // include associated table
      });

      if (!donations.length) {
        return [];
      }

      return donations;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  searchOnlineCheque = async (req) => {
    let { fromDate, toDate, fromRec, toRec, type } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    console.log(req.query);
    let whereClause = {};

    if (fromDate && toDate) {
      whereClause.DATE_OF_DAAN = {
        [Op.between]: [from, to],
      };
    }

    if (fromRec && toRec) {
      console.log("enter");
      whereClause.RECEIPT_NO = { [Op.between]: [fromRec, toRec] };
    }

    if (type) {
      whereClause.MODE_OF_DONATION = type == 1 ? "ONLINE" : "CHEQUE";
    }
    console.log(whereClause);
    const data = await TblNewDonation.findAll({
      where: whereClause,
    });
    return data;
  };

  searchElectric = async (req) => {
    const { search, type } = req.query;

    const where = {
      [Op.or]: [
        { name: { [Op.regexp]: `^${search}.*` } },
        { phoneNo: { [Op.regexp]: `^${search}.*` } },
        { voucherNo: { [Op.regexp]: `^${search}.*` } },
        { ReceiptNo: { [Op.regexp]: `^${search}.*` } },
        { address: { [Op.regexp]: `^${search}.*` } },
        { donation_date: { [Op.regexp]: `^${search}.*` } },
        { "$elecItemDetails.amount$": { [Op.regexp]: `^${search}.*` } },
        { "$elecItemDetails.transactionNo$": { [Op.regexp]: `^${search}.*` } },
        { "$elecItemDetails.ChequeNo$": { [Op.regexp]: `^${search}.*` } },
      ],
    };

    if (type) {
      where["modeOfDonation"] = { [Op.regexp]: `^${type}.*` };
    }

    try {
      const donations = await TblelecDonation.findAll({
        where,
        include: [
          {
            model: TblelecDonationItem,
            as: "elecItemDetails",
          },
        ], // include associated table
      });

      if (!donations.length) {
        return [];
      }

      return donations;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  SpecificsearchOnlinecheque = async (req) => {
    const { search, type } = req.query;

    const where = {
      [Op.or]: [
        { NAME: { [Op.regexp]: `^${search}.*` } },
        { MobileNo: { [Op.regexp]: `^${search}.*` } },
        {
          RECEIPT_NO: { [Op.regexp]: `^${search}.*` },
        },
        {
          ADDRESS: { [Op.regexp]: `^${search}.*` },
        },
        {
          DATE_OF_DAAN: { [Op.regexp]: `^${search}.*` },
        },
        {
          TYPE: { [Op.regexp]: `^${search}.*` },
        },
        {
          AMOUNT: { [Op.regexp]: `^${search}.*` },
        },
        {
          PAYMENT_ID: {
            [Op.regexp]: `^${search}.*`,
          },
        },
        {
          CHEQUE_NO: { [Op.regexp]: `^${search}.*` },
        },
      ],
    };

    if (type) {
      where["MODE_OF_DONATION"] = { [Op.regexp]: `^${type}.*` };
    }

    try {
      const donations = await TblNewDonation.findAll({
        where,
      });

      if (!donations.length) {
        return [];
      }

      return donations;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  dashAdminTotal = async () => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );

    const donationResultsPromise = TblelecDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        isActive:true
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashemployeeTotal = async (req) => {
    console.log(req.user.id);
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );

    const donationResultsPromise = TblelecDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblelecDonation.sequelize.fn(
            "SUM",
            TblelecDonation.sequelize.col("elecItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblelecDonationItem,
          as: "elecItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        isActive:true,
        created_by: req.user.id,
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  checkReceipt = async (ReceiptNo) => {
    const receiptExists = await TblmanualDonation.findOne({where:{ReceiptNo}});
    return receiptExists?true:false;
  };

  dashAdminTotalManual = async () => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );
    const donationResultsPromise = TblmanualDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        isActive:true
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashemployeeTotalManual = async (req) => {
    console.log(req.user.id);
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );
    const donationResultsPromise = TblmanualDonation.findAll({
      attributes: [
        "created_by",
        "modeOfDonation",
        [
          TblmanualDonation.sequelize.fn(
            "SUM",
            TblmanualDonation.sequelize.col("manualItemDetails.amount")
          ),
          "total_amount",
        ],
      ],
      include: [
        {
          model: TblmanualDonationItem,
          as: "manualItemDetails",
          attributes: [],
        },
      ],
      where: {
        donation_date: {
          [Op.between]: [startOfToday, endOfToday],
        },
        isActive:true,
        created_by: req.user.id,
      },
      group: ["created_by", "modeOfDonation"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      1: "bank",
      2: "cash",
      3: "cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.created_by];
      const modeOfDonation = modeOfDonationMap[donation.modeOfDonation];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.created_by]) {
        donationResultsByUser[donation.created_by] = {
          created_by: donation.created_by,
          employee_name: employeeName,
          cash_amount: 0,
          bank_amount: 0,
          cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.created_by];

      switch (modeOfDonation) {
        case "cash":
          userResult.cash_amount = totalAmount;
          break;
        case "bank":
          userResult.bank_amount = totalAmount;
          break;
        case "cheque":
          userResult.cheque_amount = totalAmount;
          break;
      }

      userResult.total =
        userResult.cash_amount +
        userResult.bank_amount +
        userResult.cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  dashAdminTotalOnline = async () => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    );
    const donationResultsPromise = TblNewDonation.findAll({
      attributes: [
        "ADDED_BY",
        "MODE_OF_DONATION",
        [
          TblNewDonation.sequelize.fn(
            "SUM",
            TblNewDonation.sequelize.col("tbl_donations.amount")
          ),
          "total_amount",
        ],
      ],
      where: {
        PAYMENT_STATUS: 1,
        DATE_OF_DAAN: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      group: ["ADDED_BY", "MODE_OF_DONATION"],
    });

    const employeeResultsPromise = TblEmployees.findAll({
      attributes: ["id", "Username"],
    });

    const [donationResults, employeeResults] = await Promise.all([
      donationResultsPromise,
      employeeResultsPromise,
    ]);

    const employeeMap = {};
    employeeResults.forEach((employee) => {
      employeeMap[employee.id] = employee.Username;
    });

    const modeOfDonationMap = {
      ONLINE: "Online",
      CHEQUE: "Cheque",
    };

    const donationResultsByUser = {};
    donationResults.forEach((donation) => {
      const employeeName = employeeMap[donation.ADDED_BY];
      const modeOfDonation = modeOfDonationMap[donation.MODE_OF_DONATION];
      const totalAmount = donation.dataValues.total_amount;

      if (!donationResultsByUser[donation.ADDED_BY]) {
        donationResultsByUser[donation.ADDED_BY] = {
          created_by: donation.ADDED_BY,
          employee_name: employeeName,
          Online_amount: 0,
          Cheque_amount: 0,
          total: 0,
        };
      }

      const userResult = donationResultsByUser[donation.ADDED_BY];

      switch (modeOfDonation) {
        case modeOfDonationMap.ONLINE:
          userResult.Online_amount = totalAmount;
          break;
        case modeOfDonationMap.CHEQUE:
          userResult.Cheque_amount = totalAmount;
          break;
      }

      userResult.total = userResult.Online_amount + userResult.Cheque_amount;
    });

    const result = Object.values(donationResultsByUser);

    return {
      data: result,
    };
  };

  getElectricDonationWithCreator = async (id) => {
    try {
      const result = await TblelecDonation.findOne({
        where: { id },
        include: [
          {
            model: TblEmployees,
            as: "creator_name",
            attributes: ["id", "Username"],
          },
        ],
      });
      // console.log("result ----------------->", result)
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  deletemanualDonation = async (req) => {
    let id = req.body.id;
    console.log(id);

    let deleteReq = await TblmanualDonation.destroy({
      where: {
        id: id,
      },
    })
      .then(async (res) => {
        await TblmanualDonationItem.destroy({
          where: {
            donationId: id,
          },
        });
        return {
          status: 1,
          message: "deleted successfully",
        };
      })
      .catch((err) => {
        return {
          status: 1,
          message: "Something went wrong",
        };
      });
    return deleteReq;
  };

  deleteDonationType = async (req) => {
    let id = req.body.id;
    const userId = req.user.id
    const donationTypeName = await TblDonationTypes.findOne({
      where: {
        id: id,
      },
      attributes:['type_hi'],
      raw:true,
      nest:true
    })
    console.log(donationTypeName, "donation Type nAME")
    const existsInElecType = await TblelecDonationItem.findOne({
      where: {
        type: donationTypeName.type_hi,
      },
      raw:true,
      nest:true
    })

    const existsInManualType = await TblmanualDonationItem.findOne({
      where: {
        type: donationTypeName.type_hi,
      },
      raw:true,
      nest:true
    })
    const existsInOnlineType = await TblNewDonation.findOne({
      where: {
        TYPE: donationTypeName.type_hi,
      },
      raw:true,
      nest:true
    })

    if(existsInElecType || existsInManualType || existsInOnlineType){
      console.log("------------->")
      return {
        status: 1,
        message: "Donation Type is Being Used Somewhere ",
      };
    }
    else{

      let deleteReq = await TblDonationTypes.destroy({
      where: {
        id: id,
      },
    })
      .then(async (res) => {
        return {
          status: 1,
          message: "deleted successfully",
        };
      })
      .catch((err) => {
        return {
          status: 1,
          message: "Something went wrong",
        };
      });
      
      return deleteReq;

    }
    
  };

  dashemployeeTotalOnline = async (req) => {
    //   const donationResultsPromise = TblNewDonation.findAll({
    //     where: {
    //       id: req.user.id,
    //     },
    //     attributes: [
    //       "ADDED_BY",
    //       "MODE_OF_DONATION",
    //       [
    //         TblNewDonation.sequelize.fn(
    //           "SUM",
    //           TblNewDonation.sequelize.col("tbl_donations.amount")
    //         ),
    //         "total_amount",
    //       ],
    //     ],
    //     group: ["ADDED_BY", "MODE_OF_DONATION"],
    //   });
    //   const employeeResultsPromise = TblEmployees.findAll({
    //     attributes: ["id", "Username"],
    //   });
    //   const [donationResults, employeeResults] = await Promise.all([
    //     donationResultsPromise,
    //     employeeResultsPromise,
    //   ]);
    //   const employeeMap = {};
    //   employeeResults.forEach((employee) => {
    //     employeeMap[employee.id] = employee.Username;
    //   });
    //   const modeOfDonationMap = {
    //     ONLINE: "Online",
    //     CHEQUE: "Cheque",
    //   };
    //   const donationResultsByUser = {};
    //   donationResults.forEach((donation) => {
    //     const employeeName = employeeMap[donation.ADDED_BY];
    //     const modeOfDonation = modeOfDonationMap[donation.MODE_OF_DONATION];
    //     const totalAmount = donation.dataValues.total_amount;
    //     if (!donationResultsByUser[donation.ADDED_BY]) {
    //       donationResultsByUser[donation.ADDED_BY] = {
    //         created_by: donation.ADDED_BY,
    //         employee_name: employeeName,
    //         Online_amount: 0,
    //         Cheque_amount: 0,
    //         total: 0,
    //       };
    //     }
    //     const userResult = donationResultsByUser[donation.ADDED_BY];
    //     switch (modeOfDonation) {
    //       case modeOfDonationMap.ONLINE:
    //         userResult.Online_amount = totalAmount;
    //         break;
    //       case modeOfDonationMap.CHEQUE:
    //         userResult.Cheque_amount = totalAmount;
    //         break;
    //     }
    //     userResult.total = userResult.Online_amount + userResult.Cheque_amount;
    //   });
    //   const result = Object.values(donationResultsByUser);
    //   return {
    //     data: result,
    //   };
  };

  donationCertificate = async (req, res) => {
    try {
      const { id } = req.query;

      let donationCertificate = await TblNewDonation.findOne({
        where: { id: id },
        attributes: ["id", [literal('DATE(DATE_OF_DAAN)'), 'DATE_OF_DAAN'], "RECEIPT_NO", "MobileNo", "NAME", "ADDRESS", "TYPE", "REMARK", "AMOUNT"],
      });

      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
      
          const filePath = path.join(__dirname, './views/', 'DonationReceipt.ejs');
          const toWords = new ToWords({
            localeCode: 'hi-IN',
          })
          const amount = toWords.convert(donationCertificate.AMOUNT);
          const template = await ejs.renderFile(filePath, {
            donationCertificate: donationCertificate,
            amount: amount
          });
          const timestamp = new Date().getTime();
          const filename = `public/pdf/donation_${timestamp}.pdf`;

          // Set a base URL for the file:// protocol
          await page.goto('file://' + filePath);

          // Inject CSS to adjust image paths
          await page.addStyleTag({
            content: `
              img {
                content: url(${filePath.replace(/\\/g, '/')});
              }
            `
          });

          await page.setContent(template);
          await page.pdf({
            path: filename,
            format: 'A2',
            printBackground: true   
          });
      
          await browser.close();
          
          console.log('File created successfully');
        } catch (err) {
          console.log(err);
        }
      })();
      return donationCertificate;
    } catch (error) {
      throw error
    }
  };

  bookingCertificate = async (req, res) => {
    try {
      const { id } = req.query;

      let bookingCertificate = await TblCheckin.findAll({
        where: { booking_id: id  },
        attributes: ["booking_id", "name", "Fname", [literal('DATE(date)'), 'date'], "time", [literal('DATE(coutDate)'), 'coutDate'], "coutTime", "contactNo", "address", "male", "female", "child", "dharmasala", "RoomNo", "roomAmount", "advanceAmount"],
      });
      const roomNumbers = bookingCertificate.map((certificate) => certificate.RoomNo);
      const dharmasalas = bookingCertificate.map((certificate) => certificate.dharmasala);
      let bookingCertificate1 = await TblDharmasal.findAll({
        where: {
          dharmasala_id : { [Op.in]: dharmasalas }
        },
        attributes: ["name"],
      });
      let bookingCertificate2 = await TblRoom.findAll({
        where: {
          [Op.and]: [
            {[Op.or]: [
              { [Op.and]: [{ FroomNo: { [Op.lte]: roomNumbers } }, { TroomNo: { [Op.gte]: roomNumbers } }] },
              { [Op.and]: [{ FroomNo: { [Op.gte]: roomNumbers } }, { TroomNo: { [Op.lte]: roomNumbers } }] }
            ]},
            {dharmasala_id: { [Op.in]: dharmasalas }},
          ] 
        },
        attributes: ["facility_id"],
      });

      const extractedIds = bookingCertificate2.map((certificate) => {
        const stringValue = certificate.facility_id;
        const numericValue = parseInt(stringValue.replace(/[^0-9]/g, ''));
        return numericValue;
      });
      let bookingCertificate3 = await TblFacility.findAll({
        where: {
          facility_id: { [Op.in]: extractedIds },
        },
        attributes: ["name"]
      });
      const facilities = bookingCertificate3.map((certificate) => certificate.name);

      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
      
          const filePath = path.join(__dirname, './views/', 'BookingReceipt.ejs');
          
          const template = await ejs.renderFile(filePath, {
            bookingCertificate: bookingCertificate,
            bookingCertificate1: bookingCertificate1,
            bookingCertificate3: bookingCertificate3,
            facilities: facilities,
            roomNumbers: roomNumbers
          });
          const timestamp = new Date().getTime();
          const filename = `public/pdf/booking_${timestamp}.pdf`;

          // Set a base URL for the file:// protocol
          await page.goto('file://' + filePath);

          // Inject CSS to adjust image paths
          await page.addStyleTag({
            content: `
              img {
                content: url(${filePath.replace(/\\/g, '/')});
              }
            `
          });

          await page.setContent(template);
          await page.pdf({
            path: filename,
            format: 'A2',
            printBackground: true   
          });
      
          await browser.close();
          
          console.log('File created successfully');
        } catch (err) {
          console.log(err);
        }
      })();
      return bookingCertificate;
    } catch (error) {
      throw error
    }
  };

  getOnlineDonation = async (req) => {
    try {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        0,
        0,
        -1
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");

      const query = `SELECT SUM(bank) AS bank, SUM(cheque) AS cheque FROM (SELECT SUM(tbl_donations.AMOUNT) AS bank, 0 AS cheque FROM tbl_donations WHERE MODE_OF_DONATION='ONLINE' AND PAYMENT_STATUS=1 AND createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' UNION SELECT 0 AS bank, SUM(tbl_donations.AMOUNT) AS cheque FROM tbl_donations WHERE MODE_OF_DONATION='CHEQUE' AND PAYMENT_STATUS=1 AND createdAt BETWEEN '${startOfToday}' AND '${endOfToday}') AS subquery;`;

      const [data] = await sequelizes.query(query)
      return data;
    } catch (error) {
      console.log(error);
      return {
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  };

  donationReceipt = async (req) => {
    try {
      //html-pdf
      // const { id } = req.query;

      // let donationReceipt = await TblmanualDonation.findOne({
      //   where: {
      //     id : id
      //   },
      //   include: {
      //     model : TblmanualDonationItem, as:"manualItemDetails", attributes: ['type', 'remark', 'amount']
      //   },
      //   attributes : ["id", [literal('DATE(donation_date)'), 'donation_date'], "ReceiptNo", "phoneNo", "name", "address"],
      //   raw: true,
      //   nest: true
      // });

      // const filePath = path.join(__dirname, '../public/uploads/', 'Receipt.ejs');
      // console.log(filePath);
      // // const htmlString = fs.readFileSync(filePath, 'utf-8').toString();
      // const pdfOptions = {
      //   format: 'A3',
      //   printBackground: true,
      //   base: "https://kundalpur.techjainsupport.co.in/uploads/images/Receipt.ejs",
      // };
      // console.log(pdfOptions.base)
      // const toWords = new ToWords({
      //   localeCode: 'hi-IN',
      // });
      // const amount = toWords.convert(donationReceipt.manualItemDetails.amount);
      // const template = await ejs.renderFile(filePath, {
      //   donationReceipt: donationReceipt,
      //   amount: amount
      // });
      // const filename = path.join(__dirname, `../public/uploads/pdf/${id}.pdf`);
      // console.log(filename)
      // pdf.create(template, pdfOptions).toFile(filename, function(err) {
      //   if (err) {
      //     console.log(err);
      //   }
      //   console.log("Pdf send successfully");
      // }); 
      // const date = new Date(donationReceipt.donation_date).toLocaleDateString('en-GB')
      // // await sendWhatsappSms(donationReceipt.phoneNo, donationReceipt.ReceiptNo, donationReceipt.manualItemDetails.amount, donationReceipt.id, donationReceipt.name, donationReceipt.address, date);
      // return donationReceipt;

      //puppeteer
      const { id } = req.query;

      let donationReceipt = await TblmanualDonation.findOne({
        where: {
          id : id
        },
        include: {
          model : TblmanualDonationItem, as:"manualItemDetails", attributes: ['type', 'remark', 'amount', 'ChequeNo', 'size', 'itemType', 'quantity', 'unit']
        },
        attributes : ["id", "modeOfDonation", [literal('DATE_FORMAT(donation_date, "%d-%m-%Y")'), 'donation_date'], "ReceiptNo", "phoneNo", "name", "address"],
        raw: true,
        nest: true
      });

      function delay(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      

      (async () => {
        try {

          //Changing .ejs extenstion to .html because browser not support .ejs file, it will automatically download
          //according to code, we are taking screenshot of page. that's why now we will use .html or other extenstion
          const url = `https://labhandibe.techjainsupport.co.in/uploads/images/Receipt.html`;
      
          console.log('Launching Puppeteer...');
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome', // Adjust the path to Chrome as needed
          });
      
          console.log('Creating a new incognito browser context...');
          const context = await browser.createIncognitoBrowserContext();
      
          // Define your custom font and language settings in the headers
          const customHeaders = {
            'Accept-Language': 'hi-IN,en-US,en;q=0.9', // Set Hindi as the preferred language, with English as a fallback
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36', // Set the user agent
            'Font-Preference': 'Noto Sans Devanagari, Arial, sans-serif', // Specify your custom fonts here, with a fallback to sans-serif
          };
      
          console.log('Creating a new page...');
          const page = await context.newPage();
      
          console.log('Enabling JavaScript on the page...');
          await page.setJavaScriptEnabled(true);
      
          // Set the custom headers
          await page.setExtraHTTPHeaders(customHeaders);
      
          console.log('Setting the viewport size...');
          await page.setViewport({ width: 1500, height: 800 });
      
          console.log('Creating a promise to wait for the page to load...');
          const domLoadedPromise = new Promise((resolve) => {
            page.once('load', resolve);
          });
      
          // Define the file path to your EJS template
          const filePath = path.join(__dirname, '../public/uploads/', 'Receipt.html');
      
          console.log('Converting an amount to words...');
          const toWords = new ToWords({ localeCode: 'hi-IN' });
          const amount = toWords.convert(donationReceipt.manualItemDetails.amount);
      
          console.log('Rendering the EJS template with your data...');
          const template = await ejs.renderFile(filePath, {
            donationReceipt: donationReceipt,
            amount: amount,
          });
      
          console.log('Defining the filename and path for the screenshot...');
          const filename = path.resolve(__dirname, '../public/uploads/image', `${id}.png`);
      
          console.log('Navigating to the URL and waiting for the page to fully load...');
          // setTimeout(() => {
          //   page.goto(url);
          // }, 1000);

          await page.goto(url, { waitUntil: 'networkidle0' });

          await delay(1000);
          
          console.log('Setting the page content to your rendered template...');
          await page.setContent(template);
      
          console.log('Waiting for the DOM to fully load...');
          await domLoadedPromise;
      
          console.log('Capturing a full-page screenshot and saving it to the specified filename...');
          await page.screenshot({
            path: filename,
            fullPage: true,
          });


          // Calling WhatsApp API for sending an Image
          const type = "manual";
          // const date = new Date(donationReceipt.donation_date).toLocaleDateString('en-GB');
          await sendWhatsappSms(donationReceipt.phoneNo, donationReceipt.ReceiptNo, donationReceipt.manualItemDetails.amount, donationReceipt.id, donationReceipt.name, donationReceipt.address, donationReceipt.donation_date, donationReceipt.manualItemDetails.ChequeNo, donationReceipt.manualItemDetails.size, donationReceipt.manualItemDetails.itemType, donationReceipt.manualItemDetails.quantity, donationReceipt.modeOfDonation, type, donationReceipt.manualItemDetails.unit).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });

          console.log('Closing the browser context and the browser...');
          await context.close();
          await browser.close();

          console.log('Image created successfully');
        } catch (err) {
          console.error('Error:', err);
        }
      })();
      return donationReceipt;
    } catch (error) {
        throw error
    }
  };

  donationReceiptElectronic = async (req) => {
    try {
      //puppeteer
      const { id } = req.query;

      let donationReceipt = await TblelecDonation.findOne({
        where: {
          id : id
        },
        include: {
          model : TblelecDonationItem, as:"elecItemDetails", attributes: ['type', 'remark', 'amount', 'ChequeNo', 'size', 'itemType', 'quantity', 'unit']
        },
        attributes : ["id", "modeOfDonation", [literal('DATE_FORMAT(donation_date, "%d-%m-%Y")'), 'donation_date'], "ReceiptNo", "phoneNo", "name", "address"],
        raw: true,
        nest: true
      });

      function delay(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      

      (async () => {
        try {

          //Changing .ejs extenstion to .html because browser not support .ejs file, it will automatically download
          //according to code, we are taking screenshot of page. that's why now we will use .html or other extenstion
          const url = `https://labhandibe.techjainsupport.co.in/uploads/images/ReceiptElectronic.html`;
      
          console.log('Launching Puppeteer...');
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome', // Adjust the path to Chrome as needed
          });
      
          console.log('Creating a new incognito browser context...');
          const context = await browser.createIncognitoBrowserContext();
      
          // Define your custom font and language settings in the headers
          const customHeaders = {
            'Accept-Language': 'hi-IN,en-US,en;q=0.9', // Set Hindi as the preferred language, with English as a fallback
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36', // Set the user agent
            'Font-Preference': 'Noto Sans Devanagari, Arial, sans-serif', // Specify your custom fonts here, with a fallback to sans-serif
          };
      
          console.log('Creating a new page...');
          const page = await context.newPage();
      
          console.log('Enabling JavaScript on the page...');
          await page.setJavaScriptEnabled(true);
      
          // Set the custom headers
          await page.setExtraHTTPHeaders(customHeaders);
      
          console.log('Setting the viewport size...');
          await page.setViewport({ width: 1500, height: 800 });
      
          console.log('Creating a promise to wait for the page to load...');
          const domLoadedPromise = new Promise((resolve) => {
            page.once('load', resolve);
          });
      
          // Define the file path to your EJS template
          const filePath = path.join(__dirname, '../public/uploads/', 'ReceiptElectronic.html');
      
          console.log('Converting an amount to words...');
          const toWords = new ToWords({ localeCode: 'hi-IN' });
          const amount = toWords.convert(donationReceipt.elecItemDetails.amount);
      
          console.log('Rendering the EJS template with your data...');
          const template = await ejs.renderFile(filePath, {
            donationReceipt: donationReceipt,
            amount: amount,
          });
      
          console.log('Defining the filename and path for the screenshot...');
          const filename = path.resolve(__dirname, '../public/uploads/image1', `${id}.png`);
      
          console.log('Navigating to the URL and waiting for the page to fully load...');
          // setTimeout(() => {
          //   page.goto(url);
          // }, 1000);

          await page.goto(url, { waitUntil: 'networkidle0' });

          await delay(1000);
          
          console.log('Setting the page content to your rendered template...');
          await page.setContent(template);
      
          console.log('Waiting for the DOM to fully load...');
          await domLoadedPromise;
      
          console.log('Capturing a full-page screenshot and saving it to the specified filename...');
          await page.screenshot({
            path: filename,
            fullPage: true,
          });


          // Calling WhatsApp API for sending an Image
          const type = "electronic";
          // const date = new Date(donationReceipt.donation_date).toLocaleDateString('en-GB');
          await sendWhatsappSms(donationReceipt.phoneNo, donationReceipt.ReceiptNo, donationReceipt.elecItemDetails.amount, donationReceipt.id, donationReceipt.name, donationReceipt.address, donationReceipt.donation_date, donationReceipt.elecItemDetails.ChequeNo, donationReceipt.elecItemDetails.size, donationReceipt.elecItemDetails.itemType, donationReceipt.elecItemDetails.quantity, donationReceipt.modeOfDonation, type, donationReceipt.elecItemDetails.unit).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });
          
          console.log('Closing the browser context and the browser...');
          await context.close();
          await browser.close();

          console.log('Image created successfully');
        } catch (err) {
          console.error('Error:', err);
        }
      })();
      return donationReceipt;
    } catch (error) {
        throw error
    }
  };

  donationReceiptOnline = async (req) => {
    try {
      //puppeteer
      const { id } = req.query;

      let donationReceipt = await TblNewDonation.findOne({
        where: {
          id : id
        },
        attributes : ["id", "MODE_OF_DONATION", [literal('DATE_FORMAT(DATE_OF_DAAN, "%d-%m-%Y")'), 'DATE_OF_DAAN'], "RECEIPT_NO", "MobileNo", "NAME", "ADDRESS", "TYPE", "REMARK", "AMOUNT", "CHEQUE_NO", [literal('DATE_FORMAT(DATE_OF_CHEQUE, "%d-%m-%Y")'), 'DATE_OF_CHEQUE'], "NAME_OF_BANK", "PAN_CARD_No"],
        raw: true,
        nest: true
      });

      function delay(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      

      (async () => {
        try {

          //Changing .ejs extenstion to .html because browser not support .ejs file, it will automatically download
          //according to code, we are taking screenshot of page. that's why now we will use .html or other extenstion
          const url = `https://labhandibe.techjainsupport.co.in/uploads/images/ReceiptOnline.html`;
      
          console.log('Launching Puppeteer...');
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome', // Adjust the path to Chrome as needed
          });
      
          console.log('Creating a new incognito browser context...');
          const context = await browser.createIncognitoBrowserContext();
      
          // Define your custom font and language settings in the headers
          const customHeaders = {
            'Accept-Language': 'hi-IN,en-US,en;q=0.9', // Set Hindi as the preferred language, with English as a fallback
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36', // Set the user agent
            'Font-Preference': 'Noto Sans Devanagari, Arial, sans-serif', // Specify your custom fonts here, with a fallback to sans-serif
          };
      
          console.log('Creating a new page...');
          const page = await context.newPage();
      
          console.log('Enabling JavaScript on the page...');
          await page.setJavaScriptEnabled(true);
      
          // Set the custom headers
          await page.setExtraHTTPHeaders(customHeaders);
      
          console.log('Setting the viewport size...');
          await page.setViewport({ width: 1500, height: 800 });
      
          console.log('Creating a promise to wait for the page to load...');
          const domLoadedPromise = new Promise((resolve) => {
            page.once('load', resolve);
          });
      
          // Define the file path to your EJS template
          const filePath = path.join(__dirname, '../public/uploads/', 'ReceiptOnline.html');
      
          console.log('Converting an amount to words...');
          const toWords = new ToWords({ localeCode: 'hi-IN' });
          const amount = toWords.convert(donationReceipt.AMOUNT);
      
          console.log('Rendering the EJS template with your data...');
          const template = await ejs.renderFile(filePath, {
            donationReceipt: donationReceipt,
            amount: amount,
          });
      
          console.log('Defining the filename and path for the screenshot...');
          const filename = path.resolve(__dirname, '../public/uploads/image2', `${id}.png`);
      
          console.log('Navigating to the URL and waiting for the page to fully load...');
          // setTimeout(() => {
          //   page.goto(url);
          // }, 1000);

          await page.goto(url, { waitUntil: 'networkidle0' });

          await delay(1000);
          
          console.log('Setting the page content to your rendered template...');
          await page.setContent(template);
      
          console.log('Waiting for the DOM to fully load...');
          await domLoadedPromise;
      
          console.log('Capturing a full-page screenshot and saving it to the specified filename...');
          await page.screenshot({
            path: filename,
            fullPage: true,
          });


          // Calling WhatsApp API for sending an Image
          const type = "online";
          // const date = new Date(donationReceipt.DATE_OF_DAAN).toLocaleDateString('en-GB');
          // const chequeDate = new Date(donationReceipt.DATE_OF_CHEQUE).toLocaleDateString('en-GB');
          await sendOnlineWhatsappSms(donationReceipt.MobileNo, donationReceipt.RECEIPT_NO, donationReceipt.AMOUNT, donationReceipt.id, donationReceipt.NAME, donationReceipt.ADDRESS, donationReceipt.DATE_OF_DAAN, donationReceipt.CHEQUE_NO, donationReceipt.DATE_OF_CHEQUE, donationReceipt.MODE_OF_DONATION, type).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });
          
          console.log('Closing the browser context and the browser...');
          await context.close();
          await browser.close();

          console.log('Image created successfully');
        } catch (err) {
          console.error('Error:', err);
        }
      })();
      return donationReceipt;
    } catch (error) {
        throw error
    }
  };

  searchDonationList = async (req) => {
    try {
      const { search } = req.query;
      const userId = req.user.id;

      const data = await TblNewDonation.findAll({
        where : {
          [Op.or] : [
            { RECEIPT_NO : { [Op.like]: `%${search}%` }  },
            { MobileNo : { [Op.like]: `%${search}%` }  },
            { NAME : { [Op.like]: `%${search}%` }  },
            { ADDRESS : { [Op.like]: `%${search}%` }  },
            { MODE_OF_DONATION : { [Op.like]: `%${search}%` }  },
            { TYPE : { [Op.like]: `%${search}%` }  },
            { REMARK : { [Op.like]: `%${search}%` }  },
            { AMOUNT : { [Op.eq]: search }  },
            { CHEQUE_NO : { [Op.like]: `%${search}%` }  },
            { DATE_OF_CHEQUE : { [Op.like]: `%${search}%` }  },
            { NAME_OF_BANK : { [Op.like]: `%${search}%` }  },
            { PAYMENT_ID : { [Op.like]: `%${search}%` }  },
            { PAN_CARD_No : { [Op.like]: `%${search}%` }  }
          ],
          ADDED_BY : userId
        },
        order: [["DATE_OF_DAAN", "DESC"]]
      }).then(async (results) => {
        let users = await TblUsers.findAll({
          attributes: ["signature", "id"],
        });
        console.log(users);
        let admins = await TblAdmin.findOne({
          attributes: ["signature"],
        });
  
        let finalResults = results.map((item) => {
          let user = users?.find((user) => user?.id === item.ADDED_BY);
          return {
            ...item.toJSON(),
            signature: user ? user.signature : "",
            adminSignature: admins ? admins.signature : "",
          };
        });
        return finalResults;
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  checkDoubleReceiptDonation = async (req) => {
    try {
      const data = await TblelecDonation.findAll({
        include : [
          {
            model : TblelecDonationItem,
            as : "elecItemDetails"
          }
        ],
        where: sequelizes.literal(`
    voucherNo IN (SELECT voucherNo 
                   FROM tbl_elec_donations
                   GROUP BY voucherNo 
                   HAVING COUNT(voucherNo) > 1)
  `)
      });
      for(const names of data) {
        const employeeName = await TblEmployees.findOne({
          where : {
            id : names.created_by
          }
        });
        if(employeeName) {
          names.created_by = employeeName.Username
        }
      }
      return data;  
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  combineElecManualDonation = async (req) => {
    try {
      const { fromDate, toDate, modeOfDonation, fromVoucher, toVoucher, search } = req.query;
      const { type, user } = req.body;
      let whereClause = {};
      let whereClauseInc = {};

      if(fromDate && toDate) {
        whereClause.donation_date = { [Op.between] : [fromDate, toDate] }
      }

      if(modeOfDonation) {
        whereClause.modeOfDonation = modeOfDonation
      }

      if(type) {
        whereClauseInc.type = type
      }

      if(user) {
        whereClause.created_by = user
      }

      if(fromVoucher && toVoucher) {
        whereClause.voucherNo = { [Op.between] : [fromVoucher, toVoucher] }
      }

      if(search) {
        whereClause = {
          [Op.or]: [
            { name: { [Op.regexp]: `^${search}.*` } },
            { phoneNo: { [Op.regexp]: `^${search}.*` } },
            { ReceiptNo: { [Op.regexp]: `^${search}.*` } },
            { address: { [Op.regexp]: `^${search}.*` } },
            { LedgerNo: { [Op.regexp]: `^${search}.*` } },
            { "$details.amount$": { [Op.regexp]: `^${search}.*` } },
            { "$details.transactionNo$": { [Op.regexp]: `^${search}.*` } },
            { "$details.ChequeNo$": { [Op.regexp]: `^${search}.*` } },
            { "$details.type$": { [Op.regexp]: `^${search}.*` } },
            { "$details.branch$": { [Op.regexp]: `^${search}.*` } },
            { "$details.BankName$": { [Op.regexp]: `^${search}.*` } },
            { "$details.remark$": { [Op.regexp]: `^${search}.*` } },
            { "$details.itemType$": { [Op.regexp]: `^${search}.*` } },
            { "$details.unit$": { [Op.regexp]: `^${search}.*` } },
          ]
        }
      }

      if(!fromVoucher && !toVoucher) {
        const manualData = await TblmanualDonation.findAll({
          include: [
            {
              model: TblmanualDonationItem,
              as: "details",
              where: whereClauseInc
            }
          ],
          where : whereClause
        });
  
        for(const employeeName of manualData) {
          const data = employeeName.created_by?await TblEmployees.findOne({ where : { id: employeeName.created_by } }) : "";
          const data1 = employeeName.created_by?await TblAdmin.findOne({ where : { id: employeeName.created_by } }) : "";
  
          if(data) {
            employeeName.created_by = data.Username?data.Username : "";
          }
          if(data1) {
            employeeName.created_by = data1.username?data1.username : "";
          }
        }

        const electronicData = await TblelecDonation.findAll({
          include: [
            {
              model: TblelecDonationItem,
              as: "details",
              where: whereClauseInc
            }
          ],
          where : whereClause
        });
  
        for(const employeeName of electronicData) {
          const data = employeeName.created_by?await TblEmployees.findOne({ where : { id: employeeName.created_by } }) : "";
          const data1 = employeeName.created_by?await TblAdmin.findOne({ where : { id: employeeName.created_by } }) : "";
  
          if(data) {
            employeeName.created_by = data.Username?data.Username : "";
          }
          if(data1) {
            employeeName.created_by = data1.username?data1.username : "";
          }
        }
  
        const data = [...(manualData || []), ...(electronicData || [])];
  
        return data;
      }

      if(fromVoucher && toVoucher) {
        const electronicData = await TblelecDonation.findAll({
          include: [
            {
              model: TblelecDonationItem,
              as: "details",
              where: whereClauseInc
            }
          ],
          where : whereClause
        });
  
        for(const employeeName of electronicData) {
          const data = employeeName.created_by?await TblEmployees.findOne({ where : { id: employeeName.created_by } }) : "";
          const data1 = employeeName.created_by?await TblAdmin.findOne({ where : { id: employeeName.created_by } }) : "";
  
          if(data) {
            employeeName.created_by = data.Username?data.Username : "";
          }
          if(data1) {
            employeeName.created_by = data1.username?data1.username : "";
          }
        }
  
        const data = [...(electronicData || [])];
  
        return data;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getDonationMobileNo = async (req) => {
    try {
      const data = await TblelecDonation.findAll({
        attributes : ["phoneNo", "name", "address"],
        order : [["id", "DESC"]],
        group : "phoneNo"
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getManualDonationMobileNo = async (req) => {
    try {
      const data = await TblmanualDonation.findAll({
        attributes : ["phoneNo", "name", "address"],
        order : [["id", "DESC"]],
        group : "phoneNo"
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

module.exports = new DonationCollaction();
