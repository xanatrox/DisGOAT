const Discord = require('discord.js');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { Client, GatewayIntentBits,GuildMember, MessageManager, Guild } = require('discord.js');
const client = new Client({ 
    intents: [
      Discord.GatewayIntentBits.Guilds, // Accès aux informations des serveurs
      Discord.GatewayIntentBits.GuildMembers, // Accès aux informations des membres du serveur
      Discord.GatewayIntentBits.GuildMessages, // Accès aux messages du serveur
      Discord.GatewayIntentBits.MessageContent, // Accès aux messages du serveur
    ],
});


// Logs channel ID
const logsChannelId = '1116013592383336580';


// Event Ready (let know if bot is running)
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Event messageDelete 
client.on('messageDelete', (message) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    const embed= new EmbedBuilder()
      .setColor("Red")
      .setTimestamp()
      .addFields({name:"Author", value: `${message.author}`})
    logsChannel.send({embeds: [embed]});
    //`[Message Deleted] ${message.author}: ${message.content}`
  }
});

// Event messageUpdate 
client.on('messageUpdate', (oldMessage, newMessage) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    logsChannel.send(`[Message Updated] ${oldMessage.author.tag}: ${oldMessage.content} => ${newMessage.content}`);
  }
});

// Event guildMemberAdd 
client.on('guildMemberAdd', (member) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    logsChannel.send(`[Member Joined] ${member.user}`);
  }
});

// Event guildMemberRemove
client.on('guildMemberRemove', (member) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    logsChannel.send(`[Member Left] ${member.user}`);
  }
});

// Event guildMemberUpdate (added or deleted role)
client.on('guildMemberUpdate', (oldMember, newMember) => {
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
  const logsChannel = client.channels.cache.get(logsChannelId);

  addedRoles.forEach(role => {
    if (logsChannel) {
      logsChannel.send(`[Role Added] ${newMember.user}: ${role.name}`);
    }
  });

  removedRoles.forEach(role => {
    if (logsChannel) {
      logsChannel.send(`[Role Removed] ${newMember.user}: ${role.name}`);
    }
  });
  
});

// Event message
client.on('message', (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
  
    // Saves logs in a txt file
    const log = `[${message.guild.name}] ${message.author}: ${message.content}\n`;
    fs.appendFile('logs.txt', log, (err) => {
      if (err) console.error(err);
    });
  });

// Bot connexion
client.login('');