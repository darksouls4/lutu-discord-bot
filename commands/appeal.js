const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const config = require("../config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;
const bans = require("../models/bans.js");
const validUrl = require("valid-url");
const Command = require("../base/Command.js");

mongoose.connect(databaseUrl, {
  useNewUrlParser: true
});

class Report extends Command {
  constructor (client) {
    super(client, {
      name: "appeal",
      description: "Appeal your report.",
      category: "Ban List",
      usage: "",
      enabled: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    bans.findOne({
      reportedID: message.author.id
    }, async (err, r) => {
      if (err) this.client.logger.log(err, "error");
      if (!r) return reply("<a:aRedTick:556121032507916290> Looks like you are not on my ban list.");

      const q = await this.client.awaitReply(message, `Do you want to appeal case **${r.caseID}** for \`${r.caseReason}\`? (\`yes\`/\`no\`)`);
      if (q === false) return reply("Prompt timed out!");

      if (q.toLowerCase() === "yes") {
        const prof = await this.client.awaitReply(message, "Please send links of photos/videos (photos better) demonstrating that you're not guilty. Please submit each link separated by a comma and and a space. Ex: Link1, Link2, Link3, Link4 You may only submit up to 4 proof links");
        const [l1, l2, l3, l4] = prof.split(", ");
        const t = prof.split(", ");

        if (!validUrl.isUri(l1)) t.length = 0;


        let links;
        if (t.length === 1) {
          links = `1) ${l1}`;
        } else if (t.length === 2) {
          links = `1) ${l1}\n2) ${l2}`;
        } else if (t.length === 3) {
          links = `1) ${l1}\n2) ${l2}\n3) ${l3}`;
        } else if (t.length === 3) {
          links = `1) ${l1}\n2) ${l2}\n3) ${l3}\n4) ${l4}`;
        } else {
          links = "<a:aRedTick:556121032507916290> No Proof Specified!";
        }

        const previewEmbed = new Discord.MessageEmbed()
          .setTitle("New Appeal Awaiting")
          .addField("User:", `${message.author.tag} [ID: ${message.author.id}]`)
          .addField("Case ID Apealed:", `${r.caseID}`)
          .addField("Case Apealed Reson:", `${r.caseReason}`)
          .addField("Proof:", `${links}`)
          .setColor("BLUE")
          .setThumbnail(`${message.author.displayAvatarURL}`)
          .setTimestamp();

        await reply("This is a preview of the appeal. Do you want to submit it? (`yes`/`no`)");
        const conf = await this.client.awaitReply(message, previewEmbed);
        if (conf === false) return reply("<a:aRedTick:556121032507916290> Prompt timed out.");

        if (conf.toLowerCase() === "yes") {
          await this.client.channels.get().send(previewEmbed);
          await this.client.channels.get().send(`📮 | **${message.author.tag}** appealed case ID **${r.caseID}**`);
        } else {
          return reply("<a:aRedTick:556121032507916290> Aborted!");
        }
      }
    });
  }
}
module.exports = Report;
