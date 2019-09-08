const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const Lockdown = require("../models/lockdown.js");

class Lockdow {
  static async handle (client, message) {
    const lockdownStatus = await Lockdown.findOne({ guildID: message.guild.id });
    if (!lockdownStatus) return false;
    if (lockdownStatus.lockdownMode !== "on") return false;
    if (message.channel.id === message.guild.settings.logsChannel) return;
    
    try {
      await message.delete();
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = Lockdow;
