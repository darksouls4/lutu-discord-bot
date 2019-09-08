const mongoose = require("mongoose");

const infractionSchema = mongoose.Schema({
  guildID: String,
  userID: String,
  infractions: Number
});

module.exports = mongoose.model("Infractions", infractionSchema);