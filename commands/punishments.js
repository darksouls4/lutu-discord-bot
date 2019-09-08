const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Settings = require("../models/settings.js");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

class Punishment extends Command {
  constructor (client) {
    super(client, {
      name: "punishments",
      description: "Set the server list of punishments according to the warns count a user receives.",
      category: "Settings",
      usage: "<add/remove> <punishment(number)> <action ban/kick/mute/reset> [duration]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Administartor",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const option = args[0].toLowerCase();

    Settings.findOne({
      guildID: message.guild.id
    }, async (err, settings) => {
      if (err) this.client.logger.log(err, "error");
      if (option === "add") {
        let nr = parseInt(args[1]);
        if (!nr) return reply("<a:aRedTick:556121032507916290> You must specify a punishment to add. A user upon reaching this amount of infractions will be punished acordingly.");
        nr = parseInt(nr);

        const ind = settings.punishments.findIndex(i => i.nr === nr);
        if (ind > 0) return reply("<a:aRedTick:556121032507916290> Seems like this punishment already exist. Remove this and re add it if you want to edit it.");
        const action = args.slice(2).join(" ");
        if (action !== "ban" && action !== "kick" && !action.startsWith("mute")) return reply("<a:aRedTick:556121032507916290> Punishment must be either mute, ban or kick.");
        if (action.startsWith("mute") && !args[2]) return reply("<a:aRedTick:556121032507916290> You must specify a duration for mute.");

        const punishment = {
          nr: nr,
          action: action
        };

        settings.punishments.push(punishment);
        await settings.save().catch(e => this.client.logger.log(e, "error"));
        return reply(`<a:aGreenTick:556121203136528388> Succesfully added punishment **${nr}** to database. A user upon reaching **${nr}** infractions in this server will be punished accordingly.`);
      } else if (option === "remove") {
        const nr = parseInt(args[1]);
        const index = settings.punishments.findIndex(i => i.nr === nr);
        if (index < 0) return reply("<a:aRedTick:556121032507916290> Punishment not found.");

        const o = settings.punishments.splice(index, 1);
        await settings.save().catch(e => this.client.logger.log(e, "error"));
        return reply(`<a:aGreenTick:556121203136528388> Successfully removed punishment **${o[0].nr}**, a user upon reaching **${o[0].nr}** will no longer be punished useless you add it back.`);
      }
    });
  }
}

module.exports = Punishment;