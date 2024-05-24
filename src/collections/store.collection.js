const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");

db.purchaseRequisition.hasMany(db.purchaseRequisitionList, {
    foreignKey: "purchaseRequisitionId",
    as: "purchaseRequisitionLists"
});

db.purchaseRequisitionList.belongsTo(db.purchaseRequisition, {
    foreignKey: "purchaseRequisitionId",
});

db.purchaseOrder.hasMany(db.purchaseOrderList, {
    foreignKey: "purchaseOrderId",
    as: "purchaseOrderList"
});

db.purchaseOrderList.belongsTo(db.purchaseOrder, {
    foreignKey: "purchaseOrderId"
});

db.gateEntry.hasMany(db.gateEntryList, {
    foreignKey: "gateEntryId",
    as: "gateEntryList"
});

db.gateEntryList.belongsTo(db.gateEntry, {
    foreignKey: "gateEntryId"
});

db.inventory.hasMany(db.inventoryList, {
    foreignKey: "InventoryId",
    as: "inventoryLists"
});

db.inventoryList.belongsTo(db.inventory, {
    foreignKey: "InventoryId"
});

const TblPurchaseRequisition = db.purchaseRequisition;
const TblPurchaseRequisitionList = db.purchaseRequisitionList;
const TblPurchaseOrder = db.purchaseOrder;
const TblPurchaseOrderList = db.purchaseOrderList;
const TblGateEntry = db.gateEntry;
const TblGateEntryList = db.gateEntryList;
const TblPaymentIn = db.paymentIn;
const TblSupplierName = db.supplierName;
const TblUom = db.uom;
const TblPaymentType = db.paymentType;
const TblInventory = db.inventory;
const TblInventoryList = db.inventoryList;
const TblStock = db.stock;
const TblItemHead = db.itemHead;
const tblEmployee = db.employees;
const TblAdmin = db.admin;

