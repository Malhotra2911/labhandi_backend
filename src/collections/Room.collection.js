const { request, raw } = require("express");
const httpStatus = require("http-status");
const { Op, Sequelize, QueryTypes, where } = require("sequelize");
const sequelize = require("../db/db-connection");
const uploadimage = require("../middlewares/imageupload");
const db = require("../models");
const ApiError = require("../utils/ApiError");
const moment = require("moment");
const { TBL_ROOM_CATEGORY } = require("../models/TableName");
const { sendroomSms } = require("../utils/Sendsms");
const { check } = require("prettier");
let ejs = require("ejs");
let path = require("path");
const puppeteer = require('puppeteer');
const { ToWords } = require('to-words');
const { checkinWhatsappSms, checkoutWhatsappSms } = require("../utils/SendWhatsappSms");

db.dharmashala.hasMany(db.holdIn, {
  foreignKey: "dharmasala",
});
db.holdIn.belongsTo(db.dharmashala, {
  foreignKey: "dharmasala",
});

db.RoomCategory.hasMany(db.holdIn, {
  foreignKey: "category",
});
db.holdIn.belongsTo(db.RoomCategory, {
  foreignKey: "category"
});

const TblCheckin = db.Checkin;
const TblRoom = db.Rooms;
const TblHoldin = db.holdIn;
const TblRoomCategory = db.RoomCategory;
const TblFacility = db.facility;
const TblDharmasal = db.dharmashala;
const TblCanceledCheckins = db.canceledCheckins;
const tblEmployee = db.employees;
const tblUsers = db.userModel;
const TblAdmin = db.admin;
const TblDisableDharamshala = db.disableDharamshala;

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Model synced successfully");
//   })
//   .catch((err) => {
//     console.error("Error syncing model", err);
//   });

class RoomCollection {
  roomCheckin = async (req, id, forUser = false) => {
    let result = [];
    let userName = "";
    if (forUser) {
      req.body.booked_by = null;
      req.body.bookedByUser = req.user.id;
      const user = await tblUsers.findOne({
        where: { id: req.body.bookedByUser },
      });
      if (!user) {
        return {
          status: false,
          message: "User Does Not Exist",
        };
      }
      userName = user.username;
    } else {
      req.body.bookedByUser = null;
      req.body.booked_by = req.user.id;
      const user1 = await TblAdmin.findOne({
        where: { id: req.body.booked_by }
      })
      const user2 = await tblEmployee.findOne({
        where: { id: req.body.booked_by },
      });
      if (!user1 && !user2) {
        return {
          status: false,
          message: "User Does Not Exist",
        };
      }
      if (user1) {
        userName = user1.username;
      }else if (user2) {
        userName = user2.Username;
      } 
    }

    req.body.booking_id = id;

    let { coutDate, coutTime, date, time, dharmasala, roomList, advanceAmount, roomAmount } = req.body;

    // checking difference in dates to calculate the amount
    coutDate = moment(coutDate);
    date = moment(date);
    var daysDiff = coutDate.diff(date, "days");

    //setting checkout Date by increasing time by 3h
    const [hours, minutes, seconds] = coutTime.split(":");

    req.body.coutDate = coutDate
      .set({ h: Number(hours), m: Number(minutes) })
      .format("YYYY-MM-DD HH:mm:ss");
    req.body.coutTime = moment(req.body.coutDate).format("HH:mm:ss");

    let allRoomsAvailable = true;

    for (const roomNo of roomList) {
      // console.log("r--------->",roomNo)
      req.body.RoomNo = roomNo;
      try {
        const existingBooking = await TblCheckin.findOne({
          where: {
            RoomNo: parseInt(roomNo),
            dharmasala: dharmasala,
            [Op.and] : [
              {[Op.or]: [
                {
                  coutDate: {
                    [Op.gt]: date, // check-out date is after desired check-in date
                  },
                  date: {
                    [Op.lte]: coutDate
                  }
                },
                {
                  coutDate: {
                    [Op.eq]: date, // check-out date is equal to desired check-in date
                  },
                  coutTime: {
                    [Op.gt]: time, // check-out time is after desired check-in time
                  },
                },
              ]},
              {[Op.or] : [
                {
                  [Op.and] : [{
                    modeOfBooking : 1,
                    paymentStatus : 0,
                    paymentMode : 2
                  }]
                },
                {
                  [Op.and] : [{
                    modeOfBooking : 2,
                    paymentStatus : 1,
                    paymentMode : 1
                  }]
                },
                {
                  [Op.and] : [{
                    modeOfBooking : 1,
                    paymentStatus : 1,
                    paymentMode : 1
                  }]
                }
              ]}
            ]
          },
          raw: true,
        });

        if (existingBooking) {
          allRoomsAvailable = false;
          console.log(`Room ${roomNo} is not available`);
          break; // exit the loop if any room is not available
        }

        let perDayhour = await TblRoom.findOne({
          where: {
            dharmasala_id: dharmasala,
            FroomNo: { [Op.lte]: roomNo },
            TroomNo: { [Op.gte]: roomNo },
          },
          raw: true,
        });
        let amount = {
          roomAmount: perDayhour.Rate,
        };
        if(forUser) {
          amount.roomAmount = roomAmount;
        }
        amount.advanceAmount = advanceAmount;

        perDayhour = perDayhour.coTime;
        const maxDurationInHours = 3 * perDayhour;
        const maxDurationInMs = maxDurationInHours * 60 * 60 * 1000;
        const checkinDateTime = new Date(`${date}T${time}`);
        const maxCheckoutDateTime = new Date(
          checkinDateTime.getTime() + maxDurationInMs
        );
        const userCheckoutDateTime = new Date(
          Date.parse(`${coutDate}T${coutTime}`)
        );

        if (userCheckoutDateTime.getTime() > maxCheckoutDateTime.getTime()) {
          allRoomsAvailable = false;
          console.log(`Room ${roomNo} is not available for the given duration`);
          break; // exit the loop if any room is not available for the given duration
        }

        let room = await TblCheckin.create({ ...req.body, ...amount });
        room.setDataValue("bookedByName", userName);
        result.push(room);
      } catch (error) {
        return {
          status: false,
          message: "Room failed to book",
          data: error?.message,
        };
      }
    }

    if (!allRoomsAvailable) {
      // delete any bookings that were made before encountering an unavailable room
      result.forEach(async (booking) => {
        await TblCheckin.destroy({ where: { id: booking.id } });
      });
      throw new ApiError(
        httpStatus.CONFLICT,
        "One or more rooms are unavailable"
      );
    }
    sendroomSms(req.body.contactNo,"checkin")
    return {
      status: true,
      message: "Room booked successfully!!",
      data: result,
    };
  };

  roomCheckOutAll = async (req) => {
    const id = req.body.id;

    try {
      const rooms = await TblCheckin.findAll({ where: { booking_id: id } });

      if (!rooms) {
        throw new Error({ error: "Room not found" });
      }

      const checkoutDate = req.body.checkoutDate
        ? new Date(req.body.checkoutDate)
        : new Date();
      const checkoutTime = req.body.checkoutDate
        ? new Date(req.body.checkoutDate).toLocaleTimeString()
        : new Date().toLocaleTimeString();

      const updatedRooms= [];
      for (let i=0; i<rooms.length; i++){
        const room = rooms[i];

        room.coutDate = checkoutDate;
        room.coutTime = checkoutTime;

        const checkindatetime = new Date(room.date);
        const checkoutdatetime = new Date(room.coutDate);

        // Adding 5 hours and 30 minutes
        checkindatetime.setHours(checkindatetime.getHours() + 5);
        checkindatetime.setMinutes(checkindatetime.getMinutes() + 30);
        checkoutdatetime.setHours(checkoutdatetime.getHours() + 5);
        checkoutdatetime.setMinutes(checkoutdatetime.getMinutes() + 30);

        var time = checkoutdatetime - checkindatetime;
        const Time = await TblRoom.findOne({
          where : {
            dharmasala_id: rooms[0].dharmasala,
              FroomNo: {
                [Op.lte]: rooms[0].RoomNo
              },
              TroomNo:{
                [Op.gte]: rooms[0].RoomNo
              }
          },
          attributes : ["coTime"]
        });
        // const days_difference = Math.floor(time / (1000 * 60 * 60 * 24));
        // const hours_difference = Math.floor((time / (1000 * 60 * 60)) % 24);
        const days_difference = Math.floor(time / (1000 * 60 * 60 * (Time.coTime - 3)));
        const hours_difference = Math.floor((time / (1000 * 60 * 60)) % (Time.coTime - 3));

        if (room.checkoutBy === null) {
          if (days_difference == 0) {
            room.roomAmount = room.roomAmount;
          }else if (days_difference > 0 && hours_difference < 3) {
            room.roomAmount = room.roomAmount * days_difference;
          }else if (days_difference > 0 && hours_difference >= 3) {
            room.roomAmount = room.roomAmount * (days_difference + 1);
          }
        }
        room.checkoutBy=req.user.id

        await room.save();
        updatedRooms.push(room);
      }
      // room.advanceAmount =
      //   room.advanceAmount - req.body.advanceAmount > 0
      //     ? room.advanceAmount - req.body.advanceAmount
      //     : 0;
      // const employeeExists = await tblEmployee.findOne({where:{id:req.user.id},raw:true});
      // if(!employeeExists){
      //   throw new Error({ error: "unauthorized" });
      // }
      
      sendroomSms(rooms[0].contactNo,"checkout")
      return {
        status: true,
        message: "Room checked out successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Room failed to checkout",
        data: error?.message,
      };
    }
  };

  roomCheckOut = async (req) => {
    const id = req.body.id;

    try {
      const room = await TblCheckin.findOne({ where: { id: id } });

      if (!room) {
        throw new Error({ error: "Room not found" });
      }

      const checkoutDate = req.body.checkoutDate
        ? new Date(req.body.checkoutDate)
        : new Date();
      const checkoutTime = req.body.checkoutDate
        ? new Date(req.body.checkoutDate).toLocaleTimeString()
        : new Date().toLocaleTimeString();

        room.coutDate = checkoutDate;
        room.coutTime = checkoutTime;

        const checkindatetime = new Date(room.date);
        const checkoutdatetime = new Date(room.coutDate);

        // Adding 5 hours and 30 minutes
        checkindatetime.setHours(checkindatetime.getHours() + 5);
        checkindatetime.setMinutes(checkindatetime.getMinutes() + 30);
        checkoutdatetime.setHours(checkoutdatetime.getHours() + 5);
        checkoutdatetime.setMinutes(checkoutdatetime.getMinutes() + 30);

        var time = checkoutdatetime - checkindatetime;
        const Time = await TblRoom.findOne({
          where : {
            dharmasala_id: room.dharmasala,
              FroomNo: {
                [Op.lte]: room.RoomNo
              },
              TroomNo:{
                [Op.gte]: room.RoomNo
              }
          },
          attributes : ["coTime"]
        });
        // const days_difference = Math.floor(time / (1000 * 60 * 60 * 24));
        // const hours_difference = Math.floor((time / (1000 * 60 * 60)) % 24);
        const days_difference = Math.floor(time / (1000 * 60 * 60 * (Time.coTime - 3)));
        const hours_difference = Math.floor((time / (1000 * 60 * 60)) % (Time.coTime - 3));

        if (days_difference == 0) {
          room.roomAmount = room.roomAmount;
        }else if (days_difference > 0 && hours_difference < 3) {
          room.roomAmount = room.roomAmount * days_difference;
        }else if (days_difference > 0 && hours_difference >= 3) {
          room.roomAmount = room.roomAmount * (days_difference + 1);
        }
        room.checkoutBy=req.user.id;
        await room.save();
      // room.advanceAmount =
      //   room.advanceAmount - req.body.advanceAmount > 0
      //     ? room.advanceAmount - req.body.advanceAmount
      //     : 0;
      // const employeeExists = await tblEmployee.findOne({where:{id:req.user.id},raw:true});
      // if(!employeeExists){
      //   throw new Error({ error: "unauthorized" });
      // }
      
      sendroomSms(room.contactNo,"checkout")
      return {
        status: true,
        message: "Room checked out successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Room failed to checkout",
        data: error?.message,
      };
    }
  };

  cancelCheckin = async (req) => {
    if (!(req.body.id || req.body.bookingId)) {
      throw new Error({ error: "bookingId or id is required" });
    }
    const searchObj = {};
    if (req.body.id) {
      searchObj.id = req.body.id;
    } else {
      searchObj.booking_id = req.body.bookingId;
    }

    try {
      const roomOrRooms = await TblCheckin.findAll({
        where: searchObj,
        raw: true,
        nest: true,
      });

      if (!roomOrRooms) {
        throw new Error({ error: "Room Or Rooms not found" });
      }

      // if (roomOrRooms && roomOrRooms.length === 1 && req.body.id) {
        const currentDate = moment(new Date()).subtract(5, 'hours').subtract(30, 'minutes');
        const roomChDate = moment(roomOrRooms[0].date).subtract(5, 'hours').subtract(30, 'minutes');
        const differenceInHours = moment.duration(currentDate.diff(roomChDate)).asHours();
        if (differenceInHours >= 1) {
          return {
            status: false,
            message: "Room failed to cancel",
            data: "Time Limit Elapsed",
          };
        }
        console.log(currentDate,"       ", roomChDate, "       ", differenceInHours)
      // }

      const checkoutDate = req.body.checkoutDate
        ? new Date(req.body.checkoutDate)
        : new Date();

      for(const room of roomOrRooms){
      // room.forceCoutDate = checkoutDate; Comment out because need one table for forceCheckout data
      room.checkoutBy=req.user.id
      room.coutDate = new Date();
      room.coutTime = new Date().toLocaleTimeString('en-US', {hour12: false});
      }

      const canceledCheckinsObj = roomOrRooms
      await TblCheckin.destroy({ where: searchObj });
      await TblCanceledCheckins.bulkCreate(canceledCheckinsObj);

      return {
        status: true,
        message: "Room cancelled successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Room failed to cancel",
        data: error?.message,
      };
    }
  };

