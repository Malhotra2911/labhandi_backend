const express = require("express");
const {
  adminController,
  userController,
  donationController,
  voucherController,
} = require("../../controllers");
const router = express.Router();
const validate = require("../../middlewares/validate");
const { userValidation, authValidation } = require("../../validations");
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

router
  .route("/cheque-status")
  .post(adminAuth(), donationController.ChangeChequeStatus);
router
  .route("/login")
  .post(validate(authValidation.adminLogin), adminController.adminLogin);
router
  .route("/login-employee")
  .post(validate(authValidation.employeeLogin), adminController.EmployeeLogin);
router
  .route("/user-register")
  .post(validate(userValidation.register), adminController.userRegister);
router.route("/donation-list").get(adminController.allList);
router
  .route("/donation-list")
  .delete(adminAuth(), donationController.delDonation);
router
  .route("/donation-list")
  .put(adminAuth(), donationController.editDonation);
router.route("/donation-list/:id").get(adminController.allList);
router.route("/get-users").get(adminAuth(), userController.getUsers);
router.route("/get-users").put(adminAuth(), adminController.editUser);
router
  .route("/change-status-users")
  .get(adminAuth(), adminController.changeuserStatus);
router
  .route("/donation-type")
  .post(adminAuth(), adminController.addDonationType);
router.route("/donation-type").get(auth(), adminController.getDonationType);
router
  .route("/donation-type")
  .delete(adminAuth(), adminController.DelDonationType);
router
  .route("/change-donation-type")
  .post(adminAuth(), adminController.changeDonationType);

  
router
  .route("/delete-donation-type")
  .post(adminAuth(), donationController.deleteDonationType);

  
router
  .route("/donation-type")
  .put(adminAuth(), adminController.EditDonationType);
router.route("/add-employee").post(adminAuth(), adminController.addEmployees);
router.route("/add-employee").get(adminAuth(), userController.getEmployees);
router.route("/add-employee").delete(adminAuth(), userController.delEmployees);
router.route("/add-employee").put(adminAuth(), userController.editEmployee);
router.route("/create-role").post(adminAuth(), voucherController.EmployeeRole);
router
  .route("/create-role")
  .get(adminAuth(), voucherController.getEmployeeRole);
router
  .route("/create-role")
  .put(adminAuth(), voucherController.EditEmployeeRole);
router
  .route("/change-elec")
  .post(adminAuth(), donationController.ChangeElecStatus);
router
  .route("/change-manualDonation")
  .post(adminAuth(), donationController.ChangemanualDonation);
router
  .route("/create-receipt")
  .post(adminAuth(), voucherController.createReceipt);
router
  .route("/create-receipt")
  .put(adminAuth(), voucherController.changeReceiptStatus);
router.route("/get-receipt").get(adminAuth(), voucherController.getReceipt);
// router.route("/voucher-get").get(adminAuth(), voucherController.getVoucherEach);

// //new routes
// router.route("/voucher-get-new").get(voucherController.NewgetVoucherEach);
// router.route("/voucher-check-new").get(voucherController.checknewvoucher);

router.route("/voucher-get").get(adminAuth(), voucherController.getVoucherr);
router
  .route("/getuser-by-num")
  .get(adminAuth(), donationController.getuserBynum);

router
  .route("/add-voucher")
  .delete(adminAuth(), voucherController.deleteVoucher);

router
  .route("/getuser-by-num-manual")
  .get(adminAuth(), donationController.getuserBynumManual);
router
  .route("/donation-report")
  .get(adminAuth(), donationController.donationReport);

router
  .route("/donation-manual-report")
  .get(adminAuth(), donationController.manualdonationReport);

router
  .route("/donation-online-report")
  .get(adminAuth(), donationController.onlineDonationReport);

router
  .route("/manual-donation")
  .post(adminAuth(), donationController.addmanualDonation);
