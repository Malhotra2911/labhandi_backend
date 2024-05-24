const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");

db.ElecDonationModel.hasMany(db.ElecDonationItem, {
    foreignKey : "donationId",
    as : "details"
});

db.ElecDonationItem.belongsTo(db.ElecDonationModel, {
    foreignKey : "donationId",
});

db.ManualDonation.hasMany(db.ManualDonationItem, {
    foreignKey : "donationId",
    as : "details"
});

db.ManualDonationItem.belongsTo(db.ManualDonation, {
    foreignKey : "donationId"
});

const TblBoliHead = db.boliHead;
const TblBoliUnit = db.boliUnit;
const TblBoli = db.boli;
const TblBoliItem = db.boliItem;
const TblReceipt = db.Receipt;
const TblBoliPayment = db.boliPayment;
const TblBoliGroup = db.boliGroup;
const TblBoliLedger = db.boliLedger;
const TblBoliVoucher = db.boliVoucher;
const TblBoliVoucherList = db.boliVoucherList;
const TblelecDonation = db.ElecDonationModel;
const TblelecDonationItem = db.ElecDonationItem;
const TblmanualDonation = db.ManualDonation;
const TblmanualDonationItem = db.ManualDonationItem;
const TblNewDonation = db.newDonationModel;

class BoliCollection {
    // boliHead