class StoreCollection {
    addPurchaseRequisition = async (req) => {
        try {
            const { purchaseRequisitionNo, supplierCode, supplierName, departmentCode, departmentName, address, city, state, pincode, purchaseRequisitionDate, deliveryDate, mobileNo, remark, approver1, approver2, approver3, approver4, purchaseRequisitionList } = req.body;
            const ADDED_BY = req.user.id;

            const data = await TblPurchaseRequisition.create({
                purchaseRequisitionNo,
                supplierCode,
                supplierName,
                departmentCode,
                departmentName,
                address,
                city,
                state,
                pincode,
                purchaseRequisitionDate,
                deliveryDate,
                mobileNo,
                remark,
                approver1,
                approver2,
                approver3,
                approver4,
                ADDED_BY,
                purchaseRequisitionList
            }).then(async (res) => {
                let purchaseRequisitionLists = [];
                purchaseRequisitionList.forEach((e) => {
                    purchaseRequisitionLists.push({
                        purchaseRequisitionId : res.id,
                        itemNo : e.itemNo,
                        itemName : e.itemName,
                        HSN : e.HSN,
                        UOM : e.UOM,
                        quantity : e.quantity,
                        price : e.price,
                        discount : e.discount,
                        GST : e.GST,
                        total : e.total
                    });
                });
                await TblPurchaseRequisitionList.bulkCreate(purchaseRequisitionLists).then(async (resp) => {
                    res.dataValues["purchaseRequisitionList"] = resp;
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

    getPurchaseRequisition = async (req) => {
        try {
            const data = await TblPurchaseRequisition.findAll({
                include : [
                    {
                        model: TblPurchaseRequisitionList,
                        as: "purchaseRequisitionLists"
                    }
                ],
                order: [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editPurchaseRequisition = async (req) => {
        try {
            const { id, purchaseRequisitionNo, supplierCode, supplierName, departmentCode, departmentName, address, city, state, pincode, purchaseRequisitionDate, deliveryDate, mobileNo, remark, approver1, approver2, approver3, approver4, isApprover1, isApprover2, isApprover3, isApprover4, purchaseRequisitionList } = req.body;

            const data = await TblPurchaseRequisition.update(
                {
                    purchaseRequisitionNo : purchaseRequisitionNo,
                    supplierCode : supplierCode,
                    supplierName : supplierName,
                    departmentCode : departmentCode,
                    departmentName : departmentName,
                    address : address,
                    city : city,
                    state : state,
                    pincode : pincode,
                    purchaseRequisitionDate : purchaseRequisitionDate,
                    deliveryDate : deliveryDate,
                    mobileNo : mobileNo,
                    remark : remark,
                    approver1 : approver1,
                    approver2 : approver2,
                    approver3 : approver3,
                    approver4 : approver4,
                    isApprover1 : isApprover1,
                    isApprover2 : isApprover2,
                    isApprover3 : isApprover3,
                    isApprover4 : isApprover4
                },
                {
                    where : {
                        id : id
                    }
                }
            );

            const updatedPurchaseRequisitionLists = await Promise.all(purchaseRequisitionList.map(async (e) => {
                const updatedPurchaseRequisitionList = await TblPurchaseRequisitionList.update(
                    {
                        itemNo : e.itemNo,
                        itemName : e.itemName,
                        HSN : e.HSN,
                        UOM : e.UOM,
                        quantity : e.quantity,
                        price : e.price,
                        discount : e.discount,
                        GST : e.GST,
                        total : e.total
                    },
                    {
                        where : {
                            id : e.id,
                            purchaseRequisitionId : id
                        }
                    }
                );
                return updatedPurchaseRequisitionList;
            }));

            const responseData = {
                purchaseRequisition: data,
                purchaseRequisitionList: updatedPurchaseRequisitionLists
            }
            return responseData;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deletePurchaseRequisition = async (req) => {
        try {
            const { id } = req.query;
            const data = TblPurchaseRequisition.destroy({
                where : {
                    id : id
                }
            }).then(async (res) => {
                await TblPurchaseRequisitionList.destroy({
                    where : {
                        purchaseRequisitionId : id
                    }
                });
                return {
                    msg: "Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    addPurchaseOrder = async (req) => {
        try {
            const { purchaseRequisitonNo, purchaseOrderNo, supplierCode, supplierName, departmentCode, departmentName, address, city, state, pincode, purchaseOrderDate, deliveryDate, mobileNo, contactPerson, contactName, remark, purchaseOrderList } = req.body;
            const ADDED_BY = req.user.id;

            const data = await TblPurchaseOrder.create({
                purchaseRequisitonNo,
                purchaseOrderNo,
                supplierCode,
                supplierName,
                departmentCode,
                departmentName,
                address,
                city,
                state,
                pincode,
                purchaseOrderDate,
                deliveryDate,
                mobileNo,
                contactPerson,
                contactName,
                remark,
                ADDED_BY,
                purchaseOrderList
            }).then(async (res) => {
                let purchaseOrderLists = [];
                purchaseOrderList.forEach((e) => {
                    purchaseOrderLists.push({
                        purchaseOrderId : res.id,
                        itemNo : e.itemNo,
                        itemName : e.itemName,
                        HSN : e.HSN,
                        UOM : e.UOM,
                        quantity : e.quantity,
                        price : e.price,
                        discount : e.discount,
                        GST : e.GST,
                        total : e.total
                    });
                });
                await TblPurchaseOrderList.bulkCreate(purchaseOrderLists).then(async (resp) => {
                    res.dataValues["purchaseOrderList"] = resp;
                });
                return {
                    data: res.dataValues
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getPurchaseOrder = async (req) => {
        try {
            const data = await TblPurchaseOrder.findAll({
                include : [
                    {
                        model: TblPurchaseOrderList,
                        as: "purchaseOrderList"
                    }
                ],
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    editPurchaseOrder = async (req) => {
        try {
            const { id, purchaseRequisitonNo, purchaseOrderNo, supplierCode, supplierName, departmentCode, departmentName, address, city, state, pincode, purchaseOrderDate, deliveryDate, mobileNo, contactPerson, contactName, remark, purchaseOrderList } = req.body;

            const data = await TblPurchaseOrder.update(
                {
                    purchaseRequisitonNo : purchaseRequisitonNo,
                    purchaseOrderNo : purchaseOrderNo,
                    supplierCode : supplierCode,
                    supplierName : supplierName,
                    departmentCode : departmentCode,
                    departmentName : departmentName,
                    address : address,
                    city : city,
                    state : state,
                    pincode : pincode,
                    purchaseOrderDate : purchaseOrderDate,
                    deliveryDate : deliveryDate,
                    mobileNo : mobileNo,
                    contactPerson : contactPerson,
                    contactName : contactName,
                    remark : remark
                },
                {
                    where : {
                        id : id
                    }
                }
            );

            const updatedPurchaseOrderLists = await Promise.all(purchaseOrderList.map(async (e) => {
                const updatedPurchaseOrderList = await TblPurchaseOrderList.update(
                    {
                        itemNo : e.itemNo,
                        itemName : e.itemName,
                        HSN : e.HSN,
                        UOM : e.UOM,
                        quantity : e.quantity,
                        price : e.price,
                        discount : e.discount,
                        GST : e.GST,
                        total : e.total
                    },
                    {
                        where : {
                            id : e.id,
                            purchaseOrderId : id
                        }
                    }
                );
                return updatedPurchaseOrderList;
            }));

            const responseData = {
                purchaseOrder: data,
                purchaseOrderList: updatedPurchaseOrderLists
            }
            return responseData;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    deletePurchaseOrder = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblPurchaseOrder.destroy({
                where : {
                    id : id
                }
            }).then(async (res) => {
                await TblPurchaseOrderList.destroy({
                    where : {
                        purchaseOrderId : id
                    }
                });
                return {
                    msg: "Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    addGateEntry = async (req) => {
        try {
            const { date, time, gateEntryNo, purchaseOrderNo, supplierCode, supplierName, gateEntryList } = req.body;
            const ADDED_BY = req.user.id;

            const data = await TblGateEntry.create({
                date,
                time,
                gateEntryNo,
                purchaseOrderNo,
                supplierCode,
                supplierName,
                ADDED_BY,
                gateEntryList
            }).then(async (res) => {
                let gateEntryLists = [];
                gateEntryList.forEach((e) => {
                    gateEntryLists.push({
                        gateEntryId : res.id,
                        itemNo : e.itemNo,
                        itemName : e.itemName,
                        departmentCode : e.departmentCode,
                        departmentName : e.departmentName,
                        UOM : e.UOM,
                        orderQuantity : e.orderQuantity,
                        acceptedQuantity : e.acceptedQuantity,
                        returnQuantity : e.returnQuantity,
                        remark : e.remark
                    });
                });
                await TblGateEntryList.bulkCreate(gateEntryLists).then(async (resp) => {
                    res.dataValues["gateEntryList"] = resp
                });
                return {
                    data: res.dataValues
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getGateEntry = async (req) => {
        try {
            const data = await TblGateEntry.findAll({
                include : [
                    {
                        model: TblGateEntryList,
                        as: "gateEntryList"
                    }
                ],
                order : [["id", "DESC"]]
            });
            for (const prices of data) {
                for (let i=0; i<prices.gateEntryList.length; i++) {
                    const price = await TblPurchaseOrderList.findOne({
                        where : {
                            itemNo : prices.gateEntryList[i].itemNo
                        },
                    });
                    if(price) {
                        prices.gateEntryList[i].setDataValue('price', price.price)
                        prices.gateEntryList[i].setDataValue('total', price.total)
                    }
                }
            }
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    editGateEntry = async (req) => {
        try {
            const { id, date, time, gateEntryNo, purchaseOrderNo, supplierCode, supplierName, gateEntryList } = req.body;

            const data = await TblGateEntry.update(
                {
                    date : date,
                    time : time,
                    gateEntryNo : gateEntryNo,
                    purchaseOrderNo : purchaseOrderNo,
                    supplierCode : supplierCode,
                    supplierName : supplierName
                },
                {
                    where : {
                        id : id
                    }
                }
            );

            const updatedGateEntryLists = await Promise.all(gateEntryList.map(async (e) => {
                const updatedGateEntryList = await TblGateEntryList.update(
                    {
                        itemNo : e.itemNo,
                        itemName : e.itemName,
                        departmentCode : e.departmentCode,
                        departmentName : e.departmentName,
                        UOM : e.UOM,
                        orderQuantity : e.orderQuantity,
                        acceptedQuantity : e.acceptedQuantity,
                        returnQuantity : e.returnQuantity,
                        remark : e.remark
                    },
                    {
                        where : {
                            id : e.id,
                            gateEntryId : id
                        }
                    }
                );
                return updatedGateEntryList;
            }));

            const responseData = {
                gateEntry: data,
                gateEntryList: updatedGateEntryLists
            }
            return responseData;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    deleteGateEntry = async (req) => {
        try {
            const { id } = req.query;

            const data = await TblGateEntry.destroy({
                where : {
                    id : id
                }
            }).then(async (res) => {
                await TblGateEntryList.destroy({
                    where : {
                        gateEntryId :  id
                    }
                });
                return {
                    msg: "Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    addPaymentIn = async (req) => {
        try {
            const { purchaseOrderNo, supplierName, supplierCode,
            departmentCode, departmentName, paymentType, paymentMode, paymentAmount, paymentDate } = req.body;
            const ADDED_BY = req.user.id;

            const data = await TblPaymentIn.create({
                purchaseOrderNo,
                supplierName,
                supplierCode,
                departmentCode,
                departmentName,
                paymentType,
                paymentMode,
                paymentAmount,
                paymentDate,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getPaymentIn = async (req) => {
        try {
            const data = await TblPaymentIn.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    editPaymentIn = async (req) => {
        try {
            const { id, purchaseOrderNo, supplierName, supplierCode,
                departmentCode, departmentName, paymentType, paymentMode, paymentAmount, paymentDate } = req.body;
                
                const data = await TblPaymentIn.update(
                    {
                        purchaseOrderNo : purchaseOrderNo,
                        supplierName : supplierName,
                        supplierCode : supplierCode,
                        departmentCode : departmentCode,
                        departmentName : departmentName,
                        paymentType : paymentType,
                        paymentMode : paymentMode,
                        paymentAmount : paymentAmount,
                        paymentDate : paymentDate
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

    deletePaymentIn = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblPaymentIn.destroy({
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

    addSupplierName = async (req) => {
        try {
            const { supplierCode, supplierName_en, supplierName_hi } = req.body;
            const data = await TblSupplierName.create({
                supplierCode,
                supplierName_en,
                supplierName_hi
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getSupplierName = async (req) => {
        try {
            const data = await TblSupplierName.findAll();
            return data;      
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editSupplierName = async (req) => {
        try {
            const { id, supplierCode, supplierName_en, supplierName_hi, status } = req.body;
            const data = await TblSupplierName.update(
                {
                    supplierCode : supplierCode,
                    supplierName_en : supplierName_en,
                    supplierName_hi : supplierName_hi,
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

    deleteSupplierName = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblSupplierName.destroy({
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

    addUom = async (req) => {
        try {
            const { UOMCode, UOM } = req.body;
            const data = await TblUom.create({
                UOMCode,
                UOM
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getUom = async (req) => {
        try {
            const data = await TblUom.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editUom = async (req) => {
        try {
            const { id, UOMCode, UOM, status } = req.body;
            const data = await TblUom.update(
                {
                    UOMCode : UOMCode,
                    UOM : UOM,
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

    deleteUom = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblUom.destroy({
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

    addPaymentType = async (req) => {
        try {
            const { paymentTypeCode, paymentTypeName } = req.body;
            const data = await TblPaymentType.create({
                paymentTypeCode,
                paymentTypeName
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getPaymentType = async (req) => {
        try {
            const data = await TblPaymentType.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editPaymentType = async (req) => {
        try {
            const { id, paymentTypeCode, paymentTypeName, status } = req.body;
            const data = await TblPaymentType.update(
                {
                    paymentTypeCode : paymentTypeCode,
                    paymentTypeName : paymentTypeName,
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

    deletePaymentType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblPaymentType.destroy({
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

    addInventory = async (req) => {
        try {
            const { Date, Time, FromDepartmentCode, FromDepartmentName, ToDepartmentCode, ToDepartmentName, SupplierCode, SupplierName, Remark, inventory_list } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblInventory.create({
                Date,
                Time,
                FromDepartmentCode,
                FromDepartmentName,
                ToDepartmentCode,
                ToDepartmentName,
                SupplierCode,
                SupplierName,
                Remark,
                ADDED_BY,
                inventory_list
            }).then(async (res) => {
                let inventoryLists = [];
                inventory_list.forEach((e)=> {
                    inventoryLists.push({
                        InventoryId : res.id,
                        MaterialCode : e.MaterialCode,
                        MaterialName : e.MaterialName,
                        UOM : e.UOM,
                        OpeningStock : e.OpeningStock,
                        AdjustStock : e.AdjustStock,
                        Quantity : e.Quantity,
                        Amount : e.Amount
                    });
                });
                await TblInventoryList.bulkCreate(inventoryLists).then(async (resp) => {
                    res.dataValues["inventoryList"] = resp;
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

    getInventory = async (req) => {
        try {
            const data = await TblInventory.findAll({
                include : [
                    {
                        model: TblInventoryList,
                        as: "inventoryLists"
                    }
                ],
                raw : true,
                nest : true
            });
            for (const username of data) {
                const employeeName = await tblEmployee.findOne({
                    where : {
                        id : username.ADDED_BY
                    }
                });

                const adminName = await TblAdmin.findOne({
                    where : {
                        id : username.ADDED_BY
                    }
                });

                if (employeeName) {
                    username.ADDED_BY = employeeName.Username
                }

                if (adminName) {
                    username.ADDED_BY = adminName.username
                }
            }
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editInventory = async (req) => {
        try {
            const { id, Date, Time, FromDepartmentCode, FromDepartmentName, ToDepartmentCode, ToDepartmentName, SupplierCode, SupplierName, Remark, inventory_list } = req.body;
            const data = await TblInventory.update(
                {
                    Date : Date,
                    Time :  Time,
                    FromDepartmentCode : FromDepartmentCode,
                    FromDepartmentName : FromDepartmentName,
                    ToDepartmentCode : ToDepartmentCode,
                    ToDepartmentName : ToDepartmentName,
                    SupplierCode : SupplierCode,
                    SupplierName : SupplierName,
                    Remark : Remark
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            const updatedInventoryLists = await Promise.all(inventory_list.map(async (e) => {
                const updatedList = await TblInventoryList.update(
                    {
                        MaterialCode : e.MaterialCode,
                        MaterialName : e.MaterialName,
                        UOM : e.UOM,
                        OpeningStock : e.OpeningStock,
                        AdjustStock : e.AdjustStock,
                        Quantity : e.Quantity,
                        Amount : e.Amount
                    },
                    {
                        where : {
                            InventoryId : id,
                            id : e.id
                        }
                    }
                );
                return updatedList;
            }));
            const responseData = {
                Inventory: data,
                InventoryLists: updatedInventoryLists
            }
            return responseData;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteInventory = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblInventory.destroy({
                where : {
                    id : id
                }
            }).then(async (res) => {
                await TblInventoryList.destroy({
                    where : {
                        InventoryId : id
                    }
                });
                return {
                    msg: "Inventory Deleted Successfully"
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addStock = async (req) => {
        try {
            const { Date, Time, DepartmentCode, DepartmentName, ItemCode, ItemName, UOM, Quantity, Remark } = req.body;
            const data = await TblStock.create({
                Date,
                Time,
                DepartmentCode,
                DepartmentName,
                ItemCode,
                ItemName,
                UOM,
                Quantity,
                Remark
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getStock = async (req) => {
        try {
            const data = await TblStock.findAll();
            return data;    
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editStock = async (req) => {
        try {
            const { id, Date, Time, DepartmentCode, DepartmentName, ItemCode, ItemName, UOM, Quantity, Remark } = req.body;
            const data = await TblStock.update(
                {
                    Date : Date,
                    Time : Time,
                    DepartmentCode : DepartmentCode,
                    DepartmentName : DepartmentName,
                    ItemCode : ItemCode,
                    ItemName : ItemName,
                    UOM : UOM,
                    Quantity : Quantity,
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
    };

    deleteStock = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblStock.destroy({
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

    addItem = async (req) => {
        try {
            const { itemCode, itemNameHindi, itemNameEnglish } = req.body;
            const data = await TblItemHead.create({
                itemCode,
                itemNameHindi,
                itemNameEnglish
            });
            return data;
        } catch (error) {
            
        }
    };

    getItem = async (req) => {
        try {
            const data = await TblItemHead.findAll();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editItem = async (req) => {
        try {
            const { id, itemCode, itemNameHindi, itemNameEnglish } = req.body;
            const data = await TblItemHead.update(
                {
                    itemCode : itemCode,
                    itemNameHindi : itemNameHindi,
                    itemNameEnglish : itemNameEnglish
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

    deleteItem = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblItemHead.destroy({
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

    getApprover = async (req) => {
        try {
            const userId = req.user.id;
            const data = await TblPurchaseRequisition.findAll({
                where : {
                    [Op.or] : [
                        { approver1 : userId },
                        { approver2 : userId },
                        { approver3 : userId },
                        { approver4 : userId },
                    ]
                },
                include : [
                    {
                        model: TblPurchaseRequisitionList,
                        as: "purchaseRequisitionLists"
                    }
                ],
                order: [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

module.exports = new StoreCollection();