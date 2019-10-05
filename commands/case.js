const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const preReports = require("../models/prereports.js");
const afterReports = require("../models/aftreports.js");
const Ban = require("../models/bans.js");
const Command = require("../base/Command.js");

class Case extends Command {
  constructor (client) {
    super(client, {
      name: "case",
      description: "Approve/Deny BanList reports.",
      category: "Ban List",
      usage: "<case id> <approve/deny> [reason]",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "Bot Admin",
      cooldown: 15,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const complaint = await preReports.findOne({ caseID: args[0] });
    if (!complaint || complaint === null) return reply("This complaint does not exist.");
    if (!args[1]) return reply("You must pick an option wheter to reject it or approve it.");

    if (args[1].toLowerCase() === "approve") {
      const newBan = new Ban({
        caseID: complaint.caseID,
        reportedID: complaint.reportedID,
        reportedByID: complaint.reportedByID,
        caseReason: complaint.caseReason,
        caseAcceptedAt: message.createdTimestamp,
        proofs: complaint.proofs
      });

      await newBan.save().catch(e => this.client.logger.log(e, "error"));
      await preReports.findOneAndDelete({ caseID: parseInt(args[0]) });
      this.client.users.get(complaint.reportedByID).send(`Your report with case id **${complaint.caseID}** has been approved by **${message.author.tag}**.`);
      const reportedUser = await this.client.users.fetch(complaint.reportedID);
      const reportAuthor = await this.client.users.fetch(complaint.reportedByID);

      const approvedEmbed = new Discord.MessageEmbed()
        .setTitle("Report Approved")
        .addField("[User]:", `▫ Username: ${reportedUser.username}\n▫ Tag: ${reportedUser.tag}\n▫ ID: ${reportedUser.id}`)
        .addField("[Complaint]:", `▫ Complaint Author: ${reportAuthor.tag}\n▫ Complaint Author ID: ${reportAuthor.id}\n▫ Complaint Reason: ${complaint.caseReason}\n▫ Complaint Proofs: ${complaint.proofs.join(", ")}`)
        .addField("[Moderator]:", `▫ Moderator: ${message.author.tag}\n▫ Moderator ID: ${message.author.id}`)
        .setColor("GREEN")
        .setTimestamp();
      this.client.channels.get(this.client.config.reportApprovedEmbedChannel).send(approvedEmbed);

      reply(`Report with case id **${complaint.caseID}** has been approved.`);
    } else if (args[1].toLowerCase() === "reject") {
      const reason = args.slice(2).join(" ");
      if (!reason) return reply("You have to specify a reason.");

      const newAfter = new afterReports({
        caseID: complaint.caseID,
        reportedID: complaint.reportedID,
        reportedByID: complaint.reportedByID,
        caseReason: complaint.caseReason,
        caseAcceptedAt: message.createdTimestamp,
        proofs: complaint.proofs,
        caseDenialReason: reason
      });

      await newAfter.save().catch(e => this.client.logger.log(e, "error"));
      await preReports.findOneAndDelete({ caseID: args[0] });
      this.client.users.get(complaint.reportedByID).send(`Your report with case id **${complaint.caseID}** has been rejected by **${message.author.tag}** because **${reason}**.`);
      const reportedUser = await this.client.users.fetch(complaint.reportedID);
      const reportAuthor = await this.client.users.fetch(complaint.reportedByID);

      const rejectedEmbed = new Discord.MessageEmbed()
        .setTitle("Report Rejected")
        .addField("[User]:", `▫ Username: ${reportedUser.username}\n▫ Tag: ${reportedUser.tag}\n▫ ID: ${reportedUser.id}`)
        .addField("[Complaint]:", `▫ Complaint Author: ${reportAuthor.tag}\n▫ Complaint Author ID: ${reportAuthor.id}\n▫ Complaint Reason: ${complaint.caseReason}\n▫ Complaint Proofs: ${complaint.proofs.join(", ")}`)
        .addField("[Moderator]:", `▫ Moderator: ${message.author.tag}\n▫ Moderator ID: ${message.author.id}\nRejection Reason: ${reason}`)
        .setColor("RED")
        .setTimestamp();
      this.client.channels.get(this.client.config.reportRejectedEmbedChannel).send(rejectedEmbed);

      reply(`Report with case id **${complaint.caseID}** has been rejected.`);
    } else {
      return reply("Unknown type.");
    }
  }
}

module.exports = Case;
