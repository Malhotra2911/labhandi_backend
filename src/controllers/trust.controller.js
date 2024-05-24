const httpStatus = require("http-status");
const { trustService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addTrust = catchAsync(async (req, res) => {
    const data = await trustService.addTrust(req);
    
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Trust Added Successfully",
        data: data
    });
});

const getTrust = catchAsync(async (req, res) => {
    const data = await trustService.getTrust(req);

    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editTrust = catchAsync(async (req, res) => {
    const data = await trustService.editTrust(req);

    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Trust Updated Successfully",
        data: data
    });
});

const deleteTrust = catchAsync(async (req, res) => {
    const data = await trustService.deleteTrust(req);

    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Trust Deleted Successfully",
        data: data
    });
});

module.exports = {
    addTrust,
    getTrust,
    editTrust,
    deleteTrust
}