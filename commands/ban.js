const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const logHandler = require("../handlers/serverLogger.js");
const Command = require("../base/Command.js");

class Ban extends Command {
  constructor (client) {
    super(client, {
      name: "ban",
      description: "Bans a user from your server.",
      category: "Moderation",
      usage: "<user> [reason]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const user = message.mentions.members.first() || message.guild.members.get(args[0]);
    let reason = args.slice(1).join(" ");
    if (!user) return reply("Please specify a user to ban.");
    if (!reason) reason = "None Provided";

    if (user.id === message.author.id) return reply("I'm so sorry... I can't allow self-harm!");
    if (!user.bannable) return reply("Uh! Oh! I can't ban this user. Looks like he's more powerful than I am!");

    try {
      user.ban(reason);
    } catch (e) {
      return message.channel.send(`Oh snap! I couldn't ban the specified user! Reason: ${e}.`);
    }

    if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
      const Logger = new logHandler({ client: this.client, case: "banAdd", guild: message.guild.id, member: user.user, moderator: message.author, reason: reason });
      Logger.send().then(t => Logger.kill());
    }

    return reply(`Successfully banned **${user.user.tag}** from this server.`);
  }
}

module.exports = Ban;
