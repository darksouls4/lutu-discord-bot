const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class ignoredUsers extends Command {
  constructor (client) {
    super(client, {
      name: "ignoredusers",
      description: "Add or remove users from ignore user list.",
      category: "Settings",
      usage: "<add/remove> <@user/id>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Administrator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    Settings.findOne({
      guildID: message.guild.id
    }, async (err, settings) => {
      if (err) this.client.logger.log(err);
      const option = args[0].toLowerCase();

      if (option === "add") {
        const user = message.mentions.users.first() || this.client.users.get(args[1]);
        if (!user) return reply("<a:aRedTick:556121032507916290> You must specify a user to add.");
        settings.ignoredUsers.push(user.id);
        await settings.save().catch(e => this.client.logger.log(e, "error"));
        return reply(`<a:aGreenTick:556121203136528388> Added ${user} to automod ignored users.`);
      } else if (option === "remove") {
        const user = message.mentions.users.first() || this.client.users.get(args[1]) || args[1];
        if (!user) return reply("<a:aRedTick:556121032507916290> You must specify a user to remove.");

        const index = settings.ignoredUsers.findIndex(i => i === user.id);
        if (index < 0) return reply("<a:aRedTick:556121032507916290> User not found on ignored user list.");
        
        settings.ignoredUsers.splice(index, 1);
        await settings.save().catch(e => this.client.logger.log(e, "error"));
        return reply("<a:aGreenTick:556121203136528388> User has been removed from the ignored list.");
      } else {
        return reply("<a:aRedTick:556121032507916290> Valid options are `add` or `remove`.");
      }
    });
  }
}

module.exports = ignoredUsers;
