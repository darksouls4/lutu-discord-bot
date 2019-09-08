const mongoose = require("mongoose");

const banSchema = mongoose.Schema({
  caseID: String,
  reportedID: String,
  reportedByID: String,
  caseReason: String,
  caseAcceptedAt: String,
  proofs: Array
});

module.exports = mongoose.model("Bans", banSchema);