const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("abood_tameme#0001");
});

app.listen(port, () => {
});

const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
const Database = require('st.db')
const db = new Database({path:'log.json'})
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
            ]
});
const logs = require('discord-logs');
logs(client, {
    debug: true
});
client.on('ready', async() => {
console.log(`Hello my name is : ${client.user.username}
Created by : Drukindn#6157`)
client.user.setPresence({
        status: "online",
        activities: [{ name: `!help`, type: "PLAYING"}]
});
});
client.on("messageCreate", async(message) => {
  let prefix = await db.fetch(`${message.guild.id}.prefixe`)
if(!prefix) prefix = "!"
        if(message.content.startsWith(prefix + "setprefix")){
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.react(`❌`)
        var prefixe = message.content.split(" ").slice(1).join(" ")
        if(!prefixe) return message.react(`❌`)
        message.react(`✅`).then(() => {
            db.set(`${message.guild.id}.prefixe`, prefixe)
        })
        }})

client.on("messageCreate", async(message) => {
  let prefix = await db.fetch(`${message.guild.id}.prefixe`)
if(!prefix) prefix = "!"
        if(message.content.startsWith(prefix + "removelog")){
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.react(`❌`)
                db.delete(`log_${message.guild.id}`)
               message.react('✅');
    }})

client.on("messageCreate", async(message) => {
  let prefix = await db.fetch(`${message.guild.id}.prefixe`)
if(!prefix) prefix = "!"
        if(message.content.startsWith(prefix + "setlog")){
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.react(`❌`)
        const args = message.content.split(" ").slice(1).join(" ")
        let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[1])
            if (!channel || channel.type !== 'GUILD_TEXT') return message.react('❌');
                if(!channel) return message.react('❌');
                db.set(`log_${message.guild.id}`, channel.id)
               message.react('✅');
    }})
        
client.on("messageCreate", async(message) => {
  const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.gg/pgZDvw7C2A`)
                .setLabel('HEKU')
            )
  let prefix = await db.fetch(`${message.guild.id}.prefixe`)
if(!prefix) prefix = "!"
        if(message.content.startsWith(prefix + "help")){
const embed = new MessageEmbed()
	.setColor('2f3136')
	.setAuthor({ name: `${message.guild.name}`})
	.setDescription(`**${prefix}setprefix | 
  ${prefix}setlog | 
  ${prefix}removelog | 
  https://discord.gg/pgZDvw7C2A**`)
	.setTimestamp()

message.channel.send({ embeds: [embed], components: [row] });
    }})

client.on("guildChannelPermissionsUpdate", async(channel, oldPermissions, newPermissions, member) => {
  let ch = channel.guild.channels.cache.get(await db.fetch(`log_${channel.guild.id}`));
  if (!ch) return;
  channel.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
            const embed = new MessageEmbed()
            .setTitle('права обновлены')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Названия канала : ', `\`${channel.name}\` ${newPermissions}`)
            .setTimestamp()
            .addField('Обновил : ', `<@${memberid}> (${memberid})`)

  ch.send({embeds: [embed]});
});
});

client.on("guildChannelTopicUpdate", async(channel, oldTopic, newTopic) => {
  let ch = channel.guild.channels.cache.get(await db.fetch(`log_${channel.guild.id}`));
  if (!ch) return;
  channel.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed1 = new MessageEmbed()
            .setTitle('Изменение темы')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Название канала : ', `\`${channel.name}\``)
            .addField('Старая тема : ', `\`${oldTopic}\``)
            .addField('Новая тема : ', `\`${newTopic}\``)
            .setTimestamp()
            .addField('обновлено : ', `<@${memberid}> (${memberid})`)

  ch.send({embeds: [embed1]});
});
});



client.on("guildMemberBoost", async(member, channel) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed2 = new MessageEmbed()
            .setTitle('Новый бустер')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('бустанул : ', `<@${member.user.id}> \`(${member.user.id})\``)
            .setTimestamp()

  ch.send({embeds: [embed2]});
});
});

client.on("guildMemberUnboost", async(member) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed3 = new MessageEmbed()
            .setTitle('Буст отняли((')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('забрал : ', `<@${member.user.id}> \`(${member.user.id})\``)
            .setTimestamp()
              ch.send({embeds: [embed3]});
});
});

client.on("guildMemberRoleAdd", async(member, role) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed4 = new MessageEmbed()
            .setTitle('Роль обновлена')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Добавление роли участника : ', `<@${member.user.id}>`)
            .addField('Роль: ', `<@&${role.id}> \`${role.id}\``)
            .setTimestamp()
            .addField('обновлено : ', `<@${memberid}> (${memberid})`)

  ch.send({embeds: [embed4]});
});
});

