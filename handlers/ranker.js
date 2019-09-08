class Ranker {
  static async check (client, message) {
    const DBL = require("dblapi.js");
    const dbl = new DBL(client.data.dblToken, client);
    const voter = await dbl.hasVoted(message.author.id);

    if (voter === true) message.rank = "Upvoter";
    if (client.config.patreons.includes(message.author.id) || client.config.supporters.includes(message.author.id)) message.rank = "Supporter";
    if (!message.rank) message.rank = "User";
  }
}

module.exports = Ranker;
