const httpStatus = require("http-status");
const { userService, donationService, boliService, trustService, committeeService, vehicleService, hrService, expenseService, storeService, bhojnalayService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { generateAuthTokens } = require("../utils/tokens");
const RoomCollection = require("../collections/Room.collection");

const adminLogin = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  
  const data = await userService.loginAdmin(username, password);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  console.log(data);
  res.send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      profile_image: data.profile_image,
      signature:data.signature
    },
    tokens,
  });
});

const userRegister = catchAsync(async (req, res) => {
  // if (req.user.roleDetails.roles.role_name != "Admin") {
  //   res.status(httpStatus.CONFLICT).send({
  //     status: false,
  //     msg: "Only admin access.",
  //   });
  // }
  const userdata = await userService.createuser(req.body, req.files);
    console.log(userdata)
  if (!userdata) {
    res.status(httpStatus.UNAUTHORIZED).send({
      status: false,
      msg: "Something went wrong",
    });
  }
  res.status(httpStatus.CREATED).send(userdata);
});

const allList = catchAsync(async (req, res) => {
  // if (req.user.roleDetails.roles.role_name != "Admin") {
  //   res.status(httpStatus.CONFLICT).send({
  //     status: false,
  //     msg: "Only admin access.",
  //   });
  // }
  const list = await donationService.allList(req);
  res.status(200).send({
    status: true,
    msg: "All List",
    data: list,
  });
});

const delUser = catchAsync(async (req, res) => {
  const user = await userService.delUser(req);
  res.status(200).send({
    status: true,
    msg: "User deleted successfully",
  });
});

const changeuserStatus = catchAsync(async (req,res)=>{
  const status = await userService.changeUserStatus(req)

  res.status(200).send({
   status
  })

})

const editUser = catchAsync(async (req, res) => {
  const data = await userService.editUser(req);

  res.status(200).send({
    status: true,
    msg: "User updated successfully",
  });
});

const addDonationType = catchAsync(async (req, res) => {
  const data = await donationService.addDonationType(req);

  res.status(200).send({
    status: true,
    msg: "Donation Type added successfully",
  });
});



const getDonationType = catchAsync(async (req, res) => {
  const data = await donationService.getDonationType(req);
  res.status(200).send({
    status: true,
    data: data,
  });
});

const DelDonationType = catchAsync(async (req, res) => {
  const data = await donationService.DelDonationType(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete Donation Type");
  }
  res.status(200).send({
    status: true,
    message:"Donation Type Deleted Successfully"
  });
});

const changeDonationType = catchAsync(async (req, res) => {
  const data = await donationService.changeDonationType(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Change Donation Type");
  }
  res.status(200).send({
    data
  });
});

const EditDonationType = catchAsync(async (req, res) => {
  const data = await donationService.EditDonationType(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update Donation Type");
  }
  res.status(200).send({
    status: true,
    message: "Donation type updated Successfully",
  });
});

const addEmployees = catchAsync(async (req, res) => {
  const data = await userService.addEmployees(req);
  if(!data){
   return res.status(httpStatus.UNAUTHORIZED).send({
      status: false,
      msg: "Failed to add employees.",
  })
}
  res.status(200).send({
    status: data.status,
    message:data.message
  });
});

const EmployeeLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const data = await userService.loginEmployee(email, password);
  console.log(data)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  console.log(data);
  res.send({
    user: {
      id: data.id,
      username: data.Username,
      Mobile: data.Mobile,
      Role: data.Role,
      // Rid: data.Rid,
      signature:data.signature,
      manualDonation:data.manualDonation,
      electronicDonation:data.electronicDonation,
      roomBooking:data.	roomBooking,
      boli:data.boli,
      vehiclePass:data.vehiclePass,
      materialPass:data.materialPass,
      store:data.store,
      expense:data.expense,
      directory:data.directory,
      hr:data.hr,
      trust:data.trust,
      admin:data.admin,
      donation:data.donation
    },
    tokens,
  });
});


