const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");
const uploadimage = require("../middlewares/imageupload");

db.ElecDonationModel.hasMany(db.ElecDonationItem, {
    foreignKey : "donationId",
    as : "detail"
});

db.ElecDonationItem.belongsTo(db.ElecDonationModel, {
    foreignKey : "donationId",
});

db.ManualDonation.hasMany(db.ManualDonationItem, {
    foreignKey : "donationId",
    as : "detail"
});

db.ManualDonationItem.belongsTo(db.ManualDonation, {
    foreignKey : "donationId"
});

const TblExpenseGroup = db.expenseGroup;
const TblExpenseLedger = db.expenseLedger;
const TblExpenseVoucher = db.expenseVoucher;
const TblExpenseVoucherList = db.expenseVoucherList;
const TblPaymentMode = db.paymentMode;
const TblInvoice = db.invoice;
const TblelecDonation = db.ElecDonationModel;
const TblelecDonationItem = db.ElecDonationItem;
const TblmanualDonation = db.ManualDonation;
const TblmanualDonationItem = db.ManualDonationItem;
const TblExpenseHead = db.expenseHead;

class ExpenseCollection {

    addExpenseGroup = async (req) => {
        try {
            const { City, PinCode, State, Country } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblExpenseGroup.create({
                City,
                PinCode,
                State,
                Country,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getExpenseGroup = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            const searchObj = {};
            if (fromDate && toDate) {
                searchObj.createdAt = { [Op.between] : [fromDate, toDate] }
            }
            const data = await TblExpenseGroup.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editExpenseGroup = async (req) => {
        try {
            const { id, City, PinCode, State, Country } = req.body;
            const data = await TblExpenseGroup.update(
                {
                    City : City,
                    PinCode : PinCode,
                    State : State,
                    Country : Country
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteExpenseGroup = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblExpenseGroup.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addExpenseLedger = async (req, LedgerNo) => {
        try {
            const { MobileNo, Name, FatherName, Address, City, PinCode, State, Country, Email, AadharNo, PanNo, OpeningBalance } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblExpenseLedger.create({
                LedgerNo,
                MobileNo,
                Name,
                FatherName,
                Address,
                City,
                PinCode,
                State,
                Country,
                Email,
                AadharNo,
                PanNo,
                OpeningBalance,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getExpenseLedger = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            const searchObj = {};
            if (fromDate && toDate) {
                searchObj.createdAt = { [Op.between] : [fromDate, toDate] }
            }
            const data = await TblExpenseLedger.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editExpenseLedger = async (req) => {
        try {
            const { id, MobileNo, Name, FatherName, Address, City, PinCode, State, Country, Email, AadharNo, PanNo, OpeningBalance, TotalAmount, DepositedAmount } = req.body;
            const data = await TblExpenseLedger.update(
                {
                    MobileNo : MobileNo,
                    Name : Name,
                    FatherName : FatherName,
                    Address : Address,
                    City : City,
                    PinCode : PinCode,
                    State : State,
                    Country : Country,
                    Email : Email,
                    AadharNo : AadharNo,
                    PanNo : PanNo,
                    OpeningBalance : OpeningBalance,
                    TotalAmount : TotalAmount,
                    DepositedAmount : DepositedAmount
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteExpenseLedger = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblExpenseLedger.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getExpenseLedgerCount = async () => {
        try {
            const count = await TblExpenseLedger.count({
                distinct: true,
                col: 'LedgerNo'
            });
            return count;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addExpenseVoucher = async (req) => {
        try {
            const { expenseDate, voucherNo, paymentMode, LedgerNo, LedgerName, amount, narration, modeOfExpense, expenseVoucherList } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblExpenseVoucher.create({
                expenseDate,
                voucherNo,
                paymentMode,
                LedgerNo,
                LedgerName,
                amount,
                narration,
                modeOfExpense,
                ADDED_BY,
                expenseVoucherList
            }).then(async (res) => {
                let expenseVoucherLists = [];
                expenseVoucherList.forEach((e) => {
                    expenseVoucherLists.push({
                        voucherId : res.id,
                        Type : e.Type,
                        voucherNo : e.voucherNo,
                        amount : e.amount,
                        remark : e.remark
                    });
                });
                await TblExpenseVoucherList.bulkCreate(expenseVoucherLists).then(async (resp) => {
                    res.dataValues["expenseVoucherList"] = resp;
                });
                return {
                    data: res.dataValues
                }
            });
            const boliLedgerData = await TblExpenseLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                }
            });
            await TblExpenseLedger.update(
                {
                    TotalAmount : boliLedgerData.TotalAmount + amount
                },
                {
                    where : {
                        LedgerNo : LedgerNo
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getExpenseVoucher = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            const searchObj = {};
            if (fromDate && toDate) {
                searchObj.expenseDate = { [Op.between] : [fromDate, toDate] }
            }
            const expenseVoucherData = await TblExpenseVoucher.findAll({
                where : searchObj,
                order : [["id", "DESC"]],
                raw : true
            });
            const expenseVoucherListPromises = expenseVoucherData.map(async (data) => {
                const expenseVoucherList = await TblExpenseVoucherList.findAll({
                    where : {
                        voucherId : data.id
                    },
                    order : [["id", "DESC"]],
                    raw : true
                });
                if (expenseVoucherList) {
                    data.expenseVoucherList = expenseVoucherList;
                }
                return data;
            });
            const expenseVoucherWithList = await Promise.all(expenseVoucherListPromises);
            return expenseVoucherWithList;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editExpenseVoucher = async (req) => {
        try {
            const { id, expenseDate, voucherNo, paymentMode, LedgerNo, LedgerName, amount, narration, modeOfExpense, expenseVoucherList } = req.body;
            const data = await TblExpenseVoucher.update(
                {
                    expenseDate : expenseDate,
                    voucherNo : voucherNo,
                    paymentMode : paymentMode,
                    LedgerNo : LedgerNo,
                    LedgerName : LedgerName,
                    amount : amount,
                    narration : narration,
                    modeOfExpense : modeOfExpense
                },
                {
                    where : {
                        id : id
                    }
                }
            ); 
            const updatedExpenseVoucherList = await Promise.all(expenseVoucherList.map(async (e) => {
                const updatedVoucherList = await TblExpenseVoucherList.update(
                    {
                        Type : e.Type,
                        voucherNo : e.voucherNo,
                        amount : e.amount,
                        remark : e.remark
                    },
                    {
                        where : {
                            voucherId : id,
                            id : e.id
                        }
                    }
                );
                return updatedVoucherList;
            }));

            const responseData = {
                ExpenseVoucherData: data,
                ExpenseVoucherLists: updatedExpenseVoucherList
            };

            const boliLedgerData = await TblExpenseLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                }
            });
            await TblExpenseLedger.update(
                {
                    TotalAmount : amount
                },
                {
                    where : {
                        LedgerNo : LedgerNo
                    }
                }
            );
            return responseData;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteExpenseVoucher = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblExpenseVoucher.destroy({
                where : {
                    id : id
                }
            }).then(async (res) => {
                await TblExpenseVoucherList.destroy({
                    where : {
                        voucherId : id
                    }
                });
                return {
                    msg : "Expense Voucher Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addPaymentMode = async (req) => {
        try {
            const { paymentModeCode, paymentMode } = req.body;
            const data = await TblPaymentMode.create({
                paymentModeCode,
                paymentMode
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getPaymentMode = async (req) => {
        try {
            const data = await TblPaymentMode.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editPaymentMode = async (req) => {
        try {
            const { id, paymentModeCode, paymentMode, status } = req.body;
            const data = await TblPaymentMode.update(
                {
                    paymentModeCode : paymentModeCode,
                    paymentMode : paymentMode,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    deletePaymentMode = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblPaymentMode.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addInvoiceUpload = async (req) => {
        try {
          const { invoiceNo, invoiceDate, invoiceAmount, remark } = req.body;
          let image1 = "";
          if(req.files) {  
            const { invoiceUpload } = req.files;
            if(invoiceUpload) {
                image1 = uploadimage(invoiceUpload)
            }
          }

          const data = await TblInvoice.create({
            invoiceNo,
            invoiceDate,
            invoiceAmount,
            invoiceUpload : image1,
            remark
          });

          return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getInvoiceUpload = async (req) => {
        try {
            const data = await TblInvoice.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editInvoiceUpload = async (req) => {
        try {
            const { id, invoiceNo, invoiceDate, invoiceAmount, remark } = req.body;
            let image1 = "";
            if(req.files) {  
                const { invoiceUpload } = req.files;
                if(invoiceUpload) {
                    image1 = uploadimage(invoiceUpload)
                }
            }

            const data = await TblInvoice.update(
                {
                    invoiceNo : invoiceNo,
                    invoiceDate : invoiceDate,
                    invoiceAmount : invoiceAmount,
                    invoiceUpload : image1,
                    remark : remark
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    deleteInvoiceUpload = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblInvoice.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getTally = async (req) => {
        try {
            const { LedgerNo } = req.query;
            const data = await TblExpenseLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                },
                attributes : ["Name", "TotalAmount", "OpeningBalance"],
                raw: true
            });
            const elecDonationData = await TblelecDonation.findAll({
                include : [
                    {
                        model : TblelecDonationItem,
                        as : 'detail'
                    },
                ],
                where : {
                    LedgerNo : LedgerNo
                }
            });
            const manualDonationData = await TblmanualDonation.findAll({
                include : [
                    {
                        model : TblmanualDonationItem,
                        as : 'detail'
                    },
                ],
                where : {
                    LedgerNo : LedgerNo
                }
            });
            data.voucherDetails = [
                ...(elecDonationData || []),
                ...(manualDonationData || [])
            ];
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addExpenseHead = async (req) => {
        try {
            const { expenseHead_hi, expenseHead_en } = req.body;
            const data = await TblExpenseHead.create({
                expenseHead_hi,
                expenseHead_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getExpenseHead = async (req) => {
        try {
            const data = await TblExpenseHead.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editExpenseHead = async (req) => {
        try {
            const { id, expenseHead_hi, expenseHead_en, status } = req.body;
            const data = await TblExpenseHead.update(
                {
                    expenseHead_hi : expenseHead_hi,
                    expenseHead_en : expenseHead_en,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteExpenseHead = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblExpenseHead.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

module.exports = new ExpenseCollection();