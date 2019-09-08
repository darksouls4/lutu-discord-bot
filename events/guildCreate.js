const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const request = require("request");
const fs = require("fs");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
    const api = `https://lutu.gq/api/postStats.php?guild=${this.client.guilds.size}&members=${this.client.users.size}&channels=${this.client.channels.size}`;
    request(api, function (error, response, body) { // eslint-disable-line no-unused-vars
      console.log("Stats posted to API.");
    });
   
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
    
    this.client.channels.get("529750069877014548").send(joinEmbed);
    await this.client.user.setActivity(`${this.client.guilds.size} Servers | ${this.client.config.prefix}help`, { type: "WATCHING" });
    const usrs = fs.readFileSync("botbans.json", "utf8");
    if (usrs.includes(guild.owner.id)) return guild.leave();
    guild.owner.user.send("**Thanks for inviting Lutu**\n<a:aGreenTick:556121203136528388> To setup your server and for a list of all available commands visit:\nhttps://lutu.gq/commands\n\nDisclamer, by using the bot you agree and comply with Privacy Policy and Terms of Service.\nTerms of Service: https://lutu.gq/terms\nPrivacy Policy: https://lutu.gq/privacy");
  }
};