router
  .route("/signature-upload")
  .put(adminAuth(), userController.adminSignatureUpload);
router
  .route("/signature-upload-emplo")
  .put(adminAuth(), userController.employeeSignatureUpload);
router
  .route("/manual-donation")
  .get(adminAuth(), donationController.getManualDonation);
router
  .route("/delete-electronic")
  .get(adminAuth(), donationController.deleteElecDonation);
router
  .route("/user-report")
  .get(adminAuth(), donationController.userDonationAmount);
router
  .route("/user-manual-report")
  .get(adminAuth(), donationController.manualuserDonationAmount);
router
  .route("/online-cheque-report")
  .get(adminAuth(), donationController.onlineuserDonationAmount);
router
  .route("/centralized-report")
  .post(adminAuth(), donationController.centralizeduserDonationAmount);

router
  .route("/get-cons-report")
  .post(adminAuth(), donationController.getConsReport);

router
  .route("/get-online-report")
  .post(adminAuth(), donationController.getOnlineReport);
  
router
  .route("/change-pass")
  .put(adminAuth(), donationController.employeeChangePass);

router
  .route("/change-admin-pass")
  .put(adminAuth(), donationController.adminChangePass);
router.route("/get-sign").get(adminAuth(), userController.getSign);
module.exports = router;

router
  .route("/donation-type-admin")
  .get(adminAuth(), donationController.getAdminDonationType);

router
  .route("/allocated-vouchers")
  .get(adminAuth(), donationController.getAllocatedVoucherList);
router
  .route("/cancel-each-voucher")
  .post(adminAuth(), donationController.cancelEachVoucher);
  
router
  .route("/delete-voucher")
  .delete(adminAuth(), voucherController.deleteVoucherRequest);
router
  .route("/update-employee-prof")
  .put(adminAuth(), userController.employeeProfile);
router
  .route("/update-admin-prof")
  .put(adminAuth(), userController.adminProfile);
router
  .route("/update-employee-prof")
  .get(adminAuth(), userController.getemployeeProfile);
router
  .route("/update-admin-prof")
  .get(adminAuth(), userController.getadminProfile);
router
  .route("/change-employee-pass")
  .put(adminAuth(), userController.ChangeemployeePass);
router
  .route("/change-admin-pass")
  .put(adminAuth(), userController.ChangeadminPass);

router
  .route("/vocher-edit-user")
  .put(adminAuth(), voucherController.editVoucher);

//search api

router
  .route("/search-electric")
  .get(adminAuth(), donationController.searchElectric);
router
  .route("/search-manual")
  .get(adminAuth(), donationController.searchManual);
router
  .route("/filter-online-cheque")
  .get(adminAuth(), donationController.searchOnlineCheque);
router
  .route("/search-online-cheque")
  .get(adminAuth(), donationController.SpecificsearchOnlinecheque);
router
  .route("/get-elecDonation")
  .get(adminAuth(), donationController.getElecDonationbyID);


  
//dashboard api admin
router
  .route("/dash-admin-total-elec")
  .get(adminAuth(), donationController.dashAdminTotal);
router
  .route("/dash-admin-total-manual")
  .get(adminAuth(), donationController.dashAdminTotalManual);
router
  .route("/dash-admin-total-online")
  .get(adminAuth(), donationController.dashAdminTotalOnline);



//dashboard api employee
router
  .route("/dash-employee-total-elec")
  .get(adminAuth(), donationController.dashemployeeTotal);
router
  .route("/dash-employee-total-manual")
  .get(adminAuth(), donationController.dashemployeeTotalManual);
router
  .route("/dash-employee-total-online")
  .get(adminAuth(), donationController.dashemployeeTotalOnline);

router.post('/delete-meanual-donation',adminAuth(), donationController.deletemanualDonation)

router
  .route("/check-receipt")
  .post(adminAuth(), donationController.checkReceipt);
  
