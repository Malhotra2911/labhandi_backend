const express = require("express");
const { vehicleController } = require('../../controllers');
const router = express.Router();
const auth = require('../../middlewares/auth');
const adminAuth = require('../../middlewares/adminAuth');

router.route("/add-vehicle").post(auth(), vehicleController.addVehicle);
router.route("/get-vehicle").get(vehicleController.getVehicle);
router.route("/edit-vehicle").put(adminAuth(), vehicleController.editVehicle);
router.route("/delete-vehicle").delete(adminAuth(), vehicleController.deleteVehicle);
router.route("/gateout").post(auth(), vehicleController.gateout);
router.route("/vehicle-history").get(vehicleController.vehicleHistory);
router.route("/gateout-history").get(vehicleController.gateoutHistory);

router.route("/add-material").post(auth(), vehicleController.addMaterial);
router.route("/get-material").get(vehicleController.getMaterial);
router.route("/edit-material").put(adminAuth(), vehicleController.editMaterial);
router.route("/delete-material").delete(adminAuth(), vehicleController.deleteMaterial);

router.route("/search-vehicle").get(vehicleController.searchVehicle);
router.route("/search-vehicleHistory").get(vehicleController.searchVehicleHistory);
router.route("/search-gateoutHistory").get(vehicleController.searchGateoutHistory);

module.exports = router;