client.on("guildMemberRoleRemove", async(member, role) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed5 = new MessageEmbed()
            .setTitle('Роль обновлена')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Роль участника удалить : ', `<@${member.user.id}>`)
            .addField('Role : ', `<@&${role.id}> \`${role.id}\``)
            .setTimestamp()
            .addField('обновлено : ', `<@${memberid}> (${memberid})`)

  ch.send({embeds: [embed5]});
});
});

client.on("guildMemberNicknameUpdate", async(member, oldNickname, newNickname) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed6 = new MessageEmbed()
            .setTitle('Псевдоним обновлен')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Старый ник участника : ', `\`${oldNickname}\` <@${member.user.id}>`)
            .addField('Новый ник участника: ', `\`${newNickname}\``)
            .setTimestamp()
            .addField('обновлено : ', `<@${memberid}> (${memberid})`)

  ch.send({embeds: [embed6]});
});
});

client.on("guildMemberEntered", async(member) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed6 = new MessageEmbed()
            .setTitle('Новый человек')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('чел присоединиться : ', `<@${member.user.id}> \`${member.user.id}\``)
            .addField('Возраст аккаунта : ', `${moment(member.user.createdAt).format(`**<t:${parseInt(member.user.createdAt / 1000)}:R>**`)}`)
            .setTimestamp()

  ch.send({embeds: [embed6]});
});
});



client.on("guildBoostLevelUp", async(guild, oldLevel, newLevel) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
  const embed8 = new MessageEmbed()
            .setTitle('Повышение уровня вверх')
            .setColor('2f3136')
            .setThumbnail(guild.guild.iconURL({ dynamic: true }))
            .addField('старый уровень повышения : ', `\`${oldLevel}\``)
            .addField('новый уровень повышения : ', `\`${newLevel}\``)
            .setTimestamp()

  ch.send({embeds: [embed8]});
});

client.on("guildBoostLevelDown", async(guild, oldLevel, newLevel) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
  const embed9 = new MessageEmbed()
            .setTitle('Повышение уровня вниз')
            .setColor('2f3136')
            .setThumbnail(guild.guild.iconURL({ dynamic: true }))
            .addField('старый уровень повышения : ', `\`${oldLevel}\``)
            .addField('новый уровень повышения : ', `\`${newLevel}\``)
            .setTimestamp()

  ch.send({embeds: [embed9]});
});

