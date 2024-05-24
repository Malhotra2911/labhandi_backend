const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");

const TblTrust = db.trust;
const TblTrustType = db.trustType;

class TrustCollection {
    addTrust = async (req) => {
        try {
            const { Date, Time, TrustCode, TrustName, MainTrustName,  TrustType, MobileNo, Email, Location, TrustAddress, State, City, PinCode, NameOfBank, AccountDetails, IFSC_Code, PAN_Number, GST, Remark } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblTrust.create({
                Date,
                Time,
                TrustCode,
                TrustName,
                MainTrustName,
                TrustType,
                MobileNo,
                Email,
                Location,
                TrustAddress,
                State,
                City,
                PinCode,
                NameOfBank,
                AccountDetails,
                IFSC_Code,
                PAN_Number,
                GST,
                Remark,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    getTrust = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            if (fromDate && toDate) {
                searchObj.Date = {[Op.and] : [
                    {[Op.gte] : fromDate},
                    {[Op.lte] : toDate}
                ]}
            }
            const data = TblTrust.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    editTrust = async (req) => {
        try {
            const { id, Date, Time, TrustCode, TrustName, MainTrustName,  TrustType, MobileNo, Email, Location, TrustAddress, State, City, PinCode, NameOfBank, AccountDetails, IFSC_Code, PAN_Number, GST, Remark } = req.body;
            const data = await TblTrust.update(
                {
                    Date : Date,
                    Time : Time,
                    TrustCode : TrustCode,
                    TrustName : TrustName,
                    MainTrustName : MainTrustName,
                    TrustType : TrustType,
                    MobileNo : MobileNo,
                    Email : Email,
                    Location : Location,
                    TrustAddress : TrustAddress,
                    State : State,
                    City : City,
                    PinCode : PinCode,
                    NameOfBank : NameOfBank,
                    AccountDetails : AccountDetails,
                    IFSC_Code : IFSC_Code,
                    PAN_Number : PAN_Number,
                    GST : GST,
                    Remark : Remark
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
    }

    deleteTrust = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblTrust.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    addTrustType = async (req) => {
        try {
            const { trustType_hi, trustType_en, status } = req.body;
            const data = await TblTrustType.create({
                trustType_hi,
                trustType_en,
                status
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getTrustType = async (req) => {
        try {
            const data = await TblTrustType.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    editTrustType = async (req) => {
        try {
            const { id, trustType_hi, trustType_en, status } = req.body;
            const data = await TblTrustType.update(
                {
                    trustType_hi : trustType_hi,
                    trustType_en : trustType_en,
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
    }

    deleteTrustType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblTrustType.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = new TrustCollection();