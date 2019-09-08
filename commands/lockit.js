const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const logHandler = require("../handlers/serverLogger.js");

class Lockit extends Command {
  constructor (client) {
    super(client, {
      name: "lockit",
      description: "Makes the channel read-only.",
      category: "Moderation",
      usage: "[reason]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: false,
      rank: "Upvoter"
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const role = message.guild.roles.find(r => r.id === message.guild.id);
    const reason = args.join(" ") || "Not Specified";

    if (message.channel.permissionsFor(role).has("SEND_MESSAGES")) {
      try {
        await message.channel.createOverwrite(role, {
         "SEND_MESSAGES": false
       }, "Lockit command used.");
      } catch (e) {
        return reply(`<a:aRedTick:556121032507916290> I cannot lock channel because ${e}.`);
      }
      if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
        const Logger = new logHandler({ client: this.client, case: "lockitOn", channel: message.channel, guild: message.guild.id, moderator: message.author, reason: reason });
        Logger.send().then(t => Logger.kill());
      }
      return reply("<a:aGreenTick:556121203136528388> This channel is now read-only.");

    } else if (!message.channel.permissionsFor(role).has("SEND_MESSAGES")) {
      try {
        await message.channel.createOverwrite(role, {
         "SEND_MESSAGES": null
        }, "Lockit command used.");
      } catch (e) {
        return reply(`<a:aRedTick:556121032507916290> I cannot unlock channel because ${e}.`);
      }
      if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
        const Logger = new logHandler({ client: this.client, case: "lockitOff", channel: message.channel, guild: message.guild.id, moderator: message.author, reason: reason });
        Logger.send().then(t => Logger.kill());
      }
      return reply("<a:aGreenTick:556121203136528388> This channel has been unlocked.");

    }
  }
}

module.exports = Lockit;
