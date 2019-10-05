const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Info extends Command {
  constructor (client) {
    super(client, {
      name: "info",
      description: "See informations regarding bot itself.",
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
    const infoEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTitle("Information About Lutu")
      .setDescription(`I'm lutu, one of best moderation bots out there, and the only one you need for your server, easy management tons of features and even new ones every week. I have easy to use built-in AutoMod and many more features to enhance security in your server. Now open source!

- **Get in touch**:
Mention bot or type \`${message.guild ? message.guild.settings.prefix : "?"}help\` to get a list of commands.
Type \`${message.guild ? message.guild.settings.prefix : "?"}invite\` to join support server or invite bot.

- **Features**:
• Lockdown Features
• Performant Automoderator (Anti-NSFW, Anti-Spam, etc.)
• Join Role
• Web Dashboard
• Prevent Mallicious Users
• Different Tools
• Easy To Configure

- **Technologies Used**:
[Discord.Js - Discord Client v12.0.0-master](https://discord.js.org/#/docs/main/master/general/welcome)
[MongoDB - Database (Mongoose v5.4.19)](https://mongodb.com/)
[Express - Dashboard v4.16.4](https://expressjs.com/)
[Sightengine - Image Evaluator v1.3.1](https://sightengine.com/)

- **Lutu Development Team**:
MrAugu#7917 - Developer/Founder
DataCell#4008 - Developer/Hosting Sponsor/Admin/Linguist
zaydme#0140 - Developer/Admin

Bot made by MrAugu#7917.
Source Code: https://github.com/MrAugu/lutu-discord-bot`);
    reply(infoEmbed);
  }
}

module.exports = Info;
