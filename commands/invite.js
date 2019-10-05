const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Invite extends Command {
  constructor (client) {
    super(client, {
      name: "invite",
      description: "Get Lutu's invitation link.",
      category: "General",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const inviteEmbed = new Discord.MessageEmbed()
      .setTitle("Invite Me!")
      .setDescription(`Lutu - All in one moderation bot.
- Lutu's Invite Link:  https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot
 This link contains Administrator permission which are neccesary for the bot to work properly. We highly disrecommend changing the permissions.

- Support Server Invite Link: https://discord.gg/?
 This link redirects you to the Lutu's Support Server where you can ask for assistance, report bugs or even give us suggestions on what we should add and/or improve.
`)
      .setColor("#36393e")
      .setTimestamp();
    message.channel.send(inviteEmbed);
  }
}

module.exports = Invite;
