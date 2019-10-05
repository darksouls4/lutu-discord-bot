const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const BanList = require("../models/bans.js");
const Command = require("../base/Command.js");

class Scan extends Command {
  constructor (client) {
    super(client, {
      name: "scan",
      description: "Scans your guild for suspicious members. It can also warn you about them, or even ban them.",
      category: "Ban List",
      usage: "<warn/ban>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Administrator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const mode = args[0].toLowerCase(); // eslint-disable-line prefer-const
    if (!mode === "warn" && !mode === "ban") return reply("Mode must be either warn (sends an embed with the blacklist reason if on the ban list) or ban (bans suspicious members and sends an embed with the blacklst reason if on the ban list)");
    const mssg = await reply("Scanning all of the members . This might take a while depending on the size of your server. Estimated time: **" + (message.guild.memberCount * 70 / 1000) + "** seconds.");
    if (mode === "warn") {
      const arr = [];
      for (const member of message.guild.members) {
        await BanList.findOne({
          reportedID: member[0]
        }, async (err, u) => {
          if (err) this.client.logger.log(err, "error");
          if (!u) return;
          if (u) {
            arr.push(member[0]);
            const bwEmbed = new Discord.MessageEmbed()
              .setTitle("Malicious user detected!")
              .setColor("#36393e")
              .setDescription(`${member[1].user.tag}`)
              .addField("User ID:", `${u.reportedID}`)
              .addField("Report Complaint:", `${u.caseReason}`)
              .setThumbnail(member[1].user.displayAvatarURL())
              .setTimestamp();
            reply(bwEmbed);
          }
        });
      }
      mssg.delete();
      return reply(`Sucessfully scanned **${message.guild.memberCount}** members and **${arr.length}** members on the ban list have been detected.`);
    } else if (mode === "ban") {
      const arr = [];
      for (const member of message.guild.members) {
        await BanList.findOne({
          reportedID: member[0]
        }, async (err, u) => {
          if (err) this.client.logger.log(err, "error");
          if (!u) return;
          if (u) {
            arr.push(member[0]);
            const bwEmbed = new Discord.MessageEmbed()
              .setTitle("Malicious user detected and auto-banned!")
              .setColor("#36393e")
              .setDescription(`${member[1].user.tag}`)
              .addField("User ID:", `${u.reportedID}`)
              .addField("Report Complaint:", `${u.caseReason}`)
              .setThumbnail(member[1].user.displayAvatarURL())
              .setTimestamp();
            reply(bwEmbed);
            await member[1].ban("Global Ban List Auto-ban");
          }
        });
      }

      return reply(`Sucessfully scanned **${message.guild.memberCount}** members and **${arr.length}** members have been banned.`);
    } else {
      return reply("Mode must be either warn (sends an embed with the blacklist reason if on the ban list) or ban (bans suspicious members and sends an embed with the blacklst reason if on the ban list).");
    }
  }
}
module.exports = Scan;
