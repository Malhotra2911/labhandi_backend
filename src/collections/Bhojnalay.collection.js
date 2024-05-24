const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");
const { bhojnalayWhatsappSms } = require("../utils/SendWhatsappSms");

const TblBhojnalayHead = db.bhojnalayHead;
const TblBhojnalay = db.bhojnalay;

class Bhojnalay {
    addBhojnalayHead = async (req) => {
        try {
            const { type, price, remark } = req.body;
            const data = await TblBhojnalayHead.create({
                type,
                price,
                remark
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBhojnalayHead = async (req) => {
        try {
            const data = await TblBhojnalayHead.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBhojnalayHead = async (req) => {
        try {
            const { id, type, price, remark, status } = req.body;
            const data = await TblBhojnalayHead.update(
                {
                    type : type,
                    price : price,
                    remark : remark,
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

    deleteBhojnalayHead = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBhojnalayHead.destroy({
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

    addBhojnalay = async (req, ReceiptNo) => {
        try {
            const { DateOfBooking, Time, Name, MobileNo, Type, NoOfPerson, TotalAmount, Remark } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblBhojnalay.create({
                DateOfBooking,
                Time,
                ReceiptNo : ReceiptNo,
                Name,
                MobileNo,
                Type,
                NoOfPerson,
                TotalAmount,
                Remark,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBhojnalay = async (req) => {
        try {
            const { id, fromDate, toDate } = req.query;
            let searchObj = {};
            if(id) {
                searchObj.id = id;
            }
            if(fromDate && toDate) {
                searchObj.DateOfBooking = { [Op.between] : [fromDate, toDate] }
            }
            const data = await TblBhojnalay.findAll({
                where : searchObj,
                order : [["DateOfBooking", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBhojnalay = async (req) => {
        try {
          const { id, DateOfBooking, Time, Name, MobileNo, Type, NoOfPerson, TotalAmount, Remark, Status } = req.body; 
          const data = await TblBhojnalay.update(
            {
                DateOfBooking : DateOfBooking,
                Time : Time,
                Name : Name,
                MobileNo : MobileNo,
                Type : Type,
                NoOfPerson : NoOfPerson,
                TotalAmount : TotalAmount,
                Remark : Remark,
                Status : Status
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

    deleteBhojnalay = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBhojnalay.destroy({
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

    getReceiptNoCount = async (req) => {
        try {
            const count = await TblBhojnalay.count({
                distinct: true,
                col: 'ReceiptNo'
            });
            return count;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    saveBhojnalayPayment = async (req) => {
        try {
            const { id, PAYMENT_ID, PAYMENT_STATUS } = req.body;
            const result = await TblBhojnalay.update(
                {
                    PAYMENT_ID : PAYMENT_ID,
                    PAYMENT_STATUS : PAYMENT_STATUS == "Success" ? 1 : 0
                },
                {
                    where : {
                        id : id
                    }
                }
            );

            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getFutureOrder = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            let today = new Date();
            today.toLocaleDateString({ timeZone: 'Asia/Kolkata' })
            const date = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            const formattedDate = `${year}-${month}-${date}`;
            searchObj.DateOfBooking = { [Op.gt] : formattedDate }
            if(fromDate && toDate) {
                searchObj.DateOfBooking = { [Op.between] : [fromDate, toDate] }
            }
            const data = await TblBhojnalay.findAll({
                where: searchObj
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getCurrentOrder = async (req) => {
        try {
            let today = new Date();
            today.toLocaleDateString({ timeZone: 'Asia/Kolkata' })
            const date = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            const formattedDate = `${year}-${month}-${date}`;
            const data = await TblBhojnalay.findAll({
                where : {
                    DateOfBooking : { [Op.eq] : formattedDate }
                }
            });
            return data; 
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBhojnalayHistory = async (req) => {
        try {
            const { search } = req.query;
            const MobileNo = req.user.mobileNo;
            const data = await TblBhojnalay.findAll({
                where : {
                    MobileNo : MobileNo,
                    [Op.or] : [
                        { ReceiptNo : { [Op.like] : `%${search}%` } },
                        { Name : { [Op.like] : `%${search}%` } },
                        { MobileNo : { [Op.eq] : search } },
                        { Type : { [Op.like] : `%${search}%` } },
                        { TotalAmount : { [Op.eq] : search } },
                        { Remark : { [Op.like] : `%${search}%` } },
                        { PAYMENT_ID : { [Op.eq] : search } }
                    ],
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBhojnalayByBookingId = async (req) => {
        try {
            const { bookingId } = req.query;
            const data = await TblBhojnalay.findAll({
                where : {
                    ReceiptNo : bookingId
                },
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    bhojnalayReceipt = async (req) => {
        const { bookingId } = req.query;
        const data = await TblBhojnalay.findOne({
            where : {
                ReceiptNo : bookingId
            }
        });

        if(data) {
            await bhojnalayWhatsappSms(data.MobileNo, bookingId)
        }

        return data;
    }
}

module.exports = new Bhojnalay(); 