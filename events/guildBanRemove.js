const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const mongoose = require("mongoose");
const config = require("../config.js");
const databaseUrl = config.dbUrl;
const Settings = require("../models/settings.js");
const logHandler = require("../handlers/serverLogger.js");

 mongoose.connect(databaseUrl, {
   useNewUrlParser: true
 });
module.exports = class {
  constructor (client) {
    this.client = client;
  }
  async run (guild, user) {
    const mguild = await Settings.findOne({ guildID: guild.id });
     if (!mguild) return;
     if (mguild.moderationLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(mguild.logsChannel);
     if (!logchannel) return;
     let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first())
     const Logger = new logHandler({ client: this.client, case: "unban", guild: guild.id, member: entry.target.user, moderator: excutor.user, reason: entry.reason || "Not specified." });
     Logger.send().then(t => Logger.kill());
}


};