const getuserBynum = catchAsync(async (req, res) => {
const user = await userService.getuserBynum(req)
if(!user){
  throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
}

res.status(200).send({
  status: true,
  message:"Success",
  data:user
});

})

// boliHead

const addBoliHead = catchAsync(async (req, res) => {
  const data = await boliService.addBoliHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Boli Head Added Successfully",
    data: data
  });
});

const getBoliHead = catchAsync(async (req, res) => {
  const data = await boliService.getBoliHead(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editBoliHead = catchAsync(async (req, res) => {
  const data = await boliService.editBoliHead(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update Boli Head");
  }
  res.status(200).send({
    status: true,
    msg: "Boli Head Updated Successfully"
  });
});

const deleteBoliHead = catchAsync(async (req, res) => {
  const data = await boliService.deleteBoliHead(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete Boli Head");
  }
  res.status(200).send({
    status: true,
    msg: "Boli Head Deleted Successfully"
  });
});

// boliUnit

const addBoliUnit = catchAsync(async (req, res) => {
  const data = await boliService.addBoliUnit(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Boli Unit Added Successfully",
    data: data
  });
});

const getBoliUnit = catchAsync(async (req, res) => {
  const data = await boliService.getBoliUnit(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editBoliUnit = catchAsync(async (req, res) => {
  const data = await boliService.editBoliUnit(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update Boli Unit");
  }
  res.status(200).send({
    status: true,
    msg: "Boli Unit Updated Successfully"
  });
});

const deleteBoliUnit = catchAsync(async (req, res) => {
  const data = await boliService.deleteBoliUnit(req);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete Boli Unit");
  }
  res.status(200).send({
    status: true,
    msg: "Boli Unit Deleted Successfully"
  });
});

const addTrustType = catchAsync(async (req, res) => {
  const data = await trustService.addTrustType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Trust Type Added Successfully",
    data: data
  });
});

const getTrustType = catchAsync(async (req, res) => {
  const data = await trustService.getTrustType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editTrustType = catchAsync(async (req, res) => {
  const data = await trustService.editTrustType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Trust Type Updated Successfully",
    data: data
  });
});

const deleteTrustType = catchAsync(async (req, res) => {
  const data = await trustService.deleteTrustType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Trust Type Deleted Successfully",
  });
});

const addSadsyaType = catchAsync(async (req, res) => {
  const data = await committeeService.addSadsyaType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Sadsya Type Added Successfully",
    data: data
  });
});

const getSadsyaType = catchAsync(async (req, res) => {
  const data = await committeeService.getSadsyaType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No data found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editSadsyaType = catchAsync(async (req, res) => {
  const data = await committeeService.editSadsyaType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Sadsya Type Updated Successfully",
    data: data
  });
});

const deleteSadsyaType = catchAsync(async (req, res) => {
  const data = await committeeService.deleteSadsyaType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Sadsya Type Deleted Successfully"
  });
});

const addRelationshipType = catchAsync(async (req, res) => {
  const data = await committeeService.addRelationshipType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Relationship Type Added Successfully",
    data: data
  });
});

const getRelationshipType = catchAsync(async (req, res) => {
  const data = await committeeService.getRelationshipType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No data found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editRelationshipType = catchAsync(async (req, res) => {
  const data = await committeeService.editRelationshipType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Relationship Type Updated Successfully",
    data: data
  });
});

const deleteRelationshipType = catchAsync(async (req, res) => {
  const data = await committeeService.deleteRelationshipType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Relationship Type Deleted Successfully"
  });
});

const addOccasionType = catchAsync(async (req, res) => {
  const data = await committeeService.addOccasionType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Occasion Type Added Successfully",
    data: data
  });
});

const getOccasionType = catchAsync(async (req, res) => {
  const data = await committeeService.getOccasionType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No data found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editOccasionType = catchAsync(async (req, res) => {
  const data = await committeeService.editOccasionType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Occasion Type Updated Successfully",
    data: data
  });
});

const deleteOccasionType = catchAsync(async (req, res) => {
  const data = await committeeService.deleteOccasionType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Occasion Type Deleted Successfully"
  });
});