client.on("guildBannerAdd", async(guild, bannerURL) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
        guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Баннер добавить')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('баннерURL : ', `\`${bannerURL}\``)
            .addField('by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("guildAfkChannelAdd", async(guild, afkChannel) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
        guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Афк канал добавить')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Название канала : ', `<#${afkChannel.id}> \`${afkChannel.name}\``)
            .addField('by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("guildVanityURLAdd", async(guild, vanityURL) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
        guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Добавить персональный URL')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Тщеславие URL : ', `https://discord.gg/${vanityURL}`)
            .addField('by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("guildVanityURLRemove", async(guild, vanityURL) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
        guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Тщеславный URL удалить')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Тщеславный URL : ', `https://discord.gg/${vanityURL}`)
            .addField('by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("guildVanityURLUpdate", async(guild, oldVanityURL, newVanityURL) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
        guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
            if (!oldVanityURL) return;
  const embed7 = new MessageEmbed()
            .setTitle('Обновление тщеславного URL')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Старый тщеславный URL: ', `https://discord.gg/${oldVanityURL}`)
            .addField('Новый персональный URL : ', `https://discord.gg/${newVanityURL}`)
            .addField('by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("guildFeaturesUpdate", async(oldGuild, newGuild) => {
  let ch = oldGuild.guild.channels.cache.get(await db.fetch(`log_${oldGuild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Обновление функций')
            .setColor('2f3136')
            .setThumbnail(oldGuild.iconURL({ dynamic: true }))
            .setDescription(`**Старые функции :** 
            ${oldGuild.features.join(", ")}

            **Новые особенности :** 
            ${newGuild.features.join(", ")}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildAcronymUpdate", async(oldGuild, newGuild) => {
  let ch = oldGuild.guild.channels.cache.get(await db.fetch(`log_${oldGuild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Обновление аббревиатуры')
            .setColor('2f3136')
            .addField('Старый акроним : ', `${oldGuild.nameAcronym}`)
            .addField('Новый акроним: ', `${newGuild.nameAcronym}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildOwnerUpdate", async(oldGuild, newGuild) => {
  let ch = oldGuild.guild.channels.cache.get(await db.fetch(`log_${oldGuild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('обновление владельца')
            .setColor('2f3136')
            .addField('Старый владелец : ', `<@${oldGuild.owner.id}> (\`${oldGuild.owner.id}\`)`)
            .addField('Новый владелец : ', `<@${newGuild.owner.id}> (\`${newGuild.owner.id}\`)`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildPartnerAdd", async(guild) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Добавить партнера')
            .setColor('2f3136')
            .addField('Имя сервера : ', `${guild.name}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildPartnerRemove", async(guild) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Партнер удалить')
            .setColor('2f3136')
            .addField('Имя сервера : ', `${guild.name}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildVerificationAdd", async(guild) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Добавить подтверждение')
            .setColor('2f3136')
            .addField('Имя сервера : ', `${guild.name}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildVerificationRemove", async(guild) => {
  let ch = guild.guild.channels.cache.get(await db.fetch(`log_${guild.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Проверка удалить')
            .setColor('2f3136')
            .addField('Имя сервера : ', `${guild.name}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});



client.on("messagePinned", async(message) => {
  let ch = message.guild.channels.cache.get(await db.fetch(`log_${message.guild.id}`));
  if (!ch) return;
        message.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Сообщение закреплено')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Message : ', `${message} | [JumpToMessage](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .addField('Pinned by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("messageContentEdited", async(message, oldContent, newContent) => {
  let ch = message.guild.channels.cache.get(await db.fetch(`log_${message.guild.id}`));
  if (!ch) return;
        message.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Сообщение отредактировано')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Старое сообщение : ', `\`\`\`${oldContent}\`\`\``)
            .addField('New message : ', `\`\`\`${newContent}\`\`\` 
            [JumpToMessage](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .addField('Отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});



client.on("guildMemberOffline", async(member, oldStatus) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Статус участника')
            .setColor('2f3136')
            .addField('Член : ', `<@${member.user.id}>`)
            .addField('Новый статус : ', `Offline`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("guildMemberOnline", async(member, newStatus) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Статус участника')
            .setColor('2f3136')
            .addField('Member : ', `<@${member.user.id}>`)
            .addField('Новый статус : ', `${newStatus}`)
            .addField('Старый статус : ', `Offline`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});



client.on("rolePositionUpdate", async(role, oldPosition, newPosition) => {
  let ch = role.guild.channels.cache.get(await db.fetch(`log_${role.guild.id}`));
  if (!ch) return;
        role.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Роль обновлена')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Имя роли : ', `<@&${role.id}> (${role.name})`)
            .addField('Старая позиция : ', `\`\`\`${oldPosition}\`\`\` `)
            .addField('Новая позиция : ', `\`\`\`${newPosition}\`\`\` `)
            .addField('Eотредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("rolePermissionsUpdate", async(role, oldPermissions, newPermissions) => {
  let ch = role.guild.channels.cache.get(await db.fetch(`log_${role.guild.id}`));
  if (!ch) return;
        role.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Роль обновлена')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Имя роли : ', `<@&${role.id}> (${role.name})`)
            .addField('Старое разрешение : ', `\`\`\`${oldPermissions}\`\`\` `)
            .addField('Новое разрешение : ', `\`\`\`${newPermissions}\`\`\` `)
            .addField('Отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});



client.on("voiceChannelSwitch", async(member, oldChannel, newChannel) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
        member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Голосовой канал')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Перемещение пользователя : ', `<@${member.user.id}>`)
            .addField('Старый канал : ', `<#${oldChannel.id}> (${oldChannel.name})`)
            .addField('Новый канал : ', `<#${newChannel.id}> (${newChannel.name})`)
            .addField('Перемещается : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("threadStateUpdate", async(oldThread, newThread) => {
  let ch = oldThread.guild.channels.cache.get(await db.fetch(`log_${oldThread.guild.id}`));
  if (!ch) return;
        oldThread.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление темы')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Название потока : ', `(${newThread.name})`)
            .addField('Тема обновлена : ', `${newThread.archived ? "archived" : "unarchived"}`)
            .addField('Отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("threadNameUpdate", async(thread, oldName, newName) => {
  let ch = thread.guild.channels.cache.get(await db.fetch(`log_${thread.guild.id}`));
  if (!ch) return;
        thread.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление темы')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Старое название темы : ', `(${oldName})`)
            .addField('Старое название темы : ', `(${newName})`)
            .addField('отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("threadLockStateUpdate", async(oldThread, newThread) => {
  let ch = oldThread.guild.channels.cache.get(await db.fetch(`log_${oldThread.guild.id}`));
  if (!ch) return;
        oldThread.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление темы')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Название потока : ', `(${newThread.name})`)
            .addField('Тема обновлена : ', `(${newThread.locked ? "locked" : "unlocked"})`)
            .addField('Отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("threadRateLimitPerUserUpdate", async(thread, oldRateLimitPerUser, newRateLimitPerUser) => {
  let ch = thread.guild.channels.cache.get(await db.fetch(`log_${thread.guild.id}`));
  if (!ch) return;
        thread.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление темы')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Название потока : ', `(${thread.name})`)
            .addField('Медленный режим потока обновлен с : ', `(${oldRateLimitPerUser ? oldRateLimitPerUser : 0})`)
            .addField('Медленный режим потока обновлен до : ', `(${newRateLimitPerUser ? newRateLimitPerUser : 0} seconds)`)
            .addField('Отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("threadAutoArchiveDurationUpdate", async(thread, oldAutoArchiveDuration, newAutoArchiveDuration) => {
  let ch = thread.guild.channels.cache.get(await db.fetch(`log_${thread.guild.id}`));
  if (!ch) return;
        thread.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление темы')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('Название потока: ', `(${thread.name})`)
            .addField('Продолжительность архива темы обновлена ​​с : ', `(${oldAutoArchiveDuration})`)
            .addField('Продолжительность архива темы обновлена ​​до : ', `(${newAutoArchiveDuration})`)
            .addField('Отредактировано : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("userAvatarUpdate", async(user, oldAvatarURL, newAvatarURL) => {
  let ch = user.guild.channels.cache.get(await db.fetch(`log_${user.guild.id}`));
  if (!ch) return;
        user.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление пользователя')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${user.id}> (${user.username})`)
            .addField('Старый аватар пользователя : ', `${oldAvatarURL}`)
            .addField('Новый аватар пользователя : ', `${newAvatarURL}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("userUsernameUpdate", async(user, oldUsername, newUsername) => {
  let ch = user.guild.channels.cache.get(await db.fetch(`log_${user.guild.id}`));
  if (!ch) return;
        user.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление пользователя')
            .setColor('2f3136')
            .addField('имя пользователя: ', `<@${user.id}> (${user.username})`)
            .addField('Старое имя пользователя : ', `${oldUsername}`)
            .addField('Новое имя пользователя : ', `${newUsername}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("userDiscriminatorUpdate", async(user, oldDiscriminator, newDiscriminator) => {
  let ch = user.guild.channels.cache.get(await db.fetch(`log_${user.guild.id}`));
  if (!ch) return;
        user.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление пользователя')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${user.id}> `)
            .addField('Дискриминатор старых пользователей : ', `${oldDiscriminator}`)
            .addField('Новый дискриминатор пользователей : ', `${newDiscriminator}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("userFlagsUpdate", async(user, oldFlags, newFlags) => {
  let ch = user.guild.channels.cache.get(await db.fetch(`log_${user.guild.id}`));
  if (!ch) return;
        user.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление пользователя')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${user.id}>`)
            .addField('Старые пользовательские флаги : ', `${oldFlags}`)
            .addField('Новые пользовательские флаги : ', `${newFlags}`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("voiceChannelJoin", async(member, channel) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Присоединился к голосовому каналу : ', `<#${channel.id}> (${channel.name})`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("voiceChannelLeave", async(member, channel) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канал')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Left voice channel : ', `<#${channel.id}> (${channel.name})`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});

client.on("voiceChannelMute", async(member, muteType) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Mute type : ', `${muteType}`)
            .addField('Muted by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("voiceChannelUnmute", async(member, oldMuteType) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Размьюченый тип : ', `${oldMuteType}`)
            .addField('Размьчен : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("voiceChannelDeaf", async(member, deafType) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('user name : ', `<@${member.id}>`)
            .addField('Deafed type : ', `${deafType}`)
            .addField('Deafed by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("voiceChannelUndeaf", async(member, deafType) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .setThumbnail(memberavatar)
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Undeafed type : ', `${deafType}`)
            .addField('Undeafed by : ', `<@${memberid}>`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("voiceStreamingStart", async(member, voiceChannel) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Старт голосовой трансляции : ', `<#${voiceChannel.id}> (${voiceChannel.name})`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});

client.on("voiceStreamingStop", async(member, voiceChannel) => {
  let ch = member.guild.channels.cache.get(await db.fetch(`log_${member.guild.id}`));
  if (!ch) return;
  member.guild.fetchAuditLogs().then(discordlogs => {
            let memberid = discordlogs.entries.first().executor.id;
            let memberavatar = discordlogs.entries.first().executor.displayAvatarURL({ dynamic: true });
  const embed7 = new MessageEmbed()
            .setTitle('Обновление голосового канала')
            .setColor('2f3136')
            .addField('имя пользователя : ', `<@${member.id}>`)
            .addField('Остановка голосовой трансляции : ', `<#${voiceChannel.id}> (${voiceChannel.name})`)
            .setTimestamp()

  ch.send({embeds: [embed7]});
});
});
client.login("MTAxMTMzODk2NTQxODI0NjE2NA.GppHEB.xLjg4o8QJqFufn-KzW94Zn0uV6WPgzqWodxzz8");