const httpStatus = require("http-status");
const { vehicleService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addVehicle = catchAsync(async (req, res) => {
    const data = await vehicleService.addVehicle(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Vehicle Added Successfully",
        data: data
    });
});

const getVehicle = catchAsync(async (req, res) => {
    const data = await vehicleService.getVehicle(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editVehicle = catchAsync(async (req, res) => {
    const data = await vehicleService.editVehicle(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
      status: true,
      msg: "Vehicle Updated Successfully",
      data: data
    });
  });
  
  const deleteVehicle = catchAsync(async (req, res) => {
    const data = await vehicleService.deleteVehicle(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
      status: true,
      msg: "Vehicle Deleted Successfully",
      data: data
    });
  });

const addMaterial = catchAsync(async (req, res) => {
    const data = await vehicleService.addMaterial(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Material Added Successfully",
        data: data
    });
});

const getMaterial = catchAsync(async (req, res) => {
    const data = await vehicleService.getMaterial(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editMaterial = catchAsync(async (req, res) => {
    const data = await vehicleService.editMaterial(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
      status: true,
      msg: "Material Updated Successfully",
      data: data
    });
  });
  
  const deleteMaterial = catchAsync(async (req, res) => {
    const data = await vehicleService.deleteMaterial(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
      status: true,
      msg: "Material Deleted Successfully",
      data: data
    });
  });

  const gateout = catchAsync(async (req, res) => {
    const data = await vehicleService.gateout(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
      status: true,
      msg: "Gateout Successfully",
      data: data
    });
  });

  const vehicleHistory = catchAsync(async (req, res) => {
    const data = await vehicleService.vehicleHistory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
  });

  const gateoutHistory = catchAsync(async (req, res) => {
    const data = await vehicleService.gateoutHistory(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
  });

  const searchVehicle = catchAsync(async (req, res) => {
    const data = await vehicleService.searchVehicle(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
      status: true,
      data: data
    })
  });

  const searchVehicleHistory = catchAsync(async (req, res) => {
    const data = await vehicleService.searchVehicleHistory(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
      status: true,
      data: data
    })
  });

  const searchGateoutHistory = catchAsync(async (req, res) => {
    const data = await vehicleService.searchGateoutHistory(req);
    if(!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
      status: true,
      data: data
    })
  });

module.exports = {
addVehicle,
getVehicle,
editVehicle,
deleteVehicle,
addMaterial,
getMaterial,
editMaterial,
deleteMaterial,
gateout,
vehicleHistory,
gateoutHistory,
searchVehicle,
searchVehicleHistory,
searchGateoutHistory
}