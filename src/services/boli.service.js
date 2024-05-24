const { BoliCollection } = require("../collections");

const addBoliHead = async (req) => {
    const data = await BoliCollection.addBoliHead(req);
    return data;
};

const getBoliHead = async (req) => {
    const data = await BoliCollection.getBoliHead(req);
    return data;
}

const editBoliHead = async (req) => {
    const data = await BoliCollection.editBoliHead(req);
    return data;
}

const deleteBoliHead = async (req) => {
    const data = await BoliCollection.deleteBoliHead(req);
    return data;
}

const addBoliUnit = async (req) => {
    const data = await BoliCollection.addBoliUnit(req);
    return data;
};

const getBoliUnit = async (req) => {
    const data = await BoliCollection.getBoliUnit(req);
    return data;
}

const editBoliUnit = async (req) => {
    const data = await BoliCollection.editBoliUnit(req);
    return data;
}

const deleteBoliUnit = async (req) => {
    const data = await BoliCollection.deleteBoliUnit(req);
    return data;
}

const addBoli = async (req, Boli_id) => {
    const data = await BoliCollection.addBoli(req, Boli_id);
    return data
}

const getBoli = async (req) => {
    const data = await BoliCollection.getBoli(req);
    return data
}

const editBoli = async (req) => {
    const data = await BoliCollection.editBoli(req);
    return data
}

const deleteBoli = async (req) => {
    const data = await BoliCollection.deleteBoli(req);
    return data
}

const getBoliCount = async (req) => {
    const data = await BoliCollection.getBoliCount(req);
    return data
}

const getReceiptNo = async (req) => {
    const data = await BoliCollection.getReceiptNo(req);
    return data
}

const addPayment = async (req) => {
    const data = await BoliCollection.addPayment(req);
    return data;
}

const getPayment = async (req) => {
    const data = await BoliCollection.getPayment(req);
    return data;
}

const editPayment = async (req) => {
    const data = await BoliCollection.editPayment(req);
    return data;
}

const deletePayment = async (req) => {
    const data = await BoliCollection.deletePayment(req);
    return data;
}

const getPendingBoli = async (req) => {
    const data = await BoliCollection.getPendingBoli(req);
    return data;
}

const getPaidBoli = async (req) => {
    const data = await BoliCollection.getPaidBoli(req);
    return data;
}

const searchBoliByDate = async (req) => {
    const data = await BoliCollection.searchBoliByDate(req);
    return data;
}

const searchBoli = async (req) => {
    const data = await BoliCollection.searchBoli(req);
    return data;
}

const getBoliByNum = async (req) => {
    const data = await BoliCollection.getBoliByNum(req);
    return data
}

const addPrintBoli = async (req) => {
    const data = await BoliCollection.addPrintBoli(req);
    return data;
};

const getPrintBoli = async (req) => {
    const data = await BoliCollection.getPrintBoli(req);
    return data;
}

const addBoliGroup = async (req) => {
    const data = await BoliCollection.addBoliGroup(req);
    return data;
}

const getBoliGroup = async (req) => {
    const data = await BoliCollection.getBoliGroup(req);
    return data;
}

const editBoliGroup = async (req) => {
    const data = await BoliCollection.editBoliGroup(req);
    return data;
}

const deleteBoliGroup = async (req) => {
    const data = await BoliCollection.deleteBoliGroup(req);
    return data;
}

const addBoliLedger = async (req, LedgerNo) => {
    const data = await BoliCollection.addBoliLedger(req, LedgerNo);
    return data;
}

const getBoliLedger = async (req) => {
    const data = await BoliCollection.getBoliLedger(req);
    return data;
}

const editBoliLedger = async (req) => {
    const data = await BoliCollection.editBoliLedger(req);
    return data;
}

const deleteBoliLedger = async (req) => {
    const data = await BoliCollection.deleteBoliLedger(req);
    return data;
}

const addBoliVoucher = async (req, Boli_id) => {
    const data = await BoliCollection.addBoliVoucher(req, Boli_id);
    return data;
}

const getBoliVoucher = async (req) => {
    const data = await BoliCollection.getBoliVoucher(req);
    return data;
}

const editBoliVoucher = async (req) => {
    const data = await BoliCollection.editBoliVoucher(req);
    return data;
}

const deleteBoliVoucher = async (req) => {
    const data = await BoliCollection.deleteBoliVoucher(req);
    return data;
}

const getBoliVoucherCount = async (req) => {
    const data = await BoliCollection.getBoliVoucherCount(req);
    return data
}

const searchBoliGroup = async (req) => {
    const data = await BoliCollection.searchBoliGroup(req);
    return data;
}

const searchBoliLedger = async (req) => {
    const data = await BoliCollection.searchBoliLedger(req);
    return data;
}

const searchBoliVoucher = async (req) => {
    const data = await BoliCollection.searchBoliVoucher(req);
    return data;
}

const getBoliLedgerCount = async (req) => {
    const data = await BoliCollection.getBoliLedgerCount(req);
    return data;
}

const getTally = async (req) => {
    const data = await BoliCollection.getTally(req);
    return data;
}

const getBoliLedgerByNum = async (req) => {
    const data = await BoliCollection.getBoliLedgerByNum(req);
    return data;
}

const getBoliStatus = async (req) => {
    const data = await BoliCollection.getBoliStatus(req);
    return data;
}

const getHighestBoliByAmount = async (req) => {
    const data = await BoliCollection.getHighestBoliByAmount(req);
    return data;
}

const getHighestBoliByCity = async (req) => {
    const data = await BoliCollection.getHighestBoliByCity(req);
    return data;
}

const getHighestBoliByState = async (req) => {
    const data = await BoliCollection.getHighestBoliByState(req);
    return data;
}

module.exports = {
    addBoliHead,
    getBoliHead,
    editBoliHead,
    deleteBoliHead,
    addBoliUnit,
    getBoliUnit,
    editBoliUnit,
    deleteBoliUnit,
    addBoli,
    getBoli,
    editBoli,
    deleteBoli,
    getBoliCount,
    getReceiptNo,
    addPayment,
    getPayment,
    editPayment,
    deletePayment,
    getPendingBoli,
    getPaidBoli,
    searchBoliByDate,
    searchBoli,
    getBoliByNum,
    addPrintBoli,
    getPrintBoli,
    addBoliGroup,
    getBoliGroup,
    editBoliGroup,
    deleteBoliGroup,
    addBoliLedger,
    getBoliLedger,
    editBoliLedger,
    deleteBoliLedger,
    addBoliVoucher,
    getBoliVoucher,
    editBoliVoucher,
    deleteBoliVoucher,
    getBoliVoucherCount,
    searchBoliGroup,
    searchBoliLedger,
    searchBoliVoucher,
    getBoliLedgerCount,
    getTally,
    getBoliLedgerByNum,
    getBoliStatus,
    getHighestBoliByAmount,
    getHighestBoliByCity,
    getHighestBoliByState
}