// Krrish Issue : https://github.com/adiwajshing/Baileys/issues/1631#issuecomment-1132816956
const {
  default: makeWASocket,
  useMultiFileAuthState,
  jidNormalizedUser,
} = require("@adiwajshing/baileys");

const pino = require("pino");
const { readFile } = require("fs/promises");

const { checkAndReturn } = require("./features/updates/getUpdates.js");
const pathOfDump = "./data.json";
const map = require("./features/updates/map.js");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("sesi");
  try {
    const tempStore = {};
    const getMessage = async (key) => {
      const { id } = key;
      console.log("Resending", id);
      return tempStore[id]?.message;
    };
    const ws = makeWASocket({
      logger: pino({ level: "silent" }),
      printQRInTerminal: true,
      getMessage,
      //work tempelate message
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
          message.buttonsMessage ||
          message.templateMessage ||
          message.listMessage
        );
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          };
        }
        return message;
      },
      browser: ["AlertBot", "AlertBot", "0.9"],
      auth: state,
    });
    ws.ev.on("creds.update", saveCreds);
    require("./abstractions/interactionFunctions.js")(ws);
    require("./AlertBot.config.js");
    const debug_jid = `${countryCode}${debugNum}@s.whatsapp.net`;
    if (ws.user && ws.user.id) ws.user.jid = jidNormalizedUser(ws.user.id);
    // _______________________________________________________________

    ws.ev.on("connection.update", async (update) => {
      const { connection } = update;
      try {
        if (connection === "open") {
          console.log("Connection Successful!");
          ws.sendMessage(debug_jid, { text: "Connected Successfully" });
        } else if (connection === "close") {
          console.log("Connection Closed!");
          console.log("Restarting!");
          startBot();
        }
      } catch (e) {
        console.log("Restarting!");
        startBot();
      }
    });
    // _______________________________________________________________

    ws.ev.on("messages.upsert", async (chatUpdate) => {
      try {
        require("./features/commands/handleCommands.js")(ws, chatUpdate);
      } catch (err) {
        console.log(err);
      }
    });

    // ______________________________________________________________
    // listen every X minutes for updates on the college website
    // handles user interaction, actual checking is done by checkAndReturn from getUpdates()
    // checkAndReturn returns updates list if that college has any
    // and returns 0 if that college has none
    // so main iterates over map and calls checkAndReturn for all and handles the subsequent interaction then

    const main = async () => {
      // require('./features/ipHandler/ipHandler.js')(ws, './ip.txt');
      for (let name in map) {
        const result = await checkAndReturn(pathOfDump, name);
        // fetch all current group(s) associated with AlertBot
        // see https://github.com/theSoberSobber/Groups-AlertBot for more info on how Dynamic groups are generated!
        // const res = await fetch(`https://alert-bot.vercel.app/groupIds`);
        // let groupArr = await res.text();
        let groupArr = await readFile("./groups.json");
        try {
          groupArr = await JSON.parse(groupArr);
        } catch (err) {
          // fall back on a old cached info.json
          // TODO : Build Mechanism to cache info.json
          groupArr = await readFile("./info.json");
          groupArr = await JSON.parse(groupArr);
          continue;
        }
        // for this the names in map must be the same as the one's used to create group links
        groupArr = groupArr[name];
        // const result =0;
        // now handle user interaction
        if (result.length != 0) {
          for (const jid of groupArr) {
            for (const i of result) {
              console.log(i.linkArr);
              for(let j=0; j<linkArr.length; j++){
                try {
                  if (i.linkArr[j].slice(-4) == ".pdf") {
                    await ws.sendFile(jid, i.linkArr[j], i.innerText);
                  } else if (i.linkArr[j].slice(-4) == ".jpg") {
                    await ws.sendImage(jid, i.linkArr[j], i.innerText);
                  } else {
                    await ws.sendMessage(jid, {
                      text: `${i.innerText}, Link: ${i.linkArr[j]}`,
                    });
                  }
                } catch (e) {
                  console.log("Error sending result data" + e);
                  console.log("Restarting!");
                  startBot();
                }
              }
            }
            await ws.sendMessage(jid, {
              text: `Brought to you by https://alert-bot.vercel.app`,
            });
          }
        }
      }
    };

    // call main every 15 seconds
    const x = 60 / 60;
    main();
    setInterval(main, 10000);
  } catch (e) {
    console.log(e);
    startBot();
  }
}

startBot();
