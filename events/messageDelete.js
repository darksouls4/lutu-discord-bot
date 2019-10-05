const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
 const mongoose = require("mongoose");
 const config = require("../config.js");
 const databaseUrl = config.dbUrl;
 const Settings = require("../models/settings.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    if(message.author.bot) return;
    if (!message.guild) return;
    const guild = await Settings.findOne({ guildID: message.guild.id });
     if (!guild) return;
     if (guild.chatLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;

    const DeleteEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag,message.author.displayAvatarURL)
      .setColor("RED")
      .setDescription(`🗑 Message Deletion\n**Message By**: ${message.author} (ID: ${message.author.id})\n**Message Channel**: ${message.channel} (ID: ${message.channel.id})\n**Message Content**:\n${message.content || "Unavailable"}`)
      .setTimestamp();
    logchannel.send(DeleteEmbed);
  }
};
