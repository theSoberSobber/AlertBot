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
      browser: ["ip-monitor", "ip-monitor", "1.0.0"],
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
    const x = 60;
    try {
      await require("./plugins/ipHandler/ipHandler.js")(ws, "./ip.txt");
      setInterval(async () => {
        await require("./plugins/ipHandler/ipHandler.js")(ws, "./ip.txt");
      }, 1000 * x);
    } catch (e) {
      console.log(`Error occured in iphandler`, e);
      startBot();
    }
    // _______________________________________________________________
  } catch (e) {
    console.log(e);
    startBot();
  }
}

startBot();
