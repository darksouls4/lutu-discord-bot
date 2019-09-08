const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Lockdown = require("../models/lockdown.js");
const logHandler = require("../handlers/serverLogger.js");
const Command = require("../base/Command.js");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

class Lockdow extends Command {
  constructor (client) {
    super(client, {
      name: "lockdown",
      description: "Enables lockdown mode. The bot will delete any message sent.",
      category: "Moderation",
      usage: "<on/off> [reason]",
      enabled: true,
      guildOnly: true,
      aliases: ["lk"],
      permLevel: "Moderator",
      cooldown: 5,
      args: true,
      rank: "Upvoter"
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const mode = args[0].toLowerCase();
    if (mode === "on") {
      Lockdown.findOne({
        guildID: message.guild.id
      }, async (err, g) => {
        if (err) this.client.logger.log(err, "error");

        const reason = args.slice(1).join(" ") || "No reason specified.";
        if (!g) {
          const newLockdown = new Lockdown({
            guildID: message.guild.id,
            lockdownMode: "on"
          });
          await newLockdown.save().catch(e => this.client.logger.log(e, "error"));

          try {
            const chen = await message.guild.createChannel("lockdown-channel", "text");
            chen.send("Permission for @-everyone for seeing this channel its denied. However peoples with admin or explicit permissions can see it. The bot will ignore all messages sent in this channel.");
            const role = await message.guild.roles.find(r => r.id === message.guild.id);
            await chen.overwritePermissions(role, {
              VIEW_CHANNEL: false
            });
          } catch (e) {
            reply("I don't have permissions to geenrate a secured channel.");
          }

          return reply("<a:aGreenTick:556121203136528388> This server is now under lockdown. All new messages will be deleted. Use `unlockdown [reason]` to unlock it.");
        }

        if (g.lockdownMode === "on") return reply("<a:aRedTick:556121032507916290> This server is already under lockdown. Use `unlockdown [reason]` to unlock it.");

        g.lockdownMode = "on";
        await g.save().catch(e => this.client.logger.log(e, "error"));
        try {
          const chen = await message.guild.createChannel("lockdown-channel", "text");
          chen.send("Members cannot see this channel unless they have an admin/moderator role or have 'Read' permission. The bot will ignore all messages sent in this channel.");
          const role = await message.guild.roles.find(r => r.id === message.guild.id);
          await chen.overwritePermissions(role, {
            VIEW_CHANNEL: false
          });
        } catch (e) {
          reply("<a:aRedTick:556121032507916290> I don't have permissions to geenrate a secured channel.");
        }
        if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
          const Logger = new logHandler({ client: this.client, case: "lockdownOn", guild: message.guild.id, moderator: message.author, reason: reason });
          Logger.send().then(t => Logger.kill());
        }
        reply("<a:aGreenTick:556121203136528388> This server is now under lockdown. All new messages will be deleted. Use `unlockdown [reason]` to unlock it.");
      });
    } else if (mode === "off") {
      Lockdown.findOne({
        guildID: message.guild.id
      }, async (err, g) => {
        if (err) this.client.logger.log(err, "error");

        const reason = args.slice(1).join(" ") || "No reason specified.";
        if (!g) {
          const newLockdown = new Lockdown({
            guildID: message.guild.id,
            lockdownMode: "off"
          });
          await newLockdown.save().catch(e => this.client.logger.log(e, "error"));
          try {
            const safeChannel = message.guild.channels.find(c => c.name === "lockdown-channel");

            if (safeChannel) {
              await safeChannel.delete();
            }
          } catch (e) {
            reply("<a:aRedTick:556121032507916290> Snap, failed to delete 'safe' channel. Probably missing permissions.");
          }
          return reply("<a:aGreenTick:556121203136528388> Lockdown mode has been disabled. Messages will no longer be deleted. Use `lockdown [reason]` to lock the server again.");
        }

        if (g.lockdownMode === "off") return reply("<a:aRedTick:556121032507916290> Server is not under lockdown. Use `lockdown [reason]` to lock it.");

        g.lockdownMode = "off";
        await g.save().catch(e => this.client.logger.log(e, "error"));
        try {
          const safeChannel = message.guild.channels.find(c => c.name === "lockdown-channel");

          if (safeChannel) {
            await safeChannel.delete();
          }
        } catch (e) {
          reply("Failed to delete 'safe' channel. Probably missing permissions.");
        }
        if (message.guild.settings.moderationLogs.toLowerCase() === "on") {
          const Logger = new logHandler({ client: this.client, case: "lockdownOff", guild: message.guild.id, moderator: message.author, reason: reason });
          Logger.send().then(t => Logger.kill());
        }
        reply("<a:aGreenTick:556121203136528388> Lockdown mode has been disabled. Messages will no longer be deleted. Use `lockdown [reason]` to lock the server again.");
      });
    }
  }
}

module.exports = Lockdow;
