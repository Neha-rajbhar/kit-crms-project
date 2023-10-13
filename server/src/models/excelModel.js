const mongoose = require("mongoose");
const excelModel = new mongoose.Schema({
  Srno: { type: String },
  CustomerName: { type: String },
  location: { type: String },
  mobile: { type: String },
  alternateMobile: { type: String },
  email: { type: String },
  type: { type: String },
  remark1: { type: String },
  remark2: { type: String },
});

const Excel = mongoose.model("Excel", excelModel);
module.exports = Excel;
