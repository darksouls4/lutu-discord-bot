const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
 const mongoose = require("mongoose");
 const config = require("../config.js");
 const databaseUrl = config.dbUrl;
 const Settings = require("../models/settings.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (oldChannel,newChannel) {
    if (!oldChannel.guild) return;
    if (!newChannel.guild) return;
    if (oldChannel.name == newChannel.name)return
    const guild = await Settings.findOne({ guildID: newChannel.guild.id });
     if (!guild) return;
     if (guild.serverLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;
    const channelEmbed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(`✏ Channel Renamed:\n**Channel**: ${newChannel} (ID: ${newChannel.id})\n**Old Name**: ${oldChannel.name}\n**New Name**: ${newChannel.name}`)
      .setTimestamp();
    logchannel.send(channelEmbed);
}


};