  updateCheckinPayment = async (req) => {
    if (!req.body.bookingId) {
      throw new Error({ error: "Booking id is Required" });
    }
    if (!req.body.paymentId) {
      throw new Error({ error: "Payment id is Required" });
    }

    const { bookingId, paymentId } = req.body;

    try {
      const room = await TblCheckin.findOne({
        where: { booking_id: bookingId },
      });

      if (!room) {
        throw new Error({ error: "Room not found" });
      }

      const paymentDate = req.body.paymentDate
        ? new Date(req.body.paymentDate)
        : new Date();

      await TblCheckin.update(
        { paymentDate: paymentDate, paymentStatus: 1, paymentid: paymentId },
        { where: { booking_id: bookingId } }
      );

      return {
        status: true,
        message: "Updated successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  };

  getBookingFromBookingId = async (req) => {
    if (!req.body.bookingId && !req.body.id) {
      throw new Error({ error: "Booking id or id is Required" });
    }

    const searchObj = {};

    if (req.body.id) {
      searchObj.id = req.body.id;
    }

    if (req.body.bookingId) {
      searchObj.booking_id = req.body.bookingId;
    }

    try {
      const rooms = await TblCheckin.findAll({
        where: searchObj,
        attributes: [
          "booking_id",
          [
            // sequelize.fn("SUM", sequelize.col("roomAmount")),
            // "total_room_amount",
            sequelize.literal(`
            SUM(
              CASE
                WHEN DATEDIFF(coutDate, date) = 0
                THEN roomAmount
                ELSE roomAmount * DATEDIFF(coutDate, date)
              END
            )
          `),
          "total_room_amount"
            
          ],
          [
            sequelize.fn("SUM", sequelize.col("advanceAmount")),
            "total_advance_amount",
          ],
          [
            sequelize.fn("DATEDIFF", sequelize.col("coutDate"), sequelize.col("date")),
            "stay_days",
          ]
        ],
        raw: true,
        nest: true,
      });

      if (!rooms) {
        return false;
      }

      rooms[0].total =
        rooms[0].total_room_amount + rooms[0].total_advance_amount;

      return rooms && rooms[0].booking_id ? rooms : false;
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  };

  forceCheckOut = async (req) => {
    const id = req.body.id;

    try {
      const room = await TblCheckin.findOne({ where: { id: id } });

      if (!room) {
        throw new Error({ error: "Room not found" });
      }

      // const currentDate = moment(new Date()).subtract(5,'hours').subtract(30,'minutes');
      // const roomChDate = moment(room.date).subtract(5,'hours').subtract(30,'minutes');

      // const differenceInHours = moment.duration(currentDate.diff(roomChDate)).asHours();
      // if(differenceInHours>=1){
      //   return {
      //     status: false,
      //     message: "Room failed to checkout",
      //     data: "Time Limit Elapsed",
      //   };
      // }
      
      // console.log(currentDate,"       ", roomChDate, "       ", differenceInHours)
      

      const checkoutDate = req.body.checkoutDate
        ? new Date(req.body.checkoutDate)
        : new Date();
      const checkoutTime = req.body.checkoutDate
        ? new Date(req.body.checkoutDate).toLocaleTimeString()
        : new Date().toLocaleTimeString();

      room.forceCoutDate = checkoutDate;
      room.checkoutBy=req.user.id
      room.coutDate = checkoutDate;
      // room.roomAmount = room.roomAmount + room.advanceAmount;
      // room.advanceAmount = 0;

      await room.save();
      sendroomSms(room.contactNo,"checkout")
      return {
        status: true,
        message: "Force Room Check out successful",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Room failed to checkout",
        data: error?.message,
      };
    }
  };

  forceCheckOutAll = async (req) => {
    const bookingId = req.body.bookingId;

    try {
      const rooms = await TblCheckin.findAll({ where: { booking_id: bookingId } });

      if (!rooms) {
        throw new Error({ error: "Rooms not found" });
      }

      const checkoutDate = req.body.checkoutDate
        ? new Date(req.body.checkoutDate)
        : new Date();
      const checkoutTime = req.body.checkoutDate
        ? new Date(req.body.checkoutDate).toLocaleTimeString()
        : new Date().toLocaleTimeString();

      const updatedRooms = [];
      for (let i=0; i<rooms.length; i++){
        const room = rooms[i];

        room.forceCoutDate = checkoutDate;
        room.checkoutBy=req.user.id;
        room.coutDate = checkoutDate;
        room.coutTime = checkoutTime;

        await room.save();
        updatedRooms.push(room);
      }

      sendroomSms(rooms[0].contactNo,"checkout")
      return {
        status: true,
        message: "Rooms Force Check out successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Rooms failed to forceCheckOut",
        data: error?.message,
      };
    }
  };

  updateHoldinDateTime = async (req) => {
    const id = req.body.id;

    try {
      const holdin = await TblHoldin.findOne({ where: { id: id } });

      if (!holdin) {
        throw new Error("holdin not found");
      }

      console.log(req.body.remain, "req remain");
      console.log(req.body.remainTime, "req remainTime");

      const remain = req.body.remain ? new Date(req.body.remain) : new Date();
      const remainTime = req.body.remainTime
        ? new Date(req.body.remainTime)
        : new Date();

      console.log(remain, "remain");
      console.log(remainTime, "remainTime");

      holdin.remain = remain;
      holdin.remainTime = remainTime;
      holdin.checkoutBy = req.user.id;

      await holdin.save();

      return {
        status: true,
        message: "Holdin Updated Successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Failed To Update",
        data: error?.message,
      };
    }
  };

  getCancelHistory = async (req) => {
    try {
      const cancelledCheckins = await TblCanceledCheckins.findAll({
        raw: true,
      });

      if (!cancelledCheckins.length) {
        throw new Error("No Cancel History Found");
      }

      for(const checkin of cancelledCheckins){
        const dharmasalaData = await TblDharmasal.findOne({where:{dharmasala_id:checkin.dharmasala},attributes:['name']})
        const roomData = await TblRoom.findOne({where:{
          FroomNo: {
            [Op.lte]:checkin.RoomNo
          },
          TroomNo:{
            [Op.gte]:checkin.RoomNo
          }
        },raw:true})
        const categoryData =roomData.category_id?await TblRoomCategory.findOne({where:{category_id:JSON.parse(JSON.parse(roomData.category_id))},attributes:['name'],raw:true}):""
        const facilityData =roomData.facility_id?await TblFacility.findOne({where:{facility_id:JSON.parse(JSON.parse(roomData.facility_id))},attributes:['name'],raw:true}):""
        const checkoutByName = checkin.checkoutBy?await tblEmployee.findOne({where:{id:checkin.checkoutBy},attributes:['Username'],raw:true}):{};
        const checkoutBy = checkin.checkoutBy?await TblAdmin.findOne({where:{id:checkin.checkoutBy},attributes:['username'],raw:true}):{};
        const bookedByName = checkin.booked_by?await tblEmployee.findOne({where:{id:checkin.booked_by},attributes:['Username'],raw:true}):{};
        const bookedBy = checkin.booked_by?await TblAdmin.findOne({where:{id:checkin.booked_by},attributes:['username'],raw:true}):{};
        if(checkoutByName && Object.keys(checkoutByName)){
          checkin.cancelByName=checkoutByName.Username;
        }
        if(checkoutBy && Object.keys(checkoutBy)){
          checkin.cancelByName=checkoutBy.username;
        }
        if(bookedByName && Object.keys(bookedByName)){
          checkin.bookedByName=bookedByName.Username;
        }
        if(bookedBy && Object.keys(bookedBy)){
          checkin.bookedByName=bookedBy.username;
        }
        checkin.cancelDate=checkin.forceCoutDate?checkin.forceCoutDate:'';
        checkin.dharmasalaName=dharmasalaData.name?dharmasalaData.name:'';
        checkin.categoryName=categoryData.name?categoryData.name:'';
        checkin.facilityName=facilityData.name?facilityData.name:'';
      }

      return cancelledCheckins;
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "No Cancel History Found",
        data: error?.message,
      };
    }
  };

  getHoldinHistory = async (req) => {
    try {
      const { fromDate, toDate } = req.query;
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 2
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        0,
        0,
        -1
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      let whereclause = {};
      whereclause = {
        checkoutBy: {[Op.ne]: null}
      }
      // if (!fromDate && !toDate) {
      //   whereclause.since = { [Op.between] : [ startOfToday, endOfToday ] }
      // }
      if (fromDate && toDate) {
        whereclause.since = {[Op.and] : [
          {[Op.gte] : fromDate},
          {[Op.lte] : toDate}
        ]}
      }
      const holdins = await TblHoldin.findAll({ where: whereclause, order: [["id", "DESC"]], raw: true });

      if (!holdins.length) {
        throw new Error("No Holdin History Found");
      }

      for (const hold of holdins) {
        const holdData1 = hold.holdBy?await tblEmployee.findOne({ where: { id: hold.holdBy } }):"";
        const holdData2 = hold.holdBy?await TblAdmin.findOne({ where: { id: hold.holdBy } }):"";
        if(holdData1){
          hold.holdByName = holdData1.Username?holdData1.Username:"";
        }else if(holdData2){
          hold.holdByName = holdData2.username?holdData2.username:"";
        }

        const checkoutData1 = hold.checkoutBy?await tblEmployee.findOne({ where: { id: hold.checkoutBy } }):"";
        const checkoutData2 = hold.checkoutBy?await TblAdmin.findOne({ where: { id: hold.checkoutBy } }):"";
        if(checkoutData1){
          hold.checkoutByName = checkoutData1.Username?checkoutData1.Username:"";
        }else if(checkoutData2){
          hold.checkoutByName = checkoutData2.username?checkoutData2.username:"";
        }

        const dharmashala = hold.dharmasala?await TblDharmasal.findOne({ where: { dharmasala_id: hold.dharmasala } }):"";
        hold.dharmashalaName = dharmashala.name?dharmashala.name:"";

        const category = hold.category?await TblRoomCategory.findOne({ where: { category_id: hold.category } }):"";
        hold.categoryName = category.name?category.name:"";
      }
      return holdins
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "No Holdin History Found",
        data: error?.message,
      };
    }
  };

  getConsolidated = async (req) => {
    const {
      employeeName,
    } = req.query;

    const { fromDate, toDate } = req.body;
    if(fromDate && toDate) {
      const query = `SELECT 
      DATE(date) AS date,
        Username,
        ROUND(SUM(onlineCheckinAmount)) AS totalOnlineCheckinAmount,
        ROUND(SUM(cashCheckinAmount)) AS totalCashCheckinAmount,
        ROUND(SUM(rateAmount)) AS totalRateAmount, 
        ROUND(SUM(checkoutAmount)) AS totalCheckoutAmount,
        ROUND(SUM(cancelledAmount)) AS totalCancelledAmount,
        ROUND(SUM(totalAmount)) AS finalAmount 
        FROM (
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
          tbl_employees.Username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) AS rateAmount,
          SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) - SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount 
              ELSE 0
            END
          ) AS totalAmount
            FROM 
            tbl_checkins 
            LEFT JOIN 
            tbl_employees ON tbl_checkins.checkoutBy = tbl_employees.id 
            GROUP BY 
            tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
            UNION 
            SELECT 
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
            tbl_employees.Username,
            0 AS onlineCheckinAmount,
            SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount, 
            0 AS cancelledAmount,
            SUM(tbl_checkins.advanceAmount) AS totalAmount 
            FROM
            tbl_checkins
            LEFT JOIN
            tbl_employees ON tbl_checkins.booked_by = tbl_employees.id 
            WHERE
            tbl_checkins.paymentMode = 2
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
            UNION
            SELECT 
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
            tbl_employees.Username,
            SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
            0 AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount, 
            0 AS cancelledAmount,
            0 AS totalAmount 
            FROM
            tbl_checkins
            LEFT JOIN
            tbl_employees ON tbl_checkins.booked_by = tbl_employees.id 
            WHERE 
            tbl_checkins.paymentMode = 1
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
            UNION
            SELECT
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
            tbl_employees.Username,
            0 AS onlineCheckinAmount,
            0 AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount,
            SUM(advanceAmount) AS cancelledAmount,
            -(SUM(advanceAmount)) AS totalAmount
            FROM
            canceled_checkins
            LEFT JOIN
            tbl_employees ON canceled_checkins.checkoutBy = tbl_employees.id
            WHERE 
            canceled_checkins.paymentMode = 2
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
            UNION
            SELECT
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
            tbl_employees.Username,
            0 AS onlineCheckinAmount,
            SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount,
            0 AS cancelledAmount,
            SUM(canceled_checkins.advanceAmount) + 0.01 AS totalAmount
            FROM
            canceled_checkins
            LEFT JOIN
            tbl_employees ON canceled_checkins.booked_by = tbl_employees.id
            WHERE 
            canceled_checkins.paymentMode = 2
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
            UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) AS rateAmount,
          SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) - SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount 
              ELSE 0
            END
          ) AS totalAmount
          FROM 
          tbl_checkins 
          LEFT JOIN 
          tbl_admins ON tbl_checkins.checkoutBy = tbl_admins.id 
          GROUP BY 
          tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
          UNION 
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          SUM(tbl_checkins.advanceAmount) AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_admins ON tbl_checkins.booked_by = tbl_admins.id 
          WHERE
          tbl_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_admins.username,
          SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          0 AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_admins ON tbl_checkins.booked_by = tbl_admins.id 
          WHERE 
          tbl_checkins.paymentMode = 1
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          SUM(advanceAmount) AS cancelledAmount,
          -(SUM(advanceAmount)) AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_admins ON canceled_checkins.checkoutBy = tbl_admins.id
          WHERE 
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(canceled_checkins.advanceAmount) + 0.01 AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_admins ON canceled_checkins.booked_by = tbl_admins.id
          WHERE 
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
        ) 
            AS merged_data 
            WHERE DATE(date) BETWEEN '${fromDate}' AND '${toDate}' AND Username IS NOT NULL AND onlineCheckinAmount IS NOT NULL AND cashCheckinAmount IS NOT NULL AND rateAmount IS NOT NULL AND checkoutAmount IS NOT NULL AND cancelledAmount IS NOT NULL GROUP BY Username, DATE(date) ORDER BY DATE(date) DESC;`;
      const [data] = await sequelize.query(query);
      return data;
    }

    if(employeeName) {
      const query = `SELECT 
      DATE(date) AS date,
        Username,
        ROUND(SUM(onlineCheckinAmount)) AS totalOnlineCheckinAmount,
        ROUND(SUM(cashCheckinAmount)) AS totalCashCheckinAmount,
        ROUND(SUM(rateAmount)) AS totalRateAmount, 
        ROUND(SUM(checkoutAmount)) AS totalCheckoutAmount,
        ROUND(SUM(cancelledAmount)) AS totalCancelledAmount,
        ROUND(SUM(totalAmount)) AS finalAmount 
        FROM (
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
          tbl_employees.Username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) AS rateAmount,
          SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) - SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS totalAmount
            FROM 
            tbl_checkins 
            LEFT JOIN 
            tbl_employees ON tbl_checkins.checkoutBy = tbl_employees.id 
            GROUP BY 
            tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
            UNION 
            SELECT 
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
            tbl_employees.Username,
            0 AS onlineCheckinAmount,
            SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount, 
            0 AS cancelledAmount,
            SUM(tbl_checkins.advanceAmount) AS totalAmount 
            FROM
            tbl_checkins
            LEFT JOIN
            tbl_employees ON tbl_checkins.booked_by = tbl_employees.id 
            WHERE
            tbl_checkins.paymentMode = 2
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
            UNION
            SELECT 
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
            tbl_employees.Username,
            SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
            0 AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount, 
            0 AS cancelledAmount,
            0 AS totalAmount 
            FROM
            tbl_checkins
            LEFT JOIN
            tbl_employees ON tbl_checkins.booked_by = tbl_employees.id 
            WHERE 
            tbl_checkins.paymentMode = 1
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
            UNION
            SELECT
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
            tbl_employees.Username,
            0 AS onlineCheckinAmount,
            0 AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount,
            SUM(advanceAmount) AS cancelledAmount,
            -(SUM(advanceAmount)) AS totalAmount
            FROM
            canceled_checkins
            LEFT JOIN
            tbl_employees ON canceled_checkins.checkoutBy = tbl_employees.id
            WHERE 
            canceled_checkins.paymentMode = 2
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
            UNION
            SELECT
            TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
            tbl_employees.Username,
            0 AS onlineCheckinAmount,
            SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
            0 AS rateAmount,
            0 AS checkoutAmount,
            0 AS cancelledAmount,
            SUM(canceled_checkins.advanceAmount) + 0.01 AS totalAmount
            FROM
            canceled_checkins
            LEFT JOIN
            tbl_employees ON canceled_checkins.booked_by = tbl_employees.id
            WHERE 
            canceled_checkins.paymentMode = 2
            GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
            UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) AS rateAmount,
          SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) - SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS totalAmount
          FROM 
          tbl_checkins 
          LEFT JOIN 
          tbl_admins ON tbl_checkins.checkoutBy = tbl_admins.id 
          GROUP BY 
          tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
          UNION 
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          SUM(tbl_checkins.advanceAmount) AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_admins ON tbl_checkins.booked_by = tbl_admins.id 
          WHERE
          tbl_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_admins.username,
          SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          0 AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_admins ON tbl_checkins.booked_by = tbl_admins.id 
          WHERE 
          tbl_checkins.paymentMode = 1
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          SUM(advanceAmount) AS cancelledAmount,
          -(SUM(advanceAmount)) AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_admins ON canceled_checkins.checkoutBy = tbl_admins.id
          WHERE 
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(canceled_checkins.advanceAmount) + 0.01 AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_admins ON canceled_checkins.booked_by = tbl_admins.id
          WHERE 
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
        ) 
            AS merged_data 
            WHERE date IS NOT NULL AND Username = '${employeeName}' AND onlineCheckinAmount IS NOT NULL AND cashCheckinAmount IS NOT NULL AND rateAmount IS NOT NULL AND checkoutAmount IS NOT NULL AND cancelledAmount IS NOT NULL GROUP BY Username, DATE(date) ORDER BY DATE(date) DESC;`;
      const [data] = await sequelize.query(query);
      return data;
    }

    const query = `SELECT 
    DATE(date) AS date,
      Username,
      ROUND(SUM(onlineCheckinAmount)) AS totalOnlineCheckinAmount,
      ROUND(SUM(cashCheckinAmount)) AS totalCashCheckinAmount,
      ROUND(SUM(rateAmount)) AS totalRateAmount, 
      ROUND(SUM(checkoutAmount)) AS totalCheckoutAmount,
      ROUND(SUM(cancelledAmount)) AS totalCancelledAmount,
      ROUND(SUM(totalAmount)) AS finalAmount 
      FROM (
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
          tbl_employees.Username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) AS rateAmount,
          SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) - SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS totalAmount
          FROM 
          tbl_checkins 
          LEFT JOIN 
          tbl_employees ON tbl_checkins.checkoutBy = tbl_employees.id 
          GROUP BY 
          tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
          UNION 
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_employees.Username,
          0 AS onlineCheckinAmount,
          SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          SUM(tbl_checkins.advanceAmount) AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_employees ON tbl_checkins.booked_by = tbl_employees.id 
          WHERE
          tbl_checkins.paymentMode = 2
          GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_employees.Username,
          SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          0 AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_employees ON tbl_checkins.booked_by = tbl_employees.id 
          WHERE 
          tbl_checkins.paymentMode = 1
          GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_employees.Username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          SUM(advanceAmount) AS cancelledAmount,
          -(SUM(advanceAmount)) AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_employees ON canceled_checkins.checkoutBy = tbl_employees.id
          WHERE 
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_employees.Username,
          0 AS onlineCheckinAmount,
          SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(canceled_checkins.advanceAmount) + 0.01 AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_employees ON canceled_checkins.booked_by = tbl_employees.id
          WHERE
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
          UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) AS rateAmount,
          SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(
            CASE
              WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
              WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
              ELSE 0
            END
          ) - SUM(
            CASE
              WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
              ELSE 0
            END
          ) AS totalAmount
          FROM 
          tbl_checkins 
          LEFT JOIN 
          tbl_admins ON tbl_checkins.checkoutBy = tbl_admins.id 
          GROUP BY 
          tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
          UNION 
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          SUM(tbl_checkins.advanceAmount) AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_admins ON tbl_checkins.booked_by = tbl_admins.id 
          WHERE
          tbl_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT 
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
          tbl_admins.username,
          SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount, 
          0 AS cancelledAmount,
          0 AS totalAmount 
          FROM
          tbl_checkins
          LEFT JOIN
          tbl_admins ON tbl_checkins.booked_by = tbl_admins.id 
          WHERE 
          tbl_checkins.paymentMode = 1
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          0 AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          SUM(advanceAmount) AS cancelledAmount,
          -(SUM(advanceAmount)) AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_admins ON canceled_checkins.checkoutBy = tbl_admins.id
          WHERE 
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
          UNION
          SELECT
          TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
          tbl_admins.username,
          0 AS onlineCheckinAmount,
          SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
          0 AS rateAmount,
          0 AS checkoutAmount,
          0 AS cancelledAmount,
          SUM(canceled_checkins.advanceAmount) + 0.01 AS totalAmount
          FROM
          canceled_checkins
          LEFT JOIN
          tbl_admins ON canceled_checkins.booked_by = tbl_admins.id
          WHERE
          canceled_checkins.paymentMode = 2
          GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
      ) 
          AS merged_data 
          WHERE date IS NOT NULL AND Username IS NOT NULL AND onlineCheckinAmount IS NOT NULL AND cashCheckinAmount IS NOT NULL AND rateAmount IS NOT NULL AND checkoutAmount IS NOT NULL AND cancelledAmount IS NOT NULL GROUP BY Username, DATE(date) ORDER BY DATE(date) DESC;`;
    const [data] = await sequelize.query(query);
    return data;
  };
  
  savePaymentDetails = async (req) => {
    let result = "";
    result = await TblCheckin.update(
      {
        paymentid: req.body.PAYMENT_ID,
        paymentStatus: req.body.PAYMENT_STATUS == "Success" ? 1 : 0,
      },
      {
        where: {
          booking_id: req.body.id,
        },
      }
    );

    return result;
  };

  getInfoByBookingId = async (req) => {
    const query = `SELECT TC.*,TD.name AS dharmasala_name,TR.category_id,TR.facility_id FROM tbl_checkins TC INNER JOIN tbl_dharmasalas TD ON TD.dharmasala_id=TC.dharmasala JOIN tbl_rooms TR ON TC.RoomNo >= TR.FroomNo AND TC.RoomNo <= TR.TroomNo WHERE TC.booking_id='${req.params.id}';`;

    const [bookingData] = await sequelize.query(query, {
      raw: true,
      logging: console.log,
    });
    for (const record of bookingData) {
      const categoryId = JSON.parse(JSON.parse(record.category_id));
      const facilityIds = JSON.parse(JSON.parse(record.facility_id));
      const categoryName = await TblRoomCategory.findOne({
        where: { category_id: categoryId },
        raw: true,
        attributes: ["name"],
      });
      let facilityNames = await TblFacility.findAll({
        where: { facility_id: facilityIds },
        raw: true,
        attributes: ["name"],
      });
      facilityNames = facilityNames.map((facility) => {
        return facility.name;
      });
      record.categoryName = categoryName.name;
      record.facilities = facilityNames;
    }
    return bookingData;
  };

  checkinHistoryUser = async (req) => {
    const bookedByUser = req.user.id;
    let searchObj = {};
    searchObj.bookedByUser = bookedByUser;
    const { fromDate, toDate, paymentStatus } = req.query;
    if(fromDate && toDate) {
      searchObj.date = {
        [Op.between] : [ fromDate, toDate ]
      }
    }

    if(paymentStatus) {
      searchObj.paymentStatus = paymentStatus
    }
    const userCheckinData = await TblCheckin.findAll({
      where: searchObj,
      raw: true,
    });
    for (const data of userCheckinData) {
      const dharamshala = await TblDharmasal.findOne({ where: { dharmasala_id : data.dharmasala } });
      const query = `SELECT * FROM tbl_rooms WHERE ${data.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
      const [[queryData]] = await sequelize.query(query);
      const category = await TblRoomCategory.findOne({ where: { category_id : JSON.parse(JSON.parse(queryData.category_id)) } });
      const facility = await TblFacility.findOne({ where: { facility_id : JSON.parse(JSON.parse(queryData.facility_id)) } });
      data.dharamshalaName = dharamshala.name
      data.categoryName = category.name
      data.facilityName = facility.name
    }
    return { userCheckinData };
  };

  checkinHistory = async (req) => {
    const currentRooms = await TblCheckin.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{
              paymentStatus: '0',
              paymentMode: '2'
            }]
          },
          {
            [Op.and]: [{
              paymentStatus: '1',
              paymentMode: '1'
            }]
          }
        ]
      },
      logging: console.log,
    });

    for (const room of currentRooms) {
      const employeeData = room.booked_by?await tblEmployee.findOne({ where: { id: room.booked_by }}):await tblUsers.findOne({ where: { id: room.bookedByUser }});
      const adminData = room.booked_by?await TblAdmin.findOne({ where: { id: room.booked_by }}):"";
      if(employeeData){
        room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
      }else if(adminData){
        room.setDataValue('bookedByName', adminData.username);
      }
      // room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
    }
    const currentRoomsData = await Promise.all(
      currentRooms.map(async (room) => {
        let query = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${room.dharmasala}`;
        const [[data]] = await sequelize.query(query);

        let query2 = `select * from tbl_rooms where ${room.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
        const [[roomDetails]] = await sequelize.query(query2);

        const categories = roomDetails && roomDetails.category_id
          ? await TblRoomCategory.findAll({
              where: {
                category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
              },
            })
          : [];
        let category_name = categories.map((category) => category.name);

        const facilities = roomDetails && roomDetails.facility_id
          ? await TblFacility.findAll({
              where: {
                facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
              },
            })
          : [];
        let facility_name = facilities.map((facility) => facility.name);

        return {
          ...room.dataValues,
          dharmasala: {
            ...data,
            id: room.dataValues.dharmasala,
          },
          category_name,
          facility_name,
        };
      })
    );
    return currentRoomsData;
  };

  getCheckinHistory = async (req) => {
    const { booked_by, fromDate, toDate } = req.query;
    const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 2
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        0,
        0,
        -1
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
        console.log(startOfToday, endOfToday);
    let whereclause = {};
    whereclause = {
      [Op.or]: [
        {
          [Op.and]: [{
            paymentStatus: '0',
            paymentMode: '2'
          }]
        },
        {
          [Op.and]: [{
            paymentStatus: '1',
            paymentMode: '1'
          }]
        }
      ]
    }
    if (!booked_by && !fromDate && !toDate) {
      whereclause.date = { [Op.between] : [ startOfToday, endOfToday ] }
    }
    if (booked_by) {
      whereclause.booked_by = booked_by
    }
    if (fromDate && toDate) {
      whereclause.date = {[Op.and] : [
        {[Op.gte] : fromDate},
        {[Op.lte] : toDate}
      ]}
    }
    const currentRooms = await TblCheckin.findAll({
      // where: {
      //   [Op.or]: [
      //     {
      //       [Op.and]: [{
      //         paymentStatus: '0',
      //         paymentMode: '2'
      //       }]
      //     },
      //     {
      //       [Op.and]: [{
      //         paymentStatus: '1',
      //         paymentMode: '1'
      //       }]
      //     }
      //   ]
      // },
      where: whereclause,
      logging: console.log,
    });
  
    const cancelledRooms = await TblCanceledCheckins.findAll({
      where : whereclause,
      logging : console.log
    });

    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }

    for (const room of cancelledRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const employeeDataPromise = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by }, attributes: ["id", "Username"] })
        : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser }, attributes: ["id", "username", "name"] });
  
      const adminDataPromise = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by }, attributes: ["id", "username"] }) : null;
  
      // const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      // const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select category_id, facility_id, coTime from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);

      const checkinRoomAmount = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });

      const cancelRoomAmount = await TblCanceledCheckins.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });

      const roomAmountSumPromise = (checkinRoomAmount?.roomAmountSum || 0) + (cancelRoomAmount?.roomAmountSum || 0)

      const checkinAdvanceAmount = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });

      const cancelAdvanceAmount = await TblCanceledCheckins.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });

      const advanceAmountSumPromise = (checkinAdvanceAmount?.advanceAmountSum || 0) + (cancelAdvanceAmount?.advanceAmountSum || 0)
  
      // const categories = roomDetails && roomDetails.category_id
      //   ? await TblRoomCategory.findAll({
      //       where: {
      //         category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
      //       },
      //     })
      //   : [];
      // const category_name = categories.map((category) => category.name);
  
      // const facilities = roomDetails && roomDetails.facility_id
      //   ? await TblFacility.findAll({
      //       where: {
      //         facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
      //       },
      //     })
      //   : [];
      // const facility_name = facilities.map((facility) => facility.name);

      // const roomAmountSumResult = await TblCheckin.findOne({
      //   attributes: [
      //     [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
      //   ],
      //   where: {
      //     booking_id: bookingId,
      //     RoomNo: bookingRoom.roomNumbers,
      //   },
      //   raw: true,
      // });
  
      // const advanceAmountSumResult = await TblCheckin.findOne({
      //   attributes: [
      //     [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
      //   ],
      //   where: {
      //     booking_id: bookingId,
      //     RoomNo: bookingRoom.roomNumbers,
      //   },
      //   raw: true,
      // });

      const [
        employeeData,
        adminData,
        [[dharmasalaData]],
        categories,
        facilities,
        roomAmountSumResult,
        advanceAmountSumResult
      ] = await Promise.all([
        employeeDataPromise,
        adminDataPromise,
        sequelize.query(dharmasalaQuery),
        roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
            attributes: ["name"]
          })
        : [],
        roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
            attributes: ["name"]
          })
        : [],
        roomAmountSumPromise,
        advanceAmountSumPromise
      ]);
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
      const category_name = categories.map((category) => category.name);
      const facility_name = facilities.map((facility) => facility.name);
      const roomAmountSum = roomAmountSumResult || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult) || 0;
  
      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime,
        roomStatus : checkinAdvanceAmount.advanceAmountSum != null ? cancelAdvanceAmount.advanceAmountSum != null ? "Some Rooms Cancelled" : "Not Cancelled" : "All Cancelled"
      });
    }
  
    return currentRoomsData;
  };

  forceCheckOutHistory = async (req) => {
    const currentRooms = await TblCheckin.findAll({
      where: {
        forceCoutDate: {
          [Op.ne]: null
        }
      },
      logging: console.log,
    });

    for (const room of currentRooms) {
      const employeeData = room.booked_by?await tblEmployee.findOne({ where: { id: room.booked_by }}):await tblUsers.findOne({ where: { id: room.bookedByUser }});
      const adminData = room.booked_by?await TblAdmin.findOne({ where: { id: room.booked_by }}):"";
      if(employeeData){
        room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
      }else if(adminData){
        room.setDataValue('bookedByName', adminData.username);
      }
      // room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
    }
    const currentRoomsData = await Promise.all(
      currentRooms.map(async (room) => {
        let query = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${room.dharmasala}`;
        const [[data]] = await sequelize.query(query);

        let query2 = `select * from tbl_rooms where ${room.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
        const [[roomDetails]] = await sequelize.query(query2);

        const categories = roomDetails && roomDetails.category_id
          ? await TblRoomCategory.findAll({
              where: {
                category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
              },
            })
          : [];
        let category_name = categories.map((category) => category.name);

        const facilities = roomDetails && roomDetails.facility_id
          ? await TblFacility.findAll({
              where: {
                facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
              },
            })
          : [];
        let facility_name = facilities.map((facility) => facility.name);
        return {
          ...room.dataValues,
          dharmasala: {
            ...data,
            id: room.dataValues.dharmasala,
          },
          category_name,
          facility_name,
        };
      })
    );
    return currentRoomsData;
  };

  getAvailCategories = async (req, getAll=false) => {
    const searchObj = {};
    const {id} = req.body;
    if(!getAll && id){
      searchObj.dharmasala_id=id
    }   
    searchObj.roomType = {[Op.or]: ["1", "2"]}; 
    const distinctCategories = await TblRoom.findAll({
      where: searchObj,
      attributes:[[Sequelize.fn('DISTINCT', Sequelize.col('category_id')) ,'category_json'],],
      raw: true,
    });
    const distinctCategoryNames = []
    for(const category of distinctCategories){
      
      const categoryRec =await TblRoomCategory.findOne({where:{category_id:JSON.parse(JSON.parse(category.category_json))},attributes:['category_id','name'],raw:true})
      distinctCategoryNames.push(categoryRec)
    }
    return distinctCategoryNames;
  };

  checkinHistoryByNum = async (req) => {
    const {num:contactNo} = req.params; 
    const checkinHistory = await TblCheckin.findAll({
      where: {contactNo:contactNo},
      raw: true,
    });
    return checkinHistory;
  };

  roomBookingStats = async (req) => {

    const query = 'SELECT CI.booked_by,SUM(CI.roomAmount) AS cancelled_amount,SUM(CI.advanceAmount) advanced_amount,ET.Username FROM tbl_checkins CI LEFT JOIN tbl_employees ET ON CI.booked_by=ET.id GROUP BY CI.booked_by;'
    const [bookingData] = await sequelize.query(query, {
      raw: true,
      logging: console.log,
    });

  };

  getDharmasalas = async (req) => {  
    // const query = 'SELECT DISTINCT TD.dharmasala_id,TD.name FROM tbl_rooms TR INNER JOIN tbl_dharmasalas TD ON TR.dharmasala_id=TD.dharmasala_id;'
    const query = 'SELECT DISTINCT TD.dharmasala_id,TD.name FROM tbl_rooms TR INNER JOIN tbl_dharmasalas TD ON TR.dharmasala_id=TD.dharmasala_id WHERE TD.status=1;'

    const [DsWithRoomsAdded] = await sequelize.query(query);
    
    return DsWithRoomsAdded;
  };

  getRoomBookingReport = async (req) => {
    try {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        0,
        0,
        -1
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");

      console.log(startOfToday, " ", endOfToday);

      const query = `
      SELECT TC.modeOfBooking,SUM(TR.Rate) AS total_amount FROM tbl_checkins TC JOIN tbl_rooms TR ON TC.RoomNo >= TR.FroomNo AND TC.RoomNo <= TR.TroomNo WHERE TC.createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' GROUP BY TC.modeOfBooking;
    `;
      const [roomBookingReport, metadata] = await sequelize.query(query);

      return roomBookingReport;
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  };

//  getRoomBookingStats = async (req, forOnline = false, forEmployee = false) => {
 getRoomBookingStats = async (req, forEmployee = false) => {
    try {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        0,
        0,
        -1
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");

      // const query = `
      //   SELECT TE.Username,TE.id,TC.paymentMode,SUM(TR.Rate) AS total_amount FROM tbl_checkins TC JOIN tbl_rooms TR ON TC.RoomNo >= TR.FroomNo AND TC.RoomNo <= TR.TroomNo INNER JOIN tbl_employees TE ON TC.booked_by=TE.id WHERE TC.createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' AND ${
      //   forOnline ? "TC.modeOfBooking=2" : "TC.modeOfBooking=1"
      // }${
      //   forEmployee ? ` AND TC.booked_by=${req.user.id}` : ""
      // } GROUP BY TE.Username,TC.paymentMode;
      // `;
      if(!forEmployee) {
        // const query = `SELECT Username, SUM(online) AS online, SUM(cash) AS cash FROM (SELECT tbl_employees.Username, tbl_checkins.modeOfBooking, SUM(advanceAmount) + SUM(roomAmount) AS online, 0 AS cash FROM tbl_checkins LEFT JOIN tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE modeOfBooking=1 AND tbl_checkins.createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' GROUP BY modeOfBooking, booked_by UNION SELECT tbl_employees.Username, tbl_checkins.modeOfBooking, 0 AS online, SUM(advanceAmount) + SUM(roomAmount) AS cash FROM tbl_checkins LEFT JOIN tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE modeOfBooking=2 AND tbl_checkins.createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' GROUP BY modeOfBooking, booked_by) AS subquery GROUP BY Username;`;
        const query = `SELECT 
        DATE(date) AS date,
          Username,
          ROUND(SUM(onlineCheckinAmount)) AS online,
          ROUND(SUM(totalAmount)) AS cash 
          FROM (
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
              tbl_employees.Username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) AS rateAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) - SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS totalAmount
              FROM 
              tbl_checkins 
              LEFT JOIN 
              tbl_employees ON tbl_checkins.checkoutBy = tbl_employees.id 
              GROUP BY 
              tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_employees.Username,
              SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              SUM(tbl_checkins.advanceAmount) AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE paymentMode = '2'
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_employees.Username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              SUM(advanceAmount) AS cancelledAmount,
              -(SUM(advanceAmount)) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_employees ON canceled_checkins.checkoutBy = tbl_employees.id
              WHERE 
              canceled_checkins.paymentMode = 2
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_employees.Username,
              SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(canceled_checkins.advanceAmount) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_employees ON canceled_checkins.booked_by = tbl_employees.id WHERE paymentMode = '2'
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
              tbl_admins.username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) AS rateAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) - SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS totalAmount
              FROM 
              tbl_checkins 
              LEFT JOIN 
              tbl_admins ON tbl_checkins.checkoutBy = tbl_admins.id 
              GROUP BY 
              tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_admins.username,
              SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              SUM(tbl_checkins.advanceAmount) AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_admins ON tbl_checkins.booked_by = tbl_admins.id WHERE paymentMode = '2'
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_admins.username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              SUM(advanceAmount) AS cancelledAmount,
              -(SUM(advanceAmount)) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_admins ON canceled_checkins.checkoutBy = tbl_admins.id
              WHERE 
              canceled_checkins.paymentMode = 2
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_admins.username,
              SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(canceled_checkins.advanceAmount) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_admins ON canceled_checkins.booked_by = tbl_admins.id WHERE paymentMode = '2'
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_employees.Username,
              0 AS cashCheckinAmount,
              SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              0 AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE paymentMode = '1' AND paymentStatus = '1'
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_admins.username,
              0 AS cashCheckinAmount,
              SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              0 AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_admins ON tbl_checkins.booked_by = tbl_admins.id WHERE paymentMode = '1' AND paymentStatus = '1'
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          ) 
              AS merged_data 
              WHERE DATE(date) BETWEEN '${startOfToday}' AND '${endOfToday}' AND Username IS NOT NULL AND cashCheckinAmount IS NOT NULL AND rateAmount IS NOT NULL AND checkoutAmount IS NOT NULL AND cancelledAmount IS NOT NULL GROUP BY Username, DATE(date) ORDER BY DATE(date) DESC;`;
        const [data] = await sequelize.query(query);
        return data;
      }

      if(forEmployee) {
        // const query = `SELECT Username, SUM(online) AS online, SUM(cash) AS cash FROM (SELECT tbl_employees.Username, tbl_checkins.modeOfBooking, SUM(advanceAmount) + SUM(roomAmount) AS online, 0 AS cash FROM tbl_checkins LEFT JOIN tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE modeOfBooking=1 AND booked_by=${req.user.id} AND tbl_checkins.createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' GROUP BY modeOfBooking, booked_by UNION SELECT tbl_employees.Username, tbl_checkins.modeOfBooking, 0 AS online, SUM(advanceAmount) + SUM(roomAmount) AS cash FROM tbl_checkins LEFT JOIN tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE modeOfBooking=2 AND booked_by=${req.user.id} AND tbl_checkins.createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' GROUP BY modeOfBooking, booked_by) AS subquery GROUP BY Username;`;
        const query = `SELECT 
        DATE(date) AS date,
          id,
          Username,
          ROUND(SUM(onlineCheckinAmount)) AS online,
          ROUND(SUM(totalAmount)) AS cash 
          FROM (
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
              tbl_employees.id,
              tbl_employees.Username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) AS rateAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) - SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount 
                  ELSE 0
                END
              ) AS totalAmount
              FROM 
              tbl_checkins 
              LEFT JOIN 
              tbl_employees ON tbl_checkins.checkoutBy = tbl_employees.id 
              GROUP BY 
              tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_employees.id,
              tbl_employees.Username,
              SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              SUM(tbl_checkins.advanceAmount) AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE paymentMode = '2'
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_employees.id,
              tbl_employees.Username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              SUM(advanceAmount) AS cancelledAmount,
              -(SUM(advanceAmount)) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_employees ON canceled_checkins.checkoutBy = tbl_employees.id
              WHERE 
              canceled_checkins.paymentMode = 2
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_employees.id,
              tbl_employees.Username,
              SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(canceled_checkins.advanceAmount) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_employees ON canceled_checkins.booked_by = tbl_employees.id WHERE paymentMode = '2'
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate)) AS date,
              tbl_admins.id,
              tbl_admins.username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) AS rateAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(
                CASE
                  WHEN tbl_checkins.forceCoutDate IS NOT NULL THEN tbl_checkins.advanceAmount
                  WHEN tbl_checkins.checkoutBy > 0 AND tbl_checkins.forceCoutDate IS NULL AND modeOfBooking = '1' THEN tbl_checkins.roomAmount
                  ELSE 0
                END
              ) - SUM(
                CASE
                  WHEN tbl_checkins.checkoutBy > 0 AND modeOfBooking = '1' THEN tbl_checkins.advanceAmount
                  ELSE 0
                END
              ) AS totalAmount
              FROM 
              tbl_checkins 
              LEFT JOIN 
              tbl_admins ON tbl_checkins.checkoutBy = tbl_admins.id 
              GROUP BY 
              tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.coutDate))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_admins.id,
              tbl_admins.username,
              SUM(tbl_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              SUM(tbl_checkins.advanceAmount) AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_admins ON tbl_checkins.booked_by = tbl_admins.id WHERE paymentMode = '2'
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_admins.id,
              tbl_admins.username,
              0 AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              SUM(advanceAmount) AS cancelledAmount,
              -(SUM(advanceAmount)) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_admins ON canceled_checkins.checkoutBy = tbl_admins.id
              WHERE 
              canceled_checkins.paymentMode = 2
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION
              SELECT
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date)) AS date,
              tbl_admins.id,
              tbl_admins.username,
              SUM(canceled_checkins.advanceAmount) AS cashCheckinAmount,
              0 AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount,
              0 AS cancelledAmount,
              SUM(canceled_checkins.advanceAmount) AS totalAmount
              FROM
              canceled_checkins
              LEFT JOIN
              tbl_admins ON canceled_checkins.booked_by = tbl_admins.id WHERE paymentMode = '2'
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, canceled_checkins.date))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_employees.id,
              tbl_employees.Username,
              0 AS cashCheckinAmount,
              SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              0 AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_employees ON tbl_checkins.booked_by = tbl_employees.id WHERE paymentMode = '1' AND paymentStatus = '1'
              GROUP BY tbl_employees.Username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
              UNION 
              SELECT 
              TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date)) AS date,
              tbl_admins.id,
              tbl_admins.username,
              0 AS cashCheckinAmount,
              SUM(tbl_checkins.advanceAmount) AS onlineCheckinAmount,
              0 AS rateAmount,
              0 AS checkoutAmount, 
              0 AS cancelledAmount,
              0 AS totalAmount 
              FROM
              tbl_checkins
              LEFT JOIN
              tbl_admins ON tbl_checkins.booked_by = tbl_admins.id WHERE paymentMode = '1' AND paymentStatus = '1'
              GROUP BY tbl_admins.username, TIMESTAMPADD(MINUTE, 30, TIMESTAMPADD(HOUR, 5, tbl_checkins.date))
          ) 
              AS merged_data 
              WHERE DATE(date) BETWEEN '${startOfToday}' AND '${endOfToday}' AND id=${req.user.id} AND Username IS NOT NULL AND cashCheckinAmount IS NOT NULL AND rateAmount IS NOT NULL AND checkoutAmount IS NOT NULL AND cancelledAmount IS NOT NULL GROUP BY Username, DATE(date) ORDER BY DATE(date) DESC;`
        const [data] = await sequelize.query(query);
        return data;
      }
      // const [roomBookingStats, metadata] = await sequelize.query(query);
      // console.log(roomBookingStats, "room booking stats");

      // let dataBankCashObj = {};
      // for (let entry of roomBookingStats) {
      //   let key = entry.Username + "_" + entry.id;
      //   if (dataBankCashObj[key]) {
      //     dataBankCashObj[key].bank =
      //       entry.paymentMode === 1
      //         ? dataBankCashObj[key].bank + Number(entry.total_amount)
      //         : dataBankCashObj[key].bank;
      //     dataBankCashObj[key].cash =
      //       entry.paymentMode === 2
      //         ? dataBankCashObj[key].cash + Number(entry.total_amount)
      //         : dataBankCashObj[key].cash;
      //   } else {
      //     dataBankCashObj[key] = {
      //       userName: entry.Username,
      //       bank: entry.paymentMode === 1 ? Number(entry.total_amount) : 0,
      //       cash: entry.paymentMode === 2 ? Number(entry.total_amount) : 0,
      //     };
      //   }
      // }
      // return Object.values(dataBankCashObj);
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  };

  getGuests = async (req, forEmployee = false) => {
    try {
      // const today = new Date();
      // const startOfToday = new Date(
      //   today.getFullYear(),
      //   today.getMonth(),
      //   today.getDate()
      // )
      //   .toISOString()
      //   .split("T")
      //   .join(" ")
      //   .split("Z")
      //   .join("");
      // const endOfToday = new Date(
      //   today.getFullYear(),
      //   today.getMonth(),
      //   today.getDate() + 1,
      //   0,
      //   0,
      //   -1
      // )
      //   .toISOString()
      //   .split("T")
      //   .join(" ")
      //   .split("Z")
      //   .join("");

      // const query = `
      //     SELECT SUM(male) AS male,SUM(female) AS female,SUM(child) AS child FROM tbl_checkins WHERE createdAt BETWEEN '${startOfToday}' AND '${endOfToday}' ${
      //   forEmployee ? `AND booked_by=${req.user.id}` : ""
      // };
      //   `;
      if(!forEmployee) {
        const query = `SELECT SUM(male) AS male, SUM(female) AS female, SUM(child) AS child FROM (SELECT MIN(booking_id) AS booking_id, male, female, child FROM tbl_checkins WHERE checkoutBy IS NULL AND ((modeOfBooking='2' AND paymentStatus='1') OR (modeOfBooking='1' AND paymentStatus='0') OR (modeOfBooking='1' AND paymentStatus='1')) AND date < DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY) GROUP BY booking_id) AS first_occurrence;`;
        const [data] = await sequelize.query(query);
        return data;
      };

      if(forEmployee) {
        const query = `SELECT SUM(male) AS male, SUM(female) AS female, SUM(child) AS child FROM (SELECT MIN(booking_id) AS booking_id, male, female, child FROM tbl_checkins WHERE checkoutBy IS NULL AND ((modeOfBooking='2' AND paymentStatus='1') OR (modeOfBooking='1' AND paymentStatus='0') OR (modeOfBooking='1' AND paymentStatus='1')) AND date < DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY) GROUP BY booking_id) AS first_occurrence;`;
        const [data] = await sequelize.query(query);
        return data;
      }
      // const [getGuests, metadata] = await sequelize.query(query, {
      //   logging: console.log,
      // });

      // return getGuests;
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  };

  getCheckinNew = async (req) => {
    let currentDate = new Date();
    console.log(currentDate, "latest code Current Date 1");
    currentDate = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
    console.log(currentDate, "latest code current Date 2");
    const currentRooms = await TblCheckin.findAll({
      where: {
        // date: {
        //   [Sequelize.Op.lte]: currentDate,
        // },
        // [Op.or]: [
        //   {
        //     [Op.and]: [{
        //       forceCoutDate:null,
        //       coutDate:{[Sequelize.Op.gte]: currentDate}
        //    }]
        //   },
        //   {
        //     forceCoutDate:{[Sequelize.Op.gte]: currentDate}
        //   },
        // ]
        [Op.or]: [
          {
            [Op.and]: [{
              paymentStatus: '0',
              paymentMode: '2'
            }]
          },
          {
            [Op.and]: [{
              paymentStatus: '1',
              paymentMode: '1'
            }]
          }
        ],
        checkoutBy: null
      },
      logging: console.log,
    });

    for (const room of currentRooms) {
      const employeeData = room.booked_by?await tblEmployee.findOne({ where: { id: room.booked_by }}):await tblUsers.findOne({ where: { id: room.bookedByUser }});
      const adminData = room.booked_by?await TblAdmin.findOne({ where: { id: room.booked_by }}):"";
      if(employeeData){
        room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
      }else if(adminData){
        room.setDataValue('bookedByName', adminData.username);
      }
      // room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
    }
    const currentRoomsData = await Promise.all(
      currentRooms.map(async (room) => {
        let query = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${room.dharmasala}`;
        const [[data]] = await sequelize.query(query);

        let query2 = `select * from tbl_rooms where ${room.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
        const [[roomDetails]] = await sequelize.query(query2);

        const categories = roomDetails && roomDetails.category_id
          ? await TblRoomCategory.findAll({
              where: {
                category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
              },
            })
          : [];
        let category_name = categories.map((category) => category.name);

        const facilities = roomDetails && roomDetails.facility_id
          ? await TblFacility.findAll({
              where: {
                facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
              },
            })
          : [];
        let facility_name = facilities.map((facility) => facility.name);

        return {
          ...room.dataValues,
          dharmasala: {
            ...data,
            id: room.dataValues.dharmasala,
          },
          category_name,
          facility_name,
          coTime : roomDetails.coTime
        };
      })
    );
    //    let q = `SELECT tbl_checkins.name AS holderName,
    //    tbl_dharmasalas.name AS dharmasala_name,
    //    tbl_checkins.*,
    //    tbl_dharmasalas.*,
    //    tbl_rooms.FroomNo,
    //    tbl_rooms.TroomNo,
    //    tbl_rooms.*,
    //    tbl_rooms.facility_id,
    //    tbl_rooms.category_id
    //  FROM tbl_checkins
    //  JOIN tbl_dharmasalas
    //    ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
    //  JOIN tbl_rooms
    //    ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo
    //  WHERE tbl_checkins.coutDate > '${currentDate}'
    //    AND tbl_checkins.date <= '${currentDate}'
    //    AND tbl_checkins.time <= '${currentDate.toLocaleTimeString()}'`

    //     const currentRooms= await sequelize.query(query);

    return currentRoomsData;
  };

  // roomCheckinOld = async (req, id) => {
  //   let result;
  //   req.body.booking_id = id;
  //   let booked_by = req.user.id;

  //   req.body.booked_by = booked_by;
  //   let { coutDate, coutTime, date, time, dharmasala, categoryId, nRoom } =
  //     req.body;
  //   const roomNo = parseInt(req.body.RoomNo);
  //   console.log(req.body);

  //   const existingBooking = await TblCheckin.findOne({
  //     where: {
  //       RoomNo: roomNo,
  //       dharmasala: dharmasala,
  //       [Op.or]: [
  //         {
  //           coutDate: {
  //             [Op.gt]: date, // check-out date is after desired check-in date
  //           },
  //         },
  //         {
  //           coutDate: {
  //             [Op.eq]: date, // check-out date is equal to desired check-in date
  //           },
  //           coutTime: {
  //             [Op.gt]: time, // check-out time is after desired check-in time
  //           },
  //         },
  //       ],
  //     },
  //     raw: true,
  //   });

  //   if (existingBooking) {
  //     throw new ApiError(httpStatus.CONFLICT, "The Room has already in use");
  //   }

  //   let perDayhour = await TblRoom.findOne({
  //     where: {
  //       FroomNo: { [Op.lte]: roomNo },
  //       TroomNo: { [Op.gte]: roomNo },
  //     },
  //     raw: true,
  //   });

  //   perDayhour = perDayhour.coTime;
  //   const maxDurationInHours = 3 * perDayhour;
  //   const maxDurationInMs = maxDurationInHours * 60 * 60 * 1000;
  //   const checkinDateTime = new Date(`${date}T${time}`);
  //   const maxCheckoutDateTime = new Date(
  //     checkinDateTime.getTime() + maxDurationInMs
  //   );
  //   const userCheckoutDateTime = new Date(
  //     Date.parse(`${coutDate}T${coutTime}`)
  //   );

  //   if (userCheckoutDateTime.getTime() > maxCheckoutDateTime.getTime()) {
  //     throw new ApiError(
  //       httpStatus.CONFLICT,
  //       "Checkout date and time exceeds the maximum duration for this booking 3 days is only allowed to book at one time"
  //     );
  //   }

  //   let room = await TblCheckin.create(req.body)
  //     .then((res) => {
  //       result = {
  //         status: true,
  //         message: "Room Booked successfully",
  //         data: res,
  //       };
  //     })
  //     .catch((err) => {
  //       result = {
  //         status: false,
  //         message: "Room failed to book",
  //       };
  //     });

  //   return result || room;
  // };

  getCheckin = async () => {
    const query = `
  SELECT tbl_checkins.name AS holderName, tbl_dharmasalas.name AS dharmasala_name, tbl_checkins.*, tbl_dharmasalas.*, tbl_rooms.FroomNo, tbl_rooms.TroomNo, tbl_rooms.*,tbl_rooms.facility_id, tbl_rooms.category_id
  FROM tbl_checkins
  JOIN tbl_dharmasalas ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
  JOIN tbl_rooms ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo  
  `;
    const currentDate = new Date();

    const [results, metadata] = await sequelize.query(query);
    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });
    // return (results)

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        console.log(facility);
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );
    return results;
  };

  getCheckinById = async (req) => {
    let { id } = req.query;
    const query = `
      SELECT tbl_checkins.name AS holderName, tbl_dharmasalas.name AS dharmasala_name, tbl_checkins.*, tbl_dharmasalas.*, tbl_rooms.FroomNo, tbl_rooms.TroomNo, tbl_rooms.*,tbl_rooms.facility_id, tbl_rooms.category_id
      FROM tbl_checkins
      JOIN tbl_dharmasalas ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
      JOIN tbl_rooms ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo  
      WHERE tbl_checkins.id = ${id}
    `;
    const [results, metadata] = await sequelize.query(query);
    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        console.log(facility);
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );
    return results[0]; // return the first element in the results array
  };

  checkinPayment = async (req) => {
    let { paymentid, id, paymentStatus } = req.body;
    let result = "";

    result = await TblCheckin.update(
      {
        paymentid: paymentid,
        paymentStatus: paymentStatus == "Success" ? 1 : 0,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return result;
  };

  checkinuser = async (req) => {
    let { id } = req.user;
    const query = `
      SELECT tbl_checkins.name AS holderName, tbl_dharmasalas.name AS dharmasala_name, tbl_checkins.*, tbl_dharmasalas.*, tbl_rooms.FroomNo, tbl_rooms.TroomNo, tbl_rooms.*,tbl_rooms.facility_id, tbl_rooms.category_id
      FROM tbl_checkins
      JOIN tbl_dharmasalas ON tbl_checkins.dharmasala = tbl_dharmasalas.dharmasala_id
      JOIN tbl_rooms ON tbl_checkins.RoomNo BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo  
      WHERE tbl_checkins.booked_by = ${id}
    `;
    const [results, metadata] = await sequelize.query(query);
    let facilitiesCategory = results?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        console.log(facility);
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );
    return results; // return the first element in the results array
  };

  // getCheckinCount = async () => {
  //   let count = await TblCheckin.count();

  //   return count;
  // };
  getCheckinCount = async () => {
    // let count = await TblCheckin.count({
    //   distinct: true,
    //   col: 'booking_id'
    // });

    // return count;
    const query = `
    SELECT COUNT(DISTINCT booking_id) AS combined_count
    FROM (
      SELECT booking_id FROM tbl_checkins
      UNION ALL
      SELECT booking_id FROM canceled_checkins
    ) AS CombinedTable
  `;
  
  const [result] = await sequelize.query(query, { raw: true });
  const count = result[0].combined_count;
  
  return count;
  };

  delCheckin = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblCheckin.destroy({
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Room deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "failed to delete checkin",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be deleted",
        };
      });
    return result;
  };

