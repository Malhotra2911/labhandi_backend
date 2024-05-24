const httpStatus = require("http-status");
const { donationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const sendWhatsappSms = require("../utils/SendWhatsappSms");

const addNewDonation = catchAsync(async (req, res) => {
  const data = await donationService.addNewDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Donation added successfully.",
    data: data,
  });
});

const editNewDonation = catchAsync(async (req, res) => {
  const data = await donationService.editNewDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Donation edited successfully.",
    data: data,
  });
});

const delDonation = catchAsync(async (req, res) => {
  const data = await donationService.delDonation(req);

  // if (!data) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  // }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Donation Deleted successfully.",
  });
});

const editDonation = catchAsync(async (req, res) => {
  const data = await donationService.editDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong ");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Donation updated successfully.",
  });
});

const addelecDonation = catchAsync(async (req, res) => {
  const data = await donationService.addelecDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  if (data.status == true) {
    // const phoneNo = data.message.data.phoneNo;
    // const ReceiptNo = data.message.data.voucherNo;
    // const amount = data.message.data.elecItemDetails[0].amount;  
    // const name = data.message.data.name;
    // const address = data.message.data.address;
    // const date = new Date(data.message.data.donation_date).toLocaleDateString('en-GB');
    // sendWhatsappSms(phoneNo, ReceiptNo, amount, name, address, date);
    // console.log(date)
    res.status(httpStatus.CREATED).send({
      status: true,
      msg: "Electric Donation added successfully.",
      data: data,
    });
  } else if (data.status == false) {
    res.status(httpStatus.UNAUTHORIZED).send(data);
  } else {
    res.status(httpStatus.CREATED).send({
      status: true,
      msg: "Electric Donation added successfully.",
      data: data
    });
  }
});

const addmanualDonation = catchAsync(async (req, res) => {
  const data = await donationService.addmanualDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  if (data==='Receipt Already Exists') {
    throw new ApiError(httpStatus.BAD_REQUEST, "Receipt Already Exists");
  }
  // const phoneNo = data.data.phoneNo;
  // const ReceiptNo = data.data.ReceiptNo;
  // const amount = data.data.manualItemDetails[0].amount;
  // const name = data.data.name;
  // const address = data.data.address;
  // const date = new Date(data.data.donation_date).toLocaleDateString('en-GB');
  // if(data.status === 1){
    // sendWhatsappSms(phoneNo, ReceiptNo, amount, name, address, date);
  // }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Manual Donation added successfully.",
    data: data,
    created_username: req.user.id,
  });
});

const getElecDonation = catchAsync(async (req, res) => {

  
  const data = await donationService.getElecDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Success",
    data: data,
  });
});


const searchDonation = catchAsync(async (req, res) => {
  const data = await donationService.searchDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Success",
    data,
  });
});

const searchManual = catchAsync(async (req, res) => {
  const data = await donationService.searchManual(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Success",
    data,
  });
});

const searchOnlineCheque = catchAsync(async (req, res) => {
  const data = await donationService.searchOnlineCheque(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Success",
    data,
  });
});

const SpecificsearchOnlinecheque = catchAsync(async (req, res) => {
  const data = await donationService.SpecificsearchOnlinecheque(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Success",
    data,
  });
});
const searchElectric = catchAsync(async (req, res) => {
  const data = await donationService.searchElectric(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Success",
    data,
  });
});

const manualsearchDonation = catchAsync(async (req, res) => {
  const data = await donationService.manualsearchDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Success",
    data,
  });
});

