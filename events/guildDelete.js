const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const request = require("request");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
    const api = `https://lutu.gq/api/postStats.php?guild=${this.client.guilds.size}&members=${this.client.users.size}&channels=${this.client.channels.size}`;
    request(api, function (error, response, body) { // eslint-disable-line no-unused-vars
      console.log("Stats posted to API.");
    });

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
    
    this.client.channels.get("529750069877014548").send(leaveEmbed);
    await this.client.user.setActivity(`${this.client.guilds.size} Servers | ${this.client.config.prefix}help`, { type: "WATCHING" });
  }
};