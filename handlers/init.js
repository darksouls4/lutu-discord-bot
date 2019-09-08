const Discord = require("discord.js");

class UponStart {
  static init (client) {
    client.on("guildMemberAdd", async (member) => {
      if (member.guild.id === "523521672829992970") {
        member.guild.channels.find(c => c.name === "welcome").send(`**${member.user.tag}** just joined! Cheers! You are **${member.guild.memberCount}th** member.`);
      }
    });

    client.on("guildMemberRemove", async (member) => {
      if (member.guild.id === "523521672829992970") {
        member.guild.channels.find(c => c.name === "welcome").send(`**${member.user.tag}** just left! Bye.. bye.. **${member.user.tag}**.`);
      }
    });

    const DBL = require("dblapi.js");
    const dbl = new DBL("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyMzU1Mjk3OTY2NDYzMzg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTUxMjgyNDQxfQ.KfCCASA1ZJ5WZmW9eKW9grdn89dJOduRIqSsH0Ha1WA", { webhookPort: 7890, webhookAuth: "password" });

    dbl.webhook.on("ready", async (hook) => {
      console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
    });

    dbl.webhook.on("vote", async (vote) => {
      const user = await client.users.fetch(vote.user);
      
      const emb = new Discord.MessageEmbed()
        .setTitle(`${user.tag} just upvoted!`)
        .setDescription(`**${user.tag}** just upvoted Lutu on discord bot list! For your dedication i offer you upvoter features for 24 hours. Cheers! <3`)
        .setColor("#36393e")
        .setTimestamp();

      client.channels.get("544760424256634891").send(emb);
    });
  }
}

module.exports = UponStart;