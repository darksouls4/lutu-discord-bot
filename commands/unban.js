const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const prettyMs = require("pretty-ms");
const logHandler = require("../handlers/serverLogger.js");

class Fetch extends Command {
  constructor (client) {
    super(client, {
      name: "unban",
      description: "unban a user by the id.",
      category: "Moderation",
      usage: "<user id>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const id = args[0];
    const reason = args.splice(1).join(" ") || "Not specified.";

    try {
      await this.client.users.fetch(id);
    } catch (e) {
      return reply(`Couldn't look up in discord database for id \`${id}\` because user does not exist in discord database.`);
    }

    const user = await this.client.users.fetch(id);

	  try {
	    const guildBans = await message.guild.fetchBans();
	    if (guildBans.has(user.id)){
		    // message.guild.members.unban(user.id)
	    } else {
		    return message.channel.send(`<a:aRedTick:556121032507916290> Sorry! This user is not banned.`);
	    }

    } catch (e) {
      return message.channel.send(`<a:aRedTick:556121032507916290> Oh snap! I couldn't unban the specified user! Reason: ${e}.`);
    }
    if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
      const Logger = new logHandler({ client: this.client, case: "unban", guild: message.guild.id, member: user, moderator: message.author, reason: reason });
      Logger.send().then(t => Logger.kill());
    }
    return reply(`<a:aGreenTick:556121203136528388> Successfully unbaned **${user.tag}** from this server.`);





  }
}

module.exports = Fetch;
