const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const util = require("util"); // eslint-disable-line no-unused-vars
const exec = require("child_process").exec;

class Exec extends Command {
  constructor (client) {
    super(client, {
      name: "exec",
      description: "Executes a commands to the VPS's CLI.",
      category: "Owner",
      usage: "<code>",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "Bot Admin",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    try {
      exec(message.content.split(" ").slice(1).join(" "), function (err, stdout, stderr) { // eslint-disable-line no-unused-vars
        if (err) return reply(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`xl\n${err.toString()}\n\`\`\``);
        reply(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`${stdout}\`\`\``).catch(err => { // eslint-disable-line no-unused-vars
          reply(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`${stdout.substr(0, 1500)}\`\`\``);
        });
      });

    } catch (err) {
      reply(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`xl\n${err.toString()}\n\`\`\``);
    }
  }
}

module.exports = Exec;