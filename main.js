const { default: makeWASocket, useSingleFileAuthState, jidNormalizedUser } = require("@adiwajshing/baileys");
const { state } = useSingleFileAuthState('./sesi.json');

const pino = require('pino');

const ws = makeWASocket({
    logger: pino({ level: 'silent' }),
    browser: ["Ramesh", "Ramesh-Connections", "1.0"],
    auth: state
})
require('./abstractions/interactionFunctions.js')(ws);
require('./AlertBot.config.js');
const debug_jid = `${countryCode}${debugNum}@s.whatsapp.net`;
if (ws.user && ws.user.id) ws.user.jid = jidNormalizedUser(ws.user.id)
// _______________________________________________________________

ws.ev.on('connection.update', async (update) => {
    const { connection } = update;
    if (connection === "open") {
        console.log("Connection Successful!");
        ws.sendMessage(debug_jid, { text: 'Connected Successfully' })
    }
})

// ______________________________________________________________
// listen every X minutes for updates on the college website

const { checkAndReturn } = require('./features/updates/getUpdates.js');
const pathOfDump = "./data.json";

const main = async () => {
    require('./features/ipHandler/ipHandler.js')(ws, './ip.txt');
    const result = await checkAndReturn(pathOfDump);
    // fetch all current group(s) asscoiated with AlertBot
    // see https://github.com/theSoberSobber/Groups-AlertBot for more info on how Dynamic groups are generated!
    const res = await fetch('https://alert-bot.vercel.app/groupIds');
    // console.log(res.body);
    let groupArr = await res.text();
    groupArr = await JSON.parse(groupArr);
    groupArr = groupArr["manit"];
    console.log(groupArr);
    if (result) {
        for (const i of result){
            for(const jid of groupArr){
                // implement better way using axios headers and content-type['application/pdf'] checking
                if(i.link.slice(-4) == ".pdf"){
                    await ws.sendFile(jid, i.link, i.innerText);
                    await ws.sendMessage(jid, { text: `Brought to you by https://alert-bot.vercel.app` })
                } else if (i.link.slice(-4) == ".jpg") {
                    await ws.sendImage(jid, i.link, i.innerText);
                    await ws.sendMessage(jid, { text: `Brought to you by https://alert-bot.vercel.app` })
                } else {
                    await ws.sendMessage(jid, { text: `${i.innerText}, Link: ${i.link}` })
                    await ws.sendMessage(jid, { text: `Brought to you by https://alert-bot.vercel.app` })
                }
            }
        }
        return;
    }
    return;
}

// call main every 15 seconds
const x = 15 / 60;
main();
setInterval(main, x * 60 * 1000);