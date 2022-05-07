const config = require("./configv2.json"),
  Discord = require("discord.js"),
  Parser = require("rss-parser"),
  parser = new Parser(),
  Youtube = require("simple-youtube-api"),
  youtube = new Youtube(config.youtubeKey),
  colors = require("colors");

const startAt = Date.now();
const lastVideos = {};

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    "GUILDS",
    "GUILD_BANS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
  ],
});
client.login(config.token).catch(console.log);

client.on("ready", () => {
  console.log(`[!] Ready to listen ${config.youtubers.length} youtubers!`);
  check();
  setInterval(check, 300000);
});

/**
 * Format a date to a readable string
 * @param {Date} date The date to format
 */
function formatDate(date) {
  let monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiej",
    "Sierpnień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  let day = date.getDate(),
    month = date.getMonth(),
    year = date.getFullYear();
  return `${day} ${monthNames[parseInt(month, 10)]} ${year}`;
}

/**
 * Call a rss url to get the last video of a youtuber
 * @param {string} youtubeChannelName The name of the youtube channel
 * @param {string} rssURL The rss url to call to get the videos of the youtuber
 * @returns The last video of the youtuber
 */
async function getLastVideo(youtubeChannelName, rssURL) {
  console.log(colors.yellow(`[${youtubeChannelName}]  | Pobieranie video...`));
  let content = await parser.parseURL(rssURL);
  console.log(
    colors.green(
      `[${youtubeChannelName}]  | Znaleziono ${content.items.length} video`
    )
  );
  let tLastVideos = content.items.sort((a, b) => {
    let aPubDate = new Date(a.pubDate || 0).getTime();
    let bPubDate = new Date(b.pubDate || 0).getTime();
    return bPubDate - aPubDate;
  });
  console.log(
    colors.cyan(
      `[${youtubeChannelName}]  | Ostatnie video: "${
        tLastVideos[0] ? tLastVideos[0].title : "err"
      }"`
    )
  );
  return tLastVideos[0];
}

/**
 * Check if there is a new video from the youtube channel
 * @param {string} youtubeChannelName The name of the youtube channel to check
 * @param {string} rssURL The rss url to call to get the videos of the youtuber
 * @returns The video || null
 */
async function checkVideos(youtubeChannelName, rssURL) {
  console.log(
    colors.yellow(`[${youtubeChannelName}] | Pobieranie ostatniego video..`)
  );
  let lastVideo = await getLastVideo(youtubeChannelName, rssURL);
  // If there isn't any video in the youtube channel, return
  if (!lastVideo)
    return console.log(
      colors.red("[ERR] | Brak ostatnich video dla " + lastVideo)
    );
  // If the date of the last uploaded video is older than the date of the bot starts, return
  if (new Date(lastVideo.pubDate).getTime() < startAt)
    return console.log(
      colors.yellow(
        `[${youtubeChannelName}] | Ostatnie video jest sprzed startu bota`
      )
    );
  let lastSavedVideo = lastVideos[youtubeChannelName];
  // If the last video is the same as the last saved, return
  if (lastSavedVideo && lastSavedVideo.id === lastVideo.id)
    return console.log(
      colors.yellow(
        `[${youtubeChannelName}] | Ostatnie video to te samo co poprzednie zapisane`
      )
    );
  return lastVideo;
}

/**
 * Get the youtube channel id from an url
 * @param {string} url The URL of the youtube channel
 * @returns The channel ID || null
 */
function getYoutubeChannelIdFromURL(url) {
  let id = null;
  url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
  if (url[2]) {
    id = url[2].split(/[^0-9a-z_-]/i)[0];
  }
  return id;
}

/**
 * Get infos for a youtube channel
 * @param {string} name The name of the youtube channel or an url
 * @returns The channel info || null
 */
async function getYoutubeChannelInfos(name) {
  console.log(
    colors.yellow(
      `[${
        name.length >= 10 ? name.slice(0, 10) + "..." : name
      }] | Pobieranie informacji o kanale...`
    )
  );
  let channel = null;
  /* Try to search by ID */
  let id = getYoutubeChannelIdFromURL(name);
  if (id) {
    channel = await youtube.getChannelByID(id);
  }
  if (!channel) {
    /* Try to search by name */
    let channels = await youtube.searchChannels(name);
    if (channels.length > 0) {
      channel = channels[0];
    }
  }
  console.log(
    colors.green(
      `[${
        name.length >= 10 ? name.slice(0, 10) + "..." : name
      }] | Nazwa pobranego kanalu: ${
        channel.raw ? channel.raw.snippet.title : "err"
      }`
    )
  );
  return channel;
}

/**
 * Check for new videos
 */
async function check() {
  console.log(
    colors.yellow("Uruchomiono funkcje wyszukujaca informacje o nowym video...")
  );
  config.youtubers.forEach(async (youtuber) => {
    console.log(
      colors.yellow(
        `[${
          youtuber.length >= 10 ? youtuber.slice(0, 10) + "..." : youtuber
        }] | Sprawdzanie...`
      )
    );
    let channelInfos = await getYoutubeChannelInfos(youtuber);
    if (!channelInfos)
      return console.log(
        colors.red("[ERR] | Podano zly kanal YT: " + youtuber)
      );
    let video = await checkVideos(
      channelInfos.raw.snippet.title,
      "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelInfos.id
    );
    if (!video)
      return console.log(
        colors.red(`[${channelInfos.raw.snippet.title}] | Brak powiadomien`)
      );
    let channel = client.channels.cache.get(config.channel);
    if (!channel)
      return console.log(colors.red("[ERR] | Nie znaleziono kanalu"));
    channel.send({
      content: config.message
        .replace("{videoURL}", video.link)
        .replace("{videoAuthorName}", video.author)
        .replace("{videoTitle}", video.title)
        .replace("{videoPubDate}", formatDate(new Date(video.pubDate))),
    });
    console.log(colors.green("Powiadomienie wyslane"));
    lastVideos[channelInfos.raw.snippet.title] = video;
  });
}
