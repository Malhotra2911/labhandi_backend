const httpStatus = require("http-status");
const { expenseService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addExpenseGroup = catchAsync(async (req, res) => {
    const data = await expenseService.addExpenseGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Expense Group Added Successfully",
        data: data
    });
});

const getExpenseGroup = catchAsync(async (req, res) => {
    const data = await expenseService.getExpenseGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editExpenseGroup = catchAsync(async (req, res) => {
    const data = await expenseService.editExpenseGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteExpenseGroup = catchAsync(async (req, res) => {
    const data = await expenseService.deleteExpenseGroup(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
    });
});

const addExpenseLedger = catchAsync(async (req, res) => {
    let count = await expenseService.getExpenseLedgerCount();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const yearRange = `${currentYear}-${String(nextYear).substring(2)}`;
    const LedgerNo = `EXPENSE/${yearRange}/000${count + 1}`;
    const data = await expenseService.addExpenseLedger(req, LedgerNo);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Expense Ledger Added Successfully",
        data: data
    });
});

const getExpenseLedger = catchAsync(async (req, res) => {
    const data = await expenseService.getExpenseLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editExpenseLedger = catchAsync(async (req, res) => {
    const data = await expenseService.editExpenseLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteExpenseLedger = catchAsync(async (req, res) => {
    const data = await expenseService.deleteExpenseLedger(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully",
        data: data
    });
});

const addExpenseVoucher = catchAsync(async (req, res) => {
    const data = await expenseService.addExpenseVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfully",
        data: data
    });
});

const getExpenseVoucher = catchAsync(async (req, res) => {
    const data = await expenseService.getExpenseVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editExpenseVoucher = catchAsync(async (req, res) => {
    const data = await expenseService.editExpenseVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteExpenseVoucher = catchAsync(async (req, res) => {
    const data = await expenseService.deleteExpenseVoucher(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully"
    });
});

const addInvoiceUpload = catchAsync(async (req, res) => {
    const data = await expenseService.addInvoiceUpload(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Added Successfully",
        data: data
    });
});

const getInvoiceUpload = catchAsync(async (req, res) => {
    const data = await expenseService.getInvoiceUpload(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editInvoiceUpload = catchAsync(async (req, res) => {
    const data = await expenseService.editInvoiceUpload(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteInvoiceUpload = catchAsync(async (req, res) => {
    const data = await expenseService.deleteInvoiceUpload(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully"
    });
});

const getTally = catchAsync(async (req, res) => {
    const data = await expenseService.getTally(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

module.exports = {
    addExpenseGroup,
    getExpenseGroup,
    editExpenseGroup,
    deleteExpenseGroup,
    addExpenseLedger,
    getExpenseLedger,
    editExpenseLedger,
    deleteExpenseLedger,
    addExpenseVoucher,
    getExpenseVoucher,
    editExpenseVoucher,
    deleteExpenseVoucher,
    addInvoiceUpload,
    getInvoiceUpload,
    editInvoiceUpload,
    deleteInvoiceUpload,
    getTally
}