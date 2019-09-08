const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Nick extends Command {
  constructor (client) {
    super(client, {
      name: "nick",
      description: "change a user's nickname !",
      category: "Moderation",
      usage: "@user <new-nick>/reset",
      enabled: true,
      guildOnly: true,
      aliases: ["setnick"],
      permLevel: "Moderator",
      cooldown: 5,
      args: true,
      rank: "Upvoter"
    });
  }

  async run (message,args, level, reply) { // eslint-disable-line no-unused-vars
    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return message.channel.send("Please give the bot `MANAGE_NICKNAMES` permission!");
    if (!message.mentions.members.first()) return message.channel.send("Please mention a user.");
    if (message.mentions.members.first().hasPermission("ADMINISTRATOR")) return message.channel.send("This user has admin permissions.");
    const newnick = args.slice(1).join(" ");
    if (!newnick) return message.channel.send("Please provide a nickname.");
    if (newnick === "reset" ) {
      message.mentions.members.first().setNickname(message.mentions.members.first().user.username);
      message.channel.send(`Successfully reseted **${message.mentions.members.first().user.tag}**'s nickname.`);
      return;
    }
    if (newnick.length > 32) return message.channel.send("Nickname must be less than 32 characters.");
    message.mentions.members.first().setNickname(newnick);
    message.channel.send(`Successfully changed **${message.mentions.members.first().user.tag}**'s nickname to **${newnick}**.`);

  }
}

module.exports = Nick;
