const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class Selfrole extends Command {
  constructor (client) {
    super(client, {
      name: "selfroles",
      description: "Manage guild's custom roles.",
      category: "Settings",
      usage: "<list/add/remove/view>",
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
      if (args[0].toLowerCase() === "list") {
        var index = 1;
        var list = `${settings.selfroles.map(selfrole => `**${index++}** - ${selfrole.name}`).join("\n")}`;
        if (settings.selfroles.length < 1) list = "Could not find any self roles!";
        
        const embed1 = new Discord.MessageEmbed()
          .setTitle(`Self roles for ${message.guild.name}`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setDescription(` **List of self roles:**\n\n${list}`)
          .setColor("#36393e")
          .setTimestamp();
        return reply(embed1);
      } else if (args[0].toLowerCase() === "view") {
        if (!args[1]) return reply("You must specify a self role to view.");

        if (isNaN(args[1])) {
          var foundOrNot = false;

          for (const selfrole of settings.selfroles) {
            if (selfrole.name === args[1].toLowerCase()) {
              foundOrNot = true;

              const embed2 = new Discord.MessageEmbed()
                .setTitle(`Showing self role : ${selfrole.name}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .addField("selfrole Name:", `${selfrole.name}`)
                .addField("selfrole ID:", `${selfrole.ID}`)
                .setColor("#36393e")
                .setTimestamp();
              return reply(embed2);

            }
          }

          if (foundOrNot === false) return reply(`Could not find any self role named **${args[1]}**.`); 
        } else if (!isNaN(args[1])) {
          if (!settings.selfroles[args[1] - 1]) return reply(`Could not find any selfrole with position **${args[1]}**.`);

          const embed3 = new Discord.MessageEmbed()
            .setTitle(`Showing self role: ${settings.selfroles[args[1] - 1].name}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .addField("selfrole Name:", `${settings.selfroles[args[1] - 1].name}`)
            .addField("selfrole ID:", `${settings.selfroles[args[1] - 1].ID}`)
            .setColor("#36393e")
            .setTimestamp();
          return reply(embed3);
        }
      } else if (args[0].toLowerCase() === "remove") {
        if (!args[0]) return reply(`You have to specify a selfrole to remove (position of it). Type \`${settings.prefix}selfroles list\` to view the list of available selfroles and their positions for your server.`);
        if (isNaN(args[1])) return reply(`You have to specify postition of the selfrole. Type \`${settings.prefix}selfroles list\` to view the list of available selfroles and their positions for your server.`);

        var indexer = parseInt(args[1]) - 1;

        if (!settings.selfroles[indexer]) return reply(`<:greenTick:527557795990470656> selfrole with position **${args[1]}** dosen't exist. Type \`${settings.prefix}selfroles list\` to view the list of available selfroles an their positions for your server.`);
        settings.selfroles.splice(indexer, 1);

        await settings.save().catch(e => this.client.logger.log(e, "error"));

        return reply(`<:greenTick:527557795990470656> selfrole with position **${args[1]}** has been removed.`);
      } else if (args[0].toLowerCase() === "add") {
        if (!args[1]) return reply("You must specify a keyword for the selfrole.");
        const therole =  message.mentions.roles.first();
        if (!therole) return reply("You must memtion the selfrole");

        const newSelfroles = {
          "name": args[1],
          "ID": therole.id
        };

        settings.selfroles.push(newSelfroles);
        await settings.save().catch(e => this.client.logger.log(e, "error"));

        return reply(`<:greenTick:527557795990470656> Added selfrole **${args[1]}**. Type \`${settings.prefix}selfroles list\` to view the list of selfroles for your server.\nType \`${settings.prefix}${args[1]} \` to assigne the role to yourselft`);
      } else {
        return reply("Available options for this command are `list`, `view`, `add`, `remove`.");
      }
    });
  }
}

module.exports = Selfrole;
