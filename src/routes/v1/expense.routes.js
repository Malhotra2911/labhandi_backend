const express = require('express');
const { expenseController } = require('../../controllers');
const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

// expense group
router.route("/add-expenseGroup").post(auth(), expenseController.addExpenseGroup);
router.route("/get-expenseGroup").get(expenseController.getExpenseGroup);
router.route("/edit-expenseGroup").put(adminAuth(), expenseController.editExpenseGroup);
router.route("/delete-expenseGroup").delete(adminAuth(), expenseController.deleteExpenseGroup);

// expense ledger
router.route("/add-expenseLedger").post(auth(), expenseController.addExpenseLedger);
router.route("/get-expenseLedger").get(expenseController.getExpenseLedger);
router.route("/edit-expenseLedger").put(adminAuth(), expenseController.editExpenseLedger);
router.route("/delete-expenseLedger").delete(adminAuth(), expenseController.deleteExpenseLedger);

// expense voucher
router.route("/add-expenseVoucher").post(auth(), expenseController.addExpenseVoucher);
router.route("/get-expenseVoucher").get(expenseController.getExpenseVoucher);
router.route("/edit-expenseVoucher").put(adminAuth(), expenseController.editExpenseVoucher);
router.route("/delete-expenseVoucher").delete(adminAuth(), expenseController.deleteExpenseVoucher);

// invoice upload
router.route("/add-invoiceUpload").post(auth(), expenseController.addInvoiceUpload);
router.route("/get-invoiceUpload").get(expenseController.getInvoiceUpload);
router.route("/edit-invoiceUpload").put(adminAuth(), expenseController.editInvoiceUpload);
router.route("/delete-invoiceUpload").delete(adminAuth(), expenseController.deleteInvoiceUpload);

router.route("/get-tally").get(expenseController.getTally);

module.exports = router;