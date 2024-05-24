const express = require("express");
const { storeController } = require("../../controllers")
const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

// purchaseRequisition
router.route("/add-purchaseRequisition").post(auth(), storeController.addPurchaseRequisition);
router.route("/get-purchaseRequisition").get(storeController.getPurchaseRequisition);
router.route("/edit-purchaseRequisition").put(adminAuth(), storeController.editPurchaseRequisition);
router.route("/delete-purchaseRequisition").delete(adminAuth(), storeController.deletePurchaseRequisition);

// purchaseOrder
router.route("/add-purchaseOrder").post(auth(), storeController.addPurchaseOrder);
router.route("/get-purchaseOrder").get(storeController.getPurchaseOrder);
router.route("/edit-purchaseOrder").put(adminAuth(), storeController.editPurchaseOrder);
router.route("/delete-purchaseOrder").delete(adminAuth(), storeController.deletePurchaseOrder);

// gateEntry
router.route("/add-gateEntry").post(auth(), storeController.addGateEntry);
router.route("/get-gateEntry").get(storeController.getGateEntry);
router.route("/edit-gateEntry").put(adminAuth(), storeController.editGateEntry);
router.route("/delete-gateEntry").delete(adminAuth(), storeController.deleteGateEntry);

// paymentIn
router.route("/add-paymentIn").post(auth(), storeController.addPaymentIn);
router.route("/get-paymentIn").get(storeController.getPaymentIn);
router.route("/edit-paymentIn").put(adminAuth(), storeController.editPaymentIn);
router.route("/delete-paymentIn").delete(adminAuth(), storeController.deletePaymentIn);

// Inventory
router.route("/add-inventory").post(auth(), storeController.addInventory);
router.route("/get-inventory").get(storeController.getInventory);
router.route("/edit-inventory").put(adminAuth(), storeController.editInventory);
router.route("/delete-inventory").delete(adminAuth(), storeController.deleteInventory);

// Stock
router.route("/add-stock").post(auth(), storeController.addStock);
router.route("/get-stock").get(storeController.getStock);
router.route("/edit-stock").put(adminAuth(), storeController.editStock);
router.route("/delete-stock").delete(adminAuth(), storeController.deleteStock);

// Approver
router.route("/get-approver").get(auth(), storeController.getApprover);

module.exports = router;