const { StoreCollection } = require("../collections");

const addPurchaseRequisition = async (req) => {
    const data = await StoreCollection.addPurchaseRequisition(req);
    return data;
}

const getPurchaseRequisition = async (req) => {
    const data = await StoreCollection.getPurchaseRequisition(req);
    return data;
}

const editPurchaseRequisition = async (req) => {
    const data = await StoreCollection.editPurchaseRequisition(req);
    return data;
}

const deletePurchaseRequisition = async(req) => {
    const data = await StoreCollection.deletePurchaseRequisition(req);
    return data;
}

const addPurchaseOrder = async (req) => {
    const data = await StoreCollection.addPurchaseOrder(req);
    return data;
}

const getPurchaseOrder = async (req) => {
    const data = await StoreCollection.getPurchaseOrder(req);
    return data;
}

const editPurchaseOrder = async (req) => {
    const data = await StoreCollection.editPurchaseOrder(req);
    return data;
}

const deletePurchaseOrder = async(req) => {
    const data = await StoreCollection.deletePurchaseOrder(req);
    return data;
}

const addGateEntry = async (req) => {
    const data = await StoreCollection.addGateEntry(req);
    return data;
}

const getGateEntry = async (req) => {
    const data = await StoreCollection.getGateEntry(req);
    return data;
}

const editGateEntry = async (req) => {
    const data = await StoreCollection.editGateEntry(req);
    return data;
}

const deleteGateEntry = async(req) => {
    const data = await StoreCollection.deleteGateEntry(req);
    return data;
}

const addPaymentIn = async (req) => {
    const data = await StoreCollection.addPaymentIn(req);
    return data;
}

const getPaymentIn = async (req) => {
    const data = await StoreCollection.getPaymentIn(req);
    return data;
}

const editPaymentIn = async (req) => {
    const data = await StoreCollection.editPaymentIn(req);
    return data;
}

const deletePaymentIn = async(req) => {
    const data = await StoreCollection.deletePaymentIn(req);
    return data;
}

const addSupplierName = async(req) => {
    const data = await StoreCollection.addSupplierName(req);
    return data;
}

const getSupplierName = async(req) => {
    const data = await StoreCollection.getSupplierName(req);
    return data;
}

const editSupplierName = async(req) => {
    const data = await StoreCollection.editSupplierName(req);
    return data;
}

const deleteSupplierName = async(req) => {
    const data = await StoreCollection.deleteSupplierName(req);
    return data;
}

const addUom = async (req) => {
    const data = await StoreCollection.addUom(req);
    return data;
}

const getUom = async (req) => {
    const data = await StoreCollection.getUom(req);
    return data;
}

const editUom = async (req) => {
    const data = await StoreCollection.editUom(req);
    return data;
}

const deleteUom = async (req) => {
    const data = await StoreCollection.deleteUom(req);
    return data;
}

const addPaymentType = async (req) => {
    const data = await StoreCollection.addPaymentType(req);
    return data;
}

const getPaymentType = async (req) => {
    const data = await StoreCollection.getPaymentType(req);
    return data;
}

const editPaymentType = async (req) => {
    const data = await StoreCollection.editPaymentType(req);
    return data;
}

const deletePaymentType = async (req) => {
    const data = await StoreCollection.deletePaymentType(req);
    return data;
}

const addInventory = async (req) => {
    const data = await StoreCollection.addInventory(req);
    return data;
}

const getInventory = async (req) => {
    const data = await StoreCollection.getInventory(req);
    return data;
}

const editInventory = async (req) => {
    const data = await StoreCollection.editInventory(req);
    return data;
}

const deleteInventory = async (req) => {
    const data = await StoreCollection.deleteInventory(req);
    return data;
}

const addStock = async (req) => {
    const data = await StoreCollection.addStock(req);
    return data;
}

const getStock = async (req) => {
    const data = await StoreCollection.getStock(req);
    return data;
}

const editStock = async (req) => {
    const data = await StoreCollection.editStock(req);
    return data;
}

const deleteStock = async (req) => {
    const data = await StoreCollection.deleteStock(req);
    return data;
}

const addItem = async (req) => {
    const data = await StoreCollection.addItem(req);
    return data;
}

const getItem = async (req) => {
    const data = await StoreCollection.getItem(req);
    return data;
}

const editItem = async (req) => {
    const data = await StoreCollection.editItem(req);
    return data;
}

const deleteItem = async (req) => {
    const data = await StoreCollection.deleteItem(req);
    return data;
}

const getApprover = async (req) => {
    const data = await StoreCollection.getApprover(req);
    return data;
}

module.exports = {
    addPurchaseRequisition,
    getPurchaseRequisition,
    editPurchaseRequisition,
    deletePurchaseRequisition,
    addPurchaseOrder,
    getPurchaseOrder,
    editPurchaseOrder,
    deletePurchaseOrder,
    addGateEntry,
    getGateEntry,
    editGateEntry,
    deleteGateEntry,
    addPaymentIn,
    getPaymentIn,
    editPaymentIn,
    deletePaymentIn,
    addSupplierName,
    getSupplierName,
    editSupplierName,
    deleteSupplierName,
    addUom,
    getUom,
    editUom,
    deleteUom,
    addPaymentType,
    getPaymentType,
    editPaymentType,
    deletePaymentType,
    addInventory,
    getInventory,
    editInventory,
    deleteInventory,
    addStock,
    getStock,
    editStock,
    deleteStock,
    addItem,
    getItem,
    editItem,
    deleteItem,
    getApprover
}