// boliHead api
router.route("/add-boliHead").post(adminAuth(), adminController.addBoliHead);
router.route("/get-boliHead").get(adminController.getBoliHead);
router.route("/edit-boliHead").put(adminAuth(), adminController.editBoliHead);
router.route("/delete-boliHead").delete(adminAuth(), adminController.deleteBoliHead);

// boliUnit api
router.route("/add-boliUnit").post(adminAuth(), adminController.addBoliUnit);
router.route("/get-boliUnit").get(adminController.getBoliUnit);
router.route("/edit-boliUnit").put(adminAuth(), adminController.editBoliUnit);
router.route("/delete-boliUnit").delete(adminAuth(), adminController.deleteBoliUnit);

// trustType api
router.route("/add-trustType").post(adminAuth(), adminController.addTrustType);
router.route("/get-trustType").get(adminController.getTrustType);
router.route("/edit-trustType").put(adminAuth(), adminController.editTrustType);
router.route("/delete-trustType").delete(adminAuth(), adminController.deleteTrustType);

// sadsyaType api
router.route("/add-sadsyaType").post(adminAuth(), adminController.addSadsyaType);
router.route("/get-sadsyaType").get(adminController.getSadsyaType);
router.route("/edit-sadsyaType").put(adminAuth(), adminController.editSadsyaType);
router.route("/delete-sadsyaType").delete(adminAuth(), adminController.deleteSadsyaType);

// relationshipType api
router.route("/add-relationshipType").post(adminAuth(), adminController.addRelationshipType);
router.route("/get-relationshipType").get(adminController.getRelationshipType);
router.route("/edit-relationshipType").put(adminAuth(), adminController.editRelationshipType);
router.route("/delete-relationshipType").delete(adminAuth(), adminController.deleteRelationshipType);

// occasionType api
router.route("/add-occasionType").post(adminAuth(), adminController.addOccasionType);
router.route("/get-occasionType").get(adminController.getOccasionType);
router.route("/edit-occasionType").put(adminAuth(), adminController.editOccasionType);
router.route("/delete-occasionType").delete(adminAuth(), adminController.deleteOccasionType);

// vehicleType api
router.route("/add-vehicleType").post(adminAuth(), adminController.addVehicleType);
router.route("/get-vehicleType").get(adminController.getVehicleType);
router.route("/edit-vehicleType").put(adminAuth(), adminController.editVehicleType);
router.route("/delete-vehicleType").delete(adminAuth(), adminController.deleteVehicleType);

// employeeType api
router.route("/add-employeeType").post(adminAuth(), adminController.addEmployeeType);
router.route("/get-employeeType").get(adminController.getEmployeeType);
router.route("/edit-employeeType").put(adminAuth(), adminController.editEmployeeType);
router.route("/delete-employeeType").delete(adminAuth(), adminController.deleteEmployeeType);

// bankName api
router.route("/add-bankName").post(adminAuth(), adminController.addBankName);
router.route("/get-bankName").get(adminController.getBankName);
router.route("/edit-bankName").put(adminAuth(), adminController.editBankName);
router.route("/delete-bankName").delete(adminAuth(), adminController.deleteBankName);

// department api
router.route("/add-department").post(adminAuth(), adminController.addDepartment);
router.route("/get-department").get(adminController.getDepartment);
router.route("/edit-department").put(adminAuth(), adminController.editDepartment);
router.route("/delete-department").delete(adminAuth(), adminController.deleteDepartment);

// employeeStatus api
router.route("/add-employeeStatus").post(adminAuth(), adminController.addEmployeeStatus);
router.route("/get-employeeStatus").get(adminController.getEmployeeStatus);
router.route("/edit-employeeStatus").put(adminAuth(), adminController.editEmployeeStatus);
router.route("/delete-employeeStatus").delete(adminAuth(), adminController.deleteEmployeeStatus);

