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

  async run (role) {
    if (!role.guild) return;
    const guild = await Settings.findOne({ guildID: role.guild.id });
     if (!guild) return;
     if (guild.serverLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;
    const RoleEmbed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`🔧 Role Created\n**Role**: ${role} (ID: ${role.id})`)
      .setTimestamp();
    logchannel.send(RoleEmbed);
  }
};
