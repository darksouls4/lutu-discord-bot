const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const mongoose = require("mongoose");
const Infractions = require("../models/infractions.js");
const Settings = require("../models/settings.js");
const config = require("../config.js");
const databaseUrl = config.dbUrl;
const ms = require("ms");
const logHandler = require("./serverLogger.js");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});


class warningHandler {
  static process (client, warnedMember, warnAuthor, guild) {
    const muteUser = async (client, member, duration) => { // eslint-disable-line no-unused-vars
      const guild = member.guild;

      const muteRole = guild.roles.find(r => r.name === "Muted");
      if (!muteRole)  return;
      if (member.roles.has(muteRole.id)) return;

      try {
        ms(ms(duration));
      } catch (e) {
        return;
      }

      try {
        await member.roles.add(muteRole.id);
      } catch (e) {
        return;
      }

      setTimeout(async () => {
        if (!member.roles.has(muteRole.id)) return;
        await logHandler.sendLog(client, { channel: "NONE" }, guild.id, 9, { moderator: client.user, user: warnedMember, reason: "Temporary Mute Complete" });
        try {
          await member.roles.remove(muteRole.id);
        } catch (e) {
          return;
        }
      }, ms(duration));
    };

    const banUser = async (client, member) => { // eslint-disable-line no-unused-vars
      if (!member.bannable)  return;
      
      try {
        await member.ban("Banned for reaching as many warning as setted in guild settings for a user to get banned.");
      } catch (e) {
        return;
      }
    };

    const kickUser = async (client, member) => { // eslint-disable-line no-unused-vars
      if (!member.kickable)  return;
      
      try {
        await member.kick("Kicked for reaching as many warning as setted in guild settings for a user to get kicked.");
      } catch (e) {
        return;
      }
    };



    Settings.findOne({
      guildID: guild.id
    }, async (err, settings) => {
      if (err) client.logger.log(err, "error");
      Infractions.findOne({
        guildID: guild.id,
        userID: warnedMember.id
      }, async (errr, user) => {
        if (errr) client.logger.log(errr, "error");
        for (const punishment of settings.punishments) {
          if (user.infractions === punishment.nr) {
            const instr = punishment.action.split(/ +/);
            if (instr[0] === "ban") await banUser(client, warnedMember);
            if (instr[0] === "kick") await kickUser(client, warnedMember);
            if (instr[0] === "mute") await muteUser(client, warnedMember, instr[1]);

            if (instr[0] === "ban") await logHandler.sendLog(client, { channel: "NONE" }, guild.id, 1, {moderator: warnAuthor, user: warnedMember, reason: `Reached ${user.infractions} Infractions` });
            if (instr[0] === "kick") await logHandler.semdLog(client, { channel: "NONE" }, guild.id, 2, { moderator: warnAuthor, user: warnedMember, reason: `Reached ${user.infractions} Infractions` });
            if (instr[0] === "mute") await logHandler.sendLog(client, { channel: "NONE" }, guild.id, 3, { moderator: warnAuthor, user: warnedMember, reason: `Reached ${user.infractions} Infractions`, duration: instr[1] });
          }
        }
      });
    });
  }
}

module.exports = warningHandler;