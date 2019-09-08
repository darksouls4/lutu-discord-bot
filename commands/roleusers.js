const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Roleusers extends Command {
  constructor (client) {
    super(client, {
      name: "roleusers",
      description: "Get list of users with a role!",
      category: "Tools",
      usage: "<role-name>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: true,
      rank: "Upvoter"
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const roleName = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.find(role => role.name === roleName)) return message.channel.send(`the role **${roleName}** was not found, please check input and capitalization.`);
		
    const membersWithRole = message.guild.members.filter(member => { 
      return member.roles.find(role => role.name === roleName);
    }).map(member => {
      return member.user.tag;
    });

    const embed = new Discord.MessageEmbed({
      "title": `Users with the ${roleName} role`,
      "description": `**${membersWithRole.join("\n").substring(0, 2000)}**`,
      "color": `${message.guild.roles.find(role => role.name === roleName).color}` 
    });

    return message.channel.send({embed});
  }
}

module.exports = Roleusers;