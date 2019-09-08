const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Userinfo extends Command {
  constructor (client) {
    super(client, {
      name: "userinfo",
      description: "Get a mentioned user's or your info!",
      category: "Tools",
      usage: "@user",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false,
      rank: "Upvoter"
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    let user = message.mentions.users.first();
    if (!user) {
      //return message.reply('You must mention someone!');
      user = message.author;
    }
    const mentioneduser = user;
    const joineddiscord = (mentioneduser.createdAt.getDate() + 1) + "/" + (mentioneduser.createdAt.getMonth() + 1) + "/" + mentioneduser.createdAt.getFullYear();
    let game;
    if (!user.presence.game) {
      game = "Not currently Playing.";
    } else {
      game = user.presence.game.name;
    }
    let messag;
    if (!user.lastMessage) {
      messag = "user didn't send a message.";
    } else {
      messag = user.lastMessage;
    }
    let status;
    if (user.presence.status === "online") {
      status = ":green_heart:";
    } else if (user.presence.status === "dnd") {
      status = ":red_circle:";
    } else if (user.presence.status === "idle") {
      status = ":large_orange_diamond:";
    } else if (user.presence.status === "offline") {
      status = ":black_circle:";
    }
    let stat; // eslint-disable-line no-unused-vars
    if (user.presence.status === "offline") {
      stat = 0x000000;
    } else if (user.presence.status === "online") {
      stat = 0x00AA4C;
    } else if (user.presence.status === "dnd") {
      stat = 0x9C0000;
    } else if (user.presence.status === "idle") {
      stat = 0xF7C035;
    }

    const emb = new Discord.MessageEmbed()
      .setColor("36393e")
      .setThumbnail(user.displayAvatarURL)
      .addField("[User Info]:", `User Tag: ${user.tag}\nJoined Discord: ${joineddiscord}\nLast message: ${messag}\nPlaying: ${game}\nStatus: ${status}\nBot: ${user.bot === false ? "No" : "Yes" }`)
      .setTimestamp();
    reply(emb);   
  }
  
}

module.exports = Userinfo;