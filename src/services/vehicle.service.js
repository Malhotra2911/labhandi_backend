const { VehicleCollection } = require('../collections');

const addVehicleType = async (req) => {
    const data = await VehicleCollection.addVehicleType(req);
    return data;
}

const getVehicleType = async (req) => {
    const data = await VehicleCollection.getVehicleType(req);
    return data;
}

const editVehicleType = async (req) => {
    const data = await VehicleCollection.editVehicleType(req);
    return data;
}

const deleteVehicleType = async (req) => {
    const data = await VehicleCollection.deleteVehicleType(req);
    return data;
}

const addVehicle = async (req) => {
    const data = await VehicleCollection.addVehicle(req);
    return data;
}

const getVehicle = async (req) => {
    const data = await VehicleCollection.getVehicle(req);
    return data;
}

const editVehicle = async (req) => {
    const data = await VehicleCollection.editVehicle(req);
    return data;
}

const deleteVehicle = async (req) => {
    const data = await VehicleCollection.deleteVehicle(req);
    return data;
}
const addMaterial = async (req) => {
    const data = await VehicleCollection.addMaterial(req);
    return data;
}

const getMaterial = async (req) => {
    const data = await VehicleCollection.getMaterial(req);
    return data;
}

const editMaterial = async (req) => {
    const data = await VehicleCollection.editMaterial(req);
    return data;
}

const deleteMaterial = async (req) => {
    const data = await VehicleCollection.deleteMaterial(req);
    return data;
}

const gateout = async (req) => {
    const data = await VehicleCollection.gateout(req);
    return data;
}

const vehicleHistory = async (req) => {
    const data = await VehicleCollection.vehicleHistory(req);
    return data;
}

const gateoutHistory = async (req) => {
    const data = await VehicleCollection.gateoutHistory(req);
    return data;
}

const searchVehicle = async (req) => {
    const data = await VehicleCollection.searchVehicle(req);
    return data;
}

const searchVehicleHistory = async (req) => {
    const data = await VehicleCollection.searchVehicleHistory(req);
    return data;
}

const searchGateoutHistory = async (req) => {
    const data = await VehicleCollection.searchGateoutHistory(req);
    return data;
}

module.exports = {
    addVehicleType,
    getVehicleType,
    editVehicleType,
    deleteVehicleType,
    addVehicle,
    getVehicle,
    editVehicle,
    deleteVehicle,
    addMaterial,
    getMaterial,
    editMaterial,
    deleteMaterial,
    gateout,
    vehicleHistory,
    gateoutHistory,
    searchVehicle,
    searchVehicleHistory,
    searchGateoutHistory
}