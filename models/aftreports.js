const mongoose = require("mongoose");

const afterBan = mongoose.Schema({
  caseID: String,
  reportedID: String,
  reportedByID: String,
  caseReason: String,
  caseAcceptedAt: String,
  proofs: Array,
  caseDenialReason: String
});

module.exports = mongoose.model("AfterBans", afterBan);