const express = require('express');
const { committeeController } = require("../../controllers");
const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

router.route("/add-committee").post(auth(), committeeController.addCommittee);
router.route("/get-committee").get(committeeController.getCommittee);
router.route("/edit-committee").put(adminAuth(), committeeController.editCommittee);
router.route("/delete-committee").delete(adminAuth(), committeeController.deleteCommittee);
router.route("/search-committee").get(committeeController.searchCommittee);

router.route("/add-family").post(auth(), committeeController.addFamily);
router.route("/get-family").get(committeeController.getFamily);
router.route("/edit-family").put(adminAuth(), committeeController.editFamily);
router.route("/delete-family").delete(adminAuth(), committeeController.deleteFamily);
router.route("/search-family").get(committeeController.searchFamily);

router.route("/getCommitteeByNum").get(committeeController.getCommitteeByNum);

module.exports = router;