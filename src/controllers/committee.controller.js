const httpStatus = require("http-status");
const { committeeService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addCommittee = catchAsync(async (req, res) => {
    const data = await committeeService.addCommittee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Committee Added Successfully",
        data: data
    });
});

const getCommittee = catchAsync(async (req, res) => {
    const data = await committeeService.getCommittee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No data found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editCommittee = catchAsync(async (req, res) => {
    const data = await committeeService.editCommittee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Committee Updated Successfully",
        data: data
    });
});

const deleteCommittee = catchAsync(async (req, res) => {
    const data = await committeeService.deleteCommittee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Committee Deleted Successfully"
    });
});

const addFamily = catchAsync(async (req, res) => {
    const data = await committeeService.addFamily(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Family Added Successfully",
        data: data
    });
});

const getFamily = catchAsync(async (req, res) => {
    const data = await committeeService.getFamily(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editFamily = catchAsync(async (req, res) => {
    const data = await committeeService.editFamily(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Family Updated Successfully",
        data: data
    });
});

const deleteFamily = catchAsync(async (req, res) => {
    const data = await committeeService.deleteFamily(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Family Deleted Successfully"
    });
});

const searchCommittee = catchAsync(async (req, res) => {
    const data = await committeeService.searchCommittee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const searchFamily = catchAsync(async (req, res) => {
    const data = await committeeService.searchFamily(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found")
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getCommitteeByNum = catchAsync(async (req, res) => {
    const data = await committeeService.getCommitteeByNum(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

module.exports = {
    addCommittee,
    getCommittee,
    editCommittee,
    deleteCommittee,
    addFamily,
    getFamily,
    editFamily,
    deleteFamily,
    searchCommittee,
    searchFamily,
    getCommitteeByNum
}