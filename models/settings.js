const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  guildID: String,
  prefix: String,
  logsChannel: String,
  modRole: String,
  adminRole: String,
  joinrole: String,
  antiSpam: String,
  antiLinks: String,
  antiInvite: String,
  antiBad: String,
  antiEveryone: String,
  maxMentions: Number,
  maxLines: Number,
  ignoredRoles: Array,
  ignoredUsers: Array,
  ignoredChannels: Array,
  checkpoint: String,
  checkpoint_logChannel: String,
  checkpoint_mode: String,
  underAttack: String,
  nsfwDetection: String,
  tags: Array,
  selfroles: Array,
  punishments: Array,
  chatLogs: String,
  moderationLogs: String,
  serverLogs: String
});

module.exports = mongoose.model("settings", settingSchema);
