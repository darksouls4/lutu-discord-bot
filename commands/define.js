const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Define extends Command {
  constructor (client) {
    super(client, {
      name: "define",
      description: "Dictionary lookup!",
      category: "Tools",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false,
      rank: "Upvoter"
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars

    const apiKey = "ba63b517-9f88-4196-a502-2b4a795f7d57";
    const fetch = require("node-fetch");
    const arg = message.content.split(" ").join(" ").slice(9);
    if (!arg) {
      return reply("Please specify a word to define.");
    }
    fetch("https://www.dictionaryapi.com/api/v3/references/learners/json/" + args + "?key=" + apiKey)
      .then(res => {
        return res.json();
      }).then(json => {
        if (json[0].meta.id === undefined) {
          return reply(`Sorry, \`${args}\` was not found.\nplease check name and speeling then try again.`);
        }
        const word = json[0].meta.id;
        const type = json[0].fl;
        const def = json[0].shortdef;
        // const example = I dunno;

        const embed = new Discord.MessageEmbed()
          .setColor("36393e")
          .setTitle("Dictionary Lookup")
          .addField("[Information]:", `**Word :** ${word}\n**Type :** ${type}\n**Definition :**  ${def}`);
        reply(embed)
          .catch(console.error);
      }).catch(err => {
        if (err) {
          message.channel.send(`Sorry, \`${args}\` was not found.\nplease check name and speeling then try again.`);
        }
      });
  
  
  }
}

module.exports = Define;
