const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const mongoose = require("mongoose");
const Infractions = require("../models/infractions.js");
const config = require("../config.js");
const databaseUrl = config.dbUrl;
const Command = require("../base/Command.js");

class Check extends Command {
  constructor (client) {
    super(client, {
      name: "check",
      description: "Checks a user's audit.",
      category: "Moderation",
      usage: "<user>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (!user) return reply("You haven't specified any user.");

    Infractions.findOne({
      guildID: message.guild.id,
      userID: user.id
    }, async (err, u) => {
      if (err) this.client.logger.log(err, "error");
      if (!u) u = "ProperyNone";
      reply(`🚩 **${user.user.tag}**'s audit contains \`${u.infractions || 0}\` infractions in this server.`);
    });
  }
}

module.exports = Check;
