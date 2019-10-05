const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const express = require("express");
const app = express();
const moment = require("moment");
require("moment-duration-format");
const settings = require("../models/settings.js");
const bans = require("../models/bans.js");
const pendingBan = require("../models/prereports.js");
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const Strategy = require("passport-discord").Strategy;
const helmet = require("helmet");
const md = require("marked");
const validUrl = require("valid-url");

module.exports = (client) => {
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
  app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  passport.use(new Strategy({
    clientID: client.appInfo.id,
    clientSecret: client.config.dashboard.oauthSecret,
    callbackURL: client.config.dashboard.callbackURL,
    scope: ["identify", "guilds"]
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: client.config.dashboard.sessionSecret,
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(helmet());

  app.locals.domain = client.config.dashboard.domain;
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  var bodyParser = require("body-parser");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  function checkAuth (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; // eslint-disable-line no-self-assign
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  passport.authenticate("discord"));

  app.get("/terms", (req, res) => renderTemplate(res, req, "terms.ejs"));
  app.get("/privacy", (req, res) => renderTemplate(res, req, "privacy.ejs"));

  app.get("/discord", (req, res) => {
    res.redirect("https://discord.gg/?");
  });

  app.get("/sitemap.xml", (req, res) => {
    res.header('Content-Type', "text/xml");
    renderTemplate(res, req, "sitemap.ejs");
  });

  app.get("/invite", (req, res) => {
    res.redirect("https://discordapp.com/oauth2/authorize?client_id=523552979664633858&permissions=8&scope=bot");
  });

  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/forbidden" }), (req, res) => {
    session.us = req.user;
    if (req.user.id === client.appInfo.owner.id || client.config.admins.includes(req.user.id)) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  });

  app.get("*", (req, res, next) => {
    if (!req.session.isAdmin && client.dashboardMaintenance === true) return renderTemplate(res, req, "maintenance.ejs");
    next();
  });

  app.post("*", (req, res, next) => {
    if (!req.session.isAdmin && client.dashboardMaintenance === true) return renderTemplate(res, req, "maintenance.ejs");
    next();
  });

  app.get("/forbidden", (req, res) => {
    renderTemplate(res, req, "403.ejs");
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs");
  });

  app.get("/commands", (req, res) => {
    renderTemplate(res, req, "commands.ejs", { md });
  });

  app.get("/stats", (req, res) => {
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
    const textChannels = client.channels.filter(c => c.type === "text").size;
    const voiceChannels = client.channels.filter(c => c.type === "voice").size;
    const guilds = client.guilds.size;
    renderTemplate(res, req, "stats.ejs", {
      stats: {
        servers: guilds,
        members: members,
        text: textChannels,
        voice: voiceChannels,
        uptime: duration,
        memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        dVersion: Discord.version,
        nVersion: process.version
      }
    });
  });

  app.get("/dashboard", checkAuth, (req, res) => {
    const perms = Discord.Permissions;
    renderTemplate(res, req, "dashboard.ejs", {perms});
  });

  app.get("/admin", checkAuth, (req, res) => {
    if (!req.session.isAdmin) return res.redirect("/");
    renderTemplate(res, req, "admin.ejs");
  });

  app.get("/members/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    renderTemplate(res, req, "guild/members.ejs", { members: guild.members });
  });

  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    if (!isManaged && !req.session.isAdmin) res.redirect("/dashboard");
    const guildSettings = await settings.findOne({ guildID: guild.id });
    if (!guildSettings) {
      await client.insertDefaults(guild.id);
      return res.redirect(`/dashboard/${guild.id}`);
    }

    guild.sets = guildSettings;
    renderTemplate(res, req, "guild/manage.ejs", { guild });
  });

  app.get("/stats/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    if (!isManaged && !req.session.isAdmin) res.redirect("/");

    let guildBans;
    let guildInvites;

    try { guildBans =  await guild.fetchBans(); } catch (e) { guildBans = { size: "??" }; }
    try { guildInvites =  await guild.fetchInvites(); } catch (e) { guildInvites = { size: "??" }; }

    renderTemplate(res, req, "guild/stats.ejs", {
      guild: guild,
      memberCount: guild.memberCount,
      name: guild.name,
      textChannels: guild.channels.filter(c => c.type === "text").size,
      voiceChannels: guild.channels.filter(c => c.type === "voice").size,
      owner: guild.owner.user,
      acronym: guild.nameAcronym,
      region: guild.region,
      verificationLevel: guild.verificationLevel,
      totalBans: guildBans.size,
      totalInvites: guildInvites.size
    });
  });


  app.get("/report", checkAuth, async (req, res) => {
    renderTemplate(res, req, "report.ejs", { error: null, success: null });
  });

  app.post("/report", checkAuth, async (req, res) => {
    const reasons = {
      "1": "Direct Message Advertising",
      "2": "Terms of Service Violation",
      "3": "Problematic Bot",
      "4": "Doxxing",
      "5": "Raids and Nuking",
      "6": "Underage in NSFW",
      "7": "Excessive Harassament"
    };

    const reason = reasons[req.body.reason];
    if (!reason) return renderTemplate(res, req, "report.ejs", { error: "Invalid reason specified.", success: null });

    const id = req.body.id;
    let usr;

    try {
      usr = await client.users.fetch(id);
    } catch (e) {
      return renderTemplate(res, req, "report.ejs", { error: "Invalid user id specified.", success: null });
    }

    const banned = await bans.findOne({ reportedID: req.body.id });
    if (banned) return renderTemplate(res, req, "report.ejs", { error: "User is already on ban list.", success: null });

    const stillAwaitCase = await pendingBan.findOne({ reportedByID: req.user.id });
    if (stillAwaitCase) return renderTemplate(res, req, "report.ejs", { error: "You cannot have more than one reports awaiting at a time.", success: null });

    const proofs = req.body.proofs.split(",");

    for (const proof of proofs) {
      if (!validUrl.isUri(proof)) {
        const proofIndex = proofs.findIndex(item => item === proof);
        proofs.splice(proofIndex, 1);
      }
    }

    if (proofs.length < 2) return renderTemplate(res, req, "report.ejs", { error: "Insufficient proof.", success: null });

    var possible = "123456789";
    var complaintID = "";
    for (var i = 0; i < 6; i++) complaintID += possible.charAt(Math.floor(Math.random() * possible.length));

    const aNewCase = new pendingBan({
      caseID: complaintID,
      reportedByID: req.user.id,
      caseReason: reason,
      reportedID: `${req.body.id}`,
      proofs: proofs
    });

    await aNewCase.save().catch(e => client.logger.log(e, "error"));

    const reportEmbed = new Discord.MessageEmbed()
      .setTitle("New Report")
      .addField("[User]:", `▫ Username: ${usr.username}\n▫ Tag: ${usr.username}#${usr.discriminator}\n▫ ID: ${usr.id}`)
      .addField("[Complaint]:", `▫ Complaint ID: ${complaintID}\n▫ Complaint Author: ${req.user.username}#${req.user.discriminator}\n▫ Complaint Author ID: ${req.user.id}\n▫ Complaint Reason: ${reason}\n▫ Complaint Proofs: ${proofs.join(", ")}`)
      .setColor("#36393e")
      .setTimestamp();
    client.channels.get(client.config.newReportEmbed).send(reportEmbed);


    renderTemplate(res, req, "report.ejs", { success: "User has been reported.", error: null });
  });

  app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    if (!isManaged && !req.session.isAdmin) res.redirect("/");

    const updatedObj = {
      guildID: guild.id,
      prefix: req.body.prefix || "?",
      adminRole: req.body.adminrole || "",
      joinrole: req.body.joinrole || "none",
      modRole: req.body["modrole"] || "",
      modLog: req.body["mod-channel"] || "",
      checkpoint: req.body.checkpoint || "off",
      checkpointMode: req.body.checkpointmode || "N/A",
      checkpointLog: req.body.checkpointlog || "",
      antiSpam: req.body["anti-spam"] || "off",
      antiLink: req.body["anti-link"] || "off",
      antiDiscord: req.body["anti-discord"] || "off",
      antiEveryone: req.body["anti-everyone"] || "off",
      antiBad: req.body["anti-bad"] || "off",
      antiNsfw: req.body["anti-nsfw"] || "off",
      maxMentions: req.body["max-mentions"] || "0",
      maxLines: req.body["max-lines"] || "0",
      ignoredChannels: req.body["ignored-channels"] || [],
      ignoredRoles: req.body["ignored-roles"] || [],
      serverLogs: req.body.serverLogs || "off",
      chatLogs: req.body.chatLogs || "off",
      moderationLogs: req.body.moderationLogs || "off"
    };

    await client.updateSettings(updatedObj);
    res.redirect("/dashboard/" + req.params.guildID);
  });

  app.get("/admin/:guildID/leave", checkAuth, async (req, res) => {
    if (!req.session.isAdmin) res.redirect("/dashboard");
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404).redirect("/admin");
    await guild.leave();
    res.redirect("/admin");
  });

  app.get("/admin/:guildID/warp", checkAuth, async (req, res) => {
    if (!req.session.isAdmin) res.redirect("/dashboard");
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404).redirect("/admin");
    const channel = guild.channels.filter(c => c.type === "text").first();
    const invite = await channel.createInvite().catch(e => client.users.get(req.user.id).send(`Couldn't send an invite because ${e}`));
    client.users.get(req.user.id).send(`Invite Generated to \`${guild.name}\` is https://discord.gg/${invite.code}/.`);
    res.redirect("/admin");
  });

  app.get("/404", async (req, res) => {
    renderTemplate(res, req, "404.ejs");
  });

  app.get("*", async (req, res) => {
    res.redirect("/404");
  });

  client.site = app.listen(client.config.dashboard.port, null, null, () => console.log("Dashboard is up and running."));
};
