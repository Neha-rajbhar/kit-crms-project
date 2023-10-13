const express = require("express");

const route = express.Router();
const { v4: uuidv4 } = require("uuid");
const employe = require("../models/employeModel.js");
const attendence = require("../models/attendenceModel.js");
const hr = require("../models/hrModel.js");
const attendanceHr = require("../models/attendanceHrModel.js");
const regularizeAttendenceHr = require("../models/regularizedAttendanceHr.js");
const regularizeAttendence = require("../models/regularizedAttendence.js");
const excel = require("../models/excelModel.js");
route.get("/generate-userid", async (req, res) => {
  try {
    const employees = await employe.find({});

    if (employees.length === 0) {
      return res.json({ lastUserIdCount: 0 });
    }

    const sortedEmployees = employees.sort((a, b) => {
      const userIdA = parseInt(a.userId.replace("vibrant", ""), 10);
      const userIdB = parseInt(b.userId.replace("vibrant", ""), 10);
      return userIdB - userIdA;
    });

    const latestEmployee = sortedEmployees[sortedEmployees.length - 1];
    const lastUserId = latestEmployee.userId;
    const lastUserIdCount = parseInt(lastUserId.replace("VIBRANT", ""), 10);

    res.json({ lastUserIdCount });
  } catch (error) {
    console.error("Error generating userId:", error);
    res.status(500).json({ error: "Error generating userId" });
  }
});

route.get("/generate-hrid", async (req, res) => {
  try {
    const hrs = await hr.find({});

    if (hrs.length === 0) {
      return res.json({ lastUserIdCount: 0 });
    }

    const sortedEmployees = hrs.sort((a, b) => {
      const userIdA = parseInt(a.hrId.replace("vibranthr", ""), 10);
      const userIdB = parseInt(b.hrId.replace("vibranthr", ""), 10);
      return userIdB - userIdA;
    });

    const latestEmployee = sortedEmployees[sortedEmployees.length - 1];
    const lastUserId = latestEmployee.hrId;
    const lastUserIdCount = parseInt(lastUserId.replace("VIBRANTHR", ""), 10);

    res.json({ lastUserIdCount });
  } catch (error) {
    console.error("Error generating hrId:", error);
    res.status(500).json({ error: "Error generating hrId" });
  }
});

route.post("/submit-employee", (req, res) => {
  //console.log(req.body);

  const newData = {
    userId: req.body.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    personalPhone: req.body.personalPhone,
    alternatePhone: req.body.alternatePhone,
    email: req.body.email,
    companyEmail: req.body.companyEmail,
    highestQualification: req.body.highestQualification,
    adharCard: req.body.adharCard,
    panCard: req.body.panCard,
    password: req.body.password,
    address: req.body.address,
    salary: req.body.salary
  };

  //console.log("nbxhasgxa");
  employe
    .create(newData)
    .then((createdEmploye) => {
      //console.log("Employe created:", createdEmploye);

      res.status(201).json({
        message: "Emplyee successfully!",
      });
    })
    .catch((error) => {
      console.error("Error creating Employe:", error);
      res.status(500).send("Error creating Employe.");
    });
});

route.post("/submit-hr", (req, res) => {
  //console.log(req.body);

  const newData = {
    hrId: req.body.hrId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    personalPhone: req.body.personalPhone,
    alternatePhone: req.body.alternatePhone,
    email: req.body.email,
    companyEmail: req.body.companyEmail,
    highestQualification: req.body.highestQualification,
    adharCard: req.body.adharCard,
    panCard: req.body.panCard,
    password: req.body.password,
    address: req.body.address,
    salary: req.body.salary
  };

  //console.log("nbxhasgxa");
  hr.create(newData)
    .then((createdHr) => {
     // console.log("Hr created:", createdHr);

      res.status(201).json({
        message: "Hr successfully!",
      });
    })
    .catch((error) => {
      console.error("Error creating Hr:", error);
      res.status(500).send("Error creating Hr.");
    });
});

route.get("/getEmployee", async (req, res) => {
  let query = res.query;
  data = await employe.find(query);
  res.send(data);
});

route.get("/getHr", async (req, res) => {
  let query = res.query;
  data = await hr.find(query);
  res.send(data);
});

route.get("/getAttendence", async (req, res) => {
  let query = res.query;
  data = await attendence.find(query);
  res.send(data);
});

route.get("/getAttendanceHr", async (req, res) => {
  let query = res.query;
  data = await attendanceHr.find(query);
  res.send(data);
});

route.get("/getRegularizedAttendence", async (req, res) => {
  let query = res.query;
  data = await regularizeAttendence.find(query);
  res.send(data);
});

