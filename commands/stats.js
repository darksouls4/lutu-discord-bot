const { RichEmbed, version } = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const moment = require("moment");
const Discord = require ("discord.js");
require("moment-duration-format");

class Stats extends Command {
  constructor (client) {
    super(client, {
      name: "stats",
      description: "Get information on the bot.",
      category: "General",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: ["botinfo", "bot"],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const time = moment.duration(this.client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
    const m = await reply("<a:pending:527838556153053204> Hold on...");

    let users = 0;
    this.client.guilds.map(g => users += g.memberCount);

    const embed = new Discord.MessageEmbed()
      .setTitle("Bot's Statistics")
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setColor("#36393e")
      .setDescription(`
<:memory:542685124714561546> Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
<:uptime:542685590244687885> Uptime: ${time}
📻 Channel Count: ${this.client.channels.size.toLocaleString()}
<:discord:542687124135215115> Server Count: ${this.client.guilds.size.toLocaleString()}
👥 User Count: ${users.toLocaleString()}
<:discordjs:542691319210835969> Discord.Js Version: v${version}
<:nodejs:542992297906929675> Node.JS Version: ${process.version}
⏱ Latency: ${m.createdTimestamp - message.createdTimestamp} MS
      `)
      .setThumbnail(this.client.user.displayAvatarURL)
      .setTimestamp();
    m.edit("", embed);      
  }
}

module.exports = Stats;