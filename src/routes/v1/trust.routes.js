const express = require('express');
const { trustController } = require("../../controllers");
const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

router.route("/add-trust").post(auth(), trustController.addTrust);
router.route("/get-trust").get(trustController.getTrust);
router.route("/edit-trust").put(adminAuth(), trustController.editTrust);
router.route("/delete-trust").delete(adminAuth(), trustController.deleteTrust);

module.exports = router;