route.get("/getRegularizedAttendanceByHr", async (req, res) => {
  let query = res.query;
  data = await regularizeAttendenceHr.find(query);
  res.send(data);
});

route.get("/getEmployeById/:id", (req, res) => {
  const id = req.params.id;

  employe
    .findById({ _id: id })
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.get("/getHrById/:id", (req, res) => {
  const id = req.params.id;
  hr.findById({ _id: id })
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.post("/updatePasswordById/:id", async (req, res) => {
  const id = req.params.id;

  employe
    .findByIdAndUpdate({ _id: id }, { password: req.body.password })
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.post("/updatePasswordHrById/:id", async (req, res) => {
  const id = req.params.id;
  hr.findByIdAndUpdate({ _id: id }, { password: req.body.password })
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.post("/updateEmployeById/:id", (req, res) => {
  const id = req.params.id;

  employe
    .findByIdAndUpdate(
      { _id: id },
      {
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        personalPhone: req.body.personalPhone,
        alternatePhone: req.body.alternatePhone,
        email: req.body.email,
        companyEmail: req.body.companyEmail,
        highestQualification: req.body.highestQualification,
        adharCard: req.body.adharCard,
        panCard: req.body.panCard,
        password: req.body.password,
        address: req.body.address,
        salary:req.body.salary
      }
    )
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.post("/updateHrById/:id", (req, res) => {
  const id = req.params.id;
  hr.findByIdAndUpdate(
    { _id: id },
    {
      hrId: req.body.hrId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      personalPhone: req.body.personalPhone,
      alternatePhone: req.body.alternatePhone,
      email: req.body.email,
      companyEmail: req.body.companyEmail,
      highestQualification: req.body.highestQualification,
      adharCard: req.body.adharCard,
      panCard: req.body.panCard,
      password: req.body.password,
      address: req.body.address,
      salary:req.body.salary
    }
  )
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.delete("/deleteEmployeById/:id", (req, res) => {
  const id = req.params.id;
  employe
    .findByIdAndDelete({ _id: id })
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.delete("/deleteHrById/:id", (req, res) => {
  const id = req.params.id;
  hr.findByIdAndDelete({ _id: id })
    .then((pro) => res.json(pro))
    .catch((err) => res.json(err));
});

route.get("/getAttendenceById/:employeId", async (req, res) => {
  const employeId = req.params.employeId;
  // console.log("employeeid", employeId);
  try {
    const attendenceData = await attendence.find({ employeId: employeId });
    res.json(attendenceData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

route.get("/getAttendanceHrById/:hrId", async (req, res) => {
  const hrId = req.params.hrId;
  // console.log("employeeid", employeId);
  try {
    const attendenceData = await attendanceHr.find({ hrId: hrId });
    res.json(attendenceData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

route.post("/attendence", async (req, res) => {
  // console.log(req.body);
  const newAttendence = {
    todayDate: req.body.todayDate,
    placeOfWorkValue: req.body.placeOfWorkValue,
    placeOfWorkFullForm: req.body.placeOfWorkFullForm,
    employeId: req.body.employeId,
    employeUserId: req.body.employeUserId,
    employeName: req.body.employeName,
    employeLastName: req.body.employeLastName,
  };
 // console.log(newAttendence, "object");
  try {
    const attendenceCreated = await attendence.create(newAttendence);
    //console.log("Attendance created:", attendenceCreated);
    res.status(201).json({ message: "Attendance Added Successfully" });
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Attendance not added" });
  }
});

route.post("/attendanceByHr", async (req, res) => {
  // console.log(req.body);
  const newAttendence = {
    todayDate: req.body.todayDate,
    placeOfWorkValue: req.body.placeOfWorkValue,
    placeOfWorkFullForm: req.body.placeOfWorkFullForm,
    hrId: req.body.hrId,
    hrHridId: req.body.hrHridId,
    hrName: req.body.hrName,
    hrLastName: req.body.hrLastName,
  };
  //console.log(newAttendence, "object");
  try {
    const attendenceCreated = await attendanceHr.create(newAttendence);
   // console.log("Attendance created:", attendenceCreated);
    res.status(201).json({ message: "Attendance Added Successfully" });
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Attendance not added" });
  }
});

route.post("/regularizedAttendence", async (req, res) => {
  const regularAttendence = {
    RegularizedAttendenceDate: req.body.RegularizedAttendenceDate,
    placeOfWorkValue: req.body.placeOfWorkValue,
    placeOfWorkFullForm: req.body.placeOfWorkFullForm,
    employeId: req.body.employeId,
    employeUserId: req.body.employeUserId,
    employeName: req.body.employeName,
    employeLastName: req.body.employeLastName,
    reason: req.body.reason,
  };
  //console.log(regularAttendence, "object");
  try {
    const attendenceCreated = await regularizeAttendence.create(
      regularAttendence
    );
    //console.log("Attendance created:", attendenceCreated);
    res.status(201).json({ message: "Attendance sent Successfully" });
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Attendance not added" });
  }
});

route.post("/regularizedAttendenceHr", async (req, res) => {
  const regularAttendence = {
    RegularizedAttendenceDate: req.body.RegularizedAttendenceDate,
    placeOfWorkValue: req.body.placeOfWorkValue,
    placeOfWorkFullForm: req.body.placeOfWorkFullForm,
    hrId: req.body.hrId,
    hrHridId: req.body.hrHridId,
    hrName: req.body.hrName,
    hrLastName: req.body.hrLastName,
    reason: req.body.reason,
  };
  //console.log(regularAttendence, "object");
  try {
    const attendenceCreated = await regularizeAttendenceHr.create(
      regularAttendence
    );
   // console.log("Attendance created:", attendenceCreated);
    res.status(201).json({ message: "Attendance sent Successfully" });
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Attendance not added" });
  }
});

route.post("/approveRegularizedAttendence/:id", async (req, res) => {
  try {
    const regularizedEntry = await regularizeAttendence.findById(req.params.id);

    if (!regularizedEntry) {
      return res.status(404).json({ message: "Regularized entry not found" });
    }

    const newAttendenceEntry = new attendence({
      todayDate: regularizedEntry.RegularizedAttendenceDate,
      placeOfWorkValue: regularizedEntry.placeOfWorkValue,
      placeOfWorkFullForm: regularizedEntry.placeOfWorkFullForm,
      employeId: regularizedEntry.employeId,
      employeUserId: regularizedEntry.employeUserId,
      employeName: regularizedEntry.employeName,
      employeLastName: regularizedEntry.employeLastName,
    });

    await newAttendenceEntry.save();

    await regularizeAttendence.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message:
        "Regularized attendance approved and moved to Attendence collection",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

route.post("/approvedRegularizedAttendanceByAdmin/:id", async (req, res) => {
  try {
    const regularizedHrEntry = await regularizeAttendenceHr.findById(
      req.params.id
    );

    if (!regularizedHrEntry) {
      return res.status(404).json({ message: "Regularized entry not found" });
    }

    const newAttendenceEntry = new attendanceHr({
      todayDate: regularizedHrEntry.RegularizedAttendenceDate,
      placeOfWorkValue: regularizedHrEntry.placeOfWorkValue,
      placeOfWorkFullForm: regularizedHrEntry.placeOfWorkFullForm,
      hrId: regularizedHrEntry.hrId,
      hrHridId: regularizedHrEntry.hrHridId,
      hrName: regularizedHrEntry.hrName,
      hrLastName: regularizedHrEntry.hrLastName,
    });

    await newAttendenceEntry.save();

    await regularizeAttendenceHr.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message:
        "Regularized attendance approved and moved to Attendence collection",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

route.post("/uploadExcel", async (req, res) => {
  try {
    const { excelData, selectedType } = req.body;
    // console.log(excelData, selectedType);

    const documents = excelData.map((row) => ({
      ...row,
      type: selectedType,
      remark1: "",
      remark2: "",
    }));

    const result = await excel.create(documents);

    res
      .status(200)
      .json({ message: "Excel data received and saved successfully", result });
  } catch (error) {
    console.error("Error processing Excel data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/fetchDistinctTypes", async (req, res) => {
  try {
    const distinctTypes = await excel.distinct("type");
    res.status(200).json(distinctTypes);
  } catch (error) {
    console.error("Error fetching distinct types:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/fetchDataByType", async (req, res) => {
  const { type } = req.query;
  try {
    const data = await excel.find({ type });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data by type:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.post("/updateRemark", async (req, res) => {
  const { type, id, remark1, remark2 } = req.body;
  // console.log(type, id, remark1, remark2, "data");

  try {
    const updatedDocument = await excel.findOneAndUpdate(
      { type: type, _id: id },
      { remark1: remark1, remark2: remark2 },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", updatedDocument });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.post("/updateRemark1", async (req, res) => {
  const { type, id, remark1 } = req.body;
  //console.log(type, id, remark1, "data");

  try {
    const updatedDocument = await excel.findOneAndUpdate(
      { type: type, _id: id },
      { remark1: remark1 },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", updatedDocument });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.post("/updateRemark2", async (req, res) => {
  const { type, id, remark2 } = req.body;
  //console.log(type, id, remark2, "data");

  try {
    const updatedDocument = await excel.findOneAndUpdate(
      { type: type, _id: id },
      { remark2: remark2 },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", updatedDocument });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = route;
