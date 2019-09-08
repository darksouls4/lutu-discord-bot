if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { Client, Collection } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const Settings = require("./models/settings.js");

class Bot extends Client {
  constructor (options) {
    super(options);
    this.cmdMaintenance = false;
    this.dashboardMaintenance = false;
    this.config = require("./config.js");
    this.commands = new Collection();
    this.aliases = new Collection();
    this.logger = require("./modules/logger.js");

    this.wait = require("util").promisify(setTimeout);

    this.awaitReply = async (msg, question, limit = 60000) => {
      const filter = m => m.author.id === msg.author.id;
      await msg.channel.send(question);
      try {
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        return collected.first().content;
      } catch (e) {
        return false;
      }
    };

    this.clean = async (client, text) => {
      if (text && text.constructor.name == "Promise") text = await text;
      if (typeof evaled !== "string") text = require("util").inspect(text, {depth: 0});

      text = text.replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(client.token, null)
        .replace(this.config.dbUrl, "mongodb:bot:67hdk3@ds067781.mlab.com:5702/bot");

      return text;
    };

    this.insertDefaults = async (guildID) => {
      const newSettings = new Settings({
        guildID: guildID,
        prefix: "?",
        logsChannel: "none",
        modRole: "none",
        adminRole: "none",
        joinrole: "none",
        antiSpam: "off",
        antiLinks: "off",
        antiInvite: "off",
        antiBad: "off",
        antiEveryone: "off",
        maxMentions: 0,
        maxLines: 0,
        ignoredRoles: [],
        ignoredUsers: [],
        ignoredChannels: [],
        checkpoint: "off",
        checkpoint_logChannel: "none",
        checkpoint_mode: "N/A",
        underAttack: "off",
        nsfwDetection: "off",
        tags: [],
        selfroles: [],
        punishments: [],
        chatLogs: "off",
        moderationLogs: "off",
        serverLogs: "off"
      });

      await newSettings.save().catch(e => this.logger.log(e, "error"));
      return;
    };

    this.updateSettings = async (obj) => {
      if (isNaN(parseInt(obj.maxMentions))) obj.maxMentions = 0;
      if (isNaN(parseInt(obj.maxLines))) obj.maxLines = 0;

      await Settings.findOne({ guildID: obj.guildID }, async (err, settingsKit) => {
        if (err) return console.log(err);

        if (!settingsKit) {
          const newSettings = new Settings({
            guildID: obj.guildID,
            prefix: obj.prefix,
            logsChannel: obj.modLog,
            modRole: obj.modRole,
            adminRole: obj.adminRole,
            joinrole: obj.joinrole,
            antiSpam: obj.antiSpam,
            antiLinks: obj.antiLink,
            antiInvite: obj.antiDiscord,
            antiBad: obj.antiBad,
            antiEveryone: obj.antiEveryone,
            maxMentions: parseInt(obj.maxMentions),
            maxLines: parseInt(obj.maxLines),
            ignoredRoles: obj.ignoredRoles,
            ignoredChannels: obj.ignoredChannels,
            ignoredUsers: [],
            checkpoint: obj.checkpoint,
            checkpoint_logChannel: obj.checkpointLog,
            checkpoint_mode: obj.checkpointMode,
            underAttack: "off",
            nsfwDetection: obj.antiNsfw,
            tags: [],
            punishments: [],
            serverLogs: obj.serverLogs,
            chatLogs: obj.chatLogs,
            moderationLogs: obj.moderationLogs
          });
          await newSettings.save().catch(e => this.logger.log(e, "error"));
          return;
        } else {
          settingsKit.prefix = obj.prefix;
          settingsKit.logsChannel = obj.modLog;
          settingsKit.modRole = obj.modRole;
          settingsKit.adminRole = obj.adminRole;
          settingsKit.joinrole = obj.joinrole;
          settingsKit.antiSpam = obj.antiSpam;
          settingsKit.antiLinks = obj.antiLink;
          settingsKit.antiInvite = obj.antiDiscord;
          settingsKit.antiBad = obj.antiBad;
          settingsKit.antiEveryone = obj.antiEveryone;
          settingsKit.maxMentions = parseInt(obj.maxMentions);
          settingsKit.maxLines = parseInt(obj.maxLines);
          settingsKit.ignoredRoles = obj.ignoredRoles;
          settingsKit.ignoredChannels = obj.ignoredChannels;
          settingsKit.checkpoint = obj.checkpoint;
          settingsKit.checkpoint_logChannel = obj.checkpointLog;
          settingsKit.checkpoint_mode = obj.checkpointMode;
          settingsKit.nsfwDetection = obj.antiNsfw;
          settingsKit.serverLogs = obj.serverLogs;
          settingsKit.chatLogs = obj.chatLogs;
          settingsKit.moderationLogs = obj.moderationLogs;
          
          await settingsKit.save().catch(e => console.log(e));
          return;
        }
      });
    };
  }

  permlevel (message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadCommand (commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      this.logger.log(`Loading Command: ${props.help.name}`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand (commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }
}

const client = new Bot({
  fetchAllMembers: true
});

const init = async () => {
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    if (file.split(".")[1] !== "js") return;
    const eventName = file.split(".")[0];
    // client.logger.log(`Loading Event: ${eventName}`);
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."));
client.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"));
client.on("error", e => client.logger.error(e));
client.on("warn", info => client.logger.warn(info));

module.exports.Client = client;

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});

Object.defineProperty(String.prototype, "toProperCase", {
  value: function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
});
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
