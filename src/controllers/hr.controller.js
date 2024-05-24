const httpStatus = require("http-status");
const { hrService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const addEmployee = catchAsync(async (req, res) => {
    const data = await hrService.addEmployee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Added Successfully",
        data: data
    });
});

const getEmployee = catchAsync(async (req, res) => {
    const data = await hrService.getEmployee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editEmployee = catchAsync(async (req, res) => {
    const data = await hrService.editEmployee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Updated Successfully",
        data: data
    });
});

const deleteEmployee = catchAsync(async (req, res) => {
    const data = await hrService.deleteEmployee(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Deleted Successfully"
    });
});

const addEmployeeLeave = catchAsync(async (req, res) => {
    const data = await hrService.addEmployeeLeave(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Leave Added Successfully",
        data: data
    });
});

const getEmployeeLeave = catchAsync(async (req, res) => {
    const data = await hrService.getEmployeeLeave(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Data Found");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editEmployeeLeave = catchAsync(async (req, res) => {
    const data = await hrService.editEmployeeLeave(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Update");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Leave Updated Successfully",
        data: data
    });
});

const deleteEmployeeLeave = catchAsync(async (req, res) => {
    const data = await hrService.deleteEmployeeLeave(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to Delete");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Leave Deleted Successfully",
    });
});

const addEmployeeAttendance = catchAsync(async (req, res) => {
    const data = await hrService.addEmployeeAttendance(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Attendance Added Successfully",
        data: data
    });
});

const getEmployeeAttendance = catchAsync(async (req, res) => {
    const data = await hrService.getEmployeeAttendance(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editEmployeeAttendance = catchAsync(async (req, res) => {
    const data = await hrService.editEmployeeAttendance(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Updated Successfully",
        data: data
    });
});

const deleteEmployeeAttendance = catchAsync(async (req, res) => {
    const data = await hrService.deleteEmployeeAttendance(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Deleted Successfully"
    });
});

const addEmployeeSalary = catchAsync(async (req, res) => {
    const data = await hrService.addEmployeeSalary(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Salary Added Successfully",
        data: data
    });
});

const getEmployeeSalary = catchAsync(async (req, res) => {
    const data = await hrService.getEmployeeSalary(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        data: data
    });
});

const editEmployeeSalary = catchAsync(async (req, res) => {
    const data = await hrService.editEmployeeSalary(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Salary Updated Successfully",
        data: data
    });
});

const deleteEmployeeSalary = catchAsync(async (req, res) => {
    const data = await hrService.deleteEmployeeSalary(req);
    if(!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "!Something Went Wrong");
    }
    res.status(200).send({
        status: true,
        msg: "Employee Salary Deleted Successfully"
    });
});

module.exports = {
    addEmployee,
    getEmployee,
    editEmployee,
    deleteEmployee,
    addEmployeeLeave,
    getEmployeeLeave,
    editEmployeeLeave,
    deleteEmployeeLeave,
    addEmployeeAttendance,
    getEmployeeAttendance,
    editEmployeeAttendance,
    deleteEmployeeAttendance,
    addEmployeeSalary,
    getEmployeeSalary,
    editEmployeeSalary,
    deleteEmployeeSalary
}