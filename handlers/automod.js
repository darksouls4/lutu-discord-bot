const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Infractions = require("../models/infractions.js");
const warningHandler = require("../handlers/serverLogger.js");
const logHandler = require("../handlers/serverLogger.js");
const validUrl = require("valid-url");
const sightengine = require("sightengine")("38148958", "uiFsNBwgwgLRLeZoRrvv");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

var authors = [];
var warned = [];
var givedWarn = [];
var messageLog = [];

class Automod {
  static run (client, message, settings) {
    Infractions.findOne({
      guildID: message.guild.id,
      userID: message.author.id
    }, async (err, u) => {
      if (err) client.logger.log(err, "error");

      if (!u) {
        const newUser = new Infractions({
          guildID: message.guild.id,
          userID: message.author.id,
          infractions: 0
        });

        await newUser.save().catch(e => client.logger.log(e, "error"));
        return undefined;
      }

      const antiSpam = async (client, message) => {
        if (messageLog.length > 50) {
          messageLog.shift();
        }

        const warnBuffer = 6;
        const maxBuffer = 9;
        const interval = 5000;
        const maxDuplicatesWarning = 6;
        const maxDuplicatesBan = 9;

        const giveWarnUser = async (m) => {
          for (var i = 0; i < messageLog.length; i++) {
            if (messageLog[i].author == m.author.id) {
              messageLog.splice(i);
            }
          }

          givedWarn.push(m.author.id);
          u.infractions = u.infractions + 1;
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: m.author, reason: "Spamming." });
            Logger.send().then(t => Logger.kill());
          }
          m.channel.send(`<@!${m.author.id}>, has been given \`1\` warning for spamming.`);

          m.channel.fetchMessages({ limit: 20 }).then((messages) => {
            const filterBy = m.author ? m.author.id : client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, 20);
            m.channel.bulkDelete(messages).catch(err => client.logger.log(err, "error"));
          });

          warningHandler.emit(client, message.member.user.user, client.user, message.guild);

          return undefined;
        };


        // Warn the User
        const warnUser = async (m) => {
          warned.push(m.author.id);
          m.channel.send(`<@${m.author.id}>, Please stop spamming.`).then(m => m.delete(2500));
        };

        if (message.author.bot) return;
        if (message.channel.type !== "text" || !message.member.user || !message.guild || !message.channel.guild) return;

