const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Roleinfo extends Command {
  constructor (client) {
    super(client, {
      name: "roleinfo",
      description: "Get some info about a role!",
      category: "Tools",
      usage: "<role-name>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
	  rank: "Upvoter",
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    let roleName = message.content.split(" ").slice(1).join(" ");
	let thisrole =	message.guild.roles.find(role => role.name === roleName)
    if(!thisrole) return message.channel.send(`the role **${roleName}** was not found, please check input and capitalization.`)
	
	let rolename = thisrole.name
	let rolemembers = thisrole.members.size
	let rolecolor = thisrole.color
	let roleposition =  thisrole.position
	let rolemontionable = thisrole.mentionable
	let roleadmin = thisrole.permissions.has('ADMINISTRATOR')
	let rolehoist = thisrole.hoist
	let roleid = thisrole.id
	

    let roleEmbed = new Discord.MessageEmbed()
      .setTitle(`role info for ${rolename}`)
      .addField("[General]:", `▫ Name : **${rolename}** \n▫ Members with the role : ${rolemembers || "NONE"}\n▫ Role ID : ${roleid}`)
      .addField("[More]:", `▫ Role Position : ${roleposition}\n▫ Administrator Role : ${roleadmin}\n▫ Mentionable : ${rolemontionable}\n▫ Display separated : ${rolehoist}`)
      .setColor(rolecolor)
      .setTimestamp();

    return message.channel.send(roleEmbed);
  }
}

module.exports = Roleinfo;