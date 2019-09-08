const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
 const mongoose = require("mongoose");
 const config = require("../config.js");
 const databaseUrl = config.dbUrl;
 const Settings = require("../models/settings.js");
 mongoose.connect(databaseUrl, {
   useNewUrlParser: true
 });
module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (oldRole,newRole) {
    if (!oldRole.guild) return;
    if (!newRole.guild) return;
    const guild = await Settings.findOne({ guildID: oldRole.guild.id });
     if (!guild) return;
     if (guild.serverLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;

     let entry = await oldRole.guild.fetchAuditLogs({
      type: 'ROLE_UPDATE'
  }).then(audit => audit.entries.first())

  let excutor = entry.executor;
  let type = entry.changes[0].key

if (newRole.name === oldRole.name && oldRole.hexColor === newRole.hexColor) return;

  if (type === "name") {
    let embed1 = new Discord.MessageEmbed()
          .setDescription(`✏ Role Renamed:\n**Moderator**: ${entry.executor} (ID: ${entry.executor.id})\n**Role**: ${newRole} (ID: ${newRole.id})\n**Old Name**: ${entry.changes[0].old}\n**New Name**: ${entry.changes[0].new}`)
          .setColor("BLUE")
          .setTimestamp();
          logchannel.send(embed1)
  }

  if (type === "color"){
      let embed2 = new Discord.MessageEmbed()
          .setDescription(`✏ Role Color Changed:\n**Moderator:** ${entry.executor} (ID: ${entry.executor.id})\n**Role**: ${newRole} (ID: ${newRole.id})\n**Old Color**: ${oldRole.hexColor}\n**New Color**: ${newRole.hexColor}`)
          .setColor("BLUE")
          .setTimestamp();
          logchannel.send(embed2)
  }

}


};
