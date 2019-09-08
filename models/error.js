const mongoose = require("mongoose");

const errSchema = mongoose.Schema({
  errCode: String,
  err: String,
  errTimestamp: String,
  errPath: String
});

module.exports = mongoose.model("Errors", errSchema);