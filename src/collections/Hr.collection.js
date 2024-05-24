const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("../db/db-connection");
const uploadimage = require("../middlewares/imageupload");

const TblEmployeeType = db.employeeType;
const TblBankName = db.bankName;
const TblDepartment = db.department;
const TblEmployeeStatus = db.employeeStatus;
const TblLeaveType = db.leaveType;
const TblHrEmployee = db.hrEmployee;
const TblHrEmployeeLeave = db.employeeLeave;
const TblDesignation = db.designation;
const TblEmployeeAttendance = db.employeeAttendance;
const TblEmployeeSalary = db.employeeSalary;

class HrCollection {
    addEmployeeType = async (req) => {
        try {
            const { employeeType_code, employeeType_hi, employeeType_en } = req.body;
            const data = await TblEmployeeType.create({
                employeeType_code,
                employeeType_hi,
                employeeType_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getEmployeeType = async (req) => {
        try {
            const data = await TblEmployeeType.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editEmployeeType = async (req) => {
        try {
            const { id, employeeType_code, employeeType_hi, employeeType_en, status } = req.body;
            const data = await TblEmployeeType.update(
                {
                    employeeType_code : employeeType_code,
                    employeeType_hi : employeeType_hi,
                    employeeType_en : employeeType_en,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteEmployeeType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblEmployeeType.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addBankName = async (req) => {
        try {
            const { bankCode, bankName } = req.body;
            const data = await TblBankName.create({
                bankCode,
                bankName
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getBankName = async (req) => {
        try {
            const data = await TblBankName.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editBankName = async (req) => {
        try {
            const { id, bankCode, bankName, status } = req.body;
            const data = await TblBankName.update(
                {
                    bankCode : bankCode,
                    bankName : bankName,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteBankName = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblBankName.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addDepartment = async (req) => {
        try {
            const { department_code, departmentName_hi, departmentName_en } = req.body;
            const data = await TblDepartment.create({
                department_code,
                departmentName_hi,
                departmentName_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getDepartment = async (req) => {
        try {
            const data = await TblDepartment.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editDepartment = async (req) => {
        try {
            const { id, department_code, departmentName_hi, departmentName_en, status } = req.body;
            const data = await TblDepartment.update(
                {
                    department_code : department_code,
                    departmentName_hi : departmentName_hi,
                    departmentName_en : departmentName_en,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteDepartment = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblDepartment.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addEmployeeStatus = async (req) => {
        try {
            const { employeeStatus_code, employeeStatus } = req.body;
            const data = await TblEmployeeStatus.create({
                employeeStatus_code,
                employeeStatus
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getEmployeeStatus = async (req) => {
        try {
            const data = await TblEmployeeStatus.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editEmployeeStatus = async (req) => {
        try {
            const { id, employeeStatus_code, employeeStatus } = req.body;
            const data = await TblEmployeeStatus.update(
                {
                    employeeStatus_code : employeeStatus_code,
                    employeeStatus : employeeStatus  
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteEmployeeStatus = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblEmployeeStatus.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addLeaveType = async (req) => {
        try {
            const { leaveType_code, leaveType_hi, leaveType_en } = req.body;
            const data = await TblLeaveType.create({
                leaveType_code,
                leaveType_hi,
                leaveType_en
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    getLeaveType = async (req) => {
        try {
            const data = await TblLeaveType.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editLeaveType = async (req) => {
        try {
            const { id, leaveType_code, leaveType_hi, leaveType_en, status } = req.body;
            const data = await TblLeaveType.update(
                {
                    leaveType_code : leaveType_code,
                    leaveType_hi : leaveType_hi,
                    leaveType_en : leaveType_en,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteLeaveType = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblLeaveType.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addEmployee = async (req) => {
        try {
            const { employeeName, employeeID, AadharNo, ContactNo, employeeStatus, Email, department, joiningDate, deactiveDate, employeeType, address, city, state, employeeSalary, designation, BankName, BankBranch, IFSC_Code, AccountNo, AccountHolderName } = req.body;
            // const { employeePhoto } = req.files;
            const ADDED_BY = req.user.id;

            // let image1 = "";
            // if (employeePhoto) {
            //     image1 = uploadimage(employeePhoto);
            // }

            const data = await TblHrEmployee.create({
                employeeName,
                employeeID,
                AadharNo,
                ContactNo,
                employeeStatus,
                Email,
                department,
                joiningDate,
                deactiveDate,
                employeeType,
                // employeePhoto : image1,
                address,
                city,
                state,
                employeeSalary,
                designation,
                BankName,
                BankBranch,
                IFSC_Code,
                AccountNo,
                AccountHolderName,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getEmployee = async (req) => {
        try {
            const data = await TblHrEmployee.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editEmployee = async (req) => {
        try {
            const { id, employeeName, employeeID, AadharNo, ContactNo, employeeStatus, Email, department, joiningDate, deactiveDate, employeeType, address, city, state, employeeSalary, designation, BankName, BankBranch, IFSC_Code, AccountNo, AccountHolderName } = req.body;
            // const { employeePhoto } = req.files;

            // let image1 = "";
            // if (employeePhoto) {
            //     image1 = uploadimage(employeePhoto);
            // }

            const data = await TblHrEmployee.update(
                {
                    employeeName : employeeName,
                    employeeID : employeeID,
                    AadharNo : AadharNo,
                    ContactNo : ContactNo,
                    employeeStatus : employeeStatus,
                    Email : Email,
                    department : department,
                    joiningDate : joiningDate,
                    deactiveDate : deactiveDate,
                    employeeType : employeeType,
                    // employeePhoto : image1,
                    address : address,
                    city : city,
                    state : state,
                    employeeSalary : employeeSalary,
                    designation : designation,
                    BankName : BankName,
                    BankBranch : BankBranch,
                    IFSC_Code : IFSC_Code,
                    AccountNo : AccountNo,
                    AccountHolderName : AccountHolderName
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteEmployee = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblHrEmployee.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addEmployeeLeave = async (req) => {
        try {
            const { employeeId, employeeName, startDate, endDate, department_code, department, designation, leaveType, remark } = req.body;
            const ADDED_BY = req.user.id;
            const data = await TblHrEmployeeLeave.create({
                employeeId,
                employeeName,
                startDate,
                endDate,
                department_code,
                department,
                designation,
                leaveType,
                remark,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getEmployeeLeave = async (req) => {
        try {
            const data = await TblHrEmployeeLeave.findAll({
                order: [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editEmployeeLeave = async (req) => {
        try {
            const { id, employeeId, employeeName, startDate, endDate, department_code, department, designation, leaveType, remark, Status } = req.body;
            const data = await TblHrEmployeeLeave.update(
                {
                    employeeId : employeeId,
                    employeeName : employeeName,
                    startDate : startDate,
                    endDate : endDate,
                    department_code : department_code,
                    department : department,
                    designation : designation,
                    leaveType : leaveType,
                    remark : remark,
                    Status : Status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteEmployeeLeave = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblHrEmployeeLeave.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addDesignation = async (req) => {
        try {
            const { designationCode, en_designation, hi_designation } = req.body;
            const data = await TblDesignation.create({
                designationCode,
                en_designation,
                hi_designation
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getDesignation = async (req) => {
        try {
            const data = await TblDesignation.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error
        }
    };

    editDesignation = async (req) => {
        try {
            const { id, designationCode, en_designation, hi_designation, status } = req.body;
            const data = await TblDesignation.update(
                {
                    designationCode : designationCode,
                    en_designation : en_designation,
                    hi_designation : hi_designation,
                    status : status
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteDesignation = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblDesignation.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    addEmployeeAttendance = async (req) => {
        try {
            const { employeeId, employeeName, department_code, department, designation, attendanceDate, inTime, outTime, totalHours, remark } = req.body;
            const ADDED_BY = req.user.id;

            const data = await TblEmployeeAttendance.create({
              employeeId,
              employeeName,
              department_code,
              department,
              designation,
              attendanceDate,
              inTime,
              outTime,
              totalHours,
              remark,
              ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getEmployeeAttendance = async (req) => {
        try {
            const data = await TblEmployeeAttendance.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editEmployeeAttendance = async (req) => {
        try {
            const { id, employeeId, employeeName, department_code, department, designation, attendanceDate, inTime, outTime, totalHours, remark } = req.body;
            const data = await TblEmployeeAttendance.update(
                {
                    employeeId : employeeId,
                    employeeName : employeeName,
                    department_code : department_code,
                    department : department,
                    designation : designation,
                    attendanceDate : attendanceDate,
                    inTime : inTime,
                    outTime : outTime,
                    totalHours : totalHours,
                    remark : remark
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteEmployeeAttendance = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblEmployeeAttendance.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    
    addEmployeeSalary = async (req) => {
        try {
            const { employeeId, employeeName, department_code, department, designation, year, month, amountPaid, remark } = req.body;
            const ADDED_BY = req.user.id;

            const data = await TblEmployeeSalary.create({
                employeeId,
                employeeName,
                department_code,
                department,
                designation,
                year,
                month,
                amountPaid,
                remark,
                ADDED_BY
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    getEmployeeSalary = async (req) => {
        try {
            const data = await TblEmployeeSalary.findAll({
                order : [["id", "DESC"]]
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    editEmployeeSalary = async (req) => {
        try {
            const { id, employeeId, employeeName, department_code, department, designation, year, month, amountPaid, remark } = req.body;
            const data = await TblEmployeeSalary.update(
                {
                    employeeId : employeeId,
                    employeeName : employeeName,
                    department_code : department_code,
                    department : department,
                    designation : designation,
                    year : year,
                    month : month,
                    amountPaid : amountPaid,
                    remark : remark
                },
                {
                    where : {
                        id : id
                    }
                }
            );
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    deleteEmployeeSalary = async (req) => {
        try {
            const { id } = req.query;
            const data = await TblEmployeeSalary.destroy({
                where : {
                    id : id
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

module.exports = new HrCollection();