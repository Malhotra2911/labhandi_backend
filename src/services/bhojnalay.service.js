const { BhojnalayCollection } = require("../collections");

const addBhojnalayHead = async (req) => {
    const data = await BhojnalayCollection.addBhojnalayHead(req);
    return data;
}

const getBhojnalayHead = async (req) => {
    const data = await BhojnalayCollection.getBhojnalayHead(req);
    return data;
}

const editBhojnalayHead = async (req) => {
    const data = await BhojnalayCollection.editBhojnalayHead(req);
    return data;
}

const deleteBhojnalayHead = async (req) => {
    const data = await BhojnalayCollection.deleteBhojnalayHead(req);
    return data;
}

const addBhojnalay = async (req, ReceiptNo) => {
    const data = await BhojnalayCollection.addBhojnalay(req, ReceiptNo);
    return data;
}

const getBhojnalay = async (req) => {
    const data = await BhojnalayCollection.getBhojnalay(req);
    return data;
}

const editBhojnalay = async (req) => {
    const data = await BhojnalayCollection.editBhojnalay(req);
    return data;
}

const deleteBhojnalay = async (req) => {
    const data = await BhojnalayCollection.deleteBhojnalay(req);
    return data;
}

const getReceiptNoCount = async (req) => {
    const data = await BhojnalayCollection.getReceiptNoCount(req);
    return data;
}

const saveBhojnalayPayment = async (req) => {
    const data = await BhojnalayCollection.saveBhojnalayPayment(req);
    try {
      return data;
    } catch (error) {
      return null;
    }
};

const getFutureOrder = async (req) => {
    const data = await BhojnalayCollection.getFutureOrder(req);
    return data;
}

const getCurrentOrder = async (req) => {
    const data = await BhojnalayCollection.getCurrentOrder(req);
    return data;
}

const getBhojnalayHistory = async (req) => {
    const data = await BhojnalayCollection.getBhojnalayHistory(req);
    return data;
}

const getBhojnalayByBookingId = async (req) => {
    const data = await BhojnalayCollection.getBhojnalayByBookingId(req);
    return data;
}

const bhojnalayReceipt = async (req) => {
    const data = await BhojnalayCollection.bhojnalayReceipt(req);
    return data;
}

module.exports = {
    addBhojnalayHead,
    getBhojnalayHead,
    editBhojnalayHead,
    deleteBhojnalayHead,
    addBhojnalay,
    getBhojnalay,
    editBhojnalay,
    deleteBhojnalay,
    getReceiptNoCount,
    saveBhojnalayPayment,
    getFutureOrder,
    getCurrentOrder,
    getBhojnalayHistory,
    getBhojnalayByBookingId,
    bhojnalayReceipt
}