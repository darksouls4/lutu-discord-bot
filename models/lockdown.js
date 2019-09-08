const mongoose = require("mongoose");

const lockSchema = mongoose.Schema({
  guildID: String,
  lockdownMode: String
});

module.exports = mongoose.model("Lockdown", lockSchema);