const addVehicleType = catchAsync(async (req, res) => {
  const data = await vehicleService.addVehicleType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Vehicle Type Added Successfully",
    data: data
  });
});

const getVehicleType = catchAsync(async (req, res) => {
  const data = await vehicleService.getVehicleType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editVehicleType = catchAsync(async (req, res) => {
  const data = await vehicleService.editVehicleType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Vehicle Type Updated Successfully",
    data: data
  });
});

const deleteVehicleType = catchAsync(async (req, res) => {
  const data = await vehicleService.deleteVehicleType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Vehicle Type Deleted Successfully"
  });
});

const addEmployeeType = catchAsync(async (req, res) => {
  const data = await hrService.addEmployeeType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Employee Type Added Successfully",
    data: data
  });
});

const getEmployeeType = catchAsync(async (req, res) => {
  const data = await hrService.getEmployeeType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editEmployeeType = catchAsync(async (req, res) => {
  const data = await hrService.editEmployeeType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Employee Type Updated Successfully",
    data: data
  });
});

const deleteEmployeeType = catchAsync(async (req, res) => {
  const data = await hrService.deleteEmployeeType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Employee Type Deleted Successfully"
  });
});

const addBankName = catchAsync(async (req, res) => {
  const data = await hrService.addBankName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Bank Name Added Successfully",
    data: data
  });
});

const getBankName = catchAsync(async (req, res) => {
  const data = await hrService.getBankName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editBankName = catchAsync(async (req, res) => {
  const data = await hrService.editBankName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Bank Name Updated Successfully",
    data: data
  });
});

const deleteBankName = catchAsync(async (req, res) => {
  const data = await hrService.deleteBankName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Bank Name Deleted Successfully"
  });
});

const addDepartment = catchAsync(async (req, res) => {
  const data = await hrService.addDepartment(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Department Added Successfully",
    data: data
  });
});

const getDepartment = catchAsync(async (req, res) => {
  const data = await hrService.getDepartment(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editDepartment = catchAsync(async (req, res) => {
  const data = await hrService.editDepartment(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Department Updated Successfully",
    data: data
  });
});

const deleteDepartment = catchAsync(async (req, res) => {
  const data = await hrService.deleteDepartment(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Department Deleted Successfully"
  });
});

const addEmployeeStatus = catchAsync(async (req, res) => {
  const data = await hrService.addEmployeeStatus(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Employee Status Added Successfully",
    data: data
  });
});

const getEmployeeStatus = catchAsync(async (req, res) => {
  const data = await hrService.getEmployeeStatus(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editEmployeeStatus = catchAsync(async (req, res) => {
  const data = await hrService.editEmployeeStatus(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Employee Status Updated Successfully",
    data: data
  });
});

const deleteEmployeeStatus = catchAsync(async (req, res) => {
  const data = await hrService.deleteEmployeeStatus(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Employee Status Deleted Successfully"
  });
});

const addLeaveType = catchAsync(async (req, res) => {
  const data = await hrService.addLeaveType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Leave Type Added Successfully",
    data: data
  });
});

const getLeaveType = catchAsync(async (req, res) => {
  const data = await hrService.getLeaveType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editLeaveType = catchAsync(async (req, res) => {
  const data = await hrService.editLeaveType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Leave Type Updated Successfully",
    data: data
  });
});

const deleteLeaveType = catchAsync(async (req, res) => {
  const data = await hrService.deleteLeaveType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Leave Type Deleted Successfully"
  });
});

const addDesignation = catchAsync(async (req, res) => {
  const data = await hrService.addDesignation(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Designation Added Successfully",
    data: data
  });
});

