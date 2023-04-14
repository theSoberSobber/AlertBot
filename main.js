// Krrish Issue : https://github.com/adiwajshing/Baileys/issues/1631#issuecomment-1132816956
const {
  default: makeWASocket,
  useMultiFileAuthState,
  jidNormalizedUser,
  DisconnectReason,
} = require("@adiwajshing/baileys");

const pino = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("sesi");
  try {
    let tempStore = {};
    const getMessage = async (key) => {
      const { id } = key;
      console.log("Resending", id);
      return tempStore[id]?.message;
    };
    const ws = makeWASocket({
      logger: pino({ level: "error" }),
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
      const { connection, lastDisconnect } = update;
      try {
        if (connection === "open") {
          console.log("Connection Successful!");
          ws.sendMessage(debug_jid, { text: "Connected Successfully" });
        } else if (connection === "close") {
          await require("./abstractions/disconnectHandler.js")(
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
        require("./features/commands/handleCommands.js")(ws, chatUpdate);
      } catch (err) {
        console.log(err);
      }
    });

    // _______________________________________________________________

    const { updateHandler } = require("./features/updates/updateHandler.js");

    // call main every 15 seconds
    const x = 60 / 60;
    try {
      tempStore = await updateHandler(ws,tempStore);
      setInterval(async () => {
        tempStore = await updateHandler(ws,tempStore);
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
