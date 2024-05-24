const { ExpenseCollection } = require("../collections");

const addExpenseGroup = async (req) => {
    const data = await ExpenseCollection.addExpenseGroup(req);
    return data;
}

const getExpenseGroup = async (req) => {
    const data = await ExpenseCollection.getExpenseGroup(req);
    return data;
}

const editExpenseGroup = async (req) => {
    const data = await ExpenseCollection.editExpenseGroup(req);
    return data;
}

const deleteExpenseGroup = async (req) => {
    const data = await ExpenseCollection.deleteExpenseGroup(req);
    return data;
}

const addExpenseLedger = async (req, LedgerNo) => {
    const data = await ExpenseCollection.addExpenseLedger(req, LedgerNo);
    return data;
}

const getExpenseLedger = async (req) => {
    const data = await ExpenseCollection.getExpenseLedger(req);
    return data;
}

const editExpenseLedger = async (req) => {
    const data = await ExpenseCollection.editExpenseLedger(req);
    return data;
}

const deleteExpenseLedger = async (req) => {
    const data = await ExpenseCollection.deleteExpenseLedger(req);
    return data;
}

const getExpenseLedgerCount = async (req) => {
    const data = await ExpenseCollection.getExpenseLedgerCount(req);
    return data;
}

const addExpenseVoucher = async (req) => {
    const data = await ExpenseCollection.addExpenseVoucher(req);
    return data;
}

const getExpenseVoucher = async (req) => {
    const data = await ExpenseCollection.getExpenseVoucher(req);
    return data;
}

const editExpenseVoucher = async (req) => {
    const data = await ExpenseCollection.editExpenseVoucher(req);
    return data;
}

const deleteExpenseVoucher = async (req) => {
    const data = await ExpenseCollection.deleteExpenseVoucher(req);
    return data;
}

const addPaymentMode = async (req) => {
    const data = await ExpenseCollection.addPaymentMode(req);
    return data;
}

const getPaymentMode = async (req) => {
    const data = await ExpenseCollection.getPaymentMode(req);
    return data;
}

const editPaymentMode = async (req) => {
    const data = await ExpenseCollection.editPaymentMode(req);
    return data;
}

const deletePaymentMode = async (req) => {
    const data = await ExpenseCollection.deletePaymentMode(req);
    return data;
}

const addInvoiceUpload = async (req) => {
    const data = await ExpenseCollection.addInvoiceUpload(req);
    return data;
}

const getInvoiceUpload = async (req) => {
    const data = await ExpenseCollection.getInvoiceUpload(req);
    return data;
}

const editInvoiceUpload = async (req) => {
    const data = await ExpenseCollection.editInvoiceUpload(req);

    return data;
}

const deleteInvoiceUpload = async (req) => {
    const data = await ExpenseCollection.deleteInvoiceUpload(req);
    return data;
}

const getTally = async (req) => {
    const data = await ExpenseCollection.getTally(req);
    return data;
}

const addExpenseHead = async (req) => {
    const data = await ExpenseCollection.addExpenseHead(req);
    return data;
}

const getExpenseHead = async (req) => {
    const data = await ExpenseCollection.getExpenseHead(req);
    return data;
}

const editExpenseHead = async (req) => {
    const data = await ExpenseCollection.editExpenseHead(req);
    return data;
}

const deleteExpenseHead = async (req) => {
    const data = await ExpenseCollection.deleteExpenseHead(req);
    return data;
}

module.exports = {
    addExpenseGroup,
    getExpenseGroup,
    editExpenseGroup,
    deleteExpenseGroup,
    addExpenseLedger,
    getExpenseLedger,
    editExpenseLedger,
    deleteExpenseLedger,
    getExpenseLedgerCount,
    addExpenseVoucher,
    getExpenseVoucher,
    editExpenseVoucher,
    deleteExpenseVoucher,
    addPaymentMode,
    getPaymentMode,
    editPaymentMode,
    deletePaymentMode,
    addInvoiceUpload,
    getInvoiceUpload,
    editInvoiceUpload,
    deleteInvoiceUpload,
    getTally,
    addExpenseHead,
    getExpenseHead,
    editExpenseHead,
    deleteExpenseHead
}