const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Help extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Learn how to use Lutu's commands.",
      category: "General",
      usage: "[category/alias]",
      enabled: true,
      guildOnly: false,
      aliases: ["halp"],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
      if (!args[0]) {
        const emb = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor("#2A7AAF")
          .addField("Moderation - `" + message.guild.settings.prefix + "help moderation`", `Commands helping you moderate your server.`)
          .addField("General - `" + message.guild.settings.prefix + "help general`", `Commands any bot have.`)
          .addField("Settings - `" + message.guild.settings.prefix + "help settings`", `Commands help you set up your server. For other features [check dashboad](https://lutu.gq/).`)
          .addField("Tools - `" + message.guild.settings.prefix + "help tools`", `Usefull tools that you will most liekly use at some point.`)
          .addField("Ban List - `" + message.guild.settings.prefix + "help banlist`", `Commands regarding ban list.`)
          .addField("Tags - `" + message.guild.settings.prefix + "help tags`", `Server custom commands.\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
        reply(emb);
     } else if (args[0].toLowerCase() === "moderation") {
       var cmds = this.client.commands.filter(c => c.help.category === "Moderation" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} - \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${cmds.join("\n")}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
        reply(emb);
     } else if (args[0].toLowerCase() === "general") {
       var cmds = this.client.commands.filter(c => c.help.category === "General" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} - \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${cmds.join("\n")}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
        reply(emb);
     } else if (args[0].toLowerCase() === "settings") {
       var cmds = this.client.commands.filter(c => c.help.category === "Settings" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} - \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${cmds.join("\n")}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
        reply(emb);
     } else if (args[0].toLowerCase() === "tools") {
       var cmds = this.client.commands.filter(c => c.help.category === "Tools" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} - \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${cmds.join("\n")}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
        reply(emb);
     } else if (args[0].toLowerCase() === "banlist") {
       var cmds = this.client.commands.filter(c => c.help.category === "Ban List" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} - \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)
       
       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${cmds.join("\n")}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
        reply(emb);
     } else if (args[0].toLowerCase() === "tags") {
       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${message.guild.settings.tags.map(t => `${t.name}`).join(", ") || "Use `" + message.guild.settings.prefix +"tags add` to add custom commands."}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
       reply(emb);
     } else {
       const command = this.client.commands.get(args[0].toLowerCase());
       if (!command) return reply(`<a:aRedTick:556121032507916290> Command/Category/Alias not found.`);
       var enab = command.conf.enabled ? "Yes" : "No";
       var cperm = command.conf.permLevel;
       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("#2A7AAF")
         .setDescription(`${command.help.name.toProperCase()} - Info\n**Name**: ${command.help.name}\n**Description**: ${command.help.description}\n**Category**: ${command.help.category}\n**Usage**: \`${message.guild.settings.prefix}${command.help.name} ${command.help.usage}\`\n**Cooldown**: ${command.conf.cooldown} Seconds\n**Minimum Rank**: ${command.conf.rank}\n**Enabled**: ${enab}\n**Permission Level**: ${cperm}\n\n<:patreon:542992320656572416> Patreon: [https://patreon.com/lutubot](https://patreon.com/lutubot)\n<:discord:542687124135215115> Support Server: [https://lutu.gq/discord](https://lutu.gq/discord)\n<:bot:559437904124837889> Invite Lutu: [https://lutu.gq/invite](https://lutu.gq/invite)`);
       reply(emb);
     }

  }
}

module.exports = Help;
