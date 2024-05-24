const httpStatus = require("http-status");
const { bhojnalayService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addBhojnalay = catchAsync(async (req, res) => {
    let count = await bhojnalayService.getReceiptNoCount();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const yearRange = `${currentYear}-${String(nextYear).substring(2)}`;
    const ReceiptNo = `BHOJNALAY/${yearRange}/000${count + 1}`;
    const data = await bhojnalayService.addBhojnalay(req, ReceiptNo);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfully",
        data: data
    });
});

const getBhojnalay = catchAsync(async (req, res) => {
    const data = await bhojnalayService.getBhojnalay(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editBhojnalay = catchAsync(async (req, res) => {
    const data = await bhojnalayService.editBhojnalay(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteBhojnalay = catchAsync(async (req, res) => {
    const data = await bhojnalayService.deleteBhojnalay(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully"
    });
});

const saveBhojnalayPayment = catchAsync(async (req, res) => {
    const data = await bhojnalayService.saveBhojnalayPayment(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: data.status,
        msg: data.message,
        data: data,
    });
});

const getFutureOrder = catchAsync(async (req, res) => {
    const data = await bhojnalayService.getFutureOrder(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getCurrentOrder = catchAsync(async (req, res) => {
    const data = await bhojnalayService.getCurrentOrder(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getBhojnalayHistory = catchAsync(async (req, res) => {
    const data = await bhojnalayService.getBhojnalayHistory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getBhojnalayByBookingId = catchAsync(async (req, res) => {
    const data = await bhojnalayService.getBhojnalayByBookingId(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const bhojnalayReceipt = catchAsync(async (req, res) => {
    const data = await bhojnalayService.bhojnalayReceipt(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

module.exports = {
    addBhojnalay,
    getBhojnalay,
    editBhojnalay,
    deleteBhojnalay,
    saveBhojnalayPayment,
    getFutureOrder,
    getCurrentOrder,
    getBhojnalayHistory,
    getBhojnalayByBookingId,
    bhojnalayReceipt
}