    addBoliHead = async (req) => {
        try {
            const { boliHead_hi, boliHead_en } = req.body; 
            const data = await TblBoliHead.create({
                boliHead_hi,
                boliHead_en,
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBoliHead = async (req) => {
        try {
            const data = await TblBoliHead.findAll({
                attributes: ["id", "boliHead_hi", "boliHead_en", "status"]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBoliHead = async (req) => {
        try {
            const { id, boliHead_hi, boliHead_en, status } = req.body;
            const data = await TblBoliHead.update(
                { 
                    boliHead_hi : boliHead_hi, 
                    boliHead_en : boliHead_en,
                    status : status
                },
                {
                where: {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteBoliHead = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBoliHead.destroy({
                where: {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // boliUnit

    addBoliUnit = async (req) => {
        try {
            const { boliUnit_hi, boliUnit_en  } = req.body;
            const data = await TblBoliUnit.create({
                boliUnit_hi,
                boliUnit_en,
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBoliUnit = async (req) => {
        try {
            const data = await TblBoliUnit.findAll({
                attributes: ["id", "boliUnit_hi", "boliUnit_en", "status"]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBoliUnit = async (req) => {
        try {
            const { id, boliUnit_hi, boliUnit_en, status } = req.body;
            const data = await TblBoliUnit.update(
                { 
                    boliUnit_hi : boliUnit_hi,
                    boliUnit_en : boliUnit_en,
                    status : status,
                },
                {
                where: {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteBoliUnit = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBoliUnit.destroy({
                where: {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // boli

    addBoli = async (req, Boli_id) => {
        try {
            const { MobileNo, Name, Email, Address, Unit, BoliAmount, PendingAmount, Date, Time, BoliStatus, active, boli_item } = req.body
            const ADDED_BY = req.user.id;
            const data = await TblBoli.create({
                Boli_id : Boli_id,
                MobileNo,
                Name,
                Email,
                Address,
                Unit,
                BoliAmount,
                PendingAmount,
                Date,
                Time,
                ADDED_BY,
                BoliStatus,
                active,
                boli_item
            }).then(async (res) => {
                let boliItems = [];
                boli_item.forEach((e) => {
                    boliItems.push({
                        Name : res.Name,
                        Address : res.Address,
                        Boli_id: res.Boli_id,
                        Type: e.Type,
                        Unit: e.Unit,
                        BoliAmount: e.BoliAmount,
                        PendingAmount: e.BoliAmount - e.PayAmount,
                        ModeOfPayment: e.ModeOfPayment, // 1 : Online, 2 : Offline
                        PayAmount: e.PayAmount,
                        ChequeNo: e.ChequeNo,
                        Date: e.Date,
                        Time: e.Time,
                        NameOfBank: e.NameOfBank,
                        PaymentId: e.PaymentId,
                        PaymentStatus: e.PaymentStatus, // 1(true) : Online, 0(false) : Offline
                        Remark: e.Remark,
                        ADDED_BY: ADDED_BY
                    });
                });
                await TblBoliItem.bulkCreate(boliItems).then(async (resp) => {
                    res.dataValues["boliItem"] = resp;
                }); 
                return {
                    data: res.dataValues
                }
            });
            return data
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getBoli = async (req) => {
        try {
            const boliData = await TblBoli.findAll({
                order : [["Date", "DESC"]],
                raw: true,
            });
            const boliItemPromises = boliData.map(async (data) => {
                const boliItem = await TblBoliItem.findAll({
                    where : {
                        Boli_id : data.Boli_id
                    },
                    order : [["Date", "DESC"]],
                    raw: true
                });
                if(boliItem) {
                    data.boliItem = boliItem;
                }
                return data;
            });
            const boliDataWithItems = await Promise.all(boliItemPromises);
            return boliDataWithItems;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBoli = async (req) => {
        try {
            const { Boli_id, MobileNo, Name, Email, Address, Unit, BoliAmount, PendingAmount, BoliStatus, active, boli_item } = req.body;
            const data = await TblBoli.update(
                {
                    MobileNo : MobileNo,
                    Name : Name,
                    Email : Email,
                    Address : Address,
                    Unit : Unit,
                    BoliAmount : BoliAmount,
                    PendingAmount : PendingAmount,
                    BoliStatus : BoliStatus,
                    active : active,
                },
                {
                    where : {
                        Boli_id : Boli_id
                    }
                }
            );
            const updatedBoliItems = await Promise.all(boli_item.map(async (e) => {
                const updatedItem = await TblBoliItem.update(
                    {
                        Name: Name,
                        Address: Address,
                        Type: e.Type,
                        Unit: e.Unit,
                        BoliAmount: e.BoliAmount,
                        PendingAmount: e.BoliAmount - e.PayAmount,
                        ModeOfPayment: e.ModeOfPayment, // 1 : Online, 2 : Offline
                        PayAmount: e.PayAmount,
                        ChequeNo: e.ChequeNo,
                        NameOfBank: e.NameOfBank,
                        PaymentId: e.PaymentId,
                        PaymentStatus: e.PaymentStatus, // 1(true) : Online, 0(false) : Offline
                        Remark: e.Remark,
                    },
                    {
                        where: {
                            Boli_id: Boli_id,
                            id: e.id
                        }
                    }
                );
                return updatedItem;
            }));
    
            const responseData = {
                Boli: data,
                BoliItems: updatedBoliItems
            };
            return responseData;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteBoli = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBoli.destroy({
                where : {
                    Boli_id : id
                }
            }).then(async (res) => {
                await TblBoliItem.destroy({
                    where : {
                        Boli_id : id
                    }
                });
                return {
                    msg : "Boli Deleted Successfully"
                }
            });
            return data
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getBoliCount = async () => {
        try {
            const count = await TblBoli.count({
                distinct: true,
                col: 'Boli_id'
            });
            
            return count;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getBoliVoucherCount = async () => {
        try {
            const count = await TblBoliVoucher.count({
                distinct: true,
                col: 'Boli_id'
            });
            
            return count;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getReceiptNo = async () => {
        try {
            const data = await TblReceipt.findOne({
                where : {
                    type : '7'
                },
                attributes : ["receipt"]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    addPayment = async (req) => {
        try {
            // const { Boli_id, Type, Unit, BoliAmount, PendingAmount, ModeOfPayment, PayAmount, ChequeNo, Date, Time, NameOfBank, PaymentId, PaymentStatus, Remark } = req.body; 
            // const ADDED_BY = req.user.id;
            // const data = await TblBoliItem.create({
            //     Boli_id,
            //     Type,
            //     Unit,
            //     BoliAmount,
            //     PendingAmount,
            //     ModeOfPayment, // 1 : Online, 2 : Offline
            //     PayAmount,
            //     ChequeNo,
            //     Date,
            //     Time,
            //     NameOfBank,
            //     PaymentId,
            //     PaymentStatus, // 1(true) : Online, 0(false) : Offline
            //     Remark,
            //     ADDED_BY
            // });
            // // if (data && data.PendingAmount === 0) {
            // //     await TblBoli.update({active : '0'}, {
            // //         where : {
            // //             Boli_id : data.Boli_id
            // //         }
            // //     });
            // // };
            // return data;

            // Add multiple data at a time
            const paymentArray = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblBoliItem.bulkCreate(
                paymentArray.map(payment => ({
                    ...payment,
                    ADDED_BY,
                    PendingAmount : payment.BoliAmount - payment.PayAmount 
                }))
            );
            const boliData = await TblBoli.findOne({
                where : {
                    Boli_id : data[0].Boli_id
                }
            });
            const boliItem = await TblBoliItem.findAll({
                where : {
                    Boli_id : data[0].Boli_id
                },
                attributes : [[sequelize.fn('SUM', sequelize.col('PayAmount')), "PayAmount"]]
            })
            const boliDataUpdate = await TblBoli.update({
                PendingAmount : boliData.BoliAmount - boliItem[0].PayAmount
            },
            {
                where : {
                    Boli_id : data[0].Boli_id
                }
            });
            const updatedBoliData = await TblBoli.findAll({
                where : {
                    Boli_id : data[0].Boli_id
                }
            });
            if (updatedBoliData[0].PendingAmount === 0) {
                const boliUpdate = await TblBoli.update(
                    {
                        BoliStatus : "Paid",
                        active : 0
                    },
                    {
                        where : {
                            Boli_id : updatedBoliData[0].Boli_id
                        }
                    }
                );
            };
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getPayment = async (req) => {
        try {
            const data = await TblBoliItem.findAll({
                order : [["Date", "DESC"]]
            })
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    editPayment = async (req) => {
        try {
            const { id, Name, Address, Type, Unit, BoliAmount, PendingAmount, ModeOfPayment, PayAmount, ChequeNo, NameOfBank, PaymentId, PaymentStatus, Remark } = req.body;
            const data = await TblBoliItem.update(
                {
                    Name : Name,
                    Address : Address,
                    Type : Type,
                    Unit : Unit,
                    BoliAmount : BoliAmount,
                    PendingAmount : PendingAmount,
                    ModeOfPayment : ModeOfPayment, // 1 : Online, 2 : Offline
                    PayAmount : PayAmount,
                    ChequeNo : ChequeNo,
                    NameOfBank : NameOfBank,
                    PaymentId : PaymentId,
                    PaymentStatus : PaymentStatus, // 1(true) : Online, 0(false) : Offline
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

    deletePayment = async (req) => {
        try {
            const { id } = req.query;
            const data = TblBoliItem.destroy({
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

    getPendingBoli = async (req) => {
        try {
            const boliData = await TblBoli.findAll({
                where : {
                    active : '1'
                },
                order : [["Date", "DESC"]],
                raw: true,
            });
            const boliItemPromises = boliData.map(async (data) => {
                const boliItem = await TblBoliItem.findAll({
                    where : {
                        Boli_id : data.Boli_id
                    },
                    order : [["Date", "DESC"]],
                    raw: true
                });
                if(boliItem) {
                    data.boliItem = boliItem;
                }
                return data;
            });
            const boliDataWithItems = await Promise.all(boliItemPromises);
            return boliDataWithItems;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getPaidBoli = async (req) => {
        try {
            const boliData = await TblBoli.findAll({
                where : {
                    active : '0'
                },
                order : [["Date", "DESC"]],
                raw: true,
            });
            const boliItemPromises = boliData.map(async (data) => {
                const boliItem = await TblBoliItem.findAll({
                    where : {
                        Boli_id : data.Boli_id
                    },
                    order : [["Date", "DESC"]],
                    raw: true
                });
                if(boliItem) {
                    data.boliItem = boliItem;
                }
                return data;
            });
            const boliDataWithItems = await Promise.all(boliItemPromises);
            return boliDataWithItems;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    searchBoliByDate = async (req) => {
        try {
            const { fromDate, toDate } = req.body;
            const boliData = await TblBoli.findAll({
                where : {
                    [Op.and] : [
                        { date : { [Op.gte] : fromDate } },
                        { date : { [Op.lte] : toDate } }
                    ]
                },
                order : [["Date", "DESC"]],
                raw: true,
            });
            const boliItemPromises = boliData.map(async (data) => {
                const boliItem = await TblBoliItem.findAll({
                    where : {
                        Boli_id : data.Boli_id
                    },
                    order : [["Date", "DESC"]],
                    raw: true
                });
                if(boliItem) {
                    data.boliItem = boliItem;
                }
                return data;
            });
            const boliDataWithItems = await Promise.all(boliItemPromises);
            return boliDataWithItems;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    searchBoli = async (req) => {
        try {
            const { search } = req.query;
            const isSearchQueryZero = search === 0;
            let boliData = await TblBoli.findAll({
                where : {
                    [Op.or]: [
                        { Boli_id: { [Op.like]: `%${search}%` } },
                        { MobileNo: { [Op.like]: `%${search}%` } },
                        { Name: { [Op.like]: `%${search}%` } },
                        { Email: { [Op.like]: `%${search}%` } },
                        { Address: { [Op.like]: `%${search}%` } },
                        { Unit: { [Op.like]: `${search}` } },
                        { BoliAmount: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { PendingAmount: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { Date: { [Op.like]: `%${search}%` } },
                        { Time: { [Op.like]: `%${search}%` } },
                        { ADDED_By: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { BoliStatus: { [Op.like]: `%${search}%` } },
                        { active: { [Op.like]: `%${search}%` } },
                    ]
                },
                order : [["Date", "DESC"]],
                raw: true,
            });
            const boliItemData = await TblBoliItem.findAll({
                where : {
                    [Op.or] : [
                        { Boli_id: { [Op.like]: `%${search}%` } },
                        { Type: { [Op.like]: `%${search}%` } },
                        { Unit: { [Op.like]: `%${search}%` } },
                        { BoliAmount: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { PendingAmount: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { ModeOfPayment: { [Op.like]: `%${search}%` } },
                        { PayAmount: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { ChequeNo: { [Op.like]: `%${search}%` } },
                        { Date: { [Op.like]: `%${search}%` } },
                        { Time: { [Op.like]: `%${search}%` } },
                        { NameOfBank: { [Op.like]: `%${search}%` } },
                        { PaymentId: { [Op.like]: `%${search}%` } },
                        { PaymentStatus: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } },
                        { Remark: { [Op.like]: `%${search}%` } },
                        { ADDED_By: isSearchQueryZero ? { [Op.eq]: 0 } : { [Op.and]: [{ [Op.eq]: search }, { [Op.ne]: 0 }] } }
                    ]               
                },
                order : [["Date", "DESC"]],
                raw: true,
            });
            if(boliData.length === 0 && boliItemData.length > 0){
                boliData = await TblBoli.findAll({
                    order : [["Date", "DESC"]],
                    raw: true,
                });
            }

            const mergedData = [...boliData];
            const boliItemPromises = mergedData.map(async (data) => {
                if(data.Boli_id) {
                    const boliItem = await TblBoliItem.findAll({
                        where : {
                            Boli_id : data.Boli_id,              
                        },
                        order : [["Date", "DESC"]],
                        raw: true,
                    });
                    if(boliItem) {
                        data.boliItem = boliItem;
                    }
                }
                return data;
            });
            const boliDataWithItems = await Promise.all(boliItemPromises);
            return boliDataWithItems;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getBoliByNum = async (req) => {
        try {
            // const { MobileNo } = req.body; // Change it by const MobileNo = req.user.mobileNo
            const MobileNo = req.user.mobileNo;
            const boliData = await TblBoli.findAll({
                where : {
                    MobileNo : MobileNo
                },
                order : [["Date", "DESC"]],
                raw: true,
            });
            const boliItemPromises = boliData.map(async (data) => {
                const boliItem = await TblBoliItem.findAll({
                    where : {
                        Boli_id : data.Boli_id
                    },
                    order : [["Date", "DESC"]],
                    raw: true
                });
                if(boliItem) {
                    data.boliItem = boliItem;
                }
                return data;
            });
            const boliDataWithItems = await Promise.all(boliItemPromises);
            return boliDataWithItems;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addPrintBoli = async (req) => {
        try {
            // For single data entry
            const { Name, Address, Boli_id, Type, Unit, PaidAmount, PrintAmount, NameOfBank, PaymentId, Remark, Date, Time } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblBoliPayment.create({
                Name,
                Address,
                Boli_id,
                Type,
                Unit,
                PaidAmount,
                PrintAmount,
                NameOfBank,
                PaymentId,
                Remark,
                Date,
                Time,
                ADDED_BY
            });
            return data;

            // For multiple data entry
            // const printArray = req.body;
            // const ADDED_BY = req.user.id;
            // const data = await TblBoliPayment.bulkCreate(
            //     printArray.map(print => ({
            //         ...print,
            //         ADDED_BY
            //     }))
            // );
            // return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    getPrintBoli = async(req) => {
        try {
            const data = await TblBoliPayment.findAll({
                order : [["Date", "DESC"]],
                raw : true
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    addBoliGroup = async (req) => {
        try {
            const { City, PinCode, State, Country } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblBoliGroup.create({
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

    getBoliGroup = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            const searchObj = {};
            if (fromDate && toDate) {
                searchObj.createdAt = { [Op.between] : [fromDate, toDate] }
            }
            const data = await TblBoliGroup.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBoliGroup = async (req) => {
        try {
            const { id, City, PinCode, State, Country } = req.body;
            const data = await TblBoliGroup.update(
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

    deleteBoliGroup = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBoliGroup.destroy({
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

    addBoliLedger = async (req, LedgerNo) => {
        try {
            const { MobileNo, Name, FatherName, Address, City, PinCode, State, Country, Email, AadharNo, PanNo, OpeningBalance } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblBoliLedger.create({
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

    getBoliLedger = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            const searchObj = {};
            if (fromDate && toDate) {
                searchObj.createdAt = { [Op.between] : [fromDate, toDate] }
            }
            const data = await TblBoliLedger.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            for (const LedgerNo of data) {
                const elecDonationData = await TblelecDonation.findAll({
                    attributes : [
                        [sequelize.fn('SUM', sequelize.col('details.amount')), 'DepositedAmount']
                    ],
                    include : [
                        {
                            model : TblelecDonationItem,
                            as : 'details',
                            attributes : []
                        },
                    ],
                    where : {
                        LedgerNo : LedgerNo.LedgerNo
                    }
                });
                const manualDonationData = await TblmanualDonation.findAll({
                    attributes : [
                        [sequelize.fn('SUM', sequelize.col('details.amount')), 'DepositedAmount']
                    ],
                    include : [
                        {
                            model : TblmanualDonationItem,
                            as : 'details',
                            attributes : []
                        },
                    ],
                    where : {
                        LedgerNo : LedgerNo.LedgerNo
                    }
                });
                const onlineDonationData = await TblNewDonation.findAll({
                    where : {
                        LedgerNo : LedgerNo.LedgerNo,
                        PAYMENT_STATUS : true
                    }
                });
                LedgerNo.DepositedAmount = (elecDonationData[0]?.dataValues?.DepositedAmount || 0) + (manualDonationData[0]?.dataValues?.DepositedAmount || 0) + (onlineDonationData[0]?.dataValues?.AMOUNT || 0);
            }
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBoliLedger = async (req) => {
        try {
            const { id, MobileNo, Name, FatherName, Address, City, PinCode, State, Country, Email, AadharNo, PanNo, OpeningBalance, TotalAmount, DepositedAmount } = req.body;
            const data = await TblBoliLedger.update(
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

    deleteBoliLedger = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBoliLedger.destroy({
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

    addBoliVoucher = async (req, Boli_id) => {
        try {
            const { Date, Time, LedgerNo, MobileNo, Name, FatherName, Address, City, PinCode, State, Country, Email, BoliAmount, boliVoucherList } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblBoliVoucher.create({
                Boli_id,
                Date,
                Time,
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
                BoliAmount,
                ADDED_BY,
                boliVoucherList
            }).then(async (res) => {
                let boliVoucherLists = [];
                boliVoucherList.forEach((e) => {
                    boliVoucherLists.push({
                        Boli_id : res.Boli_id,
                        Type : e.Type,
                        BoliAmount : e.BoliAmount,
                        Remark : e.Remark,
                        ADDED_BY : ADDED_BY
                    });
                });
                await TblBoliVoucherList.bulkCreate(boliVoucherLists).then(async (resp) => {
                    res.dataValues["boliVoucherList"] = resp;
                });
                return {
                    data: res.dataValues
                }
            });
            const boliLedgerData = await TblBoliLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                }
            });
            await TblBoliLedger.update(
                {
                    TotalAmount : boliLedgerData.TotalAmount + BoliAmount
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

    getBoliVoucher = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            const searchObj = {};
            if (fromDate && toDate) {
                searchObj.Date = { [Op.between] : [fromDate, toDate] }
            }
            const boliVoucherData = await TblBoliVoucher.findAll({
                where : searchObj,
                order : [["id", "DESC"]],
                raw : true
            });
            const boliVoucherListPromises = boliVoucherData.map(async (data) => {
                const boliVoucherList = await TblBoliVoucherList.findAll({
                    where : {
                        Boli_id : data.Boli_id
                    },
                    order : [["id", "DESC"]],
                    raw : true
                });
                if (boliVoucherList) {
                    data.boliVoucherList = boliVoucherList;
                }
                return data;
            });
            const boliVoucherWithList = await Promise.all(boliVoucherListPromises);
            return boliVoucherWithList;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBoliVoucher = async (req) => {
        try {
            const { Date, Time, Boli_id, LedgerNo, MobileNo, Name, FatherName, Address, City, PinCode, State, Country, Email, BoliAmount, boliVoucherList } = req.body;
            const data = await TblBoliVoucher.update(
                {
                    Date : Date,
                    Time : Time,
                    LedgerNo : LedgerNo,
                    MobileNo : MobileNo,
                    Name : Name,
                    FatherName : FatherName,
                    Address : Address,
                    City : City,
                    PinCode : PinCode,
                    State : State,
                    Country : Country,
                    Email : Email,
                    BoliAmount : BoliAmount
                },
                {
                    where : {
                        Boli_id : Boli_id
                    }
                }
            );
            const updatedBoliVoucherList = await Promise.all(boliVoucherList.map(async (e) => {
                const updatedVoucherList = await TblBoliVoucherList.update(
                    {
                        Type : e.Type,
                        BoliAmount : e.BoliAmount,
                        Remark : e.Remark
                    },
                    {
                        where : {
                            Boli_id : Boli_id,
                            id : e.id
                        }
                    }
                );
                return updatedVoucherList;
            }));

            const responseData = {
                BoliVoucher: data,
                BoliVoucherLists: updatedBoliVoucherList
            };

            const boliLedgerData = await TblBoliLedger.findOne({
                where : {
                    LedgerNo : LedgerNo
                }
            });
            await TblBoliLedger.update(
                {
                    TotalAmount : BoliAmount
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

    deleteBoliVoucher = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBoliVoucher.destroy({
                where : {
                    Boli_id : id
                }
            }).then(async (res) => {
                await TblBoliVoucherList.destroy({
                    where : {
                        Boli_id : id
                    }
                });
                return {
                    msg : "Boli Voucher Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    searchBoliGroup = async (req) => {
        try {
            const { search } = req.query;
            const data = await TblBoliGroup.findAll({
                where : {
                    [Op.or] : [
                        { id: { [Op.eq] : search } },
                        { City: { [Op.like] : `%${search}%` } },
                        { PinCode: { [Op.eq] : search } },
                        { State: { [Op.like] : `%${search}%` } },
                        { Country: { [Op.like] : `%${search}%` } },
                    ]
                },
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    searchBoliLedger = async (req) => {
        try {
            const { search } = req.query;
            const data = await TblBoliLedger.findAll({
                where : {
                    [Op.or] : [
                        { id: { [Op.eq] : search } },
                        { MobileNo: { [Op.eq] : search } },
                        { Name: { [Op.like] : `%${search}%` } },
                        { FatherName: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { City: { [Op.like] : `%${search}%` } },
                        { PinCode: { [Op.eq] : search } },
                        { State: { [Op.like] : `%${search}%` } },
                        { Country: { [Op.like] : `%${search}%` } },
                        { Email: { [Op.like] : `%${search}%` } },
                        { AadharNo: { [Op.eq] : search } },
                        { PanNo: { [Op.like] : `%${search}%` } },
                        { OpeningBalance: { [Op.eq] : search } },
                    ]
                },
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    searchBoliVoucher = async (req) => {
        try {
            const { search } = req.query;
            let boliVoucherData = await TblBoliVoucher.findAll({
                where : {
                    [Op.or] : [
                        { id: { [Op.eq]: search } },
                        { Boli_id: { [Op.like]: `%${search}%` } },
                        { Date: { [Op.like]: `%${search}%` } },
                        { Time: { [Op.like]: `%${search}%` } },
                        { LedgerNo: { [Op.like]: `%${search}%` } },
                        { MobileNo: { [Op.like]: `%${search}%` } },
                        { Name: { [Op.like]: `%${search}%` } },
                        { FatherName: { [Op.like]: `%${search}%` } },
                        { Address: { [Op.like]: `%${search}%` } },
                        { City: { [Op.like]: `%${search}%` } },
                        { PinCode: { [Op.like]: `%${search}%` } },
                        { State: { [Op.like]: `%${search}%` } },
                        { Country: { [Op.like]: `%${search}%` } },
                        { Email: { [Op.like]: `%${search}%` } },
                        { BoliAmount: { [Op.eq]: search } },
                    ]
                },
                order : [["id", "DESC"]],
                raw : true
            });
            const boliVoucherListData = await TblBoliVoucherList.findAll({
                where : {
                    [Op.or] : [
                        { id: { [Op.eq]: search } },
                        { Boli_id: { [Op.like]: `%${search}%` } },
                        { Type: { [Op.like]: `%${search}%` } },
                        { BoliAmount: { [Op.eq]: search } },
                        { Remark: { [Op.like]: `%${search}%` } },
                    ]
                },
                order : [["id", "DESC"]],
                raw : true
            });
            if(boliVoucherData.length === 0 && boliVoucherListData.length > 0) {
                boliVoucherData = await TblBoliVoucher.findAll({
                    order : [["id", "DESC"]],
                    raw : true
                });
            }

            const mergedData = [...boliVoucherData];
            const boliVoucherListPromises = mergedData.map(async (data) => {
                if(data.Boli_id) {
                    const boliVoucherList = await TblBoliVoucherList.findAll({
                        where : {
                            Boli_id : data.Boli_id
                        },
                        order : [["id", "DESC"]],
                        raw : true
                    });
                    if (boliVoucherList) {
                        data.boliVoucherList = boliVoucherList;
                    }
                }
                return data;
            });
            const boliVoucherWithList = await Promise.all(boliVoucherListPromises);
            return boliVoucherWithList;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBoliLedgerCount = async () => {
        try {
            const count = await TblBoliLedger.count({
                distinct: true,
                col: 'LedgerNo'
            });
            return count;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getTally = async (req) => {
        try {
            const { LedgerNo } = req.query;
            const data = await TblBoliLedger.findOne({
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
                        as : 'details'
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
                        as : 'details'
                    },
                ],
                where : {
                    LedgerNo : LedgerNo
                }
            });
            const onlineDonationData = await TblNewDonation.findAll({
                where : {
                    LedgerNo : LedgerNo,
                    PAYMENT_STATUS : true
                }
            });
            data.voucherDetails = [
                ...(elecDonationData || []),
                ...(manualDonationData || []),
                ...(onlineDonationData || [])
            ];
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBoliLedgerByNum = async (req) => {
        try {
            const MobileNo = req.user.mobileNo;
            let searchObj = {};
            searchObj.MobileNo = MobileNo;
            const { fromDate, toDate } = req.query;

            if(fromDate && toDate) {
                searchObj.createdAt = {
                    [Op.between] : [ fromDate, toDate ]
                }
            }
            const data = await TblBoliLedger.findAll({
                where : searchObj,
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getBoliStatus = async (req) => {
        try {
            const data = await TblBoliLedger.findAll({
                attributes : ["Name", 
                "TotalAmount", 
                "OpeningBalance", 
                "DepositedAmount",
                "LedgerNo",
                ],
                raw: true
            });

            for (const LedgerNo of data) {
                const elecDonationData = await TblelecDonation.findAll({
                    attributes : [
                        [sequelize.fn('SUM', sequelize.col('details.amount')), 'DepositedAmount']
                    ],
                    include : [
                        {
                            model : TblelecDonationItem,
                            as : 'details',
                            attributes : []
                        },
                    ],
                    where : {
                        LedgerNo : LedgerNo.LedgerNo
                    }
                });
                const manualDonationData = await TblmanualDonation.findAll({
                    attributes : [
                        [sequelize.fn('SUM', sequelize.col('details.amount')), 'DepositedAmount']
                    ],
                    include : [
                        {
                            model : TblmanualDonationItem,
                            as : 'details',
                            attributes : []
                        },
                    ],
                    where : {
                        LedgerNo : LedgerNo.LedgerNo
                    }
                });
                const onlineDonationData = await TblNewDonation.findAll({
                    where : {
                        LedgerNo : LedgerNo.LedgerNo,
                        PAYMENT_STATUS : true
                    }
                });
                // if (elecDonationData || manualDonationData || onlineDonationData) {
                //     LedgerNo.voucherDetails = [
                //         ...(elecDonationData || []),
                //         ...(manualDonationData || []),
                //         ...(onlineDonationData || []),
                //     ];
                // }
                let Total = LedgerNo.TotalAmount + LedgerNo.OpeningBalance;
                if(Total) {
                    LedgerNo.Total = Total
                }
                LedgerNo.DepositedAmount = (elecDonationData[0]?.dataValues?.DepositedAmount || 0) + (manualDonationData[0]?.dataValues?.DepositedAmount || 0) + (onlineDonationData[0]?.dataValues?.AMOUNT || 0);
                LedgerNo.PendingAmount = (LedgerNo.Total || 0) - (LedgerNo.DepositedAmount || 0)
            }
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getHighestBoliByAmount = async (req) => {
        try {
            const data = await TblBoliVoucher.findAll({
                order : [["BoliAmount", "DESC"]],
                limit : 10
            });
            return data;    
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getHighestBoliByCity = async (req) => {
        try {
            const data = await TblBoliVoucher.findAll({
                attributes: [
                    'City',
                    [sequelize.fn('SUM', sequelize.literal('BoliAmount')), 'totalBoliAmount']
                ],
                group : ["City"],
                order : [[sequelize.literal('totalBoliAmount'), "DESC"]],
                limit : 10
            });
            return data;    
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getHighestBoliByState = async (req) => {
        try {
            const data = await TblBoliVoucher.findAll({
                attributes: [
                    'State',
                    [sequelize.fn('SUM', sequelize.literal('BoliAmount')), 'totalBoliAmount']
                ],
                group : ["State"],
                order : [[sequelize.literal('totalBoliAmount'), "DESC"]],
                limit : 10
            });
            return data;    
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

module.exports = new BoliCollection();