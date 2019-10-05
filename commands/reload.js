const Command = require("../base/Command.js");

class Reload extends Command {
  constructor (client) {
    super(client, {
      name: "reload",
      description: "Reloads a command.",
      category: "Bot Admin",
      usage: "<command>",
      enabled: true,
      guildOnly: false,
      aliases: ["r"],
      permLevel: "Bot Admin",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const commands = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
    if (!commands) return reply(`The command \`${args[0]}\` does not exist, nor is an alias.`);

    let response = await this.client.unloadCommand(commands.conf.location, commands.help.name);
    if (response) return reply(`Error Unloading The Command: ${response}`);

    response = this.client.loadCommand(commands.conf.location, commands.help.name);
    if (response) return reply(`Error Loading The Command: ${response}`);

    reply(`\`${commands.help.name}\` has been reloaded.`);
  }
}

module.exports = Reload;
