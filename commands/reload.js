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
    if (!commands) return reply(`<a:aRedTick:556121032507916290> The command \`${args[0]}\` does not exist, nor is an alias.`);

    let response = await this.client.unloadCommand(commands.conf.location, commands.help.name);
    if (response) return reply(`<a:aRedTick:556121032507916290> Error Unloading The Command: ${response}`);

    response = this.client.loadCommand(commands.conf.location, commands.help.name);
    if (response) return reply(`<a:aRedTick:556121032507916290> Error Loading The Command: ${response}`);

    reply(`<a:aGreenTick:556121203136528388> \`${commands.help.name}\` has been reloaded.`);
  }
}

module.exports = Reload;