const editElecDonation = catchAsync(async (req, res) => {
  const data = await donationService.editElecDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editcashDonation = catchAsync(async (req, res) => {
  const data = await donationService.editcashDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editChequeDonation = catchAsync(async (req, res) => {
  const data = await donationService.editChequeDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editItemDonation = catchAsync(async (req, res) => {
  const data = await donationService.editItemDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editmanualElecDonation = catchAsync(async (req, res) => {
  const data = await donationService.editmanualElecDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editmanualcashDonation = catchAsync(async (req, res) => {
  const data = await donationService.editmanualcashDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editmanualChequeDonation = catchAsync(async (req, res) => {
  const data = await donationService.editmanualChequeDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const editmanualItemDonation = catchAsync(async (req, res) => {
  const data = await donationService.editmanualItemDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
  });
});

const getElecDonationbyID = catchAsync(async (req, res) => {
  try{
  const data = await donationService.getElecDonationbyID(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Success",
    data: data,
  });
}catch(err){
  res.status(httpStatus.CREATED).send({
    status: false,
    msg: "Not Present",
    data: [],
  });
}
});

const savePaymentDetails = catchAsync(async (req, res) => {
  const data = await donationService.savePaymentDetails(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: data.status,
    msg: data.message,
    data: data,
  });
});

const deleteElecDonation = catchAsync(async (req, res) => {
  const data = await donationService.delElecDonation(req);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Success",
  });
});

const addCashDonation = catchAsync(async (req, res) => {
  const data = await donationService.cashDonation(req);
  res.status(httpStatus.CREATED).send(data);
});

const donationList = catchAsync(async (req, res) => {
  const data = await donationService.list(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  } else {
    res.status(200).send({
      msg: "All record.",
      donation: data,
    });
  }
});

const itemList = catchAsync(async (req, res) => {
  const data = await donationService.getItemList();
  res.status(200).send(data);
});

const addDonationType = catchAsync(async (req, res) => {
  const data = await donationService.addDonationType(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Success",
  });
});

const getDonationType = catchAsync(async (req, res) => {
  const data = await donationService.getDonationType(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    data: data,
  });
});

const getAdminDonationType = catchAsync(async (req, res) => {
  const data = await donationService.getAdminDonationType(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    data: data,
  });
});

const getAllocatedVoucherList = catchAsync(async (req, res) => {
  const data = await donationService.getAllocatedVoucherList(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    data: data,
  });
});
const ChangeChequeStatus = catchAsync(async (req, res) => {
  const data = await donationService.ChangeChequeStatus(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "cheque Status Updated successfully",
  });
});

const ChangeElecStatus = catchAsync(async (req, res) => {
  const data = await donationService.ChangeElecStatus(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Donation Status Updated successfully",
  });
});

const ChangemanualDonation = catchAsync(async (req, res) => {
  const data = await donationService.ChangemanualDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Donation Status Updated successfully",
  });
});

