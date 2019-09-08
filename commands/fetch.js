const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const prettyMs = require("pretty-ms");

class Fetch extends Command {
  constructor (client) {
    super(client, {
      name: "fetch",
      description: "Track a user by theyr id.",
      category: "Tools",
      usage: "<user id>",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const id = args[0];

    try {
      await this.client.users.fetch(id);
    } catch (e) {
      return reply(`Couldn't look up in discord database for id \`${id}\` because user does not exist in discord database.`);
    }

    const statuses = {
      "online": "Online (User is online)",
      "dnd": "Do Not Disturb (User is in Do not Disturb)",
      "idle": "Idle (User is AFK)",
      "offline": "Offline/Invisible (User is Offline or Invisible)"
    };

    const bot = {
      true: "Yes",
      false: "No"
    };

    const user = await this.client.users.fetch(id);

    if (user.presence.game === null) user.presence.game = "Not Playing Anything";
    
    const uEmbed = new Discord.MessageEmbed()
      .setTitle(`${user.tag}`)
      .addField("[User]:", `▫ Username: ${user.username}\n▫ Tag: ${user.tag}\n▫ ID: ${id}\n▫ Bot: ${bot[user.bot]}`)
      .addField("[Presence]:", `▫ Game: ${user.presence.game || "Not Playing Anything"}\n▫ Status: ${statuses[user.presence.status]}`)
      .addField("[Joined Discord:]", `${prettyMs(message.createdTimestamp - user.createdTimestamp)} ago`)
      .setThumbnail(user.displayAvatarURL)
      .setColor("#36393e")
      .setTimestamp();

    reply(uEmbed);
  }
}

module.exports = Fetch;