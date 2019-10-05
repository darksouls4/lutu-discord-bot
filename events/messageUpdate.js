const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
 const mongoose = require("mongoose");
 const config = require("../config.js");
 const databaseUrl = config.dbUrl;
 const Settings = require("../models/settings.js");
 const automod = require("../handlers/automod.js");
 const lockdown = require("../handlers/lockdown.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (oldMessage, newMessage) {
    if (newMessage.author.bot) return;
    if (!oldMessage.guild) return;
    if (!newMessage.guild) return;
    const guild = await Settings.findOne({ guildID: oldMessage.guild.id });
    if (guild.chatLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
    if (!logchannel) return;
    if (oldMessage.content === newMessage.content) return;

    const EditEmbed = new Discord.MessageEmbed()
      .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL())
      .setColor("#2A7AAF")
      .setDescription(`📝 Message Edited\n**Author**: ${oldMessage.author} (ID: ${oldMessage.author.id})\n**Channel**: ${oldMessage.channel} (ID: ${oldMessage.channel.id})\n**Message**: [Warp to message](${oldMessage.url})\n**Before**:\n${oldMessage.content || "Uncached Attachments"}\n**After**:\n${newMessage.content || "Uncached Attachments"}`)
      .setTimestamp();
    logchannel.send(EditEmbed);
  }
};
