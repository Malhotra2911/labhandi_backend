const { TrustCollection } = require("../collections");

const addTrust = async (req) => {
    const data = await TrustCollection.addTrust(req);
    return data;
}

const getTrust = async (req) => {
    const data = await TrustCollection.getTrust(req);
    return data;
}

const editTrust = async (req) => {
    const data = await TrustCollection.editTrust(req);
    return data;
}

const deleteTrust = async (req) => {
    const data = await TrustCollection.deleteTrust(req);
    return data;
}

const addTrustType = async (req) => {
    const data = await TrustCollection.addTrustType(req);
    return data;
}

const getTrustType = async (req) => {
    const data = await TrustCollection.getTrustType(req);
    return data;
}

const editTrustType = async (req) => {
    const data = await TrustCollection.editTrustType(req);
    return data;
}

const deleteTrustType = async (req) => {
    const data = await TrustCollection.deleteTrustType(req);
    return data;
}

module.exports = {
    addTrust,
    getTrust,
    editTrust,
    deleteTrust,
    addTrustType,
    getTrustType,
    editTrustType,
    deleteTrustType
}