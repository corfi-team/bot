const {
  MessageEmbed,
  WebhookClient,
  MessageButton,
  MessageActionRow,
} = require(`discord.js`);
const { readFileSync } = require("fs");
const emotki = require("./../base/emotki.json");
const moment = require("moment-timezone");

exports.run = async (client, message, args) => {
  try {
    if (!message && !message.guild && !message.author && message.webhookID) return 

    if (message.partial) await message.fetch();
    const baza = client.db
      .prepare("SELECT autopubliker FROM serwer WHERE guild_id = ?")
      .get(message.guild.id);
    if (
      baza &&
      baza?.autopubliker === "on" &&
      baza?.autopubliker != null &&
      message.channel.type === "GUILD_NEWS"
    ) {
      if (message.content && !message.embeds) return message.crosspost();
    }

    if (message.author.bot) return

    const guild_gban = client.db
      .prepare("SELECT * FROM gbans WHERE id = ?")
      .get(message.guild.id);
    if (guild_gban) return;

    const author_gban = client.db
      .prepare("SELECT * FROM gbans WHERE id = ?")
      .get(message.author.id);
    if (author_gban) return;
    else if (
      client.tb.break === true &&
      !client.config.devs.includes(message.author.id)
    )
      return;

    const prefix =
      client.db
        .prepare("SELECT prefix FROM serwer WHERE guild_id = ?")
        .get(message.guild.id)?.prefix || "%";

    if (
      message.content === `<@!${client.user.id}>` ||
      message.content === `<@${client.user.id}>`
    )
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(client.config.color)
            .addField(
              `\`🔔\` Pong!`,
              `\`\`\`yaml\nPrefix bota na tym serwerze ${prefix}\nSpis komend bota ${prefix}help\n\`\`\``
            )
            .setFooter({
              text: `${client.user.tag}`,
              iconURL: client.user.displayAvatarURL({}),
            }),
        ],
      });
    else if (!message.content.startsWith(prefix)) {

      const bazaLVL = client.db
        .prepare(
          "SELECT allXP, currentXP, level, user_id FROM leveling WHERE user_id = ? AND guild_id = ?"
        )
        .get(message.author.id, message.guild.id);
      if (!bazaLVL || !bazaLVL.user_id) {
        client.db
          .prepare(
            "INSERT INTO leveling(currentXP, level, user_id, guild_id) VALUES(?,?,?,?)"
          )
          .run(3, 1, message.author.id, message.guild.id);
      } else {
        const xp = bazaLVL.currentXP;
        const nxtLvl = 3000 * (Math.pow(2, bazaLVL.level) - 1);
        if (xp + 3 >= nxtLvl) {
          message.channel.send("LEVEL UP!");
          client.db
            .prepare(
              "UPDATE leveling SET currentXP = ?, level = ?, allXP = ? WHERE guild_id = ? AND user_id = ?"
            )
            .run(
              0,
              bazaLVL.level + 1,
              bazaLVL.allXP + bazaLVL.currentXP + 3,
              message.guild.id,
              message.author.id
            );
        } else {
          client.db
            .prepare(
              "UPDATE leveling SET currentXP = ? WHERE guild_id = ? AND user_id = ?"
            )
            .run(xp + 3, message.guild.id, message.author.id);
        }
      }

      const basa = client.db
        .prepare("SELECT * FROM automod WHERE guild_id = ?")
        .get(message.guild.id);
      if (basa) {
        if (basa?.antylink && basa?.antylink === "on") {
          if (
            message.content.includes(`https://`) ||
            message.content.includes(`http://`) ||
            message.content.includes(`discord.gg/`)
          ) {
            let status = false;

            if (basa?.antylink_channel != null) {
              const channels = basa.antylink_channel.split(";");

              channels.forEach((channel) => {
                if (message.channel.id === channel) status = true;
              });
            }
            if (status === true) return;
            else {
              if (basa?.antylink_roles != null) {
                const roles = basa.antylink_roles.split(";");

                await message.guild.roles.fetch();

                roles.forEach((role) => {
                  if (message.member._roles.includes(role)) status = true;
                });
              }

              if (status === true) return;
              else {
                message.delete();

                if (basa?.antylink_kara && basa?.antylink_kara != null) {
                  const user = message.member;
                  if (basa.antylink_kara === "ban") {
                    if (!message.guild.me.permissions.has("BAN_MEMBERS"))
                      return;
                    if (!user.bannable) return;
                    user.ban({
                      reason: `Moderator ${
                        client.user.tag
                      } zbanował za wysłanie linku! ・ ${moment()
                        .tz("Poland")
                        .format("DD.MM.YYYY, HH:mm")} (Automod)`,
                    });
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie zbanowałem ${message.member} za: \n\`\`\`diff\n- Wysłanie linku!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  } else if (basa.antylink_kara === "kick") {
                    if (!message.guild.me.permissions.has("KICK_MEMBERS"))
                      return;
                    if (!user.kickable) return;
                    user.kick({
                      reason: `Moderator ${
                        client.user.tag
                      } wyrzucił za wysłanie linku! ・ ${moment()
                        .tz("Poland")
                        .format("DD.MM.YYYY, HH:mm")} (Automod)`,
                    });
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie wyrzucono ${message.member} za: \n\`\`\`diff\n- Wysłanie linku!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  } else if (basa.antylink_kara === "mute") {
                    if (!message.guild.me.permissions.has("MUTE_MEMBERS"))
                      return;
                    if (!user.moderatable) return;
                    const czas = 10800000;
                    const powud = `Moderator ${
                      client.user.tag
                    } wyciszono za wysłanie linku! ・ ${moment()
                      .tz("Poland")
                      .format("DD.MM.YYYY, HH:mm")} (Automod)`;
                    user.timeout(czas, powud);
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie wyciszono ${message.member} za: \n\`\`\`diff\n- Wysłanie linku!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  } else if (basa.antylink_kara === "warn") {
                    client.db
                      .prepare(
                        "INSERT INTO warns(user_id, mod_id, guild_id, reason) VALUES(?,?,?,?)"
                      )
                      .run(
                        user.id,
                        `${client.user.id}`,
                        message.guild.id,
                        `Wysłanie linku! ・ ${moment()
                          .tz("Poland")
                          .format("DD.MM.YYYY, HH:mm")} (Automod)`
                      );
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie zwarnowano ${message.member} za: \n\`\`\`diff\n- Wysłanie linku!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  }
                }
                return;
              }
            }
          }
        }

        if (basa?.antybadwords && basa?.antybadwords === "on") {
          let bw2 = require('washyourmouthoutwithsoap')
          let msg = bw2.check('pl', message.content)

            let status = false;

            if (basa?.antyping_channel != null) {
              const channels = basa.antyping_channel.split(";");

              channels.forEach((channel) => {
                if (message.channel.id === channel) status = true;
              });
            }
            if (status === true) return;
            else {
              if (basa?.antyping_role != null) {
                const roles = basa.antyping_role.split(";");

                await message.guild.roles.fetch();

                roles.forEach((role) => {
                  if (message.member._roles.includes(role)) status = true;
                });
              }
            }

          if (status = false) {

              if (msg) {

                message.delete()
  
                if (basa?.antybadwords_kara != null) {
                  switch (basa?.antybadwords_kara) {
                case "kick": {
                  if (!message.guild.me.permissions.has("KICK_MEMBERS") && !user.kickable) return
  
                  user.kick({reason: `Moderator ${client.user.tag} wyrzucił za przekleństwa! ・ ${moment().tz("Poland").format("DD.MM.YYYY, HH:mm")} (Automod)`,})
                  
                  return message.channel.send({
                    embeds: [
                      new MessageEmbed()
                        .setDescription(
                          `>>> ${message.member} Użył wulgaryzmu. Zostaje on wyrzucony`
                        )
                        .setColor("RED"),
                    ],
                  })
                }
  
                case "ban": {
                  if (!message.guild.me.permissions.has("BAN_MEMBERS") && !user.bannable) return
                  user.ban({reason: `Moderator ${client.user.tag} zbanował za przekleńswa! ・ ${moment().tz("Poland").format("DD.MM.YYYY, HH:mm")} (Automod)`,});
  
                  return message.channel.send({
                    embeds: [
                      new MessageEmbed()
                        .setDescription(
                          `>>> ${message.member} Użył wulgaryzmu. Zostaje on zbanowany`
                        )
                        .setColor("RED"),
                    ],
                  });
                }
                case "mute": {
                  if (!message.guild.me.permissions.has("MUTE_MEMBERS") && !user.moderatable) return
                  const czas = 10800000;
                  message.member.id.timeout(czas, `Moderator ${client.user.tag} wyciszono za wysłanie przekleństw! ・ ${moment().tz("Poland").format("DD.MM.YYYY, HH:mm")} (Automod)`);
    
                  return message.channel.send({
                    embeds: [
                      new MessageEmbed()
                        .setDescription(
                          `>>> ${message.member} Użył wulgaryzmu. Został on wyciszony`
                        )
                        .setColor("RED"),
                    ],
                  });
                }
                case 'warn': {
                  client.db.prepare("INSERT INTO warns(user_id, mod_id, guild_id, reason) VALUES(?,?,?,?)").run(message.member.id, `${client.user.id}`, message.guild.id, `Wysłanie przekleństwa! ・ ${moment().tz("Poland").format("DD.MM.YYYY, HH:mm")} (Automod)`);
    
                  message.channel.send({
                    embeds: [
                      new MessageEmbed()
                        .setDescription(
                          `>>> ${message.member} Użył wulgaryzmu. Został on ostrzezony`
                        )
                        .setColor("RED"),
                    ],
                  });
  
                }
                  }
                }
              }
          }
        }

        if (basa?.antyping && basa?.antyping === "on") {
          const member_ping = basa?.antyping_ping_member || 3;
          const roles_ping = basa?.antyping_ping_role || 3;
          if (
            message.mentions.members.size >= member_ping ||
            message.mentions.roles.size >= roles_ping
          ) {
            let status = false;

            if (basa?.antyping_channel != null) {
              const channels = basa.antyping_channel.split(";");

              channels.forEach((channel) => {
                if (message.channel.id === channel) status = true;
              });
            }
            if (status === true) return;
            else {
              if (basa?.antyping_role != null) {
                const roles = basa.antyping_role.split(";");

                await message.guild.roles.fetch();

                roles.forEach((role) => {
                  if (message.member._roles.includes(role)) status = true;
                });
              }

              if (status === true) return;
              else {
                message.delete();

                if (basa?.antyping_kara && basa?.antyping_kara != null) {
                  const user = message.member;
                  if (basa.antyping_kara === "ban") {
                    if (!message.guild.me.permissions.has("BAN_MEMBERS"))
                      return;
                    if (!user.bannable) return;
                    user.ban({
                      reason: `Moderator ${
                        client.user.tag
                      } zbanował za pingowanie! ・ ${moment()
                        .tz("Poland")
                        .format("DD.MM.YYYY, HH:mm")} (Automod)`,
                    });
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie zbanowałem ${message.member} za: \n\`\`\`diff\n- Pingowanie!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  } else if (basa.antyping_kara === "kick") {
                    if (!message.guild.me.permissions.has("KICK_MEMBERS"))
                      return;
                    if (!user.kickable) return;
                    user.kick({
                      reason: `Moderator ${
                        client.user.tag
                      } wyrzucił za pingowanie! ・ ${moment()
                        .tz("Poland")
                        .format("DD.MM.YYYY, HH:mm")} (Automod)`,
                    });
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie wyrzucono ${message.member} za: \n\`\`\`diff\n- Pingowanie!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  } else if (basa.antyping_kara === "mute") {
                    if (!message.guild.me.permissions.has("MUTE_MEMBERS"))
                      return;
                    if (!user.moderatable) return;
                    const czas = 10800000;
                    const powud = `Moderator ${
                      client.user.tag
                    } wyciszono za pingowanie! ・ ${moment()
                      .tz("Poland")
                      .format("DD.MM.YYYY, HH:mm")} (Automod)`;
                    user.timeout(czas, powud);
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie wyciszono ${message.member} za: \n\`\`\`diff\n- Pingowanie!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  } else if (basa.antyping_kara === "warn") {
                    client.db
                      .prepare(
                        "INSERT INTO warns(user_id, mod_id, guild_id, reason) VALUES(?,?,?,?)"
                      )
                      .run(
                        user.id,
                        `${client.user.id}`,
                        message.guild.id,
                        `Pingowanie! ・ ${moment()
                          .tz("Poland")
                          .format("DD.MM.YYYY, HH:mm")} (Automod)`
                      );
                    return message.channel.send({
                      embeds: [
                        new MessageEmbed()
                          .setDescription(
                            `>>> ${emotki.tak} Pomyślnie zwarnowano ${message.member} za: \n\`\`\`diff\n- Pingowanie!\n\`\`\``
                          )
                          .setColor("GREEN"),
                      ],
                    });
                  }
                }
                return;
              }
            }
          }
        }
      }

      const base = client.db
        .prepare("SELECT channel_suggest FROM suggestions WHERE guild_id = ?")
        .get(message.guild.id);
      if (
        base &&
        base.channel_suggest &&
        message.channel.id === base.channel_suggest
      ) {
        const channel = message.guild.channels.cache.get(base.channel_suggest);

        const typ = client.db
          .prepare("SELECT * FROM suggestions WHERE guild_id = ?")
          .get(message.guild.id);
        if (!channel)
          return client.db
            .prepare(
              "UPDATE suggestions SET channel_suggest = ? WHERE guild_id = ?"
            )
            .run(null, message.guild.id);
        else if (typ.roles && message.member.roles.cache.get(typ.roles)) return;
        else if (!message.content || message.content.length === 0) return;
        else if (message.content.startsWith("^")) {
          if (typ.typ === "1") {
            message.delete();
            return message.channel
              .createWebhook(`Komentarz od : ${message.author.tag}`, {
                avatar: message.author.displayAvatarURL({}),
              })
              .then(async (wehbook) => {
                wehbook.send({
                  content: `${message.content.replace("^", "")}`,
                });
                await wehbook.delete();
              });
          }
        } else {
          const messageAttachment = message.attachments.first();
          const embed = new MessageEmbed()
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL({}),
            })
            .setColor("2f3136")
            .setDescription(message.content)
          if (typ.typ === "1") {
            embed.setFooter({
              text: "Żeby skomentować użyj ^komentarz",
              iconURL: message.author.displayAvatarURL({}),
            });
          } else if (messageAttachment)
            embed.setImage(messageAttachment.proxyURL);

          message.channel
            .createWebhook(`Propozycja od: ${message.author.tag}`, {
              avatar: message.author.displayAvatarURL({}),
            })
            .then(async (wehbook) => {
              await wehbook.send({ embeds: [embed] }).then((x) => {
                x.react(emotki.yes);
                x.react(emotki.nwm);
                x.react(emotki.not);
                if (typ.typ === "2") {
                  x.startThread({
                    name: "Komentarze 📣",
                    autoArchiveDuration: 60,
                  });
                }
              });
              await wehbook.delete();
              message.delete();
            })
            .catch((err) => console.log(err));
        }
      }

      const memeszki = client.db
        .prepare("SELECT channel_mems FROM serwer WHERE guild_id = ?")
        .get(message.guild.id);
      if (
        memeszki &&
        memeszki.channel_mems &&
        message.channel.id === memeszki.channel_mems
      ) {
        if (message.channel.id != memeszki.channel_mems) return;
        else {
          let messageAttachment = message.attachments.first();

          if (
            message.content.endsWith(".png") ||
            message.content.endsWith(".jpg") ||
            message.content.endsWith(".jpeg") ||
            message.content.endsWith(".gif") ||
            message.content.endsWith(".mp3") ||
            message.content.endsWith(".mp4") ||
            message.content.endsWith(".webp")
          ) {
            message.react(`👍`);
            message.react(`👎`);
          } else if (messageAttachment) {
            message.react(`👍`);
            message.react(`👎`);
          } else return;
        }
      }

      let topka = client.db.prepare(`SELECT * FROM top_settings WHERE (guild_id) = (?)`).get(message.guild.id);

      if (topka?.top_on != null && topka?.top_on === 'on') {
          let i = client.db.prepare(`SELECT ilosc FROM top WHERE (user_id, guild_id) = (?,?)`).get(message.author.id, message.guild.id);
          if (i) {
            client.db.prepare('UPDATE top SET ilosc = ? WHERE user_id = ? AND guild_id = ?').run(i.ilosc + 1 , message.author.id, message.guild.id);
          } else {
            client.db.prepare(`INSERT INTO top(user_id, ilosc, guild_id) VALUES(?,?,?)`).run(message.author.id, 1, message.guild.id);
          }
  
          let o = client.db.prepare(`SELECT ilosc_channel FROM top WHERE (channel_id, guild_id) = (?,?)`).get(message.channel.id, message.guild.id);
          if (o) {
            client.db.prepare('UPDATE top SET ilosc_channel = ? WHERE channel_id = ? AND guild_id = ?').run(o.ilosc_channel + 1 , message.channel.id, message.guild.id);
          } else { 
            client.db.prepare(`INSERT INTO top(channel_id, ilosc_channel, guild_id) VALUES(?,?,?)`).run(message.channel.id, 1, message.guild.id);
          }

          let k = client.db.prepare(`SELECT user_global_ilosc FROM top WHERE (user_global_id) = (?)`).get(message.author.id);
          if (k) {
            client.db.prepare('UPDATE top SET user_global_ilosc = ? WHERE user_global_id = ?').run(k.user_global_ilosc + 1 , message.author.id);
          } else { 
            client.db.prepare(`INSERT INTO top(user_global_id, user_global_ilosc) VALUES(?,?)`).run(message.author.id, 1);
          }
      }

    } else {
      if (client.cooldown_5sec.has(message.author.id))
        return message.react("⏰");
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      if (!cmd || cmd.length == 0) return;
      const command =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
      if (!command) return;
      else return command.run(client, message, args);
    }
  } catch (err) {
    console.log(err);
    embed = new MessageEmbed()
      .setColor("#ff3042")
      .setTitle(`Błąd w event Message`)
      .setDescription(`\`\`\`js\n${err}\n\`\`\``);
    return client.channels.cache
      .get(client.config.error)
      .send({ ephemeral: true, embeds: [embed] });
  }
};
