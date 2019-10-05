const Command = require("../base/Command.js");

class Restart extends Command {
  constructor (client) {
    super(client, {
      name: "restart",
      description: "Restarts the bot.",
      category: "Bot Admin",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "Bot Admin",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.react("✅");

      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });

      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Restart;