  editCheckin = async (req) => {
    let result;
    let { id } = req.body;
    let userId  = req.user.id;

    const room = await TblCheckin.findOne({ where: { id: id } });
      if (!room) {
        throw new Error({ error: "Room not found" });
      }

      const currentDate = moment(new Date()).subtract(5,'hours').subtract(30,'minutes');
      const roomChDate = moment(room.date).subtract(5,'hours').subtract(30,'minutes');

      const differenceInHours = moment.duration(currentDate.diff(roomChDate)).asHours();
      const employee = await tblEmployee.findOne({where: { id: userId }});
      const admin = await TblAdmin.findOne({where: { id: userId }});
      if(differenceInHours>=1 && employee){
        return {
          status: false,
          message: "Room failed to Update",
          data: "Time Limit Elapsed",
        };
      }else if(differenceInHours>=2 && admin){
        return {
          status: false,
          message: "Room failed to Update",
          data: "Time Limit Elapsed"
        }
      }
      console.log(currentDate,"       ", roomChDate, "       ", differenceInHours)

    await TblCheckin.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Room updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room failed to be update in else",
          };
        }
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: err,
        };
      });
    return result;
  };

  /// ROOM CHECKINNN

  //FACILITIES

  CreateFacilities = async (req) => {
    let result;
    let Facilites = await TblFacility.create({
      name: req.body.name,
      comments: req.body.comments,
    })
      .then((res) => {
        console.log(res, "resultsss");
        result = {
          status: true,
          message: "Facilites Created successfully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: "Facilites failed to Create",
        };
      });

    return result || Facilites;
  };

  getFacilities = async () => {
    let room = await TblFacility.findAll();

    // const facilitesWithoption = room.map((facility) => {
    //   const facilities = facility.toJSON();
    //   facilities.option = JSON.parse(facilities.option);
    //   return facilities;
    // });
    // return facilitesWithoption;

    return room;
  };

  delFacilities = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblFacility.destroy({
      where: {
        facility_id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Facility deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "failed to deleted facility",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Facility failed to be deleted",
        };
      });
    return result;
  };

  editFacilities = async (req) => {
    let { id } = req.body;
    let result;
    await TblFacility.update(req.body, {
      where: {
        facility_id: id,
      },
    })
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Facilites updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Facilites failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Facilites failed to be update",
        };
      });

    return result;
  };

  //ROOM Facilites

  //ROOM HOLDIN

  CreateHoldIn = async (req) => {
    console.log("Create Holdin Called");
    let result;
    req.body.holdBy = req.user.id;
    let Holdin = await TblHoldin.create(req.body)
      .then((res) => {
        console.log(res, "resultsss");
        result = {
          status: true,
          message: "Holdin Created successfully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: "Holdin failed to Create",
        };
      });

    return result || Holdin;
  };

  getHoldIn = async () => {
    console.log("get Holdin Called");
    // const currentDate = new Date();

    // let room = await TblHoldin.findAll({
    //   where: {
    //     remain: {
    //       [Op.gte]: currentDate,
    //     },
    //     since: {
    //       [Sequelize.Op.lte]: currentDate,
    //     },
    //     // sinceTime: {
    //     //   [Sequelize.Op.lte]: currentDate.toLocaleTimeString(),
    //     // },
    //   },
    //   include: [
    //     { model: TblDharmasal, attributes: ['name'] },
    //     { model: TblRoomCategory, attributes: ['name'] },
    //   ],
    //   logging: console.log,
    //   raw: true,
    //   nest: true
    // });
    // console.log(room);
    // for(const rate of room){
    //   const roomRate = await TblRoom.findOne({
    //     where: {
    //       [Op.and]: {
            // dharmasala_id: rate.dharmasala,
            // FroomNo: {
            //   [Op.lte]: rate.roomNo
            // },
            // TroomNo:{
            //   [Op.gte]: rate.roomNo
            // }
    //       }
    //     },
    //     attributes: ['Rate'],
    //   });
    //   rate.roomrate = roomRate.Rate?roomRate.Rate:'';
    // }
    // return room;
  // };
    let currentDate = new Date();
    console.log(currentDate, "latest code Current Date 1");
    currentDate = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
    console.log(currentDate, "latest code current Date 2");
    const currentRooms = await TblHoldin.findAll({
      where: {
        // remain: { [Op.gte]: currentDate, },
        // since: { [Sequelize.Op.lte]: currentDate, },
        checkoutBy: { [Op.eq] : null }
      },
      logging: console.log,
    });

    for (const room of currentRooms) {
      const employeeData = room.holdBy?await tblEmployee.findOne({ where: { id: room.holdBy }}):"";
      const adminData = room.holdBy?await TblAdmin.findOne({ where: { id: room.holdBy }}):"";
      if(employeeData){
        room.setDataValue('holdByName', employeeData.Username?employeeData.Username:"");
      }else if(adminData){
        room.setDataValue('holdByName', adminData.username);
      }
      // room.setDataValue('holdByName', employeeData.Username?employeeData.Username:"");
    }
    const currentRoomsData = await Promise.all(
      currentRooms.map(async (room) => {
        let query = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${room.dharmasala}`;
        const [[data]] = await sequelize.query(query);

        let query2 = `select * from tbl_rooms where ${room.roomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
        const [[roomDetails]] = await sequelize.query(query2);

        const categories = roomDetails && roomDetails.category_id
          ? await TblRoomCategory.findAll({
              where: {
                category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
              },
            })
          : [];
        let categoryName = categories.map((category) => category.name);

        const facilities = roomDetails && roomDetails.facility_id
          ? await TblFacility.findAll({
              where: {
                facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
              },
            })
          : [];
        let facility_name = facilities.map((facility) => facility.name);

        return {
          ...room.dataValues,
          dharmasala: {
            ...data,
            id: room.dataValues.dharmasala,
          },
          categoryName,
          facility_name,
        };
      })
    );
    return currentRoomsData;
  };

  delHoldIn = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblHoldin.destroy({
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "holdin deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "holdin failed to delete",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Holdin failed to be deleted",
        };
      });

    return result;
  };

  editHoldIn = async (req) => {
    let result;
    let { id } = req.body;
    await TblHoldin.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Holdin updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Holdin failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Holdin failed to be update",
        };
      });
    return result;
  };

  //ROOM HOLDIN

  //ROOM

  CreateRooms = async (req) => {
    let result;

    let { image1 = "" } = req.files || "";
    let { image2 = "" } = req.files || "";
    let { image3 = "" } = req.files || "";
    let { image4 = "" } = req.files || "";

    let upload1;
    let upload2;
    let upload3;
    let upload4;

    let uniqueRoom = await TblRoom.count({
      where: {
        dharmasala_id: req.body.dharmasala_id,
        [Op.or]: [
          { FroomNo: req.body.FroomNo },
          { TroomNo: req.body.TroomNo },
          {
            FroomNo: { [Op.lte]: req.body.FroomNo },
            TroomNo: { [Op.gte]: req.body.TroomNo },
          },
        ],
      },
    });

    if (image1) {
      upload1 = uploadimage(image1);
    }
    if (image2) {
      upload2 = uploadimage(image2);
    }
    if (image3) {
      upload3 = uploadimage(image3);
    }

    if (image4) {
      upload4 = uploadimage(image4);
    }

    if (uniqueRoom === 0) {
      if (Number(req.body.FroomNo) <= Number(req.body.TroomNo)) {
        let categoryArray = JSON.stringify(req.body.category_id);
        let facilitiesArray = JSON.stringify(req.body.facility_id);
        let Room = await TblRoom.create({
          FroomNo: req.body.FroomNo,
          TroomNo: req.body.TroomNo,
          Rate: req.body.Rate,
          dharmasala_id: req.body.dharmasala_id,
          category_id: JSON.parse(categoryArray),
          status: req.body.status,
          roomType: req.body.type,
          advance: req.body.advance,
          Account: req.body.Account,
          facility_id: JSON.parse(facilitiesArray),
          coTime: req.body.coTime,
          image1: upload1,
          image2: upload2,
          image3: upload3,
          image4: upload4,
        })
          .then((res) => {
            console.log(res, "resultsss");
            result = {
              status: true,
              message: "Room Created successfully",
            };
          })
          .catch((err) => {
            console.log(err);
            result = {
              status: false,
              message: "Room failed to Create",
            };
          });
      } else {
        result = {
          status: false,
          message: "Room ToRoomNo must be greaterthan of FromRoomNo",
        };
      }
    } else {
      result = {
        status: false,
        message: "Room Already Exists for this Dharmasala",
      };
    }

    return result || Room;
  };

  getRooms = async () => {
    let rooms = await TblRoom.findAll({order : [["dharmasala_id", "ASC"]]});

    let facilitiesCategory = rooms?.map((facility) => {
      const facilities = facility.toJSON();
      facilities.facility_id = JSON.parse(JSON.parse(facilities.facility_id));
      facilities.category_id = JSON.parse(JSON.parse(facilities.category_id));
      return facilities;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    return facilitiesCategory;
  };

  delRooms = async (req) => {
    let { id } = req.query;
    let result;

    let room = await TblRoom.destroy({
      where: {
        room_id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Room deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room failed to be deleted",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be deleted",
        };
      });
    return result;
  };

  editRooms = async (req) => {
    let result;

    let { image1 = "" } = req.files || "";
    let { image2 = "" } = req.files || "";
    let { image3 = "" } = req.files || "";
    let { image4 = "" } = req.files || "";

    let upload1;
    let upload2;
    let upload3;
    let upload4;

    if (image1) {
      upload1 = uploadimage(image1);
    }
    if (image2) {
      upload2 = uploadimage(image2);
    }
    if (image3) {
      upload3 = uploadimage(image3);
    }

    if (image4) {
      upload4 = uploadimage(image4);
    }

    let categoryArray = JSON.stringify(req.body.category_id);
    let facilitiesArray = JSON.stringify(req.body.facility_id);
    let Room = await TblRoom.update(
      {
        FroomNo: req.body.FroomNo,
        TroomNo: req.body.TroomNo,
        Rate: req.body.Rate,
        dharmasala_id: req.body.dharmasala_id,
        category_id: JSON.parse(categoryArray),
        status: req.body.status,
        roomType: req.body.type,
        advance: req.body.advance,
        Account: req.body.Account,
        facility_id: JSON.parse(facilitiesArray),
        coTime: req.body.coTime,
        image1: upload1,
        image2: upload2,
        image3: upload3,
        image4: upload4,
      },
      {
        where: {
          room_id: req.body.id,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Room updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room failed to be update",
        };
      });
    return result;
  };

  //ROOM
  getAvailableRoom = async (req) => {
    let {
      hotelName,
      checkinDate,
      checkinTime,
      checkoutDate,
      checkoutTime,
      numAdults,
      numChildren,
      numoFRooms,
      type,
    } = req.body;

    // Convert the date and time strings to JavaScript Date objects
    // checkinDate = new Date(checkinDate);
    // checkoutDate = new Date(checkoutDate);
    checkinDate = checkinTime
      ? new Date(checkinDate + " " + checkinTime)
      : new Date(checkinDate);
    checkoutDate = checkoutTime
      ? new Date(checkoutDate + " " + checkoutTime)
      : new Date(checkoutDate);
    let whereclause = {};

    if (hotelName) {
      whereclause.dharmasala = hotelName;
    }

    if (checkoutDate && checkinDate) {
      // whereclause.date = { [Op.lt]: checkoutDate };
      // whereclause.coutDate = { [Op.gt]: checkinDate };
      whereclause = {
        [Op.and]: [
          sequelize.where(sequelize.fn('DATE', sequelize.col('date')), {
            [Op.lte]: checkoutDate,
          }),
          sequelize.where(sequelize.fn('DATE', sequelize.col('coutDate')), {
            [Op.gte]: checkinDate,
          }),
        ],
      };

      // if (checkoutTime && checkinTime) {
      //   whereclause[Op.or] = [
      //     { date: checkoutDate, time: { [Op.lte]: checkoutTime } },
      //     { coutDate: checkinDate, coutTime: { [Op.gte]: checkinTime } },
      //   ];
      // }
    }
    whereclause.paymentStatus ='1';
    whereclause.checkoutBy = null;
    const replacements = { dharmasala_id: hotelName };

    if (type) {
      replacements.type = type;
    }

    const data = await TblDisableDharamshala.findOne({
      where : {
        dharamshala : hotelName,
        // [Op.or] : [
        //   { fromDate : { [Op.between] : [checkinDate, checkoutDate] } } ,
        //   { toDate : { [Op.between] : [checkinDate, checkoutDate] } } 
        // ]
        [Op.or]: [
          {
            [Op.and]: [
              { fromDate: { [Op.lte]: checkoutDate } },
              { toDate: { [Op.gte]: checkinDate } }
            ]
          }
        ]
      }
    });
    if(data) {
      return "Rooms Not Available"
    }

    // Query the check-in and holdin tables to find overlapping bookings and holds
    const conflictingCheckIns = await TblCheckin.findAll({
      where: whereclause,
    });

    const conflictingHolds = await TblHoldin.findAll({
      where: {
        dharmasala: hotelName,
        remain: { [Op.gt]: checkinDate },
        since: { [Op.lt]: checkoutDate },
      },
    });

    // Retrieve the room ranges from the database
    const roomRanges = await TblRoom.sequelize.query(
      `
      SELECT r.FroomNo AS \`from\`, r.TroomNo AS \`to\`, r.dharmasala_id,r.roomType,r.advance,r.category_id, r.facility_id,r.coTime,r.image1 AS \`roomImage1\`, r.image2 AS \`roomImage2\`, r.image3 AS \`roomImage3\`, r.image4 AS \`roomImage4\`, r.Rate,  d.*
      FROM tbl_rooms r
      JOIN tbl_dharmasalas d ON r.dharmasala_id = d.dharmasala_id
      WHERE r.dharmasala_id = :dharmasala_id AND (r.roomType = 0 OR r.roomType = 2) ORDER BY r.category_id`,
      // ${type ? "AND r.roomType = :type" : ""}
      // `,
      {
        replacements,
        type: QueryTypes.SELECT,
        raw: true,
        groupBy: ["dharmasala_id"],
      }
    );
    // console.log(roomRanges)
    if(roomRanges && roomRanges.length === 0){
      return {
        status: false,
        message: "No rooms found"
      }
    }

    let facilitiesCategory = roomRanges?.map((facility) => {
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    const availableRoomsObj = {
      dharamshala_img: facilitiesCategory[0].dharmasala.dataValues.image1,
      dharamshala_name: facilitiesCategory[0].dharmasala.dataValues.name,
      dharamshala_desciption: facilitiesCategory[0].dharmasala.dataValues.desc,
      dharmasala_id: facilitiesCategory[0].dharmasala.dataValues.dharmasala_id,
      availableRooms: [],
    };
    let i = 0;
    // Generate the list of available rooms with room details
    // const availableRoomsObj = { availableRooms: [] };
    let unavailableRooms = [];
    facilitiesCategory.forEach((range) => {
      console.log(range);
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );
      // Filter out the unavailable rooms
      unavailableRooms = [
        ...conflictingCheckIns.map((booking) => {
          if (rangeNumbers.includes(booking.RoomNo)) return booking.RoomNo;
        }),
        ...conflictingHolds.map((hold) => {
          if (rangeNumbers.includes(hold.roomNo)) {
            return hold.roomNo;
          }
        }),
      ].filter((roomNo) => roomNo !== undefined);

      const availableRoomNumbers = rangeNumbers.filter(
        (roomNumber) => !unavailableRooms.includes(roomNumber)
      );

      availableRoomsObj.availableRooms.push({
        category_name: range.category_name[0],
        category_id: range.category_id[0],
        total_rooms: rangeNumbers.length,
        available_rooms: availableRoomNumbers.length
          ? availableRoomNumbers.length
          : 0,
        available_room_numbers: availableRoomNumbers,
        already_booked: unavailableRooms.length ? unavailableRooms.length : 0,
        already_booked_room_numbers: unavailableRooms,
        facilities: range.facility_name,
        roomDetails: roomRanges[i],
        // roomImages : {
        //   roomImage1: roomRanges[i].roomImage1,
        //   roomImage2: roomRanges[i].roomImage2,
        //   roomImage3: roomRanges[i].roomImage3,
        //   roomImage4: roomRanges[i].roomImage4,
        // }
      });
      i++;
      unavailableRooms = [];
    });

    return availableRoomsObj;
  };
  // getAvailableRoom = async (req) => {
  //   const {
  //     hotelName,
  //     checkinDate,
  //     checkinTime,
  //     checkoutDate,
  //     checkoutTime,
  //     numAdults,
  //     numChildren,
  //     numRooms,
  //     roomType,
  //   } = req.body;

  // const checkinDateTime = new Date(checkinDate + ' ' + checkinTime);
  // const checkoutDateTime = new Date(checkoutDate + ' ' + checkoutTime);

  //   const roomQueryOptions = {
  //     where: { dharmasala_id: hotelName },
  //     include: [
  //       { model: TblDharmasal },
  //       { model: TblRoomCategory },
  //       { model: TblFacility },
  //     ],
  //     order: [['FroomNo', 'ASC']],
  //   };

  //   if (roomType) {
  //     roomQueryOptions.where.roomType = roomType;
  //   }

  //   const roomRanges = await TblRoom.findAll(roomQueryOptions);

  //   const availableRooms = [];

  //   for (let range of roomRanges) {
  //     const roomNumbers = Array.from(
  //       { length: range.TroomNo - range.FroomNo + 1 },
  //       (_, i) => range.FroomNo + i
  //     );

  //     const conflictingCheckIns = await TblCheckin.findAll({
  //       where: {
  //         dharmasala: hotelName,
  //         roomNumber: { [Op.in]: roomNumbers },
  //         checkoutDateTime: { [Op.gt]: checkinDateTime },
  //         checkinDateTime: { [Op.lt]: checkoutDateTime },
  //       },
  //     });

  //     const conflictingHolds = await TblHoldin.findAll({
  //       where: {
  //         dharmasala: hotelName,
  //         roomNumber: { [Op.in]: roomNumbers },
  //         checkoutDateTime: { [Op.gt]: checkinDateTime },
  //         checkinDateTime: { [Op.lt]: checkoutDateTime },
  //       },
  //     });

  //     const unavailableRoomNumbers = new Set([
  //       ...conflictingCheckIns.map((booking) => booking.roomNumber),
  //       ...conflictingHolds.map((hold) => hold.roomNumber),
  //     ]);

  //     const availableRoomNumbers = roomNumbers.filter(
  //       (roomNumber) => !unavailableRoomNumbers.has(roomNumber)
  //     );

  //     if (availableRoomNumbers.length) {
  //       availableRooms.push({
  //         roomType: range.roomType,
  //         category: range.tbl_room_category.name,
  //         totalRooms: roomNumbers.length,
  //         availableRooms: availableRoomNumbers.length,
  //         availableRoomNumbers: availableRoomNumbers,
  //         rate: range.Rate,
  //         facilities: range.tbl_facilities.map((f) => f.name),
  //         dharamshala: range.tbl_dharmasala.name,
  //         image: range.tbl_dharmasala.image1,
  //       });
  //     }
  //   }

  //   return availableRooms;
  // };
  // getAvailableRoom = async (req) => {
  //   const {
  //     hotelName,
  //     checkinDate,
  //     checkinTime,
  //     checkoutDate,
  //     checkoutTime,
  //     numAdults,
  //     numChildren,
  //     numRooms,
  //     roomType,
  //   } = req.body;

  //   const checkinDateTime = new Date(checkinDate + ' ' + checkinTime);
  //   const checkoutDateTime = new Date(checkoutDate + ' ' + checkoutTime);

  //   const roomQueryOptions = {
  //     where: { dharmasala_id: hotelName },
  //     include: [
  //       { model: TblDharmasal },
  //       { model: TblRoomCategory },
  //       { model: TblFacility },
  //     ],
  //     order: [['FroomNo', 'ASC']],
  //   };

  //   if (roomType) {
  //     roomQueryOptions.where.roomType = roomType;
  //   }

  //   const roomRanges = await TblRoom.findAll(roomQueryOptions);

  //   const conflictingBookings = await TblCheckin.findAll({
  //     where: {
  //       dharmasala: hotelName,
  //       roomNumber: { [Op.in]: roomRanges.map(range => Array.from(
  //         { length: range.TroomNo - range.FroomNo + 1 },
  //         (_, i) => range.FroomNo + i
  //       )) },
  //       checkoutDateTime: { [Op.gt]: checkinDateTime },
  //       checkinDateTime: { [Op.lt]: checkoutDateTime },
  //     },
  //   });

  //   const conflictingHolds = await TblHoldin.findAll({
  //     where: {
  //       dharmasala: hotelName,
  //       roomNumber: { [Op.in]: roomRanges.map(range => Array.from(
  //         { length: range.TroomNo - range.FroomNo + 1 },
  //         (_, i) => range.FroomNo + i
  //       )) },
  //       checkoutDateTime: { [Op.gt]: checkinDateTime },
  //       checkinDateTime: { [Op.lt]: checkoutDateTime },
  //     },
  //   });

  //   const unavailableRoomNumbers = new Set([    ...conflictingBookings.map((booking) => booking.roomNumber),    ...conflictingHolds.map((hold) => hold.roomNumber),  ]);

  //   const availableRooms = roomRanges.flatMap(range => {
  //     const roomNumbers = Array.from(
  //       { length: range.TroomNo - range.FroomNo + 1 },
  //       (_, i) => range.FroomNo + i
  //     );

  //     const availableRoomNumbers = roomNumbers.filter(
  //       (roomNumber) => !unavailableRoomNumbers.has(roomNumber)
  //     );

  //     if (availableRoomNumbers.length) {
  //       return {
  //         roomType: range.roomType,
  //         category: range.tbl_room_category.name,
  //         totalRooms: roomNumbers.length,
  //         availableRooms: availableRoomNumbers.length,
  //         availableRoomNumbers: availableRoomNumbers,
  //         rate: range.Rate,
  //         facilities: range.tbl_facilities.map((f) => f.name),
  //         dharamshala: range.tbl_dharmasala.name,
  //         image: range.tbl_dharmasala.image1,
  //       };
  //     } else {
  //       return [];
  //     }
  //   });

  //   return availableRooms;
  // };

  getRoomHistory = async (req, isEmployee = false) => {
    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date();
    const searchObj = {
      coutDate: {
        [Op.lt]: currentDate,
      },
      checkoutBy: {
        [Op.ne]: null
      },
      // coutTime: {
      //   [Op.lt]: currentTime,
      // },
      forceCoutDate: {
        [Op.eq]: null
      }
    };

    if (req.query.modeOfBooking) {
      searchObj.modeOfBooking = req.query.modeOfBooking;
    }

    if (req.query.bookedBy) {
      searchObj.booked_by = req.query.bookedBy;
    }

    if (isEmployee) {
      searchObj.booked_by = req.user.id;
    }

    const checkinHistoryData = await TblCheckin.findAll({
      where: searchObj,
      order: [["coutDate", "DESC"]],
      raw:true
    }
    );
    for(const checkin of checkinHistoryData){
      const dharmasalaData = await TblDharmasal.findOne({where:{dharmasala_id:checkin.dharmasala},attributes:['name']})
      const roomData = await TblRoom.findOne({where:{
        FroomNo: {
          [Op.lte]:checkin.RoomNo
        },
        TroomNo:{
          [Op.gte]:checkin.RoomNo
        }
      },raw:true})
      const categoryData = roomData?roomData.category_id?await TblRoomCategory.findOne({where:{category_id:JSON.parse(JSON.parse(roomData.category_id))},attributes:['name'],raw:true}):"":"";
      const facilityData =roomData?roomData.facility_id?await TblFacility.findOne({where:{facility_id:JSON.parse(JSON.parse(roomData.facility_id))},attributes:['name'],raw:true}):"":"";
      const checkoutByName = checkin.checkoutBy?await tblEmployee.findOne({where:{id:checkin.checkoutBy},attributes:['Username'],raw:true}):{};
      const checkoutBy = checkin.checkoutBy?await TblAdmin.findOne({where:{id:checkin.checkoutBy},attributes:['username'],raw:true}):{};
      const bookedByName = checkin.booked_by?await tblEmployee.findOne({where:{id:checkin.booked_by},attributes:['Username'],raw:true}):{};
      const bookedBy = checkin.booked_by?await TblAdmin.findOne({where:{id:checkin.booked_by},attributes:['username'],raw:true}):{};
        if(checkoutByName && Object.keys(checkoutByName)){
          checkin.checkoutByName=checkoutByName.Username;
        }
        if(checkoutBy && Object.keys(checkoutBy)){
          checkin.checkoutByName=checkoutBy.username;
        }
        if(bookedByName && Object.keys(bookedByName)){
          checkin.bookedByName=bookedByName.Username;
        }
        if(bookedBy && Object.keys(bookedBy)){
          checkin.bookedByName=bookedBy.username;
        }

      checkin.forceCheckOutDate=checkin.forceCoutDate?checkin.forceCoutDate:""
      checkin.dharmasalaName=dharmasalaData.name?dharmasalaData.name:"";
      checkin.categoryName=categoryData.name?categoryData.name:"";
      checkin.facilityName=facilityData.name?facilityData.name:"";
    }

    return checkinHistoryData;
  };

  //ROOM CATEGORIES

  CreateRoomCategory = async (req) => {
    let result;

    let Room = await TblRoomCategory.create({
      name: req.body.name,
      comment: req.body.comment,
    })
      .then((res) => {
        console.log(res, "resultsss");
        result = {
          status: true,
          message: "Room Category Created successfully",
        };
      })
      .catch((err) => {
        console.log(err);
        result = {
          status: false,
          message: "Room Category failed to Create",
        };
      });

    return result || Room;
  };

  getRoomCategory = async () => {
    let RoomCategory = await TblRoomCategory.findAll();

    return RoomCategory;
  };

  delRoomCategory = async (req) => {
    let { id } = req.query;
    let result;

    let RoomCategory = await TblRoomCategory.destroy({
      where: {
        category_id: id,
      },
    })
      .then((res) => {
        if (res == 1) {
          result = {
            status: true,
            message: "Room category deleted successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room category failed to be deleted",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room Category failed to be deleted",
        };
      });
    return result;
  };

  editRoomCategory = async (req) => {
    let result;

    await TblRoomCategory.update(
      {
        name: req.body.name,
        comment: req.body.comment,
      },
      {
        where: {
          category_id: req.body.id,
        },
      }
    )
      .then((res) => {
        if (res[0] === 1) {
          result = {
            status: true,
            message: "Room Category updated successfully",
          };
        } else {
          result = {
            status: false,
            message: "Room Category failed to be update",
          };
        }
      })
      .catch((err) => {
        result = {
          status: false,
          message: "Room Category failed to be update",
        };
      });
    return result;
  };

  createDharmasala = async (req) => {
    let { name, nameH, desc } = req.body;
    let { image1, image2, image3, image4 } = req.files;
    let imagefirst = "";

    if (image1) {
      imagefirst = uploadimage(image1);
    }

    let data = await TblDharmasal.create({
      name: name,
      nameH: nameH,
      image1: imagefirst,

      desc: desc,
    });

    if (!data) {
      return {
        status: false,
        message: "failed to created Dharamashala",
      };
    }
    return {
      status: true,
      message: "Successfully created Dharamashala",
      data: data,
    };
  };

  getDharmasala = async (req) => {
    let { id } = req.query;
    // let data; 

    // if (id) {
    //   data = await sequelize.query(
    //     `SELECT * FROM tbl_dharmasalas
    //     LEFT OUTER JOIN tbl_rooms ON tbl_dharmasalas.dharmasala_id = tbl_rooms.dharmasala_id
    //     WHERE tbl_dharmasalas.dharmasala_id = :id`,
    //     {
    //       replacements: { id },
    //       type: sequelize.QueryTypes.SELECT,
    //     }
    //   );

    //   let facilitiesCategory = data?.map((facility) => {
    //     facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
    //     facility.category_id = JSON.parse(JSON.parse(facility.category_id));
    //     return facility;
    //   });

    //   await Promise.all(
    //     facilitiesCategory.map(async (facility) => {
    //       const categories = await TblRoomCategory.findAll({
    //         where: { category_id: facility.category_id },
    //       });
    //       facility.category_name = categories.map((category) => category.name);

    //       const facilities = await TblFacility.findAll({
    //         where: { facility_id: facility.facility_id },
    //       });
    //       const dharmasala = await TblDharmasal.findOne({
    //         where: {
    //           dharmasala_id: facility.dharmasala_id,
    //         },
    //       });
    //       facility.dharmasala = dharmasala;
    //       facility.facility_name = facilities.map((facility) => facility.name);
    //     })
    //   );
    //   const availableRooms = data.reduce((result, room) => {
    //     const rangeNumbers = Array.from(
    //       { length: room.TroomNo - room.FroomNo + 1 },
    //       (_, i) => i + room.FroomNo
    //     );
    //     rangeNumbers.forEach((roomNumber) => {
    //       result.push({
    //         roomNumber,
    //         ...room,
    //       });
    //     });
    //     return result;
    //   }, []);

    //   console.log(availableRooms);

    //   data = {
    //     ...data[0], // spread the first object in the array
    //     availableRooms,
    //   };

    //   return data;
    // }

    // data = await TblDharmasal.findAll({});

    // return data;
    if (!id) {
      const data = await TblDharmasal.findAll(); 
      return data;
    }
    const datas = await TblRoom.findAll({
      where : {
        dharmasala_id : id
      },
      group : ["category_id", "facility_id"],
      attributes : ["Rate", "dharmasala_id", "category_id", "facility_id", "coTime", "image1", "image2", "image3", "image4"],
      raw : true
    });
    for (const data of datas) {
      const dharamshalaName = await TblDharmasal.findOne({
        where : {
          dharmasala_id : data.dharmasala_id
        },
        attributes : ["name"]
      });
      if (dharamshalaName.name) {
        data.dharamshalaName = dharamshalaName.name
      }

      const categoryName = await TblRoomCategory.findOne({
        where : {
          category_id : JSON.parse(JSON.parse(data.category_id))
        },
        attributes : ["name"]
      });
      if (categoryName.name) {
        data.categoryName = categoryName.name
      }

      const facilityName = await TblFacility.findOne({
        where : {
          facility_id : JSON.parse(JSON.parse(data.facility_id))
        },
        attributes : ["name"]
      });
      if (facilityName.name) {
        data.facilityName = facilityName.name
      }

      const dharamshalaImage = await TblDharmasal.findOne({
        where : {
          dharmasala_id : data.dharmasala_id
        },
        attributes : ["image1", "desc"]
      });
      if (dharamshalaImage.image1 || dharamshalaImage.desc) {
        data.dharamshalaImage = dharamshalaImage.image1
        data.dharamshalaDesc = dharamshalaImage.desc
      }
    }
    return datas;
  };

  // getDharmasalaData = async (req) => {
  //   const { name } = req.body;
  //   let searchObj = {};
  //   if (name) {
  //     searchObj.name = name;
  //   }
  //   const dharmsalas = await TblDharmasal.findAll({
  //     where : searchObj,
  //     raw: true,
  //     attributes: ["dharmasala_id", "name"],
  //   });
  //   const currentTime = new Date();

  //   for (const dharmsala of dharmsalas) {
  //     const roomData = await TblRoom.findAll({
  //       where: { dharmasala_id: dharmsala.dharmasala_id },
  //       attributes: [
  //         "Froomno",
  //         "TroomNo",
  //         "dharmasala_id",
  //         "category_id",
  //         "facility_id",
  //         "roomType",
  //       ],
  //       raw: true,
  //     });
  //     const roomsCatWise = {};
  //     if (roomData.length) {
  //       for (const roomRecord of roomData) {
  //         const category_id = JSON.parse(JSON.parse(roomRecord.category_id));
  //         const categoryName = await TblRoomCategory.findOne({
  //           where: { category_id: category_id },
  //           attributes: ["name"],
  //           raw: true,
  //         });
  //         if (!roomsCatWise[categoryName.name])
  //           roomsCatWise[categoryName.name] = [];

  //         for (
  //           let roomNo = roomRecord.Froomno;
  //           roomNo <= roomRecord.TroomNo;
  //           roomNo++
  //         ) {
  //           roomsCatWise[categoryName.name].push(roomNo);
  //         }
  //       }
  //     }

  //     const checkedInRooms = await TblCheckin.findAll({
  //       where: {
  //         // coutDate: { [Op.gt]: currentTime },
  //         dharmasala: dharmsala.dharmasala_id,
  //         checkoutBy: { [Op.eq]: null }
  //       },
  //       logging: console.log,
  //       attributes: ["RoomNo"],
  //       raw: true,
  //     });
  //     const checkedInRoomsArr = checkedInRooms.map((room) => {
  //       return room.RoomNo;
  //     });

  //     const holdins = await TblHoldin.findAll({
  //       where: {
  //         // remain: { [Op.gt]: currentTime },
  //         checkoutBy: { [Op.eq]: null },
  //         dharmasala: dharmsala.dharmasala_id,
  //       },
  //       logging: console.log,
  //       attributes: ["roomNo"],
  //       raw: true,
  //     });
  //     const holdinsArr = holdins.map((holdin) => {
  //       return holdin.roomNo;
  //     });

  //     const unavailableRooms = holdinsArr.concat(checkedInRoomsArr);

  //     const occRoomsOnCategory = {};
  //     const holdRoomsCatWise = {};

  //     Object.keys(roomsCatWise).forEach((category) => {
  //       holdRoomsCatWise[category] = roomsCatWise[category].filter((id) => {
  //         return holdinsArr.includes(id);
  //       });

  //       occRoomsOnCategory[category] = roomsCatWise[category].filter((id) => {
  //         // return unavailableRooms.includes(id);
  //         return checkedInRoomsArr.includes(id);
  //       });

  //       roomsCatWise[category] = roomsCatWise[category].filter((id) => {
  //         return !unavailableRooms.includes(id);
  //       });
  //     });

  //     dharmsala.occupiedRooms = occRoomsOnCategory;
  //     dharmsala.roomData = roomsCatWise;
  //     dharmsala.holdRooms = holdRoomsCatWise;
  //   }

  //   return {dharmsalas: dharmsalas};
  // };

  getDharmasalaData = async (req) => {
    const { name } = req.body;
    let searchObj = {};
    if (name) {
      searchObj.name = name;
    }
    const dharmsalas = await TblDharmasal.findAll({
      where: searchObj,
      raw: true,
      attributes: ["dharmasala_id", "name"],
    });
  
    const response = [];
  
    for (const dharmsala of dharmsalas) {
      const roomData = await TblRoom.findAll({
        where: { dharmasala_id: dharmsala.dharmasala_id },
        attributes: [
          "Froomno",
          "TroomNo",
          "dharmasala_id",
          "category_id",
          "facility_id",
          "roomType",
        ],
        raw: true,
      });
  
      const currentTime = new Date();
      const checkedInRoomsArr = await TblCheckin.findAll({
        where: {
          dharmasala: dharmsala.dharmasala_id,
          [Op.or] : [
            {
              [Op.and] : [
                { checkoutBy: { [Op.eq]: null } },
                { modeOfBooking: { [Op.eq]: 1 } },
                { paymentStatus: { [Op.eq]: 0 } },
              ]
            },
            {
              [Op.and] : [
                { checkoutBy: { [Op.eq]: null } },
                { modeOfBooking: { [Op.eq]: 2 } },
                { paymentStatus: { [Op.eq]: 1 } },
              ]
            },
            {
              [Op.and] : [
                { checkoutBy: { [Op.eq]: null } },
                { modeOfBooking: { [Op.eq]: 1 } },
                { paymentStatus: { [Op.eq]: 1 } },
              ]
            }
          ]
          // checkoutBy: { [Op.eq]: null }
        },
        attributes: ["RoomNo"],
        raw: true,
      }).then((rooms) => rooms.map((room) => room.RoomNo));
  
      const holdRoomsArr = await TblHoldin.findAll({
        where: {
          checkoutBy: { [Op.eq]: null },
          dharmasala: dharmsala.dharmasala_id,
        },
        attributes: ["roomNo"],
        raw: true,
      }).then((holdins) => holdins.map((holdin) => holdin.roomNo));
  
      const categoriesMap = new Map();
  
      for (const roomRecord of roomData) {
        const category_id = JSON.parse(JSON.parse(roomRecord.category_id));
        const categoryName = await TblRoomCategory.findOne({
          where: { category_id: category_id },
          attributes: ["name"],
          raw: true,
        });
  
        const categoryKey = categoryName.name;
  
        if (!categoriesMap.has(categoryKey)) {
          categoriesMap.set(categoryKey, {
            category: categoryKey,
            category_id: category_id,
            occupiedRooms: [],
            holdRooms: [],
            availableRooms: [],
          });
        }
  
        const categoryInfo = categoriesMap.get(categoryKey);
  
        for (let roomNo = roomRecord.Froomno; roomNo <= roomRecord.TroomNo; roomNo++) {
          if (checkedInRoomsArr.includes(roomNo)) {
            categoryInfo.occupiedRooms.push(roomNo);
          } else if (holdRoomsArr.includes(roomNo)) {
            categoryInfo.holdRooms.push(roomNo);
          } else {
            categoryInfo.availableRooms.push(roomNo);
          }
        }
  
        categoriesMap.set(categoryKey, categoryInfo);
      }
  
      const dharmasalaInfo = {
        name: dharmsala.name,
        dharamshala_id: dharmsala.dharmasala_id,
        categories: Array.from(categoriesMap.values()),
      };
  
      response.push(dharmasalaInfo);
    }
  
    return { data: response };
  };

  // type 0 means online only 1 means offline only 2 means both
  getonlineRooms = async (req) => {
    let rooms = await TblRoom.findAll({
      where: {
        roomType: 1,
      },
    });

    let facilitiesCategory = rooms?.map((facility) => {
      const facilities = facility.toJSON();
      facilities.facility_id = JSON.parse(JSON.parse(facilities.facility_id));
      facilities.category_id = JSON.parse(JSON.parse(facilities.category_id));
      return facilities;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;

        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    return facilitiesCategory;
  };

  editDharmasala = async (req) => {
    let result;
    let {
      id,
      name,
      nameH,
      desc,
      linkimage1,
      linkimage2,
      linkimage3,
      linkimage4,
      status,
    } = req.body;

    // let imagefirst = uploadimage(image1);
    // let imagesecond = uploadimage(image2);
    // let imagethird = uploadimage(image3);
    // let imagefourth = uploadimage(image4);

    const updatedFields = {
      name: name,
      nameH: nameH,
      desc: desc,
      status: status
    };

    if (req.files && req.files.image1) {
      updatedFields.image1 = uploadimage(req.files.image1);
    }

    let data = await TblDharmasal.update(updatedFields, {
      where: {
        dharmasala_id: id,
      },
    })
      .then((Res) => {
        if (Res[0] == 1) {
          result = {
            status: "true",
            message: "Dharamasala updated successfully",
          };
        } else {
          result = {
            status: "false",
            message: "Dharamasala failed to update",
          };
        }
      })
      .catch((er) => {
        console.log(er);
        result = {
          status: "false",
          message: "Dharamasala failed to update",
        };
      });

    console.log(result);
    return result;
  };
  //ROOM Categories

  //getDetailsusingCategory

  getbyCategory = async (req) => {
    let { catg } = req.query;

    let data = await TblRoomCategory.findOne({
      where: {
        Name: catg,
      },
    });
    if (data) {
      return {
        statusCode: 200,
        message: "Success",
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: "no data available",
        data: [],
      };
    }
  };

  getAvailableRoombyCategory = async (req) => {
    let { category, hotelName, fromDate, toDate } = req.query;
    // let { category, hotelName, toDate } = req.query;
    const currentDate = new Date();
    if (!fromDate) {
      fromDate = currentDate;
    }
    // if (!toDate) {
    //   toDate = currentDate;
    // }
    if (!toDate) {
      toDate = new Date();
      toDate.setDate(toDate.getDate() + 1);
    }

    // console.log(currentDate)
    const [results] = await sequelize.query(`
  SELECT room.*, dharamsala.image1 AS dharamsalaImage
  FROM tbl_rooms room
  JOIN tbl_dharmasalas dharamsala ON room.dharmasala_id = dharamsala.dharmasala_id
  WHERE room.category_id LIKE '%${category}%'
    AND room.dharmasala_id = '${hotelName}' AND (room.roomType = 1 OR room.roomType = 2)
`);

    // console.log(results)
    let facilitiesCategory = results?.map((facility) => {
      // console.log(facility)
      facility.facility_id = JSON.parse(JSON.parse(facility.facility_id));
      facility.category_id = JSON.parse(JSON.parse(facility.category_id));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await TblRoomCategory.findAll({
          where: { category_id: facility.category_id },
        });
        facility.category_name = categories.map((category) => category.name);

        const facilities = await TblFacility.findAll({
          where: { facility_id: facility.facility_id },
        });
        const dharmasala = await TblDharmasal.findOne({
          where: {
            dharmasala_id: facility.dharmasala_id,
          },
        });
        facility.dharmasala = dharmasala;
        facility.facility_name = facilities.map((facility) => facility.name);
      })
    );

    const roomRanges = facilitiesCategory.map((room) => ({
      from: room.FroomNo,
      to: room.TroomNo,
      ...room,
    }));
    // console.log("roomranges");
    //     console.log(roomRanges)
    // Generate a flat list of all room numbers
    const allRoomNumbers = roomRanges.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );
      return [...result, ...rangeNumbers];
    }, []);
    //     console.log("allroomrnumver");
    // console.log(allRoomNumbers)
    // Find all rooms that are currently checked in or on hold
    const occupiedRooms = await TblCheckin.findAll({
      where: {
        RoomNo: {
          [Op.in]: allRoomNumbers,
        },
        // [Op.and]: [
        //   // { date: { [Op.lte]: toDate } }, // Check if the check-in date is before or on the "to" date
        //   // { coutDate: { [Op.gte]: fromDate } }, // Check if the check-out date is after or on the "from" date
        //   { checkoutBy: { [Op.eq]: null } }
        // ],
        dharmasala: hotelName,
        [Op.or] : [
          {
            [Op.and] : [
              { checkoutBy: { [Op.eq]: null } },
              { modeOfBooking: { [Op.eq]: 1 } },
              { paymentStatus: { [Op.eq]: 0 } },
            ]
          },
          {
            [Op.and] : [
              { checkoutBy: { [Op.eq]: null } },
              { modeOfBooking: { [Op.eq]: 2 } },
              { paymentStatus: { [Op.eq]: 1 } },
            ]
          },
          {
            [Op.and] : [
              { checkoutBy: { [Op.eq]: null } },
              { modeOfBooking: { [Op.eq]: 1 } },
              { paymentStatus: { [Op.eq]: 1 } },
            ]
          }
        ]
      },
    });
    const onHoldRooms = await TblHoldin.findAll({
      where: {
        RoomNo: {
          [Op.in]: allRoomNumbers,
        },
        // [Op.and]: [
        //   // { since: { [Op.lte]: toDate } },
        //   // { remain: { [Op.gte]: fromDate } },
        //   { remain: { [Op.gte]: toDate } },
        // ],
        checkoutBy: { [Op.eq]: null },
        dharmasala: hotelName,
      },
    });

    // Get room numbers from occupied rooms and on hold rooms
    const occupiedRoomNumbers = occupiedRooms.map((room) => room.RoomNo);
    const onHoldRoomNumbers = onHoldRooms.map((room) => room.roomNo);
    // console.log(occupiedRoomNumbers,onHoldRoomNumbers)
    // Generate a list of available rooms
    const availableRooms = roomRanges.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );

      const availableNumbers = rangeNumbers.filter(
        (number) =>
          !occupiedRoomNumbers.includes(number) &&
          !onHoldRoomNumbers.includes(number)
      );
      // console.log("availableroom",availableNumbers)
      return [
        ...result,
        ...availableNumbers.map((number) => ({
          ...range,
          RoomNo: number,
        })),
      ];
    }, []);

    return {
      statusCode: 200,
      data: availableRooms,
    };
  };

  savePaymentDetailsofRoom = async (req) => {
    let result = "";
    console.log(req.body);
    result = await Tblch.update(
      {
        paymentid: req.body.PAYMENT_ID,
        paymentStatus: req.body.PAYMENT_STATUS == "Success" ? 1 : 0,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    return result;
  };

  createBookingPara = async (req) => {};

  checkinReport = async (req, res) => {
    const currentRooms = await TblCheckin.findAll({
      where : {
        [Op.or]: [
          {
            [Op.and]: [{
              paymentStatus: '0',
              paymentMode: '2'
            }]
          },
          {
            [Op.and]: [{
              paymentStatus: '1',
              paymentMode: '1'
            }]
          }
        ],
        checkoutBy: null
      },
      logging: console.log,
    });
  
    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const employeeData = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by } })
        : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } });
  
      const adminData = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by } }) : null;
  
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);
  
      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;

      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
  }

  checkoutHistory = async (req, isEmployee = false) => {
    // const currentTime = new Date().toLocaleTimeString();
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 2
    )
      .toISOString()
      .split("T")
      .join(" ")
      .split("Z")
      .join("");
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    )
      .toISOString()
      .split("T")
      .join(" ")
      .split("Z")
      .join("");
    const searchObj = {
      // coutDate: {
      //   [Op.lt]: currentDate,
      // },
      checkoutBy: {
        [Op.ne]: null
      },
      forceCoutDate: {
        [Op.eq]: null
      },
    };

    if(!req.query.fromDate && !req.query.toDate && !req.query.checkoutBy) {
      searchObj.coutDate = { [Op.between] : [ startOfToday, endOfToday ] }
    }

    if (req.query.fromDate && req.query.toDate) {
      searchObj.coutDate = {[Op.and] : [
        {[Op.gte] : req.query.fromDate},
        {[Op.lte] : req.query.toDate}
      ]}
    }

    if (req.query.modeOfBooking) {
      searchObj.modeOfBooking = req.query.modeOfBooking;
    }

    if (req.query.bookedBy) {
      searchObj.booked_by = req.query.bookedBy;
    }

    if (req.query.checkoutBy) {
      searchObj.checkoutBy = req.query.checkoutBy;
    }

    if (isEmployee) {
      searchObj.booked_by = req.user.id;
    }

    const currentRooms = await TblCheckin.findAll({
      where: searchObj,
      order: [["coutDate", "DESC"]],
      logging: console.log,
    });
  
    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];

      const employeeDataPromise = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by }, attributes: ["id", "Username"] })
        : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser }, attributes: ["id", "username", "name"] });
      const employeeData1Promise = bookingRoom.checkoutBy
        ? await tblEmployee.findOne({ where: { id: bookingRoom.checkoutBy }, attributes: ["id", "Username"] })
        : {};
  
      const adminDataPromise = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by }, attributes: ["id", "username"] }) : {};
      const adminData1Promise = bookingRoom.checkoutBy ? await TblAdmin.findOne({ where: { id: bookingRoom.checkoutBy }, attributes: ["id", "username"] }) : {};
  
      // const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
      // const checkoutByName = employeeData1 ? (employeeData1.Username ? employeeData1.Username : '') : (adminData1 ? adminData1.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      // const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select category_id, facility_id, coTime from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      // const categories = roomDetails && roomDetails.category_id
      //   ? await TblRoomCategory.findAll({
      //       where: {
      //         category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
      //       },
      //     })
      //   : [];
      // const category_name = categories.map((category) => category.name);
  
      // const facilities = roomDetails && roomDetails.facility_id
      //   ? await TblFacility.findAll({
      //       where: {
      //         facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
      //       },
      //     })
      //   : [];
      // const facility_name = facilities.map((facility) => facility.name);

      // const roomAmountSumResult = await TblCheckin.findOne({
      //   attributes: [
      //     [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
      //   ],
      //   where: {
      //     booking_id: bookingId,
      //     RoomNo: bookingRoom.roomNumbers,
      //   },
      //   raw: true,
      // });
  
      // const advanceAmountSumResult = await TblCheckin.findOne({
      //   attributes: [
      //     [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
      //   ],
      //   where: {
      //     booking_id: bookingId,
      //     RoomNo: bookingRoom.roomNumbers,
      //   },
      //   raw: true,
      // });

      const [
        employeeData,
        employeeData1,
        adminData,
        adminData1,
        [[dharmasalaData]],
        categories,
        facilities,
        roomAmountSumResult,
        advanceAmountSumResult
      ] = await Promise.all([
        employeeDataPromise,
        employeeData1Promise,
        adminDataPromise,
        adminData1Promise,
        sequelize.query(dharmasalaQuery),
        roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
            attributes: ["name"]
          })
        : [],
        roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
            attributes: ["name"]
          })
        : [],
        TblCheckin.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
          ],
          where: {
            booking_id: bookingId,
            RoomNo: bookingRoom.roomNumbers,
          },
          raw: true,
        }),
        TblCheckin.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
          ],
          where: {
            booking_id: bookingId,
            RoomNo: bookingRoom.roomNumbers,
          },
          raw: true,
        })
      ])
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
      const checkoutByName = employeeData1 ? (employeeData1.Username ? employeeData1.Username : '') : (adminData1 ? adminData1.username : '');
      const category_name = categories.map((category) => category.name);
      const facility_name = facilities.map((facility) => facility.name);
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;
  
      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        checkoutByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
  };

  forceCheckoutHistory = async (req) => {
    const { fromDate, toDate } = req.query;
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 2
    )
      .toISOString()
      .split("T")
      .join(" ")
      .split("Z")
      .join("");
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    )
      .toISOString()
      .split("T")
      .join(" ")
      .split("Z")
      .join("");
    let whereclause = {};
    whereclause = {
      forceCoutDate: {
        [Op.ne]: null
      }
    }
    if (!fromDate && !toDate) {
      whereclause.forceCoutDate = { [Op.between] : [ startOfToday, endOfToday ] }
    }
    if (fromDate && toDate) {
      whereclause.forceCoutDate = {[Op.and] : [
        {[Op.gte] : fromDate},
        {[Op.lte] : toDate}
      ]}
    }
    const currentRooms = await TblCheckin.findAll({
      where: whereclause,
      order : [["coutDate", "DESC"]],
      logging: console.log,
    });

    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const employeeData = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by } })
        : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } });
      const employeeData1 = bookingRoom.checkoutBy
        ? await tblEmployee.findOne({ where: { id: bookingRoom.checkoutBy } })
        : "";
  
      const adminData = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by } }) : null;
      const adminData1 = bookingRoom.checkoutBy ? await TblAdmin.findOne({ where: { id: bookingRoom.checkoutBy } }) : null;
  
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
      const checkoutByName = employeeData1 ? (employeeData1.Username ? employeeData.Username : "") : (adminData1 ? adminData1.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
    
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);
  
      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;

      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        checkoutByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
  }

  cancelHistory = async (req) => {
      try {
        const today = new Date();
        const startOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 2
        )
          .toISOString()
          .split("T")
          .join(" ")
          .split("Z")
          .join("");
        const endOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1,
          0,
          0,
          -1
        )
          .toISOString()
          .split("T")
          .join(" ")
          .split("Z")
          .join("");
        const searchObj = {};

        if(!req.query.fromDate && !req.query.toDate && !req.query.checkoutBy) {
          searchObj.date = { [Op.between] : [ startOfToday, endOfToday ] }
        }

        if (req.query.fromDate && req.query.toDate) {
          searchObj.date = {[Op.and] : [
            {[Op.gte] : req.query.fromDate},
            {[Op.lte] : req.query.toDate}
          ]}
        }

        if (req.query.checkoutBy) {
          searchObj.checkoutBy = req.query.checkoutBy;
        }
        const cancelledCheckins = await TblCanceledCheckins.findAll({where: searchObj, order:[["coutDate" , "DESC"]]});

        if (!cancelledCheckins.length) {
          throw new Error("No Cancel History Found");
        }
    
        const groupedCheckins = {};
        for (const checkin of cancelledCheckins) {
          if (!groupedCheckins[checkin.booking_id]) {
            groupedCheckins[checkin.booking_id] = {
              ...checkin.dataValues,
              roomNumbers: [],
            };
          }
          groupedCheckins[checkin.booking_id].roomNumbers.push(checkin.RoomNo);
        }

        const currentRoomsData = [];
  
    for (const bookingId in groupedCheckins) {
      const bookingRoom = groupedCheckins[bookingId];

      const employeeData = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by } })
        : {};
      const employeeData1 = bookingRoom.checkoutBy
        ? await tblEmployee.findOne({ where: { id: bookingRoom.checkoutBy } })
        : {};
  
      const adminData = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by } }) : null;
      const adminData1 = bookingRoom.checkoutBy ? await TblAdmin.findOne({ where: { id: bookingRoom.checkoutBy } }) : null;
  
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : {}) : (adminData ? adminData.username : '');
      const cancelByName = employeeData1 ? (employeeData1.Username ? employeeData1.Username : {}) : (adminData1 ? adminData1.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);
  
      const roomAmountSumResult = await TblCanceledCheckins.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCanceledCheckins.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;

      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        cancelByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
      } catch (error) {
        // Return error response if there is an error
        console.log(error);
        return {
          status: false,
          message: "No Cancel History Found",
          data: error?.message,
        };
      }    
  }

  cancelcheckin = async (req) => {
    let userId = req.user.id;
    if (!(req.body.id || req.body.bookingId)) {
      throw new Error({ error: "bookingId or id is required" });
    }
    const searchObj = {};
    if (req.body.id) {
      searchObj.id = req.body.id;
    } else {
      searchObj.booking_id = req.body.bookingId;
    }

    try {
      const roomOrRooms = await TblCheckin.findAll({
        where: searchObj,
        raw: true,
        nest: true,
      });

      if (!roomOrRooms) {
        throw new Error({ error: "Room Or Rooms not found" });
      }

      // if (roomOrRooms && roomOrRooms.length === 1 && req.body.id) {
        const currentDate = moment(new Date()).subtract(5, 'hours').subtract(30, 'minutes');
        const roomChDate = moment(roomOrRooms[0].date).subtract(5, 'hours').subtract(30, 'minutes');
        const differenceInHours = moment.duration(currentDate.diff(roomChDate)).asHours();
        const employee = await tblEmployee.findOne({where: { id: userId }});
        const admin = await TblAdmin.findOne({where: { id: userId }});
        if (differenceInHours >= 1 && employee) {
          return {
            status: false,
            message: "Room failed to cancel",
            data: "Time Limit Elapsed",
          };
        }else if(differenceInHours>=2 && admin){
          return {
            status: false,
            message: "Room failed to cancel",
            data: "Time Limit Elapsed"
          }
        }
        console.log(currentDate,"       ", roomChDate, "       ", differenceInHours)
      // }

      const checkoutDate = req.body.checkoutDate
        ? new Date(req.body.checkoutDate)
        : new Date();

      for(const room of roomOrRooms){
      // room.forceCoutDate = checkoutDate; Comment out because need one table for forceCheckout data
      room.checkoutBy=req.user.id
      room.coutDate = new Date();
      room.coutTime = new Date().toLocaleTimeString('en-US', {hour12: false});
      }

      const canceledCheckinsObj = roomOrRooms
      await TblCheckin.destroy({ where: searchObj });
      await TblCanceledCheckins.bulkCreate(canceledCheckinsObj);

      return {
        status: true,
        message: "Room cancelled successfully",
      };
    } catch (error) {
      // Return error response if there is an error
      console.log(error);
      return {
        status: false,
        message: "Room failed to cancel",
        data: error?.message,
      };
    }
  };

  onlineCheckin = async (req) => {
    const currentRooms = await TblCheckin.findAll({
      where: {
        modeOfBooking: '2',
        paymentStatus: '1',
        paymentMode: '1',
        checkoutBy: {[Op.eq]: null}
      }
    });
    const bookingIdToRoomsMap = {};

    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }

    const currentRoomsData = [];

    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
      
      const userData = bookingRoom.bookedByUser ? await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } }) : {};

      const bookedByName = userData ? userData.name : {};

      const dharamshalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharamshalaData]] = await sequelize.query(dharamshalaQuery);

      const roomDetailsQuery = `Select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);

      const categories = roomDetails && roomDetails.category_id ? await TblRoomCategory.findOne({
        where: {
          category_id: JSON.parse(JSON.parse(roomDetails.category_id))
        }
      }) : {};
      const categoryName = categories ? categories.name : {};

      const facilities = roomDetails && roomDetails.facility_id ? await TblFacility.findOne({
        where: {
          facility_id: JSON.parse(JSON.parse(roomDetails.facility_id))
        }
      }) : {};
      const facilityName = facilities ? facilities.name : {};

      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });

      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;

      currentRoomsData.push({
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharamshalaData,
        roomDetails,
        categoryName,
        facilityName,
        roomAmountSum,
        advanceAmountSum,
        ...bookingRoom,
        coTime : roomDetails.coTime
      })
    }

    return currentRoomsData
  }

  roomsByBookingId = async (req) => {
    const { booking_id } = req.query;
    const currentRooms = await TblCheckin.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{
              paymentStatus: '0',
              paymentMode: '2'
            }]
          },
          {
            [Op.and]: [{
              paymentStatus: '1',
              paymentMode: '1'
            }]
          }
        ],
        booking_id : booking_id,
        checkoutBy: null
      },
      logging: console.log,
    });

    for (const room of currentRooms) {
      const employeeData = room.booked_by?await tblEmployee.findOne({ where: { id: room.booked_by }}):await tblUsers.findOne({ where: { id: room.bookedByUser }});
      const adminData = room.booked_by?await TblAdmin.findOne({ where: { id: room.booked_by }}):"";
      if(employeeData){
        room.setDataValue('bookedByName', employeeData.Username?employeeData.Username:employeeData.username);
      }else if(adminData){
        room.setDataValue('bookedByName', adminData.username);
      }
    }
    const currentRoomsData = await Promise.all(
      currentRooms.map(async (room) => {
        let query = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${room.dharmasala}`;
        const [[data]] = await sequelize.query(query);

        let query2 = `select * from tbl_rooms where ${room.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
        const [[roomDetails]] = await sequelize.query(query2);

        const categories = roomDetails && roomDetails.category_id
          ? await TblRoomCategory.findAll({
              where: {
                category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
              },
            })
          : [];
        let category_name = categories.map((category) => category.name);

        const facilities = roomDetails && roomDetails.facility_id
          ? await TblFacility.findAll({
              where: {
                facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
              },
            })
          : [];
        let facility_name = facilities.map((facility) => facility.name);

        return {
          ...room.dataValues,
          dharmasala: {
            ...data,
            id: room.dataValues.dharmasala,
          },
          category_name,
          facility_name,
          coTime : roomDetails.coTime
        };
      })
    );

    return currentRoomsData;
  };

  onlineRoomDashboard = async (req) => {
    try {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        0,
        0,
        -1
      )
        .toISOString()
        .split("T")
        .join(" ")
        .split("Z")
        .join("");

      console.log(startOfToday, " ", endOfToday);

      const query = `SELECT SUM(roomAmount) AS totalAmount FROM tbl_checkins WHERE date BETWEEN '${startOfToday}' AND '${endOfToday}' AND modeOfBooking='2' AND paymentMode='1' AND paymentStatus='1'`;
      const [[result]] = await sequelize.query(query);
      return result;
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Something Went Wrong",
        data: error?.message,
      };
    }
  } 

  checkCancel = async (req) => {
    let userId = req.user.id;
    if (!(req.body.id || req.body.bookingId)) {
      throw new Error({ error: "bookingId or id is required" });
    }
    const searchObj = {};
    if (req.body.id) {
      searchObj.id = req.body.id;
    } else {
      searchObj.booking_id = req.body.bookingId;
    }

    try {
      const roomOrRooms = await TblCheckin.findAll({
        where: searchObj,
        raw: true,
        nest: true,
      });

      if (!roomOrRooms) {
        throw new Error({ error: "Room Or Rooms not found" });
      }

      const currentDate = moment(new Date()).subtract(5, 'hours').subtract(30, 'minutes');
      const roomChDate = moment(roomOrRooms[0].date).subtract(5, 'hours').subtract(30, 'minutes');
      const differenceInHours = moment.duration(currentDate.diff(roomChDate)).asHours();
      const employee = await tblEmployee.findOne({where: { id: userId }});
      const admin = await TblAdmin.findOne({where: { id: userId }});
      if (differenceInHours >= 1 && employee) {
        return {
          status: false,
          message: "Room failed to cancel",
          data: "Time Limit Elapsed",
        };
      }else if(differenceInHours>=2 && admin){
        return {
          status: false,
          message: "Room failed to cancel",
          data: "Time Limit Elapsed"
        }
      }
      console.log(currentDate,"       ", roomChDate, "       ", differenceInHours)
      
      return {
        status : true
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  checkRoomShift = async (req) => {
    let userId = req.user.id;
    if (!(req.body.id || req.body.bookingId)) {
      throw new Error({ error: "bookingId or id is required" });
    }
    const searchObj = {};
    if (req.body.id) {
      searchObj.id = req.body.id;
    } else {
      searchObj.booking_id = req.body.bookingId;
    }

    try {
      const roomOrRooms = await TblCheckin.findAll({
        where: searchObj,
        raw: true,
        nest: true,
      });

      if (!roomOrRooms) {
        throw new Error({ error: "Room Or Rooms not found" });
      }

      const currentDate = moment(new Date()).subtract(5, 'hours').subtract(30, 'minutes');
      const roomChDate = moment(roomOrRooms[0].date).subtract(5, 'hours').subtract(30, 'minutes');
      const differenceInHours = moment.duration(currentDate.diff(roomChDate)).asHours();
      const employee = await tblEmployee.findOne({where: { id: userId }});
      const admin = await TblAdmin.findOne({where: { id: userId }});
      if (differenceInHours >= 1 && employee) {
        return {
          status: false,
          message: "Room failed to update",
          data: "Time Limit Elapsed",
        };
      }else if(differenceInHours>=2 && admin){
        return {
          status: false,
          message: "Room failed to update",
          data: "Time Limit Elapsed"
        }
      }
      console.log(currentDate,"       ", roomChDate, "       ", differenceInHours)
      return {
        status : true
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getCheckinDetailsByNum = async (req) => {
    try {
      const { contactNo } = req.body;
      const data = await TblCheckin.findOne({
        where : {
          contactNo : contactNo
        },
        order : [["date", "DESC"]]
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getOnlinePaymentFailed = async (req) => {
    try {
      const currentRooms = await TblCheckin.findAll({
        where: {
          [Op.and]: [{
            paymentStatus: '0',
            paymentMode: '1',
            modeOfBooking: '2'
          }],
        },
        logging: console.log,
      });

      for (const room of currentRooms) {
        const userData = room.bookedByUser?await tblUsers.findOne({ where: { id: room.bookedByUser }}):{};
        if(userData){
          room.setDataValue('bookedByName', userData.name?userData.name:userData.username);
        }
      }
      const currentRoomsData = await Promise.all(
        currentRooms.map(async (room) => {
          let query = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${room.dharmasala}`;
          const [[data]] = await sequelize.query(query);

          let query2 = `select * from tbl_rooms where ${room.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo`;
          const [[roomDetails]] = await sequelize.query(query2);

          const categories = roomDetails && roomDetails.category_id
            ? await TblRoomCategory.findAll({
                where: {
                  category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
                },
              })
            : [];
          let category_name = categories.map((category) => category.name);

          const facilities = roomDetails && roomDetails.facility_id
            ? await TblFacility.findAll({
                where: {
                  facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
                },
              })
            : [];
          let facility_name = facilities.map((facility) => facility.name);

          return {
            ...room.dataValues,
            dharmasala: {
              ...data,
              id: room.dataValues.dharmasala,
            },
            category_name,
            facility_name,
            coTime : roomDetails.coTime
          };
        })
      );

      return currentRoomsData;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  onlineCheckinHistory = async (req) => {
    const { fromDate, toDate } = req.query;
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 2
    )
      .toISOString()
      .split("T")
      .join(" ")
      .split("Z")
      .join("");
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      -1
    )
      .toISOString()
      .split("T")
      .join(" ")
      .split("Z")
      .join("");
    let whereclause = {};
    whereclause = {
      modeOfBooking : 2,
      paymentStatus : 1,
      paymentMode : 1
    }
    if (!fromDate && !toDate) {
      whereclause.date = { [Op.between] : [ startOfToday, endOfToday ] }
    }
    if (fromDate && toDate) {
      whereclause.date = {[Op.and] : [
        {[Op.gte] : fromDate},
        {[Op.lte] : toDate}
      ]}
    }
    const currentRooms = await TblCheckin.findAll({
      where: whereclause,
      logging: console.log,
    });
  
    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const userData = bookingRoom.bookedByUser?await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } }) : {};
  
      const bookedByName =userData.name?userData.name:userData.username;
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);

      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;
  
      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
  };

  roomDetail = async (req) => {
    const totalRooms = await TblRoom.findAll({
      attributes : [
        [sequelize.fn('SUM', sequelize.literal('(TroomNo-FroomNo) + 1')), 'TotalRooms']
      ],
      raw: true
    });

    const occupiedRooms = await TblCheckin.findAll({
      where : {
        [Op.or] : [
          {
            [Op.and] : [{
              modeOfBooking : 1,
              paymentStatus : 0,
              paymentMode : 2
            }]
          },
          {
            [Op.and] : [{
              modeOfBooking : 2,
              paymentStatus : 1,
              paymentMode : 1
            }]
          },
          {
            [Op.and] : [{
              modeOfBooking : 1,
              paymentStatus : 1,
              paymentMode : 1
            }]
          }
        ],
        date : { [Op.lt] : new Date(new Date(new Date().setUTCHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)).toISOString() },
        checkoutBy : {
          [Op.eq] : null
        }
      },
      attributes : ["RoomNo"],
      raw : true
    });

    const holdRooms = await TblHoldin.findAll({
      where : {
        checkoutBy : {
          [Op.eq] : null
        }
      },
      attributes : ["roomNo"],
      raw : true
    })

    const totalRoomsInt = parseInt(totalRooms[0].TotalRooms, 10);
    const blankRooms = totalRoomsInt - occupiedRooms.length - holdRooms.length;
    
    return {
      totalRooms : totalRoomsInt,
      occupiedRooms : occupiedRooms.length,
      holdRooms : holdRooms.length,
      availableRooms : blankRooms
    }
  };

  addDisableDharamshala = async (req) => {
    try {
      const { dharamshala, fromDate, toDate } = req.body;
      const data = await TblDisableDharamshala.create({
        dharamshala,
        fromDate,
        toDate
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getDisableDharamshala = async (req) => {
    try {
      const data = await TblDisableDharamshala.findAll({
        order : [["id", "DESC"]],
        attributes : ["id", "dharamshala", "fromDate", "toDate"],
        raw : true
      });

      for(const dharamshalaData of data) {
        const dharamshala = await TblDharmasal.findOne({
          where : {
            dharmasala_id : dharamshalaData.dharamshala
          },
          attributes : ["name", "desc"]
        });
        dharamshalaData.dharamshalaName = dharamshala.name
        dharamshalaData.dharamshalaDesc = dharamshala.desc
      }
      return data;
    } catch (error) {
      console.log(error);
      return error
    }
  };

  editDisableDharamshala = async (req) => {
    try {
      const { id, dharamshala, fromDate, toDate } = req.body;
      const data = await TblDisableDharamshala.update(
        {
          dharamshala : dharamshala,
          fromDate : fromDate,
          toDate : toDate
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

  deleteDisableDharamshala = async (req) => {
    try {
      const { id } = req.query;
      const data = await TblDisableDharamshala.destroy({
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

  roomBookingHistory = async (req) => {
    let whereclause = {};
    whereclause = {
      modeOfBooking : 2,
      paymentStatus : 1,
      paymentMode : 1
    }
    whereclause.bookedByUser = req.user.id;
    const currentRooms = await TblCheckin.findAll({
      where: whereclause,
      logging: console.log,
    });
  
    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const userData = bookingRoom.bookedByUser?await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } }) : {};
  
      const bookedByName =userData.name?userData.name:userData.username;
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);

      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;
  
      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
  };

  checkinCertificate = async (req) => {
    try {
      const { booking_id } = req.query;
      const currentRooms = await TblCheckin.findAll({
        where: {
          booking_id : booking_id,
          checkoutBy : null
        },
      });

      const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const employeeData = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by } })
        : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } });
  
      const adminData = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by } }) : null;
  
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);
  
      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;

      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }

      function delay(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      
      (async () => {
        try {

          //Changing .ejs extenstion to .html because browser not support .ejs file, it will automatically download
          //according to code, we are taking screenshot of page. that's why now we will use .html or other extenstion
          const url = `https://labhandibe.techjainsupport.co.in/uploads/images/CheckinReceipt.html`;
      
          console.log('Launching Puppeteer...');
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome', // Adjust the path to Chrome as needed
          });
      
          console.log('Creating a new incognito browser context...');
          const context = await browser.createIncognitoBrowserContext();
      
          // Define your custom font and language settings in the headers
          const customHeaders = {
            'Accept-Language': 'hi-IN,en-US,en;q=0.9', // Set Hindi as the preferred language, with English as a fallback
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36', // Set the user agent
            'Font-Preference': 'Noto Sans Devanagari, Arial, sans-serif', // Specify your custom fonts here, with a fallback to sans-serif
          };
      
          console.log('Creating a new page...');
          const page = await context.newPage();
      
          console.log('Enabling JavaScript on the page...');
          await page.setJavaScriptEnabled(true);
      
          // Set the custom headers
          await page.setExtraHTTPHeaders(customHeaders);
      
          console.log('Setting the viewport size...');
          await page.setViewport({ width: 1500, height: 800 });
      
          console.log('Creating a promise to wait for the page to load...');
          const domLoadedPromise = new Promise((resolve) => {
            page.once('load', resolve);
          });
      
          // Define the file path to your EJS template
          const filePath = path.join(__dirname, '../public/uploads/', 'CheckinReceipt.html');
      
          console.log('Converting an amount to words...');
          const toWords = new ToWords({ localeCode: 'hi-IN' });
      
          console.log('Rendering the EJS template with your data...');
          const template = await ejs.renderFile(filePath, {
            currentRoomsData: currentRoomsData,
          });
      
          console.log('Defining the filename and path for the screenshot...');
          const filename = path.resolve(__dirname, '../public/uploads/checkin', `${booking_id}.png`);
      
          console.log('Navigating to the URL and waiting for the page to fully load...');
          // setTimeout(() => {
          //   page.goto(url);
          // }, 1000);

          await page.goto(url, { waitUntil: 'networkidle0' });

          await delay(1000);
          
          console.log('Setting the page content to your rendered template...');
          await page.setContent(template);
      
          console.log('Waiting for the DOM to fully load...');
          await domLoadedPromise;
      
          console.log('Capturing a full-page screenshot and saving it to the specified filename...');
          await page.screenshot({
            path: filename,
            fullPage: true,
          });


          // Calling WhatsApp API for sending an Image
          await checkinWhatsappSms(currentRoomsData[0].contactNo, booking_id).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });
          
          console.log('Closing the browser context and the browser...');
          await context.close();
          await browser.close();

          console.log('Image created successfully');
        } catch (err) {
          console.error('Error:', err);
        }
      })();
    return currentRoomsData;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  checkoutCertificate = async (req) => {
    
    const searchObj = {
      checkoutBy: {
        [Op.ne]: null
      },
      forceCoutDate: {
        [Op.eq]: null
      },
    };
    const { booking_id } = req.query;

    const currentRooms = await TblCheckin.findAll({
      where: {
        booking_id : booking_id,
        checkoutBy : { [Op.ne] : null }
      },
    });
  
    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];

      const employeeDataPromise = bookingRoom.booked_by
        ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by }, attributes: ["id", "Username"] })
        : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser }, attributes: ["id", "username", "name"] });
      const employeeData1Promise = bookingRoom.checkoutBy
        ? await tblEmployee.findOne({ where: { id: bookingRoom.checkoutBy }, attributes: ["id", "Username"] })
        : {};
  
      const adminDataPromise = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by }, attributes: ["id", "username"] }) : {};
      const adminData1Promise = bookingRoom.checkoutBy ? await TblAdmin.findOne({ where: { id: bookingRoom.checkoutBy }, attributes: ["id", "username"] }) : {};
  
      // const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
      // const checkoutByName = employeeData1 ? (employeeData1.Username ? employeeData1.Username : '') : (adminData1 ? adminData1.username : '');
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      // const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select category_id, facility_id, coTime from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);

      const [
        employeeData,
        employeeData1,
        adminData,
        adminData1,
        [[dharmasalaData]],
        categories,
        facilities,
        roomAmountSumResult,
        advanceAmountSumResult
      ] = await Promise.all([
        employeeDataPromise,
        employeeData1Promise,
        adminDataPromise,
        adminData1Promise,
        sequelize.query(dharmasalaQuery),
        roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
            attributes: ["name"]
          })
        : [],
        roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
            attributes: ["name"]
          })
        : [],
        TblCheckin.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
          ],
          where: {
            booking_id: bookingId,
            RoomNo: bookingRoom.roomNumbers,
          },
          raw: true,
        }),
        TblCheckin.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
          ],
          where: {
            booking_id: bookingId,
            RoomNo: bookingRoom.roomNumbers,
          },
          raw: true,
        })
      ])
      const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
      const checkoutByName = employeeData1 ? (employeeData1.Username ? employeeData1.Username : '') : (adminData1 ? adminData1.username : '');
      const category_name = categories.map((category) => category.name);
      const facility_name = facilities.map((facility) => facility.name);
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;
  
      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        checkoutByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    function delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    
    (async () => {
      try {

        //Changing .ejs extenstion to .html because browser not support .ejs file, it will automatically download
        //according to code, we are taking screenshot of page. that's why now we will use .html or other extenstion
        const url = `https://labhandibe.techjainsupport.co.in/uploads/images/CheckoutReceipt.html`;
    
        console.log('Launching Puppeteer...');
        const browser = await puppeteer.launch({
          executablePath: '/usr/bin/google-chrome', // Adjust the path to Chrome as needed
        });
    
        console.log('Creating a new incognito browser context...');
        const context = await browser.createIncognitoBrowserContext();
    
        // Define your custom font and language settings in the headers
        const customHeaders = {
          'Accept-Language': 'hi-IN,en-US,en;q=0.9', // Set Hindi as the preferred language, with English as a fallback
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36', // Set the user agent
          'Font-Preference': 'Noto Sans Devanagari, Arial, sans-serif', // Specify your custom fonts here, with a fallback to sans-serif
        };
    
        console.log('Creating a new page...');
        const page = await context.newPage();
    
        console.log('Enabling JavaScript on the page...');
        await page.setJavaScriptEnabled(true);
    
        // Set the custom headers
        await page.setExtraHTTPHeaders(customHeaders);
    
        console.log('Setting the viewport size...');
        await page.setViewport({ width: 1500, height: 800 });
    
        console.log('Creating a promise to wait for the page to load...');
        const domLoadedPromise = new Promise((resolve) => {
          page.once('load', resolve);
        });
    
        // Define the file path to your EJS template
        const filePath = path.join(__dirname, '../public/uploads/', 'CheckoutReceipt.html');
    
        console.log('Converting an amount to words...');
        const toWords = new ToWords({ localeCode: 'hi-IN' });
    
        console.log('Rendering the EJS template with your data...');
        const template = await ejs.renderFile(filePath, {
          currentRoomsData: currentRoomsData,
        });
    
        console.log('Defining the filename and path for the screenshot...');
        const filename = path.resolve(__dirname, '../public/uploads/checkout', `${booking_id}_${Date.now()}.png`);
    
        console.log('Navigating to the URL and waiting for the page to fully load...');
        // setTimeout(() => {
        //   page.goto(url);
        // }, 1000);

        await page.goto(url, { waitUntil: 'networkidle0' });

        await delay(1000);
        
        console.log('Setting the page content to your rendered template...');
        await page.setContent(template);
    
        console.log('Waiting for the DOM to fully load...');
        await domLoadedPromise;
    
        console.log('Capturing a full-page screenshot and saving it to the specified filename...');
        await page.screenshot({
          path: filename,
          fullPage: true,
        });

        const parts = filename.split('/').pop().split('.').slice(0, -1);
        const extractedPart = parts.join('.');
        const fileNameWithoutExtension = path.basename(extractedPart, path.extname(extractedPart));
        // Calling WhatsApp API for sending an Image
        await checkoutWhatsappSms(currentRoomsData[0].contactNo, fileNameWithoutExtension).then(result => {
          console.log(result);
      })
      .catch(error => {
          console.error(error);
      });
        
        console.log('Closing the browser context and the browser...');
        await context.close();
        await browser.close();

        console.log('Image created successfully');
      } catch (err) {
        console.error('Error:', err);
      }
    })();

    return currentRoomsData;
  };

  searchRoomBookingHistory = async (req) => {
    const { search } = req.query;
    const userId = req.user.id;
    const currentRooms = await TblCheckin.findAll({
      where: {
        [Op.or] : [
          { RoomNo : { [Op.eq] : search } },
          { booking_id : { [Op.like] : `%${search}%` } },
          { dharmasala : { [Op.eq] : search } },
          { contactNo : { [Op.like] : `%${search}%` } },
          { name : { [Op.like] : `%${search}%` } },
          { email : { [Op.like] : `%${search}%` } },
          { address : { [Op.like] : `%${search}%` } },
          { city : { [Op.like] : `%${search}%` } },
          { state : { [Op.like] : `%${search}%` } },
          { proof : { [Op.like] : `%${search}%` } },
          { idNumber : { [Op.like] : `%${search}%` } },
          { male : { [Op.eq] : search } },
          { modeOfBooking	 : { [Op.eq] : search } },
          { paymentid : { [Op.like] : `%${search}%` } },
          { female : { [Op.eq] : search } },
          { child : { [Op.eq] : search } },
          { Fname : { [Op.like] : `%${search}%` } },
          { roomAmount : { [Op.eq] : search } },
          { advanceAmount : { [Op.eq] : search } },
          { bankName : { [Op.like] : `%${search}%` } },
          { transactionId : { [Op.like] : `%${search}%` } },
          { remarks : { [Op.like] : `%${search}%` } },
        ],
        modeOfBooking : 2,
        paymentStatus : 1,
        paymentMode : 1,
        bookedByUser : userId
      },
      logging: console.log,
    });
  
    const bookingIdToRoomsMap = {}; 
  
    // Group rooms by booking_id
    for (const room of currentRooms) {
      if (!bookingIdToRoomsMap[room.booking_id]) {
        bookingIdToRoomsMap[room.booking_id] = {
          ...room.dataValues,
          roomNumbers: [],
        };
      }
      bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
    }
  
    const currentRoomsData = [];
  
    for (const bookingId in bookingIdToRoomsMap) {
      const bookingRoom = bookingIdToRoomsMap[bookingId];
  
      const userData = bookingRoom.bookedByUser?await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } }) : {};
  
      const bookedByName =userData.name?userData.name:userData.username;
  
      const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
  
      const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
      const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
  
      const categories = roomDetails && roomDetails.category_id
        ? await TblRoomCategory.findAll({
            where: {
              category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
            },
          })
        : [];
      const category_name = categories.map((category) => category.name);
  
      const facilities = roomDetails && roomDetails.facility_id
        ? await TblFacility.findAll({
            where: {
              facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
            },
          })
        : [];
      const facility_name = facilities.map((facility) => facility.name);

      const roomAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const advanceAmountSumResult = await TblCheckin.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
        ],
        where: {
          booking_id: bookingId,
          RoomNo: bookingRoom.roomNumbers,
        },
        raw: true,
      });
  
      const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
      const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;
  
      currentRoomsData.push({
        booking_id: bookingId,
        bookedByName,
        roomNumbers: bookingRoom.roomNumbers,
        dharmasalaData,
        ...bookingRoom, 
        category_name,
        facility_name,
        roomAmountSum,
        advanceAmountSum,
        coTime : roomDetails.coTime
      });
    }
  
    return currentRoomsData;
  };

  checkDoubleReceiptRoomBooking = async (req) => {
    try {
      const query = `SELECT *
      FROM tbl_checkins
      GROUP BY RoomNo, dharmasala, time, contactNo, name, email, address, city, state, proof, idNumber, male, modeOfBooking, paymentStatus, paymentid, female, child, Fname, nRoom, extraM, booked_by, roomAmount, advanceAmount, paymentMode, paymentDate, bookedByUser, bankName, transactionId, remarks
      HAVING COUNT(*) > 1`;
      const [data] = await sequelize.query(query);
      
      const duplicateBookingIds = data.map((booking) => booking.booking_id);

      const currentRooms = await TblCheckin.findAll({
        where : {
          booking_id : duplicateBookingIds
        },
        logging: console.log,
      });
    
      const bookingIdToRoomsMap = {}; 
    
      // Group rooms by booking_id
      for (const room of currentRooms) {
        if (!bookingIdToRoomsMap[room.booking_id]) {
          bookingIdToRoomsMap[room.booking_id] = {
            ...room.dataValues,
            roomNumbers: [],
          };
        }
        bookingIdToRoomsMap[room.booking_id].roomNumbers.push(room.RoomNo);
      }
    
      const currentRoomsData = [];
    
      for (const bookingId in bookingIdToRoomsMap) {
        const bookingRoom = bookingIdToRoomsMap[bookingId];
    
        const employeeData = bookingRoom.booked_by
          ? await tblEmployee.findOne({ where: { id: bookingRoom.booked_by } })
          : await tblUsers.findOne({ where: { id: bookingRoom.bookedByUser } });
    
        const adminData = bookingRoom.booked_by ? await TblAdmin.findOne({ where: { id: bookingRoom.booked_by } }) : null;
    
        const bookedByName = employeeData ? (employeeData.Username ? employeeData.Username : employeeData.username) : (adminData ? adminData.username : '');
    
        const dharmasalaQuery = `SELECT name FROM tbl_dharmasalas WHERE dharmasala_id = ${bookingRoom.dharmasala}`;
        const [[dharmasalaData]] = await sequelize.query(dharmasalaQuery);
    
        const roomDetailsQuery = `select * from tbl_rooms where ${bookingRoom.RoomNo} BETWEEN tbl_rooms.FroomNo AND tbl_rooms.TroomNo AND dharmasala_id = ${bookingRoom.dharmasala}`;
        const [[roomDetails]] = await sequelize.query(roomDetailsQuery);
    
        const categories = roomDetails && roomDetails.category_id
          ? await TblRoomCategory.findAll({
              where: {
                category_id: JSON.parse(JSON.parse(roomDetails.category_id)),
              },
            })
          : [];
        const category_name = categories.map((category) => category.name);
    
        const facilities = roomDetails && roomDetails.facility_id
          ? await TblFacility.findAll({
              where: {
                facility_id: JSON.parse(JSON.parse(roomDetails.facility_id)),
              },
            })
          : [];
        const facility_name = facilities.map((facility) => facility.name);
    
        const roomAmountSumResult = await TblCheckin.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('roomAmount')), 'roomAmountSum'],
          ],
          where: {
            booking_id: bookingId,
            RoomNo: bookingRoom.roomNumbers,
          },
          raw: true,
        });
    
        const advanceAmountSumResult = await TblCheckin.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('advanceAmount')), 'advanceAmountSum'],
          ],
          where: {
            booking_id: bookingId,
            RoomNo: bookingRoom.roomNumbers,
          },
          raw: true,
        });
    
        const roomAmountSum = roomAmountSumResult.roomAmountSum || 0;
        const advanceAmountSum = Math.round(advanceAmountSumResult.advanceAmountSum) || 0;
  
        currentRoomsData.push({
          booking_id: bookingId,
          bookedByName,
          roomNumbers: bookingRoom.roomNumbers,
          dharmasalaData,
          ...bookingRoom, 
          category_name,
          facility_name,
          roomAmountSum,
          advanceAmountSum,
          coTime : roomDetails.coTime
        });
      }
    
      return currentRoomsData;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getRoomDetailsByRoomNo = async (req) => {
    try {
      const { roomNo, dharamshalaId , categoryId } = req.query;
      const data = await TblRoom.findAll({
        where : {
          [Op.and] : [
            { FroomNo : { [Op.lte] : roomNo } },
            { TroomNo : { [Op.gte] : roomNo } },
            { dharmasala_id : dharamshalaId },
            { category_id : { [Op.like] : `%${categoryId}%` }  }
          ],
        },
        raw: true
      });
      for(const names of data) {
        const category = await TblRoomCategory.findOne({
          where : {
            category_id : JSON.parse(JSON.parse(names.category_id))
          }
        });
        if(category){
          names.categoryName = category.name
        }
        const facility = await TblFacility.findOne({
          where : {
            facility_id : JSON.parse(JSON.parse(names.facility_id))
          }
        });
        if(facility) {
          names.facilityName = facility.name
        }
        names.RoomNo = roomNo
      }
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getRoomBookingMobileNo = async (req) => {
    try {
      const data = await TblCheckin.findAll({
        attributes : ["contactNo", "name", "address"],
        order : [["id", "DESC"]],
        group : "contactNo"
      });
      return data;  
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

module.exports = new RoomCollection();
