const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const preReports = require("../models/prereports.js");
const bans = require("../models/bans.js");
const validUrl = require("valid-url");
const Command = require("../base/Command.js");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

class Report extends Command {
  constructor (client) {
    super(client, {
      name: "report",
      description: "Report a suspicious member.",
      category: "Ban List",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const preResult = await preReports.findOne({ reportedByID: message.author.id });
    if (preResult) return reply("You already have 1 report awaiting review. Please wait for it to be solved then you can submit another one.");

    const uID = await this.client.awaitReply(message, "What's the ID of use you want to report?", 60000);
    if (uID === false) return reply("Prompt timed out.");

    try { await this.client.users.fetch(uID); } catch (e) { return reply("Unknown user."); }

    const isReported = await preReports.findOne({ reportedID: uID });
    if (isReported) return reply("There is a report awaiting solving on this id.");

    const isBanned = await bans.findOne({ reportedID: uID });
    if (isBanned) return reply("User is already on ban list.");

    const reportedUser = await this.client.users.fetch(uID);

    const displayEmbed = new Discord.MessageEmbed()
      .setTitle("User Recognized")
      .addField("[User]:", `▫ Username: ${reportedUser.username}\n▫ Tag: ${reportedUser.tag}\n▫ ID: ${reportedUser.id}\n\nDo you want to report this user? (\`yes\`/\`no\`)`)
      .setThumbnail(reportedUser.displayAvatarURL)
      .setColor("#36393e")
      .setTimestamp();

    const confirmation = await this.client.awaitReply(message, displayEmbed, 40000);
    if (confirmation === false) return reply("Prompt timed out.");
    if (confirmation !== "yes") return reply("Action aborted!");

    const reportReason = await this.client.awaitReply(message, `Please pick a reason:\n\n1 - Excessive Harassament
2 - Direct Message Advertising
3 - Terms of Service Violation
4 - Problematic Bot
5 - Doxxing
6 - Raids and Nuking
7 - Underage in NSFW`, 60000);
    if (reportReason === false) return reply("Prompt timed out");

    const reasons = {
      "1": "Excessive Harassament",
      "2": "Direct Message Advertising",
      "3": "Terms of Service Violation",
      "4": "Problematic Bot",
      "5": "Doxxing",
      "6": "Raids and Nuking",
      "7": "Underage in NSFW"
    };

    if (!reasons[reportReason]) return reply("Invalid reason.");

    const rawProofs = await this.client.awaitReply(message, "Please enter your proof image links separrated by a comma. (`,`)", 120000);
    if (rawProofs === false) return reply("Prompt timed out.");
    
    const proofs = rawProofs.split(",");
    
    for (const proof of proofs) {
      if (!validUrl.isUri(proof)) {
        const proofIndex = proofs.findIndex(item => item === proof);
        proofs.splice(proofIndex, 1);
      }
    }

    if (proofs.length < 1) return reply("Couldn't find any links in your message.");

    const submitConfirm = await this.client.awaitReply(message, "Do you want to submit report? (`yes`/`no`)", 60000);
    if (submitConfirm === false) return reply("Prompt timed out.");
    if (submitConfirm.toLowerCase() !== "yes") return reply("Action aborted.");

    var possible = "123456789";
    var complaintID = "";
    for (var i = 0; i < 6; i++) complaintID += possible.charAt(Math.floor(Math.random() * possible.length));

    const complaint = new preReports({
      caseID: complaintID,
      reportedID: uID,
      reportedByID: message.author.id,
      caseReason: reasons[reportReason],
      proofs: proofs
    });

    await complaint.save().catch(e => this.client.logger.log(e, "error"));
    const reportEmbed = new Discord.MessageEmbed()
      .setTitle("New Report")
      .addField("[Reported User]:", `▫ Username: ${reportedUser.username}\n▫ Tag: ${reportedUser.tag}\n▫ ID: ${reportedUser.id}`)
      .addField("[Complaint]:", `▫ Complaint ID: ${complaintID}\n▫ Complaint Author: ${message.author.tag}\n▫ Complaint Author ID: ${message.author.id}\n▫ Complaint Reason: ${reasons[reportReason]}\n▫ Complaint Proofs: ${proofs.join(", ")}`)
      .setColor("#36393e")
      .setTimestamp();

    this.client.channels.get("527529283447554058").send(reportEmbed);
    reply(`Report with ID **${complaintID}** has been saved.`);
  }
}
module.exports = Report;
