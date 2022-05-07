const { MessageEmbed, MessageAttachment } = require("discord.js");
const e = require("../../base/emotki.json");
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont('./font.ttf', { family: 'Mukta' })

module.exports = {
  name: "rank",
  aliases: ["level", "lvl"],
  category: "leveling",
  description: "Wyświetla level użytkownika",
  run: async (client, message, args) => {
    const baza = client.db
      .prepare("SELECT *, ROW_NUMBER() OVER(ORDER BY level ASC) AS rank FROM leveling WHERE guild_id = ? AND user_id = ?")
      .get(message.guild.id, message.author.id);

    let currentLevel, currentXp, currentRank, allXP;
    if (!baza || !baza.user_id) {
      currentLevel = 1;
      currentXp = 0;
      currentRank = message.guild.memberCount;
      allXP = 0
    } else {
      currentLevel = baza.level;
      currentXp = baza.currentXP;
      currentRank = baza.rank;
      allXP = baza.allXP + currentXp;
    }

    const nextLevel = 3000 * (Math.pow(2, currentLevel) - 1);
    const canvas = createCanvas(1000, 300);
    const ctx = canvas.getContext("2d");
    const barWidth = 600;
    const background = await loadImage(
      "https://images-ext-1.discordapp.net/external/-htv_9G1ZObROx7QEoxua22kFnM5hWzngr-kneBnlHE/https/images4.alphacoders.com/909/thumb-1920-909912.png?width=1095&height=616"
    );
    const avatar = await loadImage(
      message.author.displayAvatarURL({ format: "png", dynamic: false })
    );

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.lineJoin = "round";
    ctx.lineWidth = 30;

    ctx.strokeStyle = "#323031";
    ctx.strokeRect(330, 50, barWidth, 0);



    ctx.fillStyle = "#32303196";
    ctx.fillRect(30, 0, 220, canvas.height);


    ctx.fillStyle = "#32303196";
    ctx.fillRect(300, 200, canvas.width - 350, 70);

    ctx.lineJoin = "round";
    ctx.fillStyle = "#323031";
    ctx.fillRect(30, 230, 220, 50);

    ctx.font = "bold 30px Mukta";

    ctx.fillStyle = "#dc143c";
    ctx.textAlign = "center";

    ctx.fillText(`${allXP} xp`, 130, 265, 350);

    ctx.strokeStyle = "#dc143c";
    ctx.strokeRect(330, 50, (barWidth * currentXp) / nextLevel, 0);

    ctx.font = "bold 50px Mukta";
    ctx.fillStyle = "#dc143c";
    ctx.textAlign = "center";
    ctx.fillText(`${currentLevel}`, 850, canvas.height - 50, 200);

    ctx.font = "bold 50px Mukta";
    ctx.fillStyle = "#dc143c";
    ctx.textAlign = "center";
    ctx.fillText(`#${currentRank}`, 500, canvas.height - 50, 200);

    ctx.fillStyle = "white";
    ctx.font = "bold 50px Mukta";
    ctx.fillText("RANK", 400, canvas.height - 50, 200);
    ctx.fillText("LEVEL", 750, canvas.height - 50, 200);
    
    ctx.font = "30px Mukta";
    ctx.fillStyle = "#dc143c";
    ctx.textAlign = "center";
    ctx.fillText(`${currentXp} / ${nextLevel} xp`, 850, 30, 200);

    ctx.font = "30px Mukta";
    ctx.fillStyle = "#dc143c";
    ctx.textAlign = "center";
    ctx.fillText(`${message.author.tag}`, 400, 30, 200);


    ctx.beginPath();
    ctx.arc(140, 120, 80, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#323031";
    ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(200, 200, 50, 0, 2 * Math.PI);
    // ctx.lineWidth = 5;
    // ctx.fillStyle = "green";
    // ctx.fill();

    ctx.beginPath();
    ctx.arc(140, 120, 80, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 10, 10, 220, 200);

    const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");
    return message.reply({
      allowedMentions: { repliedUser: false },
      files: [attachment],
    });
  },
};
