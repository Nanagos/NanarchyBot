//  packages
const mineflayer = require("mineflayer");
const Discord = require("discord.js");
//  files
const config = require("./config.json");
const util = require("./util.js");

function start() {
  const options = {
    host: config.mc.host,
    port: config.mc.port,
    version: config.mc.version,
    plugins: util.plugins,
    username: config.mc.username,
    settings: {
      viewDistance: 1
    }
  }

  console.log("starting Minecraft bot");
  //  Minecraft Bot
  var mcBot;
  login();

  const dcBot = new Discord.Client();
  dcBot.login(config.dc.token);
  //  Discord bot
  dcBot.on("message", onDiscordMessage);
  
  setInterval(() => {
    const date = new Date(Date.now());
    console.log(date.toLocaleString());
  }, 60 * 1000);


  function login() {
    mcBot = mineflayer.createBot(options);
    bindEvents();
  }

  function bindEvents() {
    mcBot.once("login", () => {
      sendChannels("connected", "GREEN");
      console.log("connected");
      setTimeout(() => {
          mcBot.chat(`/login ${config.password}`);
      }, 1000);
    });

    mcBot.once("end", (reason) => {
      sendChannels("disconnected", "RED");
      console.log("disconnected");
      mcBot.quit();
      mcBot.end();
      setTimeout(() => {
        login();
      }, 60 * 1000);
    });

    mcBot.on("message", (jsonMsg) => {
      const list = jsonMsg.json.extra;
      if(list === undefined) return;

      var message = "";
      var color = "WHITE";
      list.forEach(part => {
        if((typeof part.text) !== "string") return;
        if((typeof part.color) === "string" && color === "WHITE") color = part.color.toUpperCase();
        message += part.text;
      });

      sendChannels(message, color);
    });
  }

  //  DISCORD FUNCTIONS

  function onDiscordMessage(message) {
    const { channel, author, content } = message;
    if(author.tag === dcBot.user.tag) return;

    const text = util.removeIllegalSigns(`[Discord|${author.tag}] ${content}`);
    if(text.length === 0) return;

    if(channel.id === config.dc.channel) {
      mcBot.chat(text.substr(0, 128));
    }
  }

  function sendChannels(msg, color) {
    if(!color) color = "WHITE";

    const channel = config.dc.channel;

    dcBot.guilds.cache.forEach(_guild => {
      _guild.channels.cache.forEach(_channel => {
        if(_channel.id === channel) {
          _channel.send({ embed: {
            description: util.removeDiscordFormating(msg),
            color: color
          } })
          .catch(error => {});
        }
      });
    });
  }
}

module.exports = {
  start
}