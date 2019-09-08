const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const logHandler = require("../handlers/serverLogger.js");
const Infractions = require("../models/infractions.js");

class Forget extends Command {
  constructor (client) {
    super(client, {
      name: "forget",
      description: "Deletes infractions from a user's audit.",
      category: "Moderation",
      usage: "[amount] <user> [reason]",
      enabled: true,
      guildOnly: true,
      aliases: ["pardon"],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const user = message.mentions.members.first() || message.guild.members.get(args[1]);
    if (!user) return reply("<a:aRedTick:556121032507916290> You haven't specified a valid user.");

    let warnsToR = parseInt(args[0]);
    let reason = args.slice(2).join(" ");
    if (isNaN(warnsToR)) reason = args.slice(1).join(" ");
    if (isNaN(warnsToR)) warnsToR = 1;
    if (!reason) reason = "None Provided";

    Infractions.findOne({
      guildID: message.guild.id,
      userID: user.id
    }, async (err, u) => {
      if (err) this.client.logger.log(err, "error");
      if (!u) {
        const newUser = new Infractions({
          guildID: message.guild.id,
          userID: user.id,
          infractions: 0
        });
        await newUser.save().catch(e => this.client.logger.log(e, "error"));
        return undefined;
      }
      u.infractions = u.infractions - warnsToR;
      if (u.infractions < 0) u.infractions = 0;
      await u.save().catch(e => this.client.logger.log(e, "error"));
      if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
        const Logger = new logHandler({ client: this.client, case: "pardon", guild: message.guild.id, member: user.user, reason: reason, moderator: message.author, amount: warnsToR });
        Logger.send().then(t => Logger.kill());
      }
      
      reply(`<a:aGreenTick:556121203136528388> Successfully forgot \`${warnsToR}\` infraction(s) from **${user.user.tag}**'s audit.`);
    });
  }
}

module.exports = Forget;
