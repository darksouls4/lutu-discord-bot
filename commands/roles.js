const Command = require('../base/Command.js');

class Roles extends Command {
  constructor(client) {
    super(client, {
      name: 'roles',
      description: 'Map all the roles in the server.',
      category: 'Tools',
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false,
      rank: "Upvoter"
    });
  }

  async run(message, level) { //eslint-disable-line no-unused-vars
    const roles = message.guild.roles.map(r => `ID : ${r.id} - ${r.name}`).join('\n');
    message.channel.send(`**[List of all the roles]** :\n\`\`\`${roles}\`\`\``);
  }
}

module.exports = Roles;
