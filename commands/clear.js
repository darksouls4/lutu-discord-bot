const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const logHandler = require("../handlers/serverLogger.js");
const request = require("request");

class Clear extends Command {
  constructor (client) {
    super(client, {
      name: "clear",
      description: "Deletes a specified amount of messages.",
      category: "Moderation",
      usage: "<amount> [user]",
      enabled: true,
      guildOnly: true,
      aliases: ["purge"],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const user = message.mentions.members.first() || message.guild.members.get(args[1]);
    var amount = parseInt(message.content.split(" ")[0]) ? parseInt(message.content.split(" ")[0]) : parseInt(message.content.split(" ")[1]);
    if (user) {
      var reason = args.slice(2).join(" ") || "Not specified.";
    } else {
      var reason = args.slice(1).join(" ") || "Not specified.";
    }
    if (!amount) return reply("Please specify an amount of messages to delete.");
    if (amount > 99) return reply("The number must be smaller than 100.");
    if (amount < 2) return reply("The number must be bigger than 1.");
    if (!amount && !user) return reply("Please mention a user or specify an amount of messages to delete!");
    amount = amount + 1;
    message.channel.messages.fetch({ limit: amount }).then(async (messages) => {
      if (user) {
        const filterBy = user ? user.id : this.client.user.id;
        messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
        try {
          await message.channel.bulkDelete(messages);
        } catch (e) {
          return reply(`Couldn't delete messages because ${e}.`);
        }
        if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
          const Logger = new logHandler({ client: this.client, case: "clearMessages", guild: message.guild.id, moderator: message.author, reason: reason, channel: message.channel, amount: amount, member: user  });
          Logger.send().then(t => Logger.kill());
        }
        return reply(`Successfully deleted **${messages.length}** of **${user.user.tag}**'s messages!`);
      }

      try {
        await message.channel.bulkDelete(amount);
      } catch (e) {
        return reply(`Couldn't delete messages because ${e}.`);
      }
      if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
        const Logger = new logHandler({ client: this.client, case: "clearMessages", guild: message.guild.id, moderator: message.author, reason: reason, channel: message.channel, amount: amount  });
        Logger.send().then(t => Logger.kill());
      }
      reply(`Successfully deleted **${amount}** messsages!`);
    });
  }
}

module.exports = Clear;
