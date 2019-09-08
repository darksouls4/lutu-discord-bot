const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const request = require("request");
const first = require("../handlers/init.js");
// const config = require("../config.js");
// const mongoose = require("mongoose");
// const databaseUrl = config.dbUrl;
// const Settings = require("../models/settings.js");

// mongoose.connect(databaseUrl, {
//   useNewUrlParser: true
// });

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    const DBL = require("dblapi.js");
    const dbl = new DBL("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyMzU1Mjk3OTY2NDYzMzg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTUxMjgyNDQxfQ.KfCCASA1ZJ5WZmW9eKW9grdn89dJOduRIqSsH0Ha1WA", this.client);

    if (process.env.PRODUCTION === "true") {
      first.init(this.client);
      await dbl.postStats(this.client.guilds.size);
      setInterval( async () => {
        const api = `https://lutu.gq/api/postStats.php?guild=${this.client.guilds.size}&members=${this.client.users.size}&channels=${this.client.channels.size}`;
        request(api, function (error, response, body) {}); // eslint-disable-line no-unused-vars
      }, 30000);

      setInterval(() => {
        dbl.postStats(this.client.guilds.size);
      }, 1800000);
    }

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

    // const sets = await Settings.find();
    // for (const set of sets) {
    //   if (set.infractions === 0) {
    //     await Infractions.findOneAndDelete({ guildID: set.guildID, userID: set.userID });
    //     console.log(set.guildID, set.userID);
    //   }
    // }
    // for (const set of sets) {
    //   if (!this.client.guilds.get(set.guildID)) {
    //     console.log(set.guildID);
    //     await Settings.findOneAndDelete({ guildID: set.guildID });
    //   }
    // }

    // var index = 0;
    //
    // for (const set of sets) {
    //   console.log(set.guildID);
    //   await Settings.findOneAndDelete({ guildID: set.guildID });
    //
    //   const newSettings = new Settings({
    //     guildID: set.guildID,
    //     prefix: set.prefix,
    //     logsChannel: set.logsChannel,
    //     modRole: set.modRole,
    //     adminRole: set.adminRole,
    //     joinrole: set.joinrole,
    //     antiSpam: set.antiSpam,
    //     antiLinks: set.antiLinks,
    //     antiInvite: set.antiInvite,
    //     antiBad: set.antiBad,
    //     antiEveryone: set.antiEveryone,
    //     maxMentions: set.maxMentions,
    //     maxLines: set.maxLines,
    //     ignoredRoles: set.ignoredRoles,
    //     ignoredUsers: set.ignoredUsers,
    //     ignoredChannels: set.ignoredChannels,
    //     checkpoint: set.checkpoint,
    //     checkpoint_logChannel: set.checkpoint_logChannel,
    //     checkpoint_mode: set.checkpoint_mode,
    //     underAttack: set.underAttack,
    //     nsfwDetection: set.nsfwDetection,
    //     tags: set.tags,
    //     selfroles: set.selfroles,
    //     punishments: set.punishments,
    //     chatLogs: "off",
    //     moderationLogs: "off",
    //     serverLogs: "off"
    //   });
    //
    //   await newSettings.save().catch(e => this.client.logger.log(e, "error"));
    //   console.log(`${index++}: ${set.guildID}`);
    // }
  }
};
