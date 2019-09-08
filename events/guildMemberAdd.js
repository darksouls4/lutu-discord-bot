const Discord = require("discord.js");
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const Settings = require("../models/settings.js");
const Bans = require("../models/bans.js");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (member) {
    Settings.findOne({
      guildID: member.guild.id
    }, async (err, s) => {
      if (err) this.client.logger.log(err, "error");
      if (!s) return;

      Bans.findOne({
        reportedID: member.id
      }, async (er, u) => {
        if (er) this.client.logger.log(er, "error");
        if (!u) u = "smh";


        if (s.checkpoint_mode === "warn" && u.caseReason) {
          const warnEmbed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL)
            .setDescription("Hello. I have been detected a malicious user joining your server.")
            .addField("User:", `${member.user.tag} (ID: ${member.id})`)
            .addField("Ban Reason:", `${u.caseReason}`)
            .addField("Case Proof:", `${u.caseProof1}`)
            .addField("Guild:", `${member.guild.name} (ID: ${member.guild.id})`)
            .setColor("RED")
            .setTimestamp();
          member.guild.owner.user.send(warnEmbed).catch(e=>e);
        } else if (s.checkpoint_mode === "ban" && u.caseReason) {
          const warnEmbed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL)
            .setDescription("Hello. I have been detected a malicious user joining your server.")
            .addField("User:", `${member.user.tag} [ID: ${member.id}]`)
            .addField("Ban Reason:", `${u.caseReason}`)
            .addField("Case Proof:", `${u.caseProof1}`)
            .addField("Guild:", `${member.guild.name} [ID: ${member.guild.id}]`)
            .setColor("RED")
            .setTimestamp();
          member.ban("Global Ban List Auto-ban");
          member.guild.owner.user.send(warnEmbed).catch(e=>e);
        }
	    if (s.joinrole != "none" ){
	 	    member.roles.add(member.guild.roles.find(role => role.id === s.joinrole));
   	  }

        if (s.checkpoint === "on") {
          const channel = member.guild.channels.get(s.checkpoint_logChannel);
          if (!channel) return;

          let checkEmbed = new Discord.MessageEmbed() // eslint-disable-line
            .setAuthor(member.user.tag, member.user.displayAvatarURL)
            .setTimestamp();

          if (!u.caseReason) {
            checkEmbed.setDescription("A new member just joined the server!");// \n\nStatus:\n<a:aGreenTick:556121203136528388> Not Banned");
            checkEmbed.addField("Status:", "<a:aGreenTick:556121203136528388> Clear! (Not On Global Ban-List)");
            checkEmbed.setColor("GREEN");
          }

          if (u.caseReason) {
            checkEmbed.setDescription("A new member just joined the server!");
            checkEmbed.addField("Status:", "<a:aRedTick:556121032507916290> Malicious user! (Banned on Global Ban-List)");
            checkEmbed.addField("Ban Reason:", `${u.caseReason}`);
            checkEmbed.setColor("RED");
          }

          channel.send(checkEmbed);
        } else {
          return;
        }
      });
    });
  }
};
