const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Track extends Command {
  constructor (client) {
    super(client, {
      name: "track",
      description: "Track an invite code!",
      category: "Tools",
      usage: "<invite-code>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: true,
      rank: "Upvoter"
    });
  }

  async run (message,args, level, reply) { 

		const invitecode = args.slice(0).join(" ");
 
      const idunno = message.member.guild.fetchInvites().then(i=> { 
	  const codeexist = i.get(invitecode)
	  if(!codeexist) return message.channel.send("This invite code was not found.");
	  const inviteinviter = i.get(invitecode).inviter
	  const inviteuses = i.get(invitecode).uses
	  const invitecreated = (i.get(invitecode).createdAt.getDate() + 1) + '/' + (i.get(invitecode).createdAt.getMonth() + 1) + '/' + i.get(invitecode).createdAt.getFullYear()
	  var willexpite = 'Never'
	  if(i.get(invitecode).expiresAt){ 
	  willexpite =  (i.get(invitecode).expiresAt.getDate() + 1) + '/' + (i.get(invitecode).expiresAt.getMonth() + 1) + '/' + i.get(invitecode).expiresAt.getFullYear()
	  }
     const settingEmbed = new Discord.MessageEmbed()
      .setTitle(`Trck data for ${invitecode}`)
      .addField("[Info]:", `▫ Inviter : **${inviteinviter.tag}** .\n▫ Inviter ID : ${inviteinviter.id} .\n▫ Used : ${inviteuses} time(s)\n▫ Created at : ${invitecreated}\n▫ Expires at : ${willexpite}`)
      .setColor("#36393e")
      .setTimestamp();
     return reply(settingEmbed);
    });
  }
}

module.exports = Track;