const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const moment  = require("moment");

class Serverinfo extends Command {
  constructor (client) {
    super(client, {
      name: "serverinfo",
      description: "gets the current server info!",
      category: "Tools",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false,
      rank: "Upvoter"
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
  
    const guildmessageServerInfo = message.guild;
    const createdAtServerInfo = moment(message.guild.createdAt).format("MMMM Do YYYY, h:mm:ss a");
    const channelsServerInfo = message.guild.channels.size;
    const ownerServerInfo = message.guild.owner.user.tag;
    const memberCountServerInfo = message.guild.memberCount;
    const BotCountServerInfo = message.guild.members.filter(member => member.user.bot).size;
    const largeServerInfo = message.guild.large;
    const regionServerInfo = message.guild.region;
    const rolesinfo =  message.guild.roles.size;
    const VerificationLevelInfo = message.guild.verificationLevel;
    const VerifiedInfo = message.guild.verified;
    const AdminsInfo = message.guild.members.filter(member => member.hasPermission("ADMINISTRATOR")).size;
    const EmojisInfo = message.guild.emojis.size;
    const afkServerInfo = message.guild.channels.get(message.guild.afkChannelID) === undefined ? "None" : message.guild.channels.get(guildmessageServerInfo.afkChannelID).name;

    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: message.guild.name,
        icon_url: message.guild.iconURL
      },
      title: "Server Information",
      fields: [{
        name: "info",
        value: `**Channels Count :** ${channelsServerInfo}\n**AFK Channels :** ${afkServerInfo}\n**Emojis count :** ${EmojisInfo}\n**Roles count :** ${rolesinfo}`
      },
      {
        name: "Members", //idk how to separate bots from humans LOL
        value: `**Members Count :** ${memberCountServerInfo}\n**Bots Count :** ${BotCountServerInfo}\n**Admins Count :** ${AdminsInfo}\n**Owner :** ${ownerServerInfo}\n**Owner ID :** ${message.guild.owner.id}`
      },
      {
        name: "More",
        value: `**Created at :** ${createdAtServerInfo}\n**Verification Level :** ${VerificationLevelInfo}\n**Large Guild :** ${largeServerInfo ? "Yes" : "No"}\n**Verified Guild :** ${VerifiedInfo  ? "Yes" : "No"}\n**Region :** ${regionServerInfo}`
      }
      ],
      timestamp: new Date()
    }
    });
			
			
  }
}

module.exports = Serverinfo;