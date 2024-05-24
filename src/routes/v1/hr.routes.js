const express = require('express');
const { hrController } = require("../../controllers");
const router = express.Router();
const auth = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/adminAuth");

router.route("/add-employee").post(auth(), hrController.addEmployee);
router.route("/get-employee").get(hrController.getEmployee);
router.route("/edit-employee").put(adminAuth(), hrController.editEmployee);
router.route("/delete-employee").delete(adminAuth(), hrController.deleteEmployee);

router.route("/add-employeeLeave").post(auth(), hrController.addEmployeeLeave);
router.route("/get-employeeLeave").get(hrController.getEmployeeLeave);
router.route("/edit-employeeLeave").put(adminAuth(), hrController.editEmployeeLeave);
router.route("/delete-employeeLeave").delete(adminAuth(), hrController.deleteEmployeeLeave);

router.route("/add-employeeAttendance").post(auth(), hrController.addEmployeeAttendance);
router.route("/get-employeeAttendance").get(hrController.getEmployeeAttendance);
router.route("/edit-employeeAttendance").put(adminAuth(), hrController.editEmployeeAttendance);
router.route("/delete-employeeAttendance").delete(adminAuth(), hrController.deleteEmployeeAttendance);

router.route("/add-employeeSalary").post(auth(), hrController.addEmployeeSalary);
router.route("/get-employeeSalary").get(hrController.getEmployeeSalary);
router.route("/edit-employeeSalary").put(adminAuth(), hrController.editEmployeeSalary);
router.route("/delete-employeeSalary").delete(adminAuth(), hrController.deleteEmployeeSalary);

module.exports = router;