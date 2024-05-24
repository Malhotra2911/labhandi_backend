const express = require('express');
const { boliController } = require("../../controllers");
const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

router.route("/add-boli").post(auth(), boliController.addBoli);
router.route("/get-boli").get(boliController.getBoli);
router.route("/edit-boli").put(adminAuth(), boliController.editBoli);
router.route("/delete-boli").delete(adminAuth(), boliController.deleteBoli);

router.route("/add-payment").post(auth(), boliController.addPayment);
router.route("/get-payment").get(boliController.getPayment);
router.route("/edit-payment").put(adminAuth(), boliController.editPayment);
router.route("/delete-payment").delete(adminAuth(), boliController.deletePayment);

router.route("/getPending-boli").get(boliController.getPendingBoli);
router.route("/getPaid-boli").get(boliController.getPaidBoli);

router.route("/search-boliByDate").post(boliController.searchBoliByDate);
router.route("/search-boli").get(boliController.searchBoli);

router.route("/get-boliByNum").get(boliController.getBoliByNum);

router.route("/add-printBoli").post(auth(), boliController.addPrintBoli);
router.route("/get-printBoli").get(boliController.getPrintBoli);

router.route("/add-boliGroup").post(auth(), boliController.addBoliGroup);
router.route("/get-boliGroup").get(boliController.getBoliGroup);
router.route("/edit-boliGroup").put(adminAuth(), boliController.editBoliGroup);
router.route("/delete-boliGroup").delete(adminAuth(), boliController.deleteBoliGroup);

router.route("/add-boliLedger").post(auth(), boliController.addBoliLedger);
router.route("/get-boliLedger").get(boliController.getBoliLedger);
router.route("/edit-boliLedger").put(adminAuth(), boliController.editBoliLedger);
router.route("/delete-boliLedger").delete(adminAuth(), boliController.deleteBoliLedger);

router.route("/add-boliVoucher").post(auth(), boliController.addBoliVoucher);
router.route("/get-boliVoucher").get(boliController.getBoliVoucher);
router.route("/edit-boliVoucher").put(adminAuth(), boliController.editBoliVoucher);
router.route("/delete-boliVoucher").delete(adminAuth(), boliController.deleteBoliVoucher);

router.route("/search-boliGroup").get(boliController.searchBoliGroup);
router.route("/search-boliLedger").get(boliController.searchBoliLedger);
router.route("/search-boliVoucher").get(boliController.searchBoliVoucher);

router.route("/get-tally").get(boliController.getTally);

router.route("/get-boliLedgerByNum").get(auth(), boliController.getBoliLedgerByNum);
router.route("/get-boliStatus").get(boliController.getBoliStatus);

// boli dashboard
router.route("/get-highestBoliByAmount").get(boliController.getHighestBoliByAmount);
router.route("/get-highestBoliByCity").get(boliController.getHighestBoliByCity);
router.route("/get-highestBoliByState").get(boliController.getHighestBoliByState);

module.exports = router;