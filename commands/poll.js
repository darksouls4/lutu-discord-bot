const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Poll extends Command {
  constructor (client) {
    super(client, {
      name: "poll",
      description: "announce a simple poll on a channel",
      category: "Tools",
      usage: "#channel <message>\nor echo <message>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      args: true,
      rank: "Upvoter"
    });
  }

  async run (message) { // eslint-disable-line no-unused-vars
    const messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    let channel = message.mentions.channels.first();
    if (!channel) {
      channel = message.channel;
      args = messageArray.slice(0);
    }
    const announcement = args.slice(1).join(" ");

    const msg = await channel.send(announcement);
    message.delete();
    await msg.react("✅");
    await msg.react("❌");
  }
}

module.exports = Poll;