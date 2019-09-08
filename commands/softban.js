const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
// const logHandler = require("../handlers/serverLogger.js");
const Command = require("../base/Command.js");

class Softban extends Command {
  constructor (client) {
    super(client, {
      name: "softban",
      description: "softban a user from your server.",
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
    if (!user) return reply("<a:aRedTick:556121032507916290> Please specify a user to softban.");
    if (!reason) reason = "None Provided";

    if (user.id === message.author.id) return reply("<a:aRedTick:556121032507916290> I'm so sorry... I can't allow self-harm!");
    if (!user.bannable) return reply("<a:aRedTick:556121032507916290> Uh! Oh! I can't softban this user. Looks like he's more powerful than I am!");

    try {
      await user.ban(reason);
      const guildBans = await message.guild.fetchBans();
      if (guildBans.has(user.id)) {
        message.guild.members.unban(user.id);
      }

    } catch (e) {
      return message.channel.send(`<a:aRedTick:556121032507916290> Oh snap! I couldn't softban the specified user! Reason: ${e}.`);
    }

    // logHandler.sendLog(this.client, message, message.guild.id, 1, { moderator: message.author, user: user, reason: reason });
    return reply(`<a:aGreenTick:556121203136528388> Successfully softbanned **${user.user.tag}** from this server.`);
  }
}

module.exports = Softban;