const express = require("express");

const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");
const { roomController } = require("../../controllers");

router.route("/checkin").post(auth(), roomController.checkIn);
router.route("/checkin").get(roomController.getCheckin);
router.route("/checkin").delete(adminAuth(), roomController.delCheckin);
router.route("/checkin").put(adminAuth(), roomController.editCheckin);
router.route("/checkin-user").post(auth(), roomController.userCheckin);
router.route('/checkin-id').get(roomController.getCheckinbyId)
router.route('/checkin-payment').put(roomController.checkinPayment)
router.route('/checkin-user').get(auth(),roomController.checkinuser)
//checkin

router.route("/checkOutAll").post(auth(), roomController.checkOutAll);
router.route("/update-holdin").put(auth(), roomController.updateHoldinDateTime);

router.route("/facility").post(adminAuth(), roomController.CreateFacilities);
router.route("/facility").get(adminAuth(), roomController.getFacilities);
router.route("/facility").delete(adminAuth(), roomController.delFacilities);
router.route("/facility").put(adminAuth(), roomController.editFacilities);
//facilites


router.route("/hold").post(adminAuth(), roomController.CreateHoldIn);
router.route("/hold").get(adminAuth(), roomController.getHoldIn);
router.route("/hold").delete(adminAuth(), roomController.delHoldIn);
router.route("/hold").put(adminAuth(), roomController.editHoldIn);
//holdIn

router.route("/").post(adminAuth(), roomController.CreateRooms);
router.route("/").get(adminAuth(), roomController.getRooms);
router.route("/").delete(adminAuth(), roomController.delRooms);
router.route("/").put(adminAuth(), roomController.editRooms);
router.route("/users-room").get(adminAuth(), roomController.getonlineRooms); //for online booking
//Rooms

router.route("/check-room").post(roomController.getAvailableRoom);
router.route("/get-room-history-admin").post(adminAuth(),roomController.getRoomHistory);
router.route("/get-room-history-employee").post(auth(),roomController.getRoomHistoryEmployee);

router.route("/check-room-catg").get(roomController.getAvailableRoombyCategory);
//ROOM AVAILBILITIES

router.route("/category").post(adminAuth(), roomController.CreateRoomCategory);
router.route("/category").get(adminAuth(), roomController.getRoomCategory);
router.route("/category").delete(adminAuth(), roomController.delRoomCategory);
router.route("/category").put(adminAuth(), roomController.editRoomCategory);
//Categories
router
  .route("/details-by-category")
  .get(adminAuth(), roomController.getbyCategory);

//dharmashala
router.route("/dharmashala").post(adminAuth(), roomController.createDharmasala);
router.route("/dharmashala").get(roomController.getDharmasala);
router.route("/dharmashala").put(adminAuth(), roomController.editDharmasala);
router.route("/dharmashala-data").post(auth(),roomController.getDharmasalaData);

//booking parameters
router
  .route("/booking-parameters")
  .post(adminAuth(), roomController.createBookingPara);

  router.route("/room-booking-report").get(adminAuth(),roomController.getRoomBookingReport);
  
  router.route("/room-booking-stats-1").get(adminAuth(),roomController.getRoomBookingStats);
  router.route("/employee-booking-stats-1").get(auth(),roomController.getEmployeeBookingStats);
  router.route("/room-booking-stats-2").get(adminAuth(),roomController.getRoomBookingStats2);
  router.route("/employee-booking-stats-2").get(auth(),roomController.getEmployeeBookingStats2);
  router.route("/get-guests").get(adminAuth(),roomController.getGuests);
  router.route("/employee-get-guests").get(auth(),roomController.employeeGetGuests);
  router.route("/checkOut").post(auth(), roomController.checkOut);
  router.route("/force-checkout").post(auth(), roomController.forceCheckOut);
  router.route("/cancel-checkin").delete(auth(),roomController.cancelCheckin);
  router.route("/update-checkin-payment").put(adminAuth(),roomController.updateCheckinPayment);
  router.route("/get-booking").post(roomController.getBookingFromBookingId);
  router.route("/cancel-history").get(auth(),roomController.getCancelHistory);
  router.route("/holdin-history").get(auth(),roomController.getHoldinHistory);
  router.route('/payment-complete').put(roomController.savePaymentDetails);
  router.route("/booking-info/:id").get(roomController.getInfoByBookingId);
  router.route("/checkin-history-user").get(auth(),roomController.checkinHistoryUser);
  router.route("/get-dharmasalas").get(auth(),roomController.getDharmasalas);
  router.route("/get-avail-categories").post(auth(),roomController.getAvailCategories);
  router.route("/get-used-categories").get(auth(),roomController.getInUseCategories);
  router.route("/checkin-history-by-num/:num").get(roomController.checkinHistoryByNum);
  router.route("/consolidated").post(auth(),roomController.getConsolidated);
  router.route("/checkin-history").get(auth(), roomController.checkinHistory);
  router.route("/forceCheckout-history").get(auth(), roomController.forceCheckOutHistory);
  router.route("/force-checkoutAll").post(auth(), roomController.forceCheckOutAll);
  router.route("/checkinHistory").get(auth(), roomController.getCheckinHistory); // room numbers in single line
  router.route("/checkinReport").get(roomController.checkinReport); // room numbers in single line
  router.route("/checkoutHistoryAdmin").post(adminAuth(), roomController.checkoutHistoryAdmin); // room numbers in single line
  router.route("/checkoutHistoryEmployee").post(auth(), roomController.checkoutHistoryEmployee); // room numbers in single line
  router.route("/forceCheckoutHistory").get(auth(), roomController.forceCheckoutHistory) // room numbers in single line
  router.route("/cancelHistory").get(auth(), roomController.cancelHistory) // room numbers in single line
  router.route("/cancelCheckin").delete(auth(), roomController.cancelcheckin); 
  router.route("/onlineCheckin").get(roomController.onlineCheckin); // room numbers in single line
  router.route("/roomsByBookingId").get(roomController.roomsByBookingId);
  router.route("/onlineRoom-dashboard").get(roomController.onlineRoomDashboard);
  router.route("/checkCancel").post(auth(), roomController.checkCancel);
  router.route("/checkRoomShift").post(auth(), roomController.checkRoomShift);
  router.route("/getCheckinDetailsByNum").post(auth(), roomController.getCheckinDetailsByNum);
  router.route("/getOnlinePaymentFailed").get(roomController.getOnlinePaymentFailed);
  router.route("/onlineCheckinHistory").get(roomController.onlineCheckinHistory);
  router.route("/room-detail").get(roomController.roomDetail);
  router.route("/roomBooking-history").get(auth(), roomController.roomBookingHistory);

  router.route("/checkin-certificate").get(roomController.checkinCertificate);
  router.route("/checkout-certificate").get(roomController.checkoutCertificate); 
  router.route("/search-roomBookingHistory").get(auth(), roomController.searchRoomBookingHistory);
// router.route("/booking-parameters").get(adminAuth(), roomController.getBookingPara)
// router.route("/booking-parameters").put(adminAuth(), roomController.updateBookingPara)
  router.route("/getRoomDetailsByRoomNo").get(roomController.getRoomDetailsByRoomNo);
  router.route("/getRoomBooking-mobileNo").get(roomController.getRoomBookingMobileNo);

module.exports = router;
