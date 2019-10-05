const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const config = require("../config.js");
const pref = config.prefix;
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Settings = require("../models/settings.js");
const Error = require("../models/error.js");
const automod = require("../handlers/automod.js");
const lockdown = require("../handlers/lockdown.js");
const fs = require("fs");
const moment = require("moment");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    function getDmLvl (message, client) { if (message.author.id === client.appInfo.owner.id) { return 10; } else if (client.config.admins.includes(message.author.id)) { return 9; } else { return 0; } }
    const reply = (c) => message.channel.send(c);
    const guildSettings = message.channel.type === "text" ? await Settings.findOne({ guildID: message.guild.id }) : { prefix: "?" };
    if (message.guild) message.guild.settings = guildSettings;
    if (!guildSettings && message.guild) {
      const newSettings = new Settings({
        guildID: message.guild.id,
        prefix: pref,
        logsChannel: "none",
        modRole: "none",
        adminRole: "none",
        joinrole: "none",
        antiSpam: "off",
        antiLinks: "off",
        antiInvite: "off",
        antiBad: "off",
        antiEveryone: "off",
        maxMentions: 0,
        maxLines: 0,
        ignoredRoles: [],
        ignoredUsers: [],
        ignoredChannels: [],
        checkpoint: "off",
        checkpoint_logChannel: "none",
        checkpoint_mode: "N/A",
        underAttack: "off",
        nsfwDetection: "off",
        tags: [],
        selfroles: [],
        punishments: [],
        chatLogs: "off",
        moderationLogs: "off",
        serverLogs: "off"
      });

      await newSettings.save().catch(e => this.client.logger.log(e, "error"));
      return undefined;
    }

    if (message.guild && !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

    const mentionHelp = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(mentionHelp)) {
      const helpEmbed = new Discord.MessageEmbed()
        .setTitle("Lutu - One of Best Moderation Bots")
        .setDescription(`
        Looking for some peace? Can't find trustworthy moderators? Need round-the-clock moderation for your server?
Lutu. Introducing the new, easy to configure smart moderation bot...
Lutu is a moderation bot with a wide range of commands and features that will not only let you have peace of mind, but will let your users feel safer, thanks to Lutu's Auto-moderation features, and its proprietary Banlist.
First, Auto-moderator can achieve what normal, human moderators would do. From preventing spam, to deleting NSFW (Not Safe For Work) content, Lutu has an increasing amount of Auto-moderator features that will not only protect your server, but minimize the time wasted on moderating, and maximizing the happy time spent on chatting with others! At the time of writing, Lutu's available Auto-moderator options are: Anti Bad Words, Anti @Everyone, Anti Discord Invites, Anti Links, Anti NSFW, Anti Spam, Max Message Lines, Max Message Mentions.
Second, thanks to its proprietary Banlist, Lutu can prevent known abusers from joining your server, or just warn you if they do. You can even scan your server for them using the "scan" command. Lastly, you can report abusive users yourself by using the "report" command.
Third, Lutu can achieve the basic moderation commands like nicking, clearing messages, punishing, muting, kicking, soft banning and banning. But that's not all what's in there! Lutu has two unique commands specially desgined to prevent all users (exluding Moderators and Administrators) from sending messages in a specific channel ("lockit" command), or in the whole server ("lockdown" command).

Dashboard: [https://lutu.gq/](https://lutu.gq/)
Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)
Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)

Basic Commands:
\`${guildSettings.prefix}help\` - Get a list of commands.
\`${guildSettings.prefix}info\` - Basic information about Lutu.

Created by MrAugu#7917.
Source Code: https://github.com/MrAugu/lutu-discord-bot/
        `)
        .setColor("BLUE")
        .setTimestamp();
      return message.channel.send(`Hey there, my prefix is \`${guildSettings.prefix}\`.`, helpEmbed);
    }

    const level = message.channel.type === "text" ? await this.client.permlevel(message) : getDmLvl(message, this.client);
    if (message.guild && level < 4 || level == 0) {
      if (!message.member) return;
      const lk = await lockdown.handle(this.client, message);
      if (lk === true) return;
    }

    if (message.guild && level < 2) {
      if (message.member && !guildSettings.ignoredUsers.includes(message.author.id)) {
        if (!guildSettings.ignoredChannels.includes(message.channel.id)) {
          if (!message.member.roles.some(r=>guildSettings.ignoredRoles.includes(r.id))) {
            automod.run(this.client, message, message.guild.settings);
          }
        }
      }
    }

    if (message.content.indexOf(guildSettings.prefix) !== 0) return;

    const args = message.content.slice(guildSettings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    const usrs = fs.readFileSync("botbans.json", "utf8");
    if (cmd && usrs.includes(message.author.id)) return reply("Seems like you can't acces this. You've been banned by one of bot admins for more details regarding your case and appeal info, join our support server https://lutu.gq/discord.");
    if (!cmd && this.client.cmdMaintenance === true) return;
    if (!cmd && message.guild) {
      for (const tag of guildSettings.tags) {
        if (command === tag.name) return reply(tag.content);
      }
      for (const selfrole of guildSettings.selfroles) {
        if (command === selfrole.name) {
          if (message.member.roles.find(role => role.id === selfrole.ID)) {
            message.member.roles.remove(message.guild.roles.find(role => role.id === selfrole.ID));
            return reply(`Removed your **${selfrole.name}** role.`);
          }
          message.member.roles.add(message.guild.roles.find(role => role.id === selfrole.ID));
          return reply(`You got the **${selfrole.name}** role.`);
        }
      }
    }

    if (!cmd) return;
    if (level < 9 && this.client.cmdMaintenance === true) return reply("We are currently undergoing a maintenance we'll be back soon.");
    if (cmd.conf.enabled === false) return reply("This command is currently globally disabled. Visit our dashboard at https://lutu.gq/.");
    if (cmd && !message.guild && cmd.conf.guildOnly) return message.channel.send("This command is unavailable via private message. Please run this command in a server.");

    if (cmd.conf.args === true && !args.length) {
      return reply(`You haven't provided any argument.\nCorrect Usage: \`${guildSettings.prefix}${cmd.help.name} ${cmd.help.usage}\`\nCheck out the surce code at: https://github.com/MrAugu/lutu-discord-bot/`);
    }

    if (!cooldowns.has(cmd.help.name)) {
      cooldowns.set(cmd.help.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.help.name);
    const cooldownAmount = cmd.conf.cooldown * 1000;

    if (message.author.id !== "414764511489294347" && message.author.id !== "") {
      if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return reply(`Slow it down dude. You have to wait ${timeLeft.toFixed(1)} seconds before using \`${cmd.help.name}\` again.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    }

    const noPermEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle("FORBIDDEN!")
      .setColor("#36393e")
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription(`
Forbidden! You do not have the required permissions to use \`${cmd.help.name}\`.

▫ Required Permission Level: ${this.client.levelCache[cmd.conf.permLevel]} - ${cmd.conf.permLevel}
▫ Your Permission Level: ${level} - ${this.client.config.permLevels.find(l => l.level === level).name}

Source Code: https://github.com/MrAugu/lutu-discord-bot
          `)
      .setTimestamp();

    if (level < this.client.levelCache[cmd.conf.permLevel]) return reply(noPermEmbed);

    message.author.permLevel = level;

    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    const content = `${timestamp} ${message.author.tag} (ID:${message.author.id}) ran ${cmd.help.name} in ${message.guild ? message.guild.name : "DMs"} (ID: ${message.guild ? message.guild.id : "0"})
Raw Input |${message.content}|
`;

    fs.appendFileSync("command_logs.txt", content, "utf8");

    this.client.channels.get(this.client.config.commandLogChannel).send(`**${cmd.help.name}** was used by \`${message.author.tag}\` (ID: ${message.author.id}) in guild \`${message.guild ? message.guild.name : "Direct Message"}\` (ID: ${message.guild ? message.guild.id : "000000000000000000"}), channel \`${message.channel.name}\` (ID: ${message.channel.id}).\nMessage content: \n\`\`\`${message.content}\`\`\``);
    try {
      await cmd.run(message, args, level, reply);
    } catch (e) {
      const errorCode = Date.now().toString(36);
      const newErr = new Error({
        errCode: errorCode,
        err: e,
        errTimestamp: message.createdAtTimestamp,
        errPath: `/home/mraugu/ftp/public_html/Lutu/commands/${cmd.help.name}.js`
      });
      await newErr.save().catch(e => console.log(e));
      this.client.logger.error(e);
      reply(`Internal error occured!\nError Code: \`${errorCode}\`\nPlease report this error to the developers. Type \`${guildSettings.prefix}invite\` to get a link to the support server.`);
      this.client.channels.get(this.client.config.errorChannel).send(`An internal error occured while running \`${cmd.help.name}.js\`.\n\`\`\`xl\n${e}\`\`\``);
    }
  }
};
