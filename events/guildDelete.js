const Discord = require("discord.js"); // eslint-disable-line no-unused-vars

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
    const leaveEmbed = new Discord.MessageEmbed()
      .setTitle("Left a Server!")
      .setThumbnail(guild.iconURL)
      .setDescription(`
- Name: ${guild.name}
- Owner: ${guild.owner.user.tag} (ID:${guild.owner.id})
- Member Count: ${guild.memberCount}
- ID: ${guild.id}
- Created On: ${guild.createdAt}

- Current Server Count: ${this.client.guilds.size}
      `)
      .setColor("RED")
      .setTimestamp();

    this.client.channels.get(this.client.config.guildLogChannel).send(leaveEmbed);
    await this.client.user.setActivity(`${this.client.guilds.size} Servers | ${this.client.config.prefix}help`, { type: "WATCHING" });
  }
};
