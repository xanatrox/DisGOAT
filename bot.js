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
const logsChannelId = '1137785534215897281';


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
      .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()})
      .setThumbnail(message.author.avatarURL())
      .addFields(
        {name: "*Message sent by : *" , value: `${message.author} *deleted in* ${message.channel}`, inline: true},
        {name : " ", value: `${message.content}`},
      )      
      .setFooter({text: `Message ID: ${message.id}`});

    logsChannel.send({embeds: [embed]});
  }
});


// Event messageUpdate 
client.on('messageUpdate', (oldMessage, newMessage) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    const embed= new EmbedBuilder()
      .setColor("Blue")
      .setTimestamp()
      .setAuthor({name: oldMessage.author.username, iconURL: oldMessage.author.avatarURL()})
      .setThumbnail(oldMessage.author.avatarURL())
      .addFields(
        {name: "*Message modified by : *" , value: `${oldMessage.author} *modified in* ${oldMessage.channel}`, inline: true},
        {name : " ", value: `${oldMessage.content} --> ${newMessage.content} `},
      )      
      .setFooter({text: `Message ID: ${oldMessage.id}`});

    logsChannel.send({embeds: [embed]});
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


// Event checkDiscordInvite then remove and warn users 
client.on('message',(message) => {

  const logsChannel = client.channels.cache.get(logsChannelId);
  if (message.content.includes("discord.gg/") || message.content.includes('discordapp.com/invite/')) {
    message.delete()
    message.channel.send("Link deleted \n **Invite links are not permitted on this server**")
  }
});



// Bot connexion
client.login('');