const getDesignation = catchAsync(async (req, res) => {
  const data = await hrService.getDesignation(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editDesignation = catchAsync(async (req, res) => {
  const data = await hrService.editDesignation(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
  }
  res.status(200).send({
    status: true,
    msg: "Designation Updated Successfully",
    data: data
  });
});

const deleteDesignation = catchAsync(async (req, res) => {
  const data = await hrService.deleteDesignation(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
  }
  res.status(200).send({
    status: true,
    msg: "Designation Deleted Successfully",
  });
});

const customWhatsapp = catchAsync(async (req, res) => {
  const data = await committeeService.customWhatsapp(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }
  res.status(200).send({
    status: true,
    msg: "Message Sent Successfully"
  });
});

const addDisableDharamshala = catchAsync(async (req, res) => {
  const data = await RoomCollection.addDisableDharamshala(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }
  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getDisableDharamshala = catchAsync(async (req, res) => {
  const data = await RoomCollection.getDisableDharamshala(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editDisableDharamshala = catchAsync(async (req, res) => {
  const data = await RoomCollection.editDisableDharamshala(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }
  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deleteDisableDharamshala = catchAsync(async (req, res) => {
  const data = await RoomCollection.deleteDisableDharamshala(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }
  res.status(200).send({
    staus: true,
    msg: "Deleted Successfully"
  });
});

const checkDoubleReceiptDonation = catchAsync(async (req, res) => {
  const data = await donationService.checkDoubleReceiptDonation(req);

  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
}); 

const addPaymentMode = catchAsync(async (req, res) => {
  const data = await expenseService.addPaymentMode(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }

  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getPaymentMode = catchAsync(async (req, res) => {
  const data = await expenseService.getPaymentMode(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }

  res.status(200).send({
    status: true,
    data: data
  });
});

const editPaymentMode = catchAsync(async (req, res) => {
  const data = await expenseService.editPaymentMode(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }

  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deletePaymentMode = catchAsync(async (req, res) => {
  const data = await expenseService.deletePaymentMode(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong")
  }

  res.status(200).send({
    status: true,
    msg: "Deleted Successfully"
  });
});

const combineElecManualDonation = catchAsync(async (req, res) => {
  const data = await donationService.combineElecManualDonation(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }

  res.status(200).send({
    status: true,
    data: data
  });
});

const multipleSmsWhatsapp = catchAsync(async (req, res) => {
  const data = await committeeService.multipleSmsWhatsapp(req);
  if(data.message) {
    res.status(401).send({
      status: false,
      msg: data.message
    })
  }
  res.status(200).send({
    status: true,
    msg: "Message Sent Successfully"
  });
});

const addExpenseHead = catchAsync(async (req, res) => {
  const data = await expenseService.addExpenseHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getExpenseHead = catchAsync(async (req, res) => {
  const data = await expenseService.getExpenseHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editExpenseHead = catchAsync(async (req, res) => {
  const data = await expenseService.editExpenseHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deleteExpenseHead = catchAsync(async (req, res) => {
  const data = await expenseService.deleteExpenseHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Deleted Successfully"
  });
});

const checkDoubleReceiptRoomBooking = catchAsync(async (req, res) => {
  const data = await RoomCollection.checkDoubleReceiptRoomBooking(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const addSupplierName = catchAsync(async (req, res) => {
  const data = await storeService.addSupplierName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getSupplierName = catchAsync(async (req, res) => {
  const data = await storeService.getSupplierName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editSupplierName = catchAsync(async (req, res) => {
  const data = await storeService.editSupplierName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deleteSupplierName = catchAsync(async (req, res) => {
  const data = await storeService.deleteSupplierName(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Deleted Successfully"
  });
});

const addBhojnalayHead = catchAsync(async (req, res) => {
  const data = await bhojnalayService.addBhojnalayHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status : true,
    msg : "Added Successfully",
    data : data
  })
});

const getBhojnalayHead = catchAsync(async (req, res) => {
  const data = await bhojnalayService.getBhojnalayHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status : true,
    data : data
  })
});

const editBhojnalayHead = catchAsync(async (req, res) => {
  const data = await bhojnalayService.editBhojnalayHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status : true,
    msg : "Updated Successfully",
    data : data
  })
});

const deleteBhojnalayHead = catchAsync(async (req, res) => {
  const data = await bhojnalayService.deleteBhojnalayHead(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status : true,
    msg : "Deleted Successfully",
  })
});

const addUom = catchAsync(async (req, res) => {
  const data = await storeService.addUom(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getUom = catchAsync(async (req, res) => {
  const data = await storeService.getUom(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editUom = catchAsync(async (req, res) => {
  const data = await storeService.editUom(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deleteUom = catchAsync(async (req, res) => {
  const data = await storeService.deleteUom(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Deleted Successfully"
  });
});

const addPaymentType = catchAsync(async (req, res) => {
  const data = await storeService.addPaymentType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getPaymentType = catchAsync(async (req, res) => {
  const data = await storeService.getPaymentType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editPaymentType = catchAsync(async (req, res) => {
  const data = await storeService.editPaymentType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deletePaymentType = catchAsync(async (req, res) => {
  const data = await storeService.deletePaymentType(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Deleted Successfully"
  });
});

const addItem = catchAsync(async (req, res) => {
  const data = await storeService.addItem(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Added Successfully",
    data: data
  });
});

const getItem = catchAsync(async (req, res) => {
  const data = await storeService.getItem(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    data: data
  });
});

const editItem = catchAsync(async (req, res) => {
  const data = await storeService.editItem(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Updated Successfully",
    data: data
  });
});

const deleteItem = catchAsync(async (req, res) => {
  const data = await storeService.deleteItem(req);
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
  }
  res.status(200).send({
    status: true,
    msg: "Deleted Successfully",
    data: data
  });
});

module.exports = {
  adminLogin,
  userRegister,
  allList,
  delUser,
  addDonationType,
  getDonationType,
  editUser,
  addEmployees,
  DelDonationType,
  EditDonationType,
  EmployeeLogin,
  changeDonationType,
  changeuserStatus,
  getuserBynum,
  addBoliHead,
  getBoliHead,
  editBoliHead,
  deleteBoliHead,
  addBoliUnit,
  getBoliUnit,
  editBoliUnit,
  deleteBoliUnit,
  addTrustType,
  getTrustType,
  editTrustType,
  deleteTrustType,
  addSadsyaType,
  getSadsyaType,
  editSadsyaType,
  deleteSadsyaType,
  addRelationshipType,
  getRelationshipType,
  editRelationshipType,
  deleteRelationshipType,
  addOccasionType,
  getOccasionType,
  editOccasionType,
  deleteOccasionType,
  addVehicleType,
  getVehicleType,
  editVehicleType,
  deleteVehicleType,
  addEmployeeType,
  getEmployeeType,
  editEmployeeType,
  deleteEmployeeType,
  addBankName,
  getBankName,
  editBankName,
  deleteBankName,
  addDepartment,
  getDepartment,
  editDepartment,
  deleteDepartment,
  addEmployeeStatus,
  getEmployeeStatus,
  editEmployeeStatus,
  deleteEmployeeStatus,
  addLeaveType,
  getLeaveType,
  editLeaveType,
  deleteLeaveType,
  addDesignation,
  getDesignation,
  editDesignation,
  deleteDesignation,
  customWhatsapp,
  addDisableDharamshala,
  getDisableDharamshala,
  editDisableDharamshala,
  deleteDisableDharamshala,
  checkDoubleReceiptDonation,
  addPaymentMode,
  getPaymentMode,
  editPaymentMode,
  deletePaymentMode,
  combineElecManualDonation,
  multipleSmsWhatsapp,
  addExpenseHead,
  getExpenseHead,
  editExpenseHead,
  deleteExpenseHead,
  checkDoubleReceiptRoomBooking,
  addSupplierName,
  getSupplierName,
  editSupplierName,
  deleteSupplierName,
  addBhojnalayHead,
  getBhojnalayHead,
  editBhojnalayHead,
  deleteBhojnalayHead,
  addUom,
  getUom,
  editUom,
  deleteUom,
  addPaymentType,
  getPaymentType,
  editPaymentType,
  deletePaymentType,
  addItem,
  getItem,
  editItem,
  deleteItem
};
