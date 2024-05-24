const httpStatus = require("http-status");
const { boliService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addBoli = catchAsync(async (req, res) => {
    let count = await boliService.getBoliCount();
    let receiptNo = await boliService.getReceiptNo();
    const parts = String(receiptNo.receipt).split('/');
    const extractedParts = parts.slice(0, 2).join('/');
    const Boli_id = `${extractedParts}/000${count + 1}`;
    const data = await boliService.addBoli(req, Boli_id);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Added Successfully",
        data: data
    });
});

const getBoli = catchAsync(async (req, res) => {
    const data = await boliService.getBoli(req);
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editBoli = catchAsync(async (req, res) => {
    const data = await boliService.editBoli(req);
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update Boli");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Updated Successfully",
        data : data
    });
});

const deleteBoli = catchAsync(async (req, res) => {
    const data = await boliService.deleteBoli(req);
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete Boli");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Deleted Successfully",
    });
});

const addPayment = catchAsync(async (req, res) => {
    const data = await boliService.addPayment(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Payment Added Successfully",
        data: data
    });
});

const getPayment = catchAsync(async (req, res) => {
    const data = await boliService.getPayment(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editPayment = catchAsync(async (req, res) => {
    const data = await boliService.editPayment(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update Payment");
    }
    res.status(200).send({
        status: true,
        msg: "Payment Updated Successfully",
        data: data
    });
});

const deletePayment = catchAsync(async (req, res) => {
    const data = await boliService.deletePayment(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Failed to Delete Payment");
    }
    res.status(200).send({
        status: true,
        msg: "Payment Deleted Successfully",
    });
});

const getPendingBoli = catchAsync(async (req, res) => {
    const data = await boliService.getPendingBoli(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getPaidBoli = catchAsync(async (req, res) => {
    const data = await boliService.getPaidBoli(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const searchBoliByDate = catchAsync(async (req, res) => {
    const data = await boliService.searchBoliByDate(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const searchBoli = catchAsync(async (req, res) => {
    const data = await boliService.searchBoli(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getBoliByNum = catchAsync(async (req, res) => {
    const data = await boliService.getBoliByNum(req);
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const addPrintBoli = catchAsync(async (req, res) => {
    const data = await boliService.addPrintBoli(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfully",
        data: data
    });
});

const getPrintBoli = catchAsync(async (req, res) => {
    const data = await boliService.getPrintBoli(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    })
});

const addBoliGroup = catchAsync(async (req, res) => {
    const data = await boliService.addBoliGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Group Added Successfully",
        data: data
    });
});

const getBoliGroup = catchAsync(async (req, res) => {
    const data = await boliService.getBoliGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editBoliGroup = catchAsync(async (req, res) => {
    const data = await boliService.editBoliGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Group Updated Successfully",
        data: data
    });
});

const deleteBoliGroup = catchAsync(async (req, res) => {
    const data = await boliService.deleteBoliGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Group Deleted Successfully",
    });
});

const addBoliLedger = catchAsync(async (req, res) => {
    let count = await boliService.getBoliLedgerCount();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const yearRange = `${currentYear}-${String(nextYear).substring(2)}`;
    const LedgerNo = `LEDGER/${yearRange}/000${count + 1}`;
    const data = await boliService.addBoliLedger(req, LedgerNo);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Ledger Added Successfully",
        data: data
    });
});

const getBoliLedger = catchAsync(async (req, res) => {
    const data = await boliService.getBoliLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editBoliLedger = catchAsync(async (req, res) => {
    const data = await boliService.editBoliLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Ledger Updated Successfully",
        data: data
    });
});

const deleteBoliLedger = catchAsync(async (req, res) => {
    const data = await boliService.deleteBoliLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Ledger Deleted Successfully",
    });
});

const addBoliVoucher = catchAsync(async (req, res) => {
    let count = await boliService.getBoliVoucherCount();
    let receiptNo = await boliService.getReceiptNo();
    const parts = String(receiptNo.receipt).split('/');
    const extractedParts = parts.slice(0, 2).join('/');
    const Boli_id = `${extractedParts}/000${count + 1}`;
    const data = await boliService.addBoliVoucher(req, Boli_id);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Voucher Added Successfully",
        data: data
    });
});

const getBoliVoucher = catchAsync(async (req, res) => {
    const data = await boliService.getBoliVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editBoliVoucher = catchAsync(async (req, res) => {
    const data = await boliService.editBoliVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Voucher Updated Successfully",
        data: data
    });
});

const deleteBoliVoucher = catchAsync(async (req, res) => {
    const data = await boliService.deleteBoliVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Boli Voucher Deleted Successfully",
    });
});

const searchBoliGroup = catchAsync(async (req, res) => {
    const data = await boliService.searchBoliGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const searchBoliLedger = catchAsync(async (req, res) => {
    const data = await boliService.searchBoliLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const searchBoliVoucher = catchAsync(async (req, res) => {
    const data = await boliService.searchBoliVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getTally = catchAsync(async (req, res) => {
    const data = await boliService.getTally(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getBoliLedgerByNum = catchAsync(async (req, res) => {
    const data = await boliService.getBoliLedgerByNum(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getBoliStatus = catchAsync(async (req, res) => {
    const data = await boliService.getBoliStatus(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getHighestBoliByAmount = catchAsync(async (req, res) => {
    const data = await boliService.getHighestBoliByAmount(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getHighestBoliByCity = catchAsync(async (req, res) => {
    const data = await boliService.getHighestBoliByCity(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const getHighestBoliByState = catchAsync(async (req, res) => {
    const data = await boliService.getHighestBoliByState(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

module.exports = {
    addBoli,
    getBoli,
    editBoli,
    deleteBoli,
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
    searchBoliGroup,
    searchBoliLedger,
    searchBoliVoucher,
    getTally,
    getBoliLedgerByNum,
    getBoliStatus,
    getHighestBoliByAmount,
    getHighestBoliByCity,
    getHighestBoliByState
}