const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evaluates a JavaScript code.",
      category: "Owner",
      usage: "<amount> [user]",
      enabled: true,
      guildOnly: false,
      aliases: ["ev"],
      permLevel: "Bot Admin",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const code = args.join(" ");
    try {
      const evaluat = async (c) => eval(c);
      const evaled = await evaluat(code);
      const clean = await this.client.clean(this.client, evaled);

      const MAX_CHARS = 3 + 2 + clean.length + 3;
      if (MAX_CHARS > 1500) {
        return message.channel.send("Snap, the output has exceeded 1500 charachters in length. Sending it as file...", { files: [{ attachment: Buffer.from(clean), name: "eval.txt" }] });
      }

      reply(`📥 Input:\`\`\`js\n${code}\n\`\`\`\n📤 Output:\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      reply(`📥 Input:\`\`\`js\n${code}\n\`\`\`\n📤 Output:\`\`\`xl\n${err}\n\`\`\``);
    }
  }
}

module.exports = Eval;