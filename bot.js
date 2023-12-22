const Discord = require('discord.js');
const { EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds, //Accès aux informations des serveurs
      GatewayIntentBits.GuildMembers, //Accès aux messages du serveur
      GatewayIntentBits.GuildMessages,// Accès aux messages du serveur
      GatewayIntentBits.MessageContent,// Accès au contenu des messages du serveur
    ],
});


// Logs channel ID
const logsChannelId = '1137785534215897281';

// Function to create embed
function createEmbedForGuildMember(author, description, color, footerText, thumbnailUrl) {
  return new EmbedBuilder()
    .setColor(color)
    .setTimestamp()
    .setAuthor({ name: author.username, iconURL: author.avatarURL() })
    .setThumbnail(thumbnailUrl)
    .addFields({ name: " ", value: description })
    .setFooter({ text: footerText });
}

// Event Ready (let know if bot is running)
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Event message is deleted
client.on('messageDelete', (message) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    const embed = createEmbed(message.author, `${message.author} *deleted in* ${message.channel}`, "Red", `Message ID: ${message.id}`);
    logsChannel.send({ embeds: [embed] }).catch(console.error);
  }
});

// Event when message is updated
client.on('messageUpdate', (oldMessage, newMessage) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  
  if (newMessage.content.includes("discord.gg/") || newMessage.content.includes('discordapp.com/invite/')) {
    newMessage.delete().catch(console.error);
    newMessage.channel.send("**:warning: Link deleted :warning:**\n **Invite links are not permitted on this server**")
  }

  if (logsChannel) {
    const embed = createEmbed(oldMessage.author, `${oldMessage.author} *modified in* ${oldMessage.channel}\n${oldMessage.content} --> ${newMessage.content}`, "Blue", `Message ID: ${oldMessage.id}`);
    logsChannel.send({ embeds: [embed] }).catch(console.error);
  }
});

// Event when member joins server
client.on('guildMemberAdd', (member) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    const joinDescription = `**Member:** ${member.user.tag}\n**Joined at:** ${member.joinedAt.toDateString()}\n**Member ID:** ${member.id}`;
    const joinEmbed = createEmbedForGuildMember(member.user, joinDescription, "Green", `Member Joined`, member.user.avatarURL());
    logsChannel.send({ embeds: [joinEmbed] }).catch(console.error);
  }
});

// Event when member leaves server
client.on('guildMemberRemove', (member) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (logsChannel) {
    const leaveDescription = `**Member:** ${member.user.tag}\n**Left at:** ${new Date().toDateString()}\n**Member ID:** ${member.id}`;
    const leaveEmbed = createEmbedForGuildMember(member.user, leaveDescription, "Red", `Member Left`, member.user.avatarURL());
    logsChannel.send({ embeds: [leaveEmbed] }).catch(console.error);
  }
});

// Event when member is updated (added or deleted role)
client.on('guildMemberUpdate', (oldMember, newMember) => {
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
  const logsChannel = client.channels.cache.get(logsChannelId);

  addedRoles.forEach(role => {
    if (logsChannel) {
      logsChannel.send(`[Role Added] ${newMember.user}: ${role.name}`).catch(console.error);
    }
  });

  removedRoles.forEach(role => {
    if (logsChannel) {
      logsChannel.send(`[Role Removed] ${newMember.user}: ${role.name}`).catch(console.error);
    }
  });
});

// Event checkDiscordInvite then remove and warn users 
client.on('messageCreate', (message) => {
  const logsChannel = client.channels.cache.get(logsChannelId);
  if (message.content.includes("discord.gg") || message.content.includes('discordapp.com/invite/')) {
    message.delete().catch(console.error);
    message.channel.send("**:warning: Link deleted :warning:**\n **Invite links are not permitted on this server**")

    if (logsChannel) {
      const embed = createEmbed(message.author, `${message.author} *sent in* ${message.channel}\n${message.content}`, "Blue", `Message ID: ${message.id}`);
      logsChannel.send({ embeds: [embed] }).catch(console.error);
    }
  }
});

client.login(''); 
