const mongoose = require("mongoose");

const preSchema = mongoose.Schema({
  caseID: String,
  reportedID: String,
  reportedByID: String,
  caseReason: String,
  proofs: Array
});

module.exports = mongoose.model("Prereports", preSchema);