// leaveType api
router.route("/add-leaveType").post(adminAuth(), adminController.addLeaveType);
router.route("/get-leaveType").get(adminController.getLeaveType);
router.route("/edit-leaveType").put(adminAuth(), adminController.editLeaveType);
router.route("/delete-leaveType").delete(adminAuth(), adminController.deleteLeaveType);

// designation api
router.route("/add-designation").post(adminAuth(), adminController.addDesignation);
router.route("/get-designation").get(adminController.getDesignation);
router.route("/edit-designation").put(adminAuth(), adminController.editDesignation);
router.route("/delete-designation").delete(adminAuth(), adminController.deleteDesignation);

// custom whatsapp
router.route("/custom-whatsapp").post(adminController.customWhatsapp);

// disable dharamshala
router.route("/add-disableDharamshala").post(adminAuth(), adminController.addDisableDharamshala);
router.route("/get-disableDharamshala").get(adminController.getDisableDharamshala);
router.route("/edit-disableDharamshala").put(adminAuth(), adminController.editDisableDharamshala);
router.route("/delete-disableDharamshala").delete(adminAuth(), adminController.deleteDisableDharamshala);

router.route("/checkDoubleReceipt-donation").get(adminController.checkDoubleReceiptDonation);

// paymentMode
router.route("/add-paymentMode").post(adminAuth(), adminController.addPaymentMode);
router.route("/get-paymentMode").get(adminController.getPaymentMode);
router.route("/edit-paymentMode").put(adminAuth(), adminController.editPaymentMode);
router.route("/delete-paymentMode").delete(adminAuth(), adminController.deletePaymentMode);

// manual and electronic donation combine report
router.route("/combine-elecmanualDonation").post(adminController.combineElecManualDonation);

router.route("/multipeSms-whatsapp").post(adminController.multipleSmsWhatsapp);

// expenseHead
router.route("/add-expenseHead").post(adminAuth(), adminController.addExpenseHead);
router.route("/get-expenseHead").get(adminController.getExpenseHead);
router.route("/edit-expenseHead").put(adminAuth(), adminController.editExpenseHead);
router.route("/delete-expenseHead").delete(adminAuth(), adminController.deleteExpenseHead);

router.route("/checkDoubleReceipt-roomBooking").get(adminController.checkDoubleReceiptRoomBooking);

// Supplier name
router.route("/add-supplierName").post(adminAuth(), adminController.addSupplierName);
router.route("/get-supplierName").get(adminController.getSupplierName);
router.route("/edit-supplierName").put(adminAuth(), adminController.editSupplierName);
router.route("/delete-supplierName").delete(adminAuth(), adminController.deleteSupplierName);

// Bhojnalay Head
router.route("/add-bhojnalayHead").post(adminAuth(), adminController.addBhojnalayHead);
router.route("/get-bhojnalayHead").get(adminController.getBhojnalayHead);
router.route("/edit-bhojnalayHead").put(adminAuth(), adminController.editBhojnalayHead);
router.route("/delete-bhojnalayHead").delete(adminAuth(), adminController.deleteBhojnalayHead);

// UOM
router.route("/add-uom").post(adminAuth(), adminController.addUom);
router.route("/get-uom").get(adminController.getUom);
router.route("/edit-uom").put(adminAuth(), adminController.editUom);
router.route("/delete-uom").delete(adminAuth(), adminController.deleteUom);

// Payment Type
router.route("/add-paymentType").post(adminAuth(), adminController.addPaymentType);
router.route("/get-paymentType").get(adminController.getPaymentType);
router.route("/edit-paymentType").put(adminAuth(), adminController.editPaymentType);
router.route("/delete-paymentType").delete(adminAuth(), adminController.deletePaymentType);

// Item Head
router.route("/add-item").post(adminAuth(), adminController.addItem);
router.route("/get-item").get(adminController.getItem);
router.route("/edit-item").put(adminAuth(), adminController.editItem);
router.route("/delete-item").delete(adminAuth(), adminController.deleteItem);