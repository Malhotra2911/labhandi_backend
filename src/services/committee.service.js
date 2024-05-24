const { CommitteeCollection } = require("../collections");

const addSadsyaType = async (req) => {
    const data = await CommitteeCollection.addSadsyaType(req);
    return data;
}

const getSadsyaType = async (req) => {
    const data = await CommitteeCollection.getSadsyaType(req);
    return data;
}

const editSadsyaType = async (req) => {
    const data = await CommitteeCollection.editSadsyaType(req);
    return data;
}

const deleteSadsyaType = async (req) => {
    const data = await CommitteeCollection.deleteSadsyaType(req);
    return data;
}

const addRelationshipType = async (req) => {
    const data = await CommitteeCollection.addRelationshipType(req);
    return data;
}

const getRelationshipType = async (req) => {
    const data = await CommitteeCollection.getRelationshipType(req);
    return data;
}

const editRelationshipType = async (req) => {
    const data = await CommitteeCollection.editRelationshipType(req);
    return data;
}

const deleteRelationshipType = async (req) => {
    const data = await CommitteeCollection.deleteRelationshipType(req);
    return data;
}

const addCommittee = async (req) => {
    const data = await CommitteeCollection.addCommittee(req);
    return data;
}

const getCommittee = async (req) => {
    const data = await CommitteeCollection.getCommittee(req);
    return data;
}

const editCommittee = async (req) => {
    const data = await CommitteeCollection.editCommittee(req);
    return data;
}

const deleteCommittee = async (req) => {
    const data = await CommitteeCollection.deleteCommittee(req);
    return data;
}

const addOccasionType = async (req) => {
    const data = await CommitteeCollection.addOccasionType(req);
    return data;
}

const getOccasionType = async (req) => {
    const data = await CommitteeCollection.getOccasionType(req);
    return data;
}

const editOccasionType = async (req) => {
    const data = await CommitteeCollection.editOccasionType(req);
    return data;
}

const deleteOccasionType = async (req) => {
    const data = await CommitteeCollection.deleteOccasionType(req);
    return data;
}

const addFamily = async (req) => {
    const data = await CommitteeCollection.addFamily(req);
    return data;
}

const getFamily = async (req) => {
    const data = await CommitteeCollection.getFamily(req);
    return data;
}

const editFamily = async (req) => {
    const data = await CommitteeCollection.editFamily(req);
    return data;
}

const deleteFamily = async (req) => {
    const data = await CommitteeCollection.deleteFamily(req);
    return data;
}

const customWhatsapp = async (req) => {
    const data = await CommitteeCollection.customWhatsapp(req);
    return data;
}

const searchCommittee = async (req) => {
    const data = await CommitteeCollection.searchCommittee(req);
    return data;
}

const searchFamily = async (req) => {
    const data = await CommitteeCollection.searchFamily(req);
    return data;
}

const multipleSmsWhatsapp = async (req) => {
    const data = await CommitteeCollection.multipleSmsWhatsapp(req);
    return data;
}

const getCommitteeByNum = async (req) => {
    const data = await CommitteeCollection.getCommitteeByNum(req);
    return data;
}

module.exports = {
    addSadsyaType,
    getSadsyaType,
    editSadsyaType,
    deleteSadsyaType,
    addRelationshipType,
    getRelationshipType,
    editRelationshipType,
    deleteRelationshipType,
    addCommittee,
    getCommittee,
    editCommittee,
    deleteCommittee,
    addOccasionType,
    getOccasionType,
    editOccasionType,
    deleteOccasionType,
    addFamily,
    getFamily,
    editFamily,
    deleteFamily,
    customWhatsapp,
    searchCommittee,
    searchFamily,
    multipleSmsWhatsapp,
    getCommitteeByNum
}