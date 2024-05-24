const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");
const { sendCustomWhatsappSms } = require("../utils/SendWhatsappSms");
const uploadimage = require("../middlewares/imageupload");

const TblSadsyaType = db.sadsyaType;
const TblRelationshipType = db.relationshipType;
const TblCommittee = db.committee;
const TblOccasionType = db.occasionType;
const TblFamily = db.family;
const TblFamilyMembers = db.familyMembers;
const TblCustomWhatsapp = db.customWhatsapp;

class CommitteeCollection {
    addSadsyaType = async (req) => {
        try {
            const { sadsyaType_hi, sadsyaType_en } = req.body;
            const data = await TblSadsyaType.create({
                sadsyaType_hi,
                sadsyaType_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getSadsyaType = async (req) => {
        try {
            const data = await TblSadsyaType.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editSadsyaType = async (req) => {
        try {
            const { id, sadsyaType_hi, sadsyaType_en, status } = req.body;
            const data = await TblSadsyaType.update(
                {
                    sadsyaType_hi : sadsyaType_hi,
                    sadsyaType_en : sadsyaType_en,
                    status : status
                },
                {
                    where : {
                        id: id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteSadsyaType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblSadsyaType.destroy({
                where : {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addRelationshipType = async (req) => {
        try {
            const { relationshipType_hi, relationshipType_en } = req.body;
            const data = await TblRelationshipType.create({
                relationshipType_hi,
                relationshipType_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getRelationshipType = async (req) => {
        try {
            const data = await TblRelationshipType.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editRelationshipType = async (req) => {
        try {
            const { id, relationshipType_hi, relationshipType_en, status } = req.body
            const data = await TblRelationshipType.update(
                {
                    relationshipType_hi : relationshipType_hi,
                    relationshipType_en : relationshipType_en,
                    status : status
                },
                {
                    where : {
                        id: id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteRelationshipType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblRelationshipType.destroy({
                where : {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addCommittee = async (req) => {
        try {
            const { Name, FathersName, SadsyaType, Age, MobileNo, Email, AadharNo, PanNo, Address, DateOfBirth, DateOfAnniversary, FromDate, ToDate, Status, Remark } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblCommittee.create({
                Name,
                FathersName,
                SadsyaType,
                Age,
                MobileNo,
                Email,
                AadharNo,
                PanNo,
                Address,
                DateOfBirth,
                DateOfAnniversary,
                FromDate,
                ToDate,
                Status,
                Remark,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getCommittee = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            if(fromDate && toDate) {
                searchObj.DateOfBirth = {[Op.and] : [
                    {[Op.gte] : fromDate},
                    {[Op.lte] : toDate}
                ]}
            }
            const data = await TblCommittee.findAll({
                where : searchObj,
                order: [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editCommittee = async (req) => {
        try {
            const { id, Name, FathersName, SadsyaType, Age, MobileNo, Email, AadharNo, PanNo, Address, DateOfBirth, DateOfAnniversary, FromDate, ToDate, Status, Remark } = req.body;
            const data = await TblCommittee.update(
                {
                    Name : Name,
                    FathersName : FathersName,
                    SadsyaType : SadsyaType,
                    Age : Age,
                    MobileNo : MobileNo,
                    Email : Email,
                    AadharNo : AadharNo,
                    PanNo : PanNo,
                    Address : Address,
                    DateOfBirth : DateOfBirth,
                    DateOfAnniversary : DateOfAnniversary,
                    FromDate : FromDate,
                    ToDate : ToDate,
                    Status : Status,
                    Remark : Remark
                },
                {
                    where : {
                        id: id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteCommittee = async(req) => {
        try {
            const { id } = req.query;
            const data = await TblCommittee.destroy({
                where : {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addOccasionType = async (req) => {
        try {
            const { occasionType_hi, occasionType_en } = req.body;
            const data = await TblOccasionType.create({
                occasionType_hi,
                occasionType_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getOccasionType = async (req) => {
        try {
            const data = await TblOccasionType.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editOccasionType = async (req) => {
        try {
            const { id, occasionType_hi, occasionType_en, status } = req.body
            const data = await TblOccasionType.update(
                {
                    occasionType_hi : occasionType_hi,
                    occasionType_en : occasionType_en,
                    status : status
                },
                {
                    where : {
                        id: id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteOccasionType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblOccasionType.destroy({
                where : {
                    id: id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addFamily = async (req) => {
        try {
            const { MobileNo, Name, FathersName, Address, Age, AadharNo, PanNo, Email, SadsyaType, DateOfBirth, DateOfOccasion, OccasionType, Status, Remark, familyMember } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblFamily.create({
                MobileNo,
                Name,
                FathersName,
                Address,
                Age,
                AadharNo,
                PanNo,
                Email,
                SadsyaType,
                DateOfBirth,
                DateOfOccasion,
                OccasionType,
                Status,
                Remark,
                ADDED_BY,
                familyMember
            }).then(async (res) => {
                let familyMembers = [];
                familyMember.forEach((e) => {
                    familyMembers.push({
                        familyId : res.id,
                        MobileNo : e.MobileNo,
                        Name : e.Name,
                        RelationshipType : e.RelationshipType,
                        Address : e.Address,
                        Email : e.Email,
                        DateOfBirth : e.DateOfBirth,
                        DateOfOccasion : e.DateOfOccasion,
                    });
                });
                await TblFamilyMembers.bulkCreate(familyMembers).then(async (resp) => {
                    res.dataValues["familyMember"] = resp;
                });
                return {
                    data: res.dataValues
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getFamily = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            if(fromDate && toDate) {
                searchObj.DateOfBirth = {[Op.and] : [
                    {[Op.gte] : fromDate},
                    {[Op.lte] : toDate}
                ]}
            }
            const familyData = await TblFamily.findAll({
                where : searchObj,
                order : [["id", "DESC"]],
                raw : true
            });
            const familyMemberPromises = familyData.map(async (data) => {
                const familyMember = await TblFamilyMembers.findAll({
                    where : {
                        familyId : data.id
                    },
                    raw : true
                });
                if(familyMember) {
                    data.familyMembers = familyMember;
                }
                return data;
            });
            const familyWithMembers = await Promise.all(familyMemberPromises);
            return familyWithMembers;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editFamily = async (req) => {
        try {
            const { id, MobileNo, Name, FathersName, Address, Age, AadharNo, PanNo, Email, SadsyaType, DateOfBirth, DateOfOccasion, OccasionType, Status, Remark, familyMember } = req.body;
            const data = await TblFamily.update(
                {
                    MobileNo : MobileNo,
                    Name : Name,
                    FathersName : FathersName,
                    Address : Address,
                    Age : Age,
                    AadharNo : AadharNo,
                    PanNo : PanNo,
                    Email : Email,
                    SadsyaType : SadsyaType,
                    DateOfBirth : DateOfBirth,
                    DateOfOccasion : DateOfOccasion,
                    OccasionType : OccasionType,
                    Status : Status,
                    Remark : Remark,
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            const updatedFamilyMembers = await Promise.all(familyMember.map(async (e) => {
                const updatedMember = await TblFamilyMembers.update(
                    {
                        MobileNo : e.MobileNo,
                        Name : e.Name,
                        RelationshipType : e.RelationshipType,
                        Address : e.Address,
                        Email : e.Email,
                        DateOfBirth : e.DateOfBirth,
                        DateOfOccasion : e.DateOfOccasion,
                    },
                    {
                        where : {
                            familyId : id,
                            id : e.id
                        }
                    }
                );
                return updatedMember;
            }));

            const responseData = {
                Family : data,
                FamilyMembers : updatedFamilyMembers
            };
            return responseData;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteFamily = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblFamily.destroy({
                where : {
                    id : id
                }
            }).then(async(res) => {
                await TblFamilyMembers.destroy({
                    where : {
                        familyId : id
                    }
                });
                return {
                    msg : "Family Members Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    customWhatsapp = async (req) => {
        try {
            const { phoneNumbers, message } = req.body;
            let image1 = "";
            if(req.files) {  
                const { media } = req.files;
                if(media) {
                    image1 = uploadimage(media)
                }
            }

            const data = await TblCustomWhatsapp.create({
                message,
                media: image1
            });
            
            if(req.files) {
                const mediaUrl = `https://kundalpur.techjainsupport.co.in/public/uploads/images/customWhatsapp/${data.media}`;
                await sendCustomWhatsappSms(JSON.parse(phoneNumbers), message, "image", mediaUrl);
                console.log(JSON.parse(phoneNumbers), message, mediaUrl);
            }else {
                console.log(JSON.parse(phoneNumbers), message);
                await sendCustomWhatsappSms(JSON.parse(phoneNumbers), message);
            }
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    searchCommittee = async (req) => {
        try {
            const { search } = req.query;
            const data = await TblCommittee.findAll({
                where : {
                    [Op.or] : [
                        { Name: { [Op.like] : `%${search}%` } },
                        { FathersName: { [Op.like] : `%${search}%` } },
                        { SadsyaType: { [Op.like] : `%${search}%` } },
                        { Age: { [Op.eq] : search } },
                        { MobileNo: { [Op.like] : `%${search}%` } },
                        { Email: { [Op.like] : `%${search}%` } },
                        { AadharNo: { [Op.like] : `%${search}%` } },
                        { PanNo: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { Status: { [Op.like] : `%${search}%` } },
                        { Remark: { [Op.like] : `%${search}%` } },
                    ]
                },
                order: [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    searchFamily = async (req) => {
        try {
            const { search } = req.query;
            let familyData = await TblFamily.findAll({
                where : {
                    [Op.or] : [
                        { MobileNo: { [Op.like] : `%${search}%` } },
                        { Name: { [Op.like] : `%${search}%` } },
                        { FathersName: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { Age: { [Op.eq] : search } },
                        { AadharNo: { [Op.like] : `%${search}%` } },
                        { PanNo: { [Op.like] : `%${search}%` } },
                        { Email: { [Op.like] : `%${search}%` } },
                        { SadsyaType: { [Op.like] : `%${search}%` } },
                        { OccasionType: { [Op.like] : `%${search}%` } },
                        { Remark: { [Op.like] : `%${search}%` } },
                    ]
                },
                order : [["id", "DESC"]],
                raw : true
            });
            const familyMemberData = await TblFamilyMembers.findAll({
                where : {
                    [Op.or] : [
                        { MobileNo: { [Op.like] : `%${search}%` } },
                        { Name: { [Op.like] : `%${search}%` } },
                        { RelationshipType: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { Email: { [Op.like] : `%${search}%` } },
                    ]
                },
                raw : true
            });
            if(familyData.length === 0 && familyMemberData.length > 0) {
                familyData = await TblFamily.findAll({
                    order : [["id", "DESC"]],
                    raw : true
                });
            }

            const mergedData = [...familyData];
            const familyMemberPromises = mergedData.map(async (data) => {
                const familyMember = await TblFamilyMembers.findAll({
                    where : {
                        familyId : data.id
                    },
                    raw : true
                });
                if(familyMember) {
                    data.familyMembers = familyMember;
                }
                return data;
            });
            const familyWithMembers = await Promise.all(familyMemberPromises);
            return familyWithMembers;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    multipleSmsWhatsapp = async (req) => {
        try {
            const { phoneNumbers } = req.body;
            const message = "Working Fine Multiple Message";
            await sendCustomWhatsappSms(phoneNumbers, message);
            return {
                msg: "Done"
            }
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getCommitteeByNum = async (req) => {
        try {
            const { MobileNo } = req.query;
            const data = await TblCommittee.findAll({
                where : {
                    MobileNo : MobileNo
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

module.exports = new CommitteeCollection();