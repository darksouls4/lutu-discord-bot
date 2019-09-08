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

  async run (oldMember,newMember) {
    if (oldMember.nickname !== newMember.nickname){
    const guild = await Settings.findOne({ guildID: oldMember.guild.id });
     if (!guild) return;
     if (guild.moderationLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;

    const NickEmbed = new Discord.MessageEmbed()
      .setAuthor(newMember.user.tag,newMember.user.displayAvatarURL)
      .setColor("BLUE")
      .setDescription(`✏ Nickname Change\n**Old Nickname**: ${oldMember.nickname || newMember.user.username}\n**New Nickname**: ${newMember.nickname ||newMember.user.username}`)
      .setTimestamp();
    logchannel.send(NickEmbed);
  }
  if (oldMember.roles.map(role => role).length !== newMember.roles.map(role => role).length){
    const guild = await Settings.findOne({ guildID: oldMember.guild.id });
     if (!guild) return;
     if (guild.moderationLogs.toLowerCase() !== "on") return;
    const logchannel = this.client.channels.get(guild.logsChannel);
     if (!logchannel) return;
    const NickEmbed = new Discord.MessageEmbed()
      .setAuthor(newMember.user.tag,newMember.user.displayAvatarURL)
      .setColor("BLUE")
      .setDescription(`✏ Roles Update\n**Old Roles**: ${oldMember.roles.map(role => role)}\n**New Roles**: ${newMember.roles.map(role => role)}`)
      .setTimestamp();
    logchannel.send(NickEmbed);
  }


}


};
