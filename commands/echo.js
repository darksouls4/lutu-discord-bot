const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
class Echo extends Command {
  constructor (client) {
    super(client, {
      name: "echo",
      description: "announce a message on a channel",
      category: "Tools",
      usage: "#channel <message>\nor echo <message>",
      enabled: true,
      guildOnly: true,
      aliases: ["talk","say","announce"],
      permLevel: "Moderator",
      args: true,
      rank: "Upvoter"
    });
  }

  async run (message) { // eslint-disable-line no-unused-vars
    message.channel.send("Disclamer, by using the bot you agree and comply with Privacy Policy and Terms of Service.\nTerms of Service: https://lutu.gq/terms\nPrivacy Policy: https://lutu.gq/privacy");

    const messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    let channel = message.mentions.channels.first();
    if (!channel) {
      channel = message.channel;
      args = messageArray.slice(0);
    }
    const announcement = args.slice(1).join(" ");

    channel.send(announcement);
    message.delete();
  }
}

module.exports = Echo;