const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Settings = require("../models/settings.js");
const Command = require("../base/Command.js");

class Setting extends Command {
  constructor (client) {
    super(client, {
      name: "settings",
      description: "View your guild's settings, like a boss!",
      category: "Settings",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const settings = await Settings.findOne({ guildID: message.guild.id });

    if (settings.maxMentions === 0) settings.maxMentions = "OFF";
    if (settings.maxLines === 0) settings.maxLines = "OFF";

    const settingEmbed = new Discord.MessageEmbed()
      .setTitle(`Settings for ${message.guild.name}`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .addField("[General]:", `▫ Prefix: \`|${settings.prefix}|\` Do not include the 2x |.\n▫ Moderation Log Channel: ${message.guild.channels.get(settings.logsChannel) || "NONE"}\n▫ Under Attack: ${settings.underAttack.toUpperCase()}`)
      .addField("[Roles]:", `▫ Moderator Role: ${message.guild.roles.get(settings.modRole) || "NONE"}\n▫ Administrator Role: ${message.guild.roles.get(settings.adminRole) || "NONE"}\n▫ Auto Join Role: ${message.guild.roles.get(settings.joinrole) || "NONE"}`)
      .addField("[Auto-Moderator]:", `▫ AntiSpam: ${settings.antiSpam.toUpperCase()}\n▫ AntiLinks: ${settings.antiLinks.toUpperCase()}\n▫ AntiInvites: ${settings.antiInvite.toUpperCase()}\n▫ AntiSwear: ${settings.antiBad.toUpperCase()}\n▫ AntiEveryone: ${settings.antiEveryone.toUpperCase()}\n▫ MaxMentions: ${settings.maxMentions}\n▫ MaxLines: ${settings.maxLines}\n▫ AntiNsfw: ${settings.nsfwDetection.toUpperCase()}`)
      .addField("[Auto-Moderator Ignored]:", `▫ Ignored Channels: ${settings.ignoredChannels.map(c=>`${message.guild.channels.get(c)}`).join(", ")}\n▫ Roles: ${settings.ignoredRoles.map(r=>`${message.guild.roles.get(r)}`).join(", ")}\n▫ Members: ${settings.ignoredUsers.map(u=>`${this.client.users.get(u)}`).join(", ")}`)
      .addField("[Checkpoint]:", `▫ Status: ${settings.checkpoint.toUpperCase()}\n▫ Mode: ${settings.checkpoint_mode.toUpperCase()}\n▫ Channel: ${message.guild.channels.get(settings.checkpoint_logChannel) || "NONE"}`)
      .addField("[Punishments]:", `${settings.punishments.map(p => `${p.nr} - ${p.action}`).join("\n") || "No Punishments Set"}`)
      .setColor("#36393e")
      .setTimestamp();
    return reply(settingEmbed);
  }
}
module.exports = Setting;
