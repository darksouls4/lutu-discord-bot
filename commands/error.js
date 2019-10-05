const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Errors = require("../models/error.js");

class Error extends Command {
  constructor (client) {
    super(client, {
      name: "error",
      description: "Checks what an error means.",
      category: "Bot Admin",
      usage: "<error code>",
      enabled: true,
      guildOnly: false,
      aliases: ["err"],
      permLevel: "Bot Admin",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const code = args[0];


    Errors.findOne({
      errCode: code
    }, async (e, r) => {
      if (e) this.client.logger.log(e, "error");

      if (!r) return reply("Couldn't find any error matching this code!");

      reply(`\`\`\`${r.err}\`\`\`\n\`\`\`${r.errPath}\`\`\``);
    });
  }
}

module.exports = Error;
