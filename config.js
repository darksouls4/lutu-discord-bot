const config = {
  "token":  "CLIENT_TOKEN",
  "prefix": "?",
  "admins": [],
  "dbUrl": "MONGODB_URL",
  "patreons": [],
  "supporters": [],

  "dashboard" : {
    "oauthSecret": "CLIENT_SECRET",
    "callbackURL": "http://localhost/callback", // add this to callback urls in your application's OAuth tab
    "sessionSecret": "ohmulol12445$@%#%#fcdshfuiwedfkh",
    "domain": "localhost",
    "port": 80
  },

  /* Channels */
  "appealEmbedChannel": "CHANNEL_ID",
  "banListLogChannel": "CHANNEL_ID",
  "reportRejectedEmbedChannel": "CHANNEL_ID",
  "reportApprovedEmbedChannel": "CHANNEL_ID",
  "newReportEmbed": "CHANNEL_ID",
  "guildLogChannel": "CHANNEL_ID",
  "commandLogChannel": "CHANNEL_ID",
  "errorChannel": "CHANNEL_ID",

  permLevels: [
    { level: 0,
      name: "User",
      check: () => true
    },

    { level: 2,
      name: "Moderator",
      check: (message) => {
        try {
          if (message.member.hasPermission("MANAGE_MESSAGES") || message.member.hasPermission("MANAGE_GUILD") ||  message.member.roles.get(message.guild.settings.modRole) !== undefined) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator",
      check: (message) => {
        try {
          if (message.member.hasPermission("ADMINISTRATOR") ||  message.member.roles.get(message.guild.settings.adminRole) !== undefined) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "Server Owner",
      check: (message) => {
        if (message.channel.type === "text" && message.guild.ownerID) {
          if (message.guild.ownerID === message.author.id) return true;
        } else {
          return false;
        }
      }
    },

    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: "Bot Owner",
      check: (message) => message.client.appInfo.owner.id === message.author.id
    }
  ]
};

module.exports = config;
