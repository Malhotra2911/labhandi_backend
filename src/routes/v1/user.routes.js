const express = require("express");
const {
  userController,
  donationController,
  voucherController,
  bhojnalayController,
} = require("../../controllers");
const validate = require("../../middlewares/validate");
const { userValidation } = require("../../validations");
const router = express.Router();
const auth = require("../../middlewares/auth");
const {sendSms} = require("../../utils/Sendsms");
const adminAuth = require("../../middlewares/adminAuth");

router
  .route("/login")
  .post(validate(userValidation.login), userController.login);
router
  .route("/login-with-email")
  .post(validate(userValidation.loginEmail), userController.loginWithEmail);
router
  .route("/login-with-mobile")
  .post(validate(userValidation.loginMobile), userController.loginWithMobile);
router.route("/verify-opt").post(userController.verifyOTP);
router.route("/sms").post(userController.sendDonationsms)
router
  .route("/user-forgot-password")
  .post(
    auth(),
    validate(userValidation.forgotPass),
    userController.forgotPassword
  );  /// RESET PASSWORD FOR LOGINNED USERS

  // router.route('/forgot-password').post( validate(userValidation.ReqforgotPass),
  router.route('/forgot-password').post(
  userController.forgotPasswordReqOtp) ///req otp

  router.route('/verify-otp-forgot').post( 
  userController.verifyForgotOtp) ///req otp
  
  router.route('/changepass-forgot').post( 
    userController.changePassForgot) ///changePassword




router.route("/create-account").post(userController.createAccount);

router.route("/profile-list").get(auth(), userController.profileList);
router.route("/update-profile").post(auth(), userController.updateProfile);

router.route("/item-list").get(auth(), donationController.itemList);
router
  .route("/add-cash-donation")
  .post(auth(), donationController.addCashDonation);
router.route("/add-donation").post(auth(), donationController.addNewDonation);
router.route("/edit-donation").put(donationController.editNewDonation);
router.route("/donation-list").get(auth(), donationController.donationList);

router
  .route("/add-elecDonation")
  .post(adminAuth(), donationController.addelecDonation);
router
  .route("/add-elecDonation")
  .get(adminAuth(), donationController.getElecDonation);
  router
  .route("/add-elecDonation")
  .put(adminAuth(), donationController.editElecDonation);
router
  .route("/delete-elecDonation")
  .delete(adminAuth(), donationController.deleteElecDonation);
router
  .route("/get-elecDonation")
  .get(adminAuth(), donationController.getElecDonationbyID);

  router.route("/search-donation")
  .post(adminAuth(), donationController.searchDonation);
  
  router.route("/manual-search-donation")
  .post(adminAuth(), donationController.manualsearchDonation);

  router.route('/searchAllDonation').get(adminAuth(),donationController.searchAllDonation)
  router.route('/manual-searchAllDonation').get(adminAuth(),donationController.searchmanualAllDonation)

router
  .route("/add-voucher-user")
  .post(adminAuth(), voucherController.GenerateVoucher);
  router
  .route("/add-voucher-user")
  .get(adminAuth(), voucherController.getVoucher);

router.route("/check-voucher").get(auth(), voucherController.getVoucherr);
router.route('/req-voucher').get(auth(),voucherController.requestVoucher)
router.route('/get-req-voucher').get(adminAuth(),voucherController.getrequestVoucher)
router.route("/update-voucher").post(auth(), voucherController.updateVoucher);

router.route("/edit-cash-donation").put(adminAuth(), donationController.editcashDonation);
router.route("/edit-item-donation").put(adminAuth(), donationController.editItemDonation);
router.route("/edit-cheque-donation").put(adminAuth(), donationController.editChequeDonation);
router.route("/edit-manual-elec-donation").put(adminAuth(), donationController.editmanualElecDonation);
router.route("/edit-manual-cash-donation").put(adminAuth(), donationController.editmanualcashDonation);
router.route("/edit-manual-item-donation").put(adminAuth(), donationController.editmanualItemDonation);
router.route("/edit-manual-cheque-donation").put(adminAuth(), donationController.editmanualChequeDonation);
router.route('/payment-complete').put(donationController.savePaymentDetails);

router.route('/donation-certificate').get(donationController.donationCertificate);
router.route('/booking-certificate').get(donationController.bookingCertificate);
router.route("/get-online-donation").get(donationController.getOnlineDonation);
router.route("/donation-receipt").get(donationController.donationReceipt);
router.route("/donation-receiptElectronic").get(donationController.donationReceiptElectronic);
router.route("/donation-receiptOnline").get(donationController.donationReceiptOnline);
router.route("/search-donationList").get(auth(), donationController.searchDonationList);

// bhojnalay
router.route("/add-bhojnalay").post(auth(), bhojnalayController.addBhojnalay);
router.route("/get-bhojnalay").get(bhojnalayController.getBhojnalay);
router.route("/edit-bhojnalay").put(adminAuth(), bhojnalayController.editBhojnalay);
router.route("/delete-bhojnalay").delete(adminAuth(), bhojnalayController.deleteBhojnalay);
router.route("/get-futureOrder").get(bhojnalayController.getFutureOrder);
router.route("/get-currentOrder").get(bhojnalayController.getCurrentOrder);
router.route("/get-bhojnalayHistory").get(auth(), bhojnalayController.getBhojnalayHistory);
router.route("/get-bhojnalayByBookingId").get(bhojnalayController.getBhojnalayByBookingId);

// bhojnalay payment
router.route('/payment-success').put(bhojnalayController.saveBhojnalayPayment)

router.route("/getDonation-mobileNo").get(donationController.getDonationMobileNo);
router.route("/getManualDonation-mobileNo").get(donationController.getManualDonationMobileNo)
router.route("/bhojnalay-receipt").get(bhojnalayController.bhojnalayReceipt);

module.exports = router;
