const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const fs = require("fs");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
    const joinEmbed = new Discord.MessageEmbed()
      .setTitle("Joined a Server!")
      .setThumbnail(guild.iconURL)
      .setDescription(`
- Name: ${guild.name}
- Owner: ${guild.owner.user.tag} (ID:${guild.owner.id})
- Member Count: ${guild.memberCount}
- ID: ${guild.id}
- Created On: ${guild.createdAt}

- Current Server Count: ${this.client.guilds.size}
      `)
      .setColor("GREEN")
      .setTimestamp();

    this.client.channels.get(this.client.config.guildLogChannel).send(joinEmbed);
    await this.client.user.setActivity(`${this.client.guilds.size} Servers | ${this.client.config.prefix}help`, { type: "WATCHING" });
    const usrs = fs.readFileSync("botbans.json", "utf8");
    if (usrs.includes(guild.owner.id)) return guild.leave();
  }
};
