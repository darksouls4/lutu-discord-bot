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

  async run (channel) {
    if (!channel.guild) return;
    const guild = await Settings.findOne({ guildID: channel.guild.id });
     if (!guild) return;
     if (guild.serverLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;
    const channelEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`🚫 Channel Deleted\n**Channel**: ${channel.name} (ID: ${channel.id}) `)
      .setTimestamp();
    logchannel.send(channelEmbed);
}


};
