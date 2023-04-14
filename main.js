const {
  default: makeWASocket,
  useMultiFileAuthState,
  jidNormalizedUser,
  DisconnectReason,
} = require("@adiwajshing/baileys");

const pino = require("pino");

const { readFile } = require("fs/promises");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("sesi");
  try {
    const getMessage = async (key) => {
      const { id } = key;
      console.log("Resending", id);
      let tempStore = await readFile("./data/store.json", "utf-8");
      tempStore = await JSON.parse(tempStore);
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
    require("./lib/interactionFunctions.js")(ws);
    require("./AlertBot.config.js");
    if (ws.user && ws.user.id) ws.user.jid = jidNormalizedUser(ws.user.id);
    // _______________________________________________________________

    ws.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      try {
        if (connection === "open") {
          console.log("Connection Successful!");
          for (let i = 0; i < debugNums.length; ++i) {
            const debugJid = `${countryCode}${debugNums[i]}@s.whatsapp.net`;
            ws.sendMessage(debugJid, { text: "Connected Successfully" });
          }
        } else if (connection === "close") {
          await require("./lib/disconnectHandler.js")(
            DisconnectReason,
            lastDisconnect
          );
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
        require("./plugins/commands/handleCommands.js")(ws, chatUpdate);
      } catch (err) {
        console.log(err);
      }
    });

    // _______________________________________________________________

    // require('./plugins/ipHandler/ipHandler.js')(ws, './ip.txt');

    // _______________________________________________________________

    const { updateHandler } = require("./plugins/updates/updateHandler.js");

    // call main every 15 seconds
    const x = 60 / 60;
    try {
      await updateHandler(ws);
      setInterval(async () => {
        await updateHandler(ws);
      }, 10000);
    } catch (e) {
      console.log(e);
      startBot();
    }
  } catch (e) {
    console.log(e);
    startBot();
  }
}

startBot();
