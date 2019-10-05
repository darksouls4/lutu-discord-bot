const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const request = require("request");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    await this.client.user.setStatus("online");

    const statusArray = [
      (client) => client.user.setActivity("Lutu.gq | ?help", { type: "WATCHING" }),
      (client) => client.user.setActivity(`${this.client.guilds.size} servers | ?help`, { type: "WATCHING" }),
      (client) => client.user.setActivity(`${this.client.channels.size} channels | ?help`, { type: "WATCHING" }),
      (client) => client.user.setActivity(`${this.client.users.size} users | ?help`, { type: "WATCHING" })
    ];

    var pick = 0;
    setInterval(() => {
      statusArray[pick](this.client);
      pick += 1;
      if (pick === 3) pick = 0;
    }, 20000);

    let users = 0;
    this.client.guilds.map(g => users += g.memberCount);

    this.client.dashboard = require("../modules/dashboard.js")(this.client);
    this.client.logger.log(`Logged in as ${this.client.user.tag}! Serving ${this.client.guilds.size} Servers and ${users} Users.`, "ready");
    this.client.readyState = true;
  }
};
