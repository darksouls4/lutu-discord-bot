const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Myperms extends Command {
  constructor (client) {
    super(client, {
      name: "myperms",
      description: "Checks your permission for the current guild.",
      category: "General",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const m = await reply("Checking your permissions...");

    const lvl = await this.client.permlevel(message);

    let admin;
    let mod;
    let sown;

    if (lvl > 3 || lvl === 3) {
      admin = "Yes";
    } else {
      admin = "No";
    }

    if (lvl > 2 || lvl === 2) {
      mod = "Yes";
    } else {
      mod = "No";
    }

    if (lvl > 4 || lvl === 4) {
      sown = "Yes";
    } else {
      sown = "No";
    }


    const pEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription(`
Your Permissions for this server:

• Server Owner - ${sown}
• Server Administrator: ${admin}
• Server Moderator - ${mod}
      `)
      .setColor("#36393e")
      .setTimestamp();

    m.edit(pEmbed);
  }
}

module.exports = Myperms;
