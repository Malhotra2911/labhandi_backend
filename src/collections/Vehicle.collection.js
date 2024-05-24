const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");

const TblVehicleType = db.vehicleType;
const TblVehicle = db.vehicle;
const TblMaterial = db.material;
const TblMaterialItem = db.materialItem;

class VehicleCollection {
    addVehicleType = async (req) => {
        try {
            const { vehicleType_hi, vehicleType_en } = req.body;
            const data = await TblVehicleType.create({
                vehicleType_hi,
                vehicleType_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getVehicleType = async (req) => {
        try {
            const data = await TblVehicleType.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editVehicleType = async (req) => {
        try {
            const { id, vehicleType_hi, vehicleType_en, status } = req.body;
            const data = await TblVehicleType.update(
                {
                    vehicleType_hi : vehicleType_hi,
                    vehicleType_en : vehicleType_en,
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

    deleteVehicleType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblVehicleType.destroy({
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

    addVehicle = async (req) => {
        try {
            const { Date, Time, VehicleName, VehicleNo, Name, MobileNo, Address, VehicleType, Remark } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblVehicle.create({
                Date,
                Time,
                VehicleName,
                VehicleNo,
                Name,
                MobileNo,
                Address,
                VehicleType,
                Remark,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getVehicle = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            searchObj = { GateOut_BY : null };
            if (fromDate && toDate) {
                searchObj.Date = {[Op.and] : [
                    {[Op.gte] : fromDate},
                    {[Op.lte] : toDate}
                ]}
            }
            const data = await TblVehicle.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    editVehicle = async (req) => {
        try {
            const { id, Date, Time, VehicleName, VehicleNo, Name, MobileNo, Address, VehicleType, Remark, GateOutDate, GateOutTime } = req.body;
            const data = await TblVehicle.update(
                {
                    Date : Date,
                    Time : Time,
                    VehicleName : VehicleName,
                    VehicleNo : VehicleNo,
                    Name : Name,
                    MobileNo : MobileNo, 
                    Address : Address,
                    VehicleType : VehicleType,
                    Remark : Remark,
                    GateOutDate : GateOutDate,
                    GateOutTime : GateOutTime
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

    deleteVehicle = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblVehicle.destroy({
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

    addMaterial = async (req) => {
        try {
            const { Date, Time, VehicleName, VehicleNo, Name, MobileNo, Address, VehicleType, OrderNo, Remark, materialItem } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblMaterial.create({
                Date,
                Time,
                VehicleName,
                VehicleNo,
                Name,
                MobileNo,
                Address,
                VehicleType,
                OrderNo,
                Remark,
                ADDED_BY,
                materialItem
            }).then(async (res) => {
                let materialItems = [];
                materialItem.forEach((e) => {
                    materialItems.push({
                        MaterialId : res.id,
                        ItemName : e.ItemName,
                        ItemNo : e.ItemNo,
                        Quantity : e.Quantity,
                        Amount : e.Amount,
                        SupplierCode : e.SupplierCode,
                        SupplierName : e.SupplierName,
                        OrderNo : e.OrderNo,
                        Remark : e.Remark
                    });
                });
                await TblMaterialItem.bulkCreate(materialItems).then(async (resp) => {
                    res.dataValues["materialItem"] = resp;
                });
                return {
                    data: res.dataValues
                }
            });
            return data
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getMaterial = async (req) => {
        try {
            const materialData = await TblMaterial.findAll({
                order : [["id", "DESC"]],
                raw: true
            });

            const materialItemPromises = materialData.map(async (data) => {
                const materialItem = await TblMaterialItem.findAll({
                    where : {
                        materialId : data.id
                    },
                    order : [["id", "DESC"]],
                    raw :  true
                });
                if (materialItem) {
                    data.materialItem = materialItem;
                }
                return data
            });
            const materialDataWithItems = await Promise.all(materialItemPromises);
            return materialDataWithItems;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    editMaterial = async (req) => {
        try {
            const { id, Date, Time, VehicleName, VehicleNo, Name, MobileNo, Address, VehicleType, OrderNo, Remark, materialItem } = req.body;
            const data = await TblMaterial.update(
                {
                    Date : Date,
                    Time : Time,
                    VehicleName : VehicleName,
                    VehicleNo : VehicleNo,
                    Name : Name,
                    MobileNo : MobileNo,
                    Address : Address,
                    VehicleType : VehicleType,
                    OrderNo : OrderNo,
                    Remark : Remark,
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            const updatedMaterialItems = await Promise.all(materialItem.map(async (e) => {
                const updatedItem = await TblMaterialItem.update(
                    {
                        ItemName : e.ItemName,
                        ItemNo : e.ItemNo,
                        Quantity : e.Quantity,
                        Amount : e.Amount,
                        SupplierCode : e.SupplierCode,
                        SupplierName : e.SupplierName,
                        OrderNo : e.OrderNo,
                        Remark : e.Remark
                    },
                    {
                        where : {
                            MaterialId : id,
                            id : e.id
                        }
                    }
                );
                return updatedItem;
            }));

            const responseData = {
                Material : data,
                MaterialItem : updatedMaterialItems
            }

            return responseData;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    deleteMaterial = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblMaterial.destroy({
                where : {
                    id : id
                }
            }).then(async (res) => {
                await TblMaterialItem.destroy({
                    where : {
                        MaterialId : id
                    }
                });
                return {
                    msg : "Material Deleted Successfully"
                }
            });
            return data
        } catch (error) {
            console.log(error);
            return error
        }
    };

    gateout = async (req) => {
        try {
            const { id, GateOutDate, GateOutTime } = req.body;
            const data = await TblVehicle.findOne({
                where : {
                    id : id
                }
            });
            
            if(!data) {
                throw new Error({ error: "Vehicle Not Found" });
            }

            const gateOutDate = GateOutDate ? new Date(GateOutDate) : new Date();
            const gateOutTime = GateOutTime ? new Date(GateOutTime).toLocaleTimeString('en-US', { hour12 : false }) : new Date().toLocaleTimeString('en-US', { hour12 : false });

            data.GateOutDate = gateOutDate;
            data.GateOutTime = gateOutTime;
            data.GateOut_BY = req.user.id;

            await data.save();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    vehicleHistory = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            if (fromDate && toDate) {
                searchObj.Date = {[Op.and] : [
                    {[Op.gte] : fromDate},
                    {[Op.lte] : toDate}
                ]}
            }
            const data = await TblVehicle.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    gateoutHistory = async (req) => {
        try {
            const { fromDate, toDate } = req.query;
            let searchObj = {};
            searchObj = { GateOut_BY : { [Op.ne] : null } };
            if (fromDate && toDate) {
                searchObj.GateOutDate = {[Op.and] : [
                    {[Op.gte] : fromDate},
                    {[Op.lte] : toDate}
                ]}
            }
            const data = await TblVehicle.findAll({
                where : searchObj,
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    searchVehicle = async (req) => {
        try {
            const { search } = req.query;
            const data = await TblVehicle.findAll({
                where : {
                    [Op.or] : [
                        { VehicleName: { [Op.like] : `%${search}%` } },
                        { VehicleNo: { [Op.like] : `%${search}%` } },
                        { Name: { [Op.like] : `%${search}%` } },
                        { MobileNo: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { VehicleType: { [Op.like] : `%${search}%` } }
                    ],
                    GateOut_BY : null
                },
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    searchVehicleHistory = async (req) => {
        try {
            const { search } = req.query;
            const data = await TblVehicle.findAll({
                where : {
                    [Op.or] : [
                        { VehicleName: { [Op.like] : `%${search}%` } },
                        { VehicleNo: { [Op.like] : `%${search}%` } },
                        { Name: { [Op.like] : `%${search}%` } },
                        { MobileNo: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { VehicleType: { [Op.like] : `%${search}%` } }
                    ],
                },
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    searchGateoutHistory = async (req) => {
        try {
            const { search } = req.query;
            const data = await TblVehicle.findAll({
                where : {
                    [Op.or] : [
                        { VehicleName: { [Op.like] : `%${search}%` } },
                        { VehicleNo: { [Op.like] : `%${search}%` } },
                        { Name: { [Op.like] : `%${search}%` } },
                        { MobileNo: { [Op.like] : `%${search}%` } },
                        { Address: { [Op.like] : `%${search}%` } },
                        { VehicleType: { [Op.like] : `%${search}%` } }
                    ],
                    GateOut_BY : { [Op.ne] : null }
                },
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

module.exports = new VehicleCollection();