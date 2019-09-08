const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Bans = require("../models/bans.js");
const databaseUrl = require("../config.js").dbUrl;
const mongoose = require("mongoose");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

class Lookup extends Command {
  constructor (client) {
    super(client, {
      name: "lookup",
      description: "Check the status of a user or yourself.",
      category: "Ban List",
      usage: "[user]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const usr = message.mentions.members.first() || message.guild.members.get(args[0]) || args[0]; // eslint-disable-line
    if (!usr) return reply("<a:aRedTick:556121032507916290> Looks like you didn't specify a valid user.");

    if (usr === args[0]) {
      try {
        await this.client.fetchUser(args[0]);
      } catch (e) {
        return reply("<a:aRedTick:556121032507916290> Looks like you didn't specify a valid user.");
      }
    }

    var user;

    if (usr === args[0]) {
      user = await  this.client.fetchUser(args[0]);
    } else {
      user = usr;
    }

    Bans.findOne({
      reportedID: user.id
    }, async (err, u) => {
      if (err) this.client.logger.log(err, "error");
      if (!user.user) user.user = user;
      let embed = new Discord.MessageEmbed() // eslint-disable-line prefer-const
        .setTitle(user.user.tag)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setThumbnail(user.user.displayAvatarURL)
        .setColor("#36393e")
        .setTimestamp();

      if (!u) {
        embed.addField("[Status]:", "<a:aGreenTick:556121203136528388> Not Banned");
      }

      if (u) {
        embed.addField("[Status]:", "<a:aRedTick:556121032507916290> Banned");
        embed.addField("[Complaint]:", `▫ CaseID: ${u.caseID}\n▫ Reason: ${u.caseReason}\n▫ Approved at: ${u.caseAcceptedAt}\n▫ Proofs: ${u.proofs.join(", ")}`);
      }

      reply(embed);
    });
  }
}

module.exports = Lookup;