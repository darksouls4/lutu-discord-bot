const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Setup extends Command {
  constructor (client) {
    super(client, {
      name: "setup",
      description: "Sets up the bot.",
      category: "Settings",
      usage: "mutedrole",
      enabled: false,
      guildOnly: true,
      aliases: [],
      permLevel: "Administrator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    if (!args[0]) return reply("Correct usage : `setup mutedrole`.");
    if (args[0].toLowerCase() === "mutedrole") {
      let mutedRole = message.guild.roles.find(r => r.name === "Muted");
      if (mutedRole) {
        const ms = await reply("The 'Muted' role already exists. Do you want to overwrite its permissions and make it Lutu's 'Muted' role?\n\n- Yes\n- No");
        await ms.react("✅");
        await ms.react("❎");
        const collected = await ms.awaitReactions((reaction, user) => user.id === message.author.id, {max: 1, time: 60000, errors: ["time"] });
        const res = collected.first().emoji.name;

        if (res === "✅") {
          ms.delete();
        } else if (res === "greenTick") {
          await ms.edit(`Starting setup...
Initializing Role
Setting Permissions for Categories
Setting Permissions for Text Channels
Setting Permissions for Voice Channels
          `);

          await ms.edit(`Setup started!
Initializing Role...
Setting Permissions for Categories
Setting Permissions for Text Channels
Setting Permissions for Voice Channels
          `);

          try {
            await mutedRole.setPermissions(0);
          } catch (e) {
            return ms.edit(`Setup initialized!
Initializing Role Failed! Missing permissions!
Setting Permissions for Categories Failed! Missing permissions!
Setting Permissions for Text Channels Failed! Missing permissions!
Setting Permissions for Voice Channels Failed! Missing permissions!
            `);
          }

          await ms.edit(`Setup initialized!
Role initialized!
Setting Permissions for Categories
Setting Permissions for Text Channels
Setting Permissions for Voice Channels
          `);

          try {
            message.guild.channels.forEach(async (channel, id) => { // eslint-disable-line
              await channel.overwritePermissions(mutedRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });
            });
          } catch (e) {
            return ms.edit(`Setup initialized!
Initializing Role Failed! Missing permissions!
Setting Permissions for Categories Failed! Missing permissions!
Setting Permissions for Text Channels Failed! Missing permissions!
Setting Permissions for Voice Channels Failed! Missing permissions!
            `);
          }

          await ms.edit(`Setup initialized!
Role initialized!
Permissions for Categories have been set!
Permissions for Text Channels have been set!
Permissions for Voice Channels have been set!

'Muted' role is ready!
          `);


        } else {
          return reply("Invalid choice or prompt, timed out. Aborted.");
        }
      } else {
        try {
          const ms = await reply("Unpacking setup of 'Muted' role.");

          await ms.edit(`Initializing setup...
Initializing Role
Setting Permissions for Categoris
Setting Permissions for Text Channels
Setting Permissions for Voice Channels
          `);

          await ms.edit(`Setup initialized!
Initializing Role...
Setting Permissions for Categories
Setting Permissions for Text Channels
Setting Permissions for Voice Channels
          `);

          try {
            mutedRole = await message.guild.roles.create({
              data: {
                name: "Muted",
                color: "#000001",
                permissions: []
              }

            });
          } catch (e) {
            return ms.edit(`Setup initialized!
Initializing Role Failed! Missing permissions!
Setting Permissions for Categories Failed! Missing permissions!
Setting Permissions for Text Channels Failed! Missing permissions!
Setting Permissions for Voice Channels Failed! Missing permissions!
            `);
          }

          await ms.edit(`Setup initialized!
Role initialized!
Setting Permissions for Categories
Setting Permissions for Text Channels
Setting Permissions for Voice Channels
          `);

          try {
            message.guild.channels.forEach(async (channel, id) => { // eslint-disable-line
              await channel.overwritePermissions(mutedRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });
            });
          } catch (e) {
            return ms.edit(`Setup initialized!
Initializing Role Failed! Missing permissions!
Setting Permissions for Categories Failed! Missing permissions!
Setting Permissions for Text Channels Failed! Missing permissions!
Setting Permissions for Voice Channels Failed! Missing permissions!
            `);
          }

          await ms.edit(`Setup initialized!
Role initialized!
Permissions for Categories have been set!
Permissions for Text Channels have been set!
Permissions for Voice Channels have been set!

The 'Muted' role is now ready!
          `);
        } catch (e) {
          console.log(e.stack);
        }
      }
    } else {
      return reply("Only available options for this commands are: `mutedrole`.");
    }
  }
}

module.exports = Setup;