const getuserBynum = catchAsync(async (req, res) => {
  const data = await donationService.getuserBynum(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const getuserBynumManual = catchAsync(async (req, res) => {
  const data = await donationService.getuserBynumManual(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const donationReport = catchAsync(async (req, res) => {
  const data = await donationService.donationReport(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const onlineDonationReport = catchAsync(async (req, res) => {
  const data = await donationService.onlineDonationReport(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const manualdonationReport = catchAsync(async (req, res) => {
  const data = await donationService.manualdonationReport(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const searchAllDonation = catchAsync(async (req, res) => {
  const data = await donationService.searchAllDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const searchmanualAllDonation = catchAsync(async (req, res) => {
  const data = await donationService.searchmanualAllDonation(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data,
  });
});

const userDonationAmount = catchAsync(async (req, res) => {
  const data = await donationService.userDonationAmount(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const manualuserDonationAmount = catchAsync(async (req, res) => {
  const data = await donationService.manualuserDonationAmount(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const onlineuserDonationAmount = catchAsync(async (req, res) => {
  const data = await donationService.onlineuserDonationAmount(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const centralizeduserDonationAmount = catchAsync(async (req, res) => {
  const data = await donationService.centralizeduserDonationAmount(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const getConsReport = catchAsync(async (req, res) => {
  const data = await donationService.getConsReport(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const getOnlineReport = catchAsync(async (req, res) => {
  const data = await donationService.getOnlineReport(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const employeeChangePass = catchAsync(async (req, res) => {
  const data = await donationService.employeeChangePass(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Successfully updated the password",
  });
});

const adminChangePass = catchAsync(async (req, res) => {
  const data = await donationService.adminChangePass(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Successfully updated the password",
  });
});

const getManualDonation = catchAsync(async (req, res) => {
  const data = await donationService.getManualDonation(req);

  res.status(200).send({
    status: true,
    msg: "Success",
    data: data || [],
  });
});

const cancelEachVoucher = catchAsync(async (req, res) => {
  const data = await donationService.cancelEachVoucher(req);

  res.status(200).send({
    data,
  });
});

const dashAdminTotal = catchAsync(async (req, res) => {
  const data = await donationService.dashAdminTotal(req);

  res.status(200).send({
    data,
  });
});

const dashemployeeTotal = catchAsync(async (req, res) => {
  const data = await donationService.dashemployeeTotal(req);

  res.status(200).send({
    data,
  });
});

const checkReceipt = catchAsync(async (req, res) => {
  const data = await donationService.checkReceipt(req);

  res.status(200).send({
    data,
  });
});

const dashAdminTotalManual = catchAsync(async (req, res) => {
  const data = await donationService.dashAdminTotalManual(req);

  res.status(200).send({
    data,
  });
});

const dashemployeeTotalManual = catchAsync(async (req, res) => {
  const data = await donationService.dashemployeeTotalManual(req);

  res.status(200).send({
    data,
  });
});

const dashAdminTotalOnline = catchAsync(async (req, res) => {
  const data = await donationService.dashAdminTotalOnline(req);

  res.status(200).send({
    data,
  });
});

const dashemployeeTotalOnline = catchAsync(async (req, res) => {
  const data = await donationService.dashemployeeTotalOnline(req,res);
  res.status(httpStatus.OK).send({
    data,
  });
});


const deletemanualDonation = catchAsync(async (req, res) => {


  const data = await donationService.deletemanualDonation(req, res);
  res.status(httpStatus.OK).send({
    data,
  });
});

const deleteDonationType = catchAsync(async (req, res) => {


  const data = await donationService.deleteDonationType(req, res);
  res.status(httpStatus.OK).send({
    data,
  });
});

const donationCertificate = catchAsync(async (req, res) => {
  const data = await donationService.donationCertificate(req, res);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "pdf saved successfully",
  });
});

const bookingCertificate = catchAsync(async (req, res) => {
  const data = await donationService.bookingCertificate(req, res);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "pdf saved successfully",
  });
});

const getOnlineDonation = catchAsync(async (req, res) => {
  const data = await donationService.getOnlineDonation(req, res);
  res.status(httpStatus.OK).send({
    data,
  });
});

const donationReceipt = catchAsync(async (req, res) => {
  const data = await donationService.donationReceipt(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Image saved successfully",
    data: data
  });
});

const donationReceiptElectronic = catchAsync(async (req, res) => {
  const data = await donationService.donationReceiptElectronic(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Image saved successfully",
    data: data
  });
});

const donationReceiptOnline = catchAsync(async (req, res) => {
  const data = await donationService.donationReceiptOnline(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!something Went Wrong");
  }

  res.status(200).send({
    status: true,
    msg: "Image saved successfully",
    data: data
  });
});

const searchDonationList = catchAsync(async (req, res) => {
  const data = await donationService.searchDonationList(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data
  });
});

const getDonationMobileNo = catchAsync(async (req, res) => {
  const data = await donationService.getDonationMobileNo(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data
  });
});

const getManualDonationMobileNo = catchAsync(async (req, res) => {
  const data = await donationService.getManualDonationMobileNo(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data
  });
});

module.exports = {
  cancelEachVoucher,
  dashAdminTotalManual,
  dashemployeeTotalOnline,
  dashemployeeTotalManual,
  dashAdminTotalOnline,
  addCashDonation,
  dashAdminTotal,
  getManualDonation,
  SpecificsearchOnlinecheque,
  searchmanualAllDonation,
  donationList,
  dashemployeeTotal,
  userDonationAmount,
  manualuserDonationAmount,
  itemList,
  addNewDonation,
  addelecDonation,
  getElecDonation,
  deleteElecDonation,
  getElecDonationbyID,
  addDonationType,
  getDonationType,
  onlineDonationReport,
  ChangeChequeStatus,
  getAdminDonationType,
  editElecDonation,
  delDonation,
  editDonation,
  ChangeElecStatus,
  editcashDonation,
  editChequeDonation,
  editItemDonation,
  editmanualElecDonation,
  editmanualcashDonation,
  editmanualChequeDonation,
  searchOnlineCheque,
  editmanualItemDonation,
  getuserBynumManual,
  savePaymentDetails,
  searchDonation,
  getuserBynum,
  manualdonationReport,
  donationReport,
  ChangemanualDonation,
  searchAllDonation,
  addmanualDonation,
  manualsearchDonation,
  onlineuserDonationAmount,
  centralizeduserDonationAmount,
  employeeChangePass,
  getAllocatedVoucherList,
  searchElectric,
  searchManual,
  deletemanualDonation,
  deleteDonationType,
  getConsReport,
  checkReceipt,
  getOnlineReport,
  donationCertificate,
  bookingCertificate,
  getOnlineDonation,
  adminChangePass,
  donationReceipt,
  editNewDonation,
  donationReceiptElectronic,
  donationReceiptOnline,
  searchDonationList,
  getDonationMobileNo,
  getManualDonationMobileNo
};
