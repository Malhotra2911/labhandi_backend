const httpStatus = require("http-status");
const { storeService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addPurchaseRequisition = catchAsync(async (req, res) => {
    const data = await storeService.addPurchaseRequisition(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfuly",
        data: data
    });
});

const getPurchaseRequisition = catchAsync(async (req, res) => {
    const data = await storeService.getPurchaseRequisition(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editPurchaseRequisition = catchAsync(async (req, res) => {
    const data = await storeService.editPurchaseRequisition(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deletePurchaseRequisition = catchAsync(async (req, res) => {
    const data = await storeService.deletePurchaseRequisition(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
    });
});

const addPurchaseOrder = catchAsync(async (req, res) => {
    const data = await storeService.addPurchaseOrder(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfuly",
        data: data
    });
});

const getPurchaseOrder = catchAsync(async (req, res) => {
    const data = await storeService.getPurchaseOrder(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editPurchaseOrder = catchAsync(async (req, res) => {
    const data = await storeService.editPurchaseOrder(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deletePurchaseOrder = catchAsync(async (req, res) => {
    const data = await storeService.deletePurchaseOrder(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
    });
});

const addGateEntry = catchAsync(async (req, res) => {
    const data = await storeService.addGateEntry(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfuly",
        data: data
    });
});

const getGateEntry = catchAsync(async (req, res) => {
    const data = await storeService.getGateEntry(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editGateEntry = catchAsync(async (req, res) => {
    const data = await storeService.editGateEntry(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteGateEntry = catchAsync(async (req, res) => {
    const data = await storeService.deleteGateEntry(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
    });
});

const addPaymentIn = catchAsync(async (req, res) => {
    const data = await storeService.addPaymentIn(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfuly",
        data: data
    });
});

const getPaymentIn = catchAsync(async (req, res) => {
    const data = await storeService.getPaymentIn(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editPaymentIn = catchAsync(async (req, res) => {
    const data = await storeService.editPaymentIn(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deletePaymentIn = catchAsync(async (req, res) => {
    const data = await storeService.deletePaymentIn(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
    });
});

const addInventory = catchAsync(async (req, res) => {
    const data = await storeService.addInventory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfully",
        data: data
    });
});

const getInventory = catchAsync(async (req, res) => {
    const data = await storeService.getInventory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data : data
    });
});

const editInventory = catchAsync(async (req, res) => {
    const data = await storeService.editInventory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteInventory = catchAsync(async (req, res) => {
    const data = await storeService.deleteInventory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully"
    });
});

const addStock = catchAsync(async (req, res) => {
    const data = await storeService.addStock(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfully",
        data: data
    });
});

const getStock = catchAsync(async (req, res) => {
    const data = await storeService.getStock(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editStock = catchAsync(async (req, res) => {
    const data = await storeService.editStock(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteStock = catchAsync(async (req, res) => {
    const data = await storeService.deleteStock(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
        data: data
    });
});

const getApprover = catchAsync(async (req, res) => {
    const data = await storeService.getApprover(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

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
    addInventory,
    getInventory,
    editInventory,
    deleteInventory,
    addStock,
    getStock,
    editStock,
    deleteStock,
    getApprover
}