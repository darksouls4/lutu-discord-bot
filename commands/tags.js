const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class Tags extends Command {
  constructor (client) {
    super(client, {
      name: "tags",
      description: "Manage guild's custom commands.",
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
        var list = `${settings.tags.map(tag => `**${index++}** - ${tag.name}`).join("\n")}`;
        if (settings.tags.length < 1) list = "Could not find any tags!";

        const embed1 = new Discord.MessageEmbed()
          .setTitle(`Tags for ${message.guild.name}`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(` **List of tags:**\n\n${list}`)
          .setColor("#36393e")
          .setTimestamp();
        return reply(embed1);
      } else if (args[0].toLowerCase() === "view") {
        if (!args[1]) return reply("You must specify a tag to view.");

        if (isNaN(args[1])) {
          var foundOrNot = false;

          for (const tag of settings.tags) {
            if (tag.name === args[1].toLowerCase()) {
              foundOrNot = true;

              const embed2 = new Discord.MessageEmbed()
                .setTitle(`Showing Tag: ${tag.name}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .addField("Tag Name:", `${tag.name}`)
                .addField("Tag Content:", `${tag.content}`)
                .setColor("#36393e")
                .setTimestamp();
              return reply(embed2);

            }
          }

          if (foundOrNot === false) return reply(`Could not find any tag named **${args[1]}**.`);
        } else if (!isNaN(args[1])) {
          if (!settings.tags[args[1] - 1]) return reply(`Could not find any tag with position **${args[1]}**.`);

          const embed3 = new Discord.MessageEmbed()
            .setTitle(`Showing Tag: ${settings.tags[args[1] - 1].name}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField("Tag Name:", `${settings.tags[args[1] - 1].name}`)
            .addField("Tag Content:", `${settings.tags[args[1] - 1].content}`)
            .setColor("#36393e")
            .setTimestamp();
          return reply(embed3);
        }
      } else if (args[0].toLowerCase() === "remove") {
        if (!args[0]) return reply(`You have to specify a tag to remove (position of it). Type \`${settings.prefix}tags list\` to view the list of available tags and theyr positions for your server.`);
        if (isNaN(args[1])) return reply(`You have to specify postition of the tag. Type \`${settings.prefix}tags list\` to view the list of available tags and theyr positions for your server.`);

        var indexer = parseInt(args[1]) - 1;

        if (!settings.tags[indexer]) return reply(`Tag with position **${args[1]}** dosen't exist. Type \`${settings.prefix}tags list\` to view the list of available tags an theyr positions for your server.`);
        settings.tags.splice(indexer, 1);

        await settings.save().catch(e => this.client.logger.log(e, "error"));

        return reply(`Tag with position **${args[1]}** has been removed.`);
      } else if (args[0].toLowerCase() === "add") {
        if (!args[1]) return reply("You must specify a keyword for the tag.");
        const ctx = args.slice(2).join(" ");
        if (!ctx) return reply("You must specify the tag's content");

        const newTag = {
          "name": args[1],
          "content": ctx
        };

        settings.tags.push(newTag);
        await settings.save().catch(e => this.client.logger.log(e, "error"));

        return reply(`Added tag **${args[1]}**. Type \`${settings.prefix}tags list\` to view the list of tags for your server.`);
      } else {
        return reply("Available options for this command are `list`, `view`, `add`, `remove`.");
      }
    });
  }
}

module.exports = Tags;
