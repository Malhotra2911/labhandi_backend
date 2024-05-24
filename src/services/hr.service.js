const { HrCollection } = require("../collections");

const addEmployeeType = async (req) => {
    const data = await HrCollection.addEmployeeType(req);
    return data;
};

const getEmployeeType = async (req) => {
    const data = await HrCollection.getEmployeeType(req);
    return data;
};

const editEmployeeType = async (req) => {
    const data = await HrCollection.editEmployeeType(req);
    return data;
};

const deleteEmployeeType = async (req) => {
    const data = await HrCollection.deleteEmployeeType(req);
    return data;
};

const addBankName = async (req) => {
    const data = await HrCollection.addBankName(req);
    return data;
};

const getBankName = async (req) => {
    const data = await HrCollection.getBankName(req);
    return data;
};

const editBankName = async (req) => {
    const data = await HrCollection.editBankName(req);
    return data;
};

const deleteBankName = async (req) => {
    const data = await HrCollection.deleteBankName(req);
    return data;
};

const addDepartment = async (req) => {
    const data = await HrCollection.addDepartment(req);
    return data;
};

const getDepartment = async (req) => {
    const data = await HrCollection.getDepartment(req);
    return data;
};

const editDepartment = async (req) => {
    const data = await HrCollection.editDepartment(req);
    return data;
};

const deleteDepartment = async (req) => {
    const data = await HrCollection.deleteDepartment(req);
    return data;
};

const addEmployeeStatus = async (req) => {
    const data = await HrCollection.addEmployeeStatus(req);
    return data;
};

const getEmployeeStatus = async (req) => {
    const data = await HrCollection.getEmployeeStatus(req);
    return data;
};

const editEmployeeStatus = async (req) => {
    const data = await HrCollection.editEmployeeStatus(req);
    return data;
};

const deleteEmployeeStatus = async (req) => {
    const data = await HrCollection.deleteEmployeeStatus(req);
    return data;
};

const addLeaveType = async (req) => {
    const data = await HrCollection.addLeaveType(req);
    return data;
};

const getLeaveType = async (req) => {
    const data = await HrCollection.getLeaveType(req);
    return data;
};

const editLeaveType = async (req) => {
    const data = await HrCollection.editLeaveType(req);
    return data;
};

const deleteLeaveType = async (req) => {
    const data = await HrCollection.deleteLeaveType(req);
    return data;
};

const addEmployee = async (req) => {
    const data = await HrCollection.addEmployee(req);
    return data;
}

const getEmployee = async (req) => {
    const data = await HrCollection.getEmployee(req);
    return data;
}

const editEmployee = async (req) => {
    const data = await HrCollection.editEmployee(req);
    return data;
}

const deleteEmployee = async (req) => {
    const data = await HrCollection.deleteEmployee(req);
    return data;
}

const addEmployeeLeave = async (req) => {
    const data = await HrCollection.addEmployeeLeave(req);
    return data;
}

const getEmployeeLeave = async (req) => {
    const data = await HrCollection.getEmployeeLeave(req);
    return data;
}

const editEmployeeLeave = async (req) => {
    const data = await HrCollection.editEmployeeLeave(req);
    return data;
}

const deleteEmployeeLeave = async (req) => {
    const data = await HrCollection.deleteEmployeeLeave(req);
    return data;
}

const addDesignation = async (req) => {
    const data = await HrCollection.addDesignation(req);
    return data;
}

const getDesignation = async (req) => {
    const data = await HrCollection.getDesignation(req);
    return data;
}

const editDesignation = async (req) => {
    const data = await HrCollection.editDesignation(req);
    return data;
}

const deleteDesignation = async (req) => {
    const data = await HrCollection.deleteDesignation(req);
    return data;
}

const addEmployeeAttendance = async (req) => {
    const data = await HrCollection.addEmployeeAttendance(req);
    return data;
}

const getEmployeeAttendance = async (req) => {
    const data = await HrCollection.getEmployeeAttendance(req);
    return data;
}

const editEmployeeAttendance = async (req) => {
    const data = await HrCollection.editEmployeeAttendance(req);
    return data;
}

const deleteEmployeeAttendance = async (req) => {
    const data = await HrCollection.deleteEmployeeAttendance(req);
    return data;
}

const addEmployeeSalary = async (req) => {
    const data = await HrCollection.addEmployeeSalary(req);
    return data;
}

const getEmployeeSalary = async (req) => {
    const data = await HrCollection.getEmployeeSalary(req);
    return data;
}

const editEmployeeSalary = async (req) => {
    const data = await HrCollection.editEmployeeSalary(req);
    return data;
}

const deleteEmployeeSalary = async (req) => {
    const data = await HrCollection.deleteEmployeeSalary(req);
    return data;
}

module.exports = {
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
    addEmployee,
    getEmployee,
    editEmployee,
    deleteEmployee,
    addEmployeeLeave,
    getEmployeeLeave,
    editEmployeeLeave,
    deleteEmployeeLeave,
    addDesignation,
    getDesignation,
    editDesignation,
    deleteDesignation,
    addEmployeeAttendance,
    getEmployeeAttendance,
    editEmployeeAttendance,
    deleteEmployeeAttendance,
    addEmployeeSalary,
    getEmployeeSalary,
    editEmployeeSalary,
    deleteEmployeeSalary
}