        if (message.author.id !== client.user.id) {
          const currentTime = Math.floor(Date.now());
          authors.push({
            "time": currentTime,
            "author": message.author.id
          });

          messageLog.push({
            "message": message.content,
            "author": message.author.id
          });

          let msgMatch = 0;
          for (var i = 0; i < messageLog.length; i++) {
            if (messageLog[i].message == message.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
              msgMatch++;
            }
          }

          if (msgMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
            warnUser(message);
          }

          if (msgMatch == maxDuplicatesBan && !givedWarn.includes(message.author.id)) {
            giveWarnUser(message);
          }

          var matched = 0;

          for (var i = 0; i < authors.length; i++) { // eslint-disable-line no-redeclare
            if (authors[i].time > currentTime - interval) {
              matched++;
              if (matched == warnBuffer && !warned.includes(message.author.id)) {
                warnUser(message);
              } else if (matched == maxBuffer) {
                if (!givedWarn.includes(message.author.id)) {
                  giveWarnUser(message);
                }
              }
            } else if (authors[i].time < currentTime - interval) {
              authors.splice(i);
              warned.splice(warned.indexOf(authors[i]));
              givedWarn.splice(warned.indexOf(authors[i]));
            }

            if (messageLog.length >= 350) {
              messageLog.shift();
            }
          }
        }

      };

      const antiLink = async (client, message) => {
        var stat = false;
        const warnIt = async () => {
          stat = true;
          message.delete().catch(e=>e);
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger2 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Posting links." });
            Logger2.send().then(t => Logger2.kill());
          }
          message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction for posting links.`);

          u.infractions = u.infractions + 1;
          await u.save().catch(e => client.logger.log(e, "error"));
          warningHandler.emit(client, message.member.user, client, message.guild);
        };

        const args = message.content.trim().split(/ +/g);

        for (const arg of args) {
          if (validUrl.isUri(arg)) {
            if (stat === false) warnIt();
          }
        }
      };

      const antiInvite = async (client, message) => {
        var stat = false;
        const warnTheUser = async () => {
          stat = true;
          message.delete().catch(e=>e);
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger3 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Posted an invite link." });
            Logger3.send().then(t => Logger3.kill());
          }

          message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction for posting discord invitation links.`);
          u.infractions = u.infractions + 1;
          await u.save().catch(e => client.logger.log(e, "error"));
          warningHandler.emit(client, message.member.user, client, message.guild);
        };

        const invite = new RegExp("(https?://)?(www.)?(discord.(gg|io|me|li)|discordapp.com/invite)/.+[a-z]");
        const args = message.content.trim().split(/ +/g);

        for (const arg of args) {
          if (arg.match(invite)) {
            if (stat === false) warnTheUser();
          }
        }

      };

      const maxLines = async (client, message, amount) => {
        const maxLines = message.content.split("\n");

        if (maxLines.length > amount) {
          message.delete().catch(e=>e);
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger4 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Exceeding limit of maximum lines per message." });
            Logger4.send().then(t => Logger4.kill());
          }
          message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction because its message contained ${maxLines.length} new lines.`);

          u.infractions = u.infractions + 1;
          await u.save().catch(e => client.logger.log(e, "error"));
          warningHandler.emit(client, message.member.user, client, message.guild);

          try {
            message.author.send(`Here its your message if you wish to edit it:\n${message.content}`);
          } catch (e) {
            return;
          }
        }
      };

      const antiEveryone = async (client, message) => {

        if (message.content.includes("@everyone") || message.content.includes("@here")) {

          if (!message.channel.permissionsFor(message.member).toArray().includes("MENTION_EVERYONE")) {
            message.delete().catch(e=>e);
            if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
              const Logger5 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Atempt to mention @everyone/@here." });
              Logger5.send().then(t => Logger5.kill());
            }
            message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction for attempt to mention at here/ at everyone.`);

            u.infractions = u.infractions + 1;
            await u.save().catch(e => client.logger.log(e, "error"));
            warningHandler.emit(client, message.member.user, client, message.guild);
          }
        }
      };

      const maxMentions = async (client, message, amount) => {
        const totalMentions = message.mentions.users.size + message.mentions.roles.size;

        if (totalMentions > amount) {
          message.delete().catch(e=>e);
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger6 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Exceeding limit of maximum mentions per message." });
            Logger6.send().then(t => Logger6.kill());
          }
          message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction for mass pinging.`);

          u.infractions = u.infractions + 1;
          await u.save().catch(e => client.logger.log(e, "error"));
          warningHandler.emit(client, message.member.user, client, message.guild);
        }
      };


      const antiBad = async (client, message) => {
        var stat = false;
        const sueAuthor = async (client, message) => {
          stat = true;
          message.delete().catch(e=>e);
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger7 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Sending bad words in messges." });
            Logger7.send().then(t => Logger7.kill());
          }
          message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction for saying bad words!`);

          u.infractions = u.infractions + 1;
          await u.save().catch(e => client.logger.log(e, "error"));
          warningHandler.emit(client, message.member.user, client, message.guild);
        };

        const badWords = ["fuck","dick","nigg", "bitch","pussy","cock","suck", "ass", "sex", "retarded", "cunt", "shitty", "penis", "vagina"];

        const args = message.content.trim().split(/ +/g);

        for (const arg of args) {
          if (stat === false) {
            if (badWords.includes(arg.toLowerCase())) sueAuthor(client, message);
          }
        }
      };

      const antiNsfw = async (client, message) => {
        if (message.channel.nsfw) return;

        var state = false;
        const punishUser = async (client, message) => {
          state = true;
          message.delete().catch(e=>e);
          if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
            const Logger8 = new logHandler({ client: client, case: "automod", guild: message.guild.id, member: message.author, reason: "Sending inappropriate attachments." });
            Logger8.send().then(t => Logger8.kill());
          }
          message.channel.send(`<@!${message.author.id}>, has been given \`1\` infraction for posting NSFW content!`);

          u.infractions = u.infractions + 1;
          await u.save().catch(e => client.logger.log(e, "error"));
          warningHandler.emit(client, message.member.user, client, message.guild);
        };

        if (message.attachments.size > 0) {
          for (const img of message.attachments) {
            sightengine.check(["nudity"]).set_url(img[1].url).then(function (result) {
              if (result.status === "success") {
                if (result.nudity.safe < 0.80) {
                  if (state === false) punishUser(client, message);
                }
              }
            }).catch(function (err) {
              return err;
            });
          }
        }

        const args = message.content.trim().split(/ +/g);

        for (const arg of args) {
          if (validUrl.isUri(arg)) {
            sightengine.check(["nudity"]).set_url(arg).then(function (result) {
              if (result.status === "success") {
                if (result.nudity.safe < 0.80) {
                  if (state === false) punishUser(client, message);
                }
              }
            }).catch(function (err) {
              return err;
            });
          }
        }
      };
      // if (message.member.roles.get(settings.ignoredRole) !== undefined) return;
      if (settings.antiSpam === "on") antiSpam(client, message);
      if (settings.antiInvite === "on") antiInvite(client, message);
      if (settings.antiLinks === "on") antiLink(client, message);
      if (settings.maxLines > 0) maxLines(client, message, settings.maxLines);
      if (settings.antiEveryone === "on") antiEveryone(client, message);
      if (settings.maxMentions > 0) maxMentions(client, message, settings.maxMentions);
      if (settings.antiBad === "on") antiBad(client, message);
      if (settings.nsfwDetection === "on") antiNsfw(client, message);
    });
  }
}

module.exports = Automod;
