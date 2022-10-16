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
const map = require('./features/updates/map.js');
// handles user interaction, actual checking is done by checkAndReturn from getUpdates()
// checkAndReturn returns updates list if that college has any
// and returns 0 if that college has none
// so main iterates over map and calls checkAndReturn for all and handles the subsequent interaction then
const main = async () => {
    for(const name in map){
        const result = await checkAndReturn(pathOfDump, name);
        // fetch all current group(s) associated with AlertBot
        // see https://github.com/theSoberSobber/Groups-AlertBot for more info on how Dynamic groups are generated!
        const res = await fetch(`https://alert-bot.vercel.app/groupIds`);
        // console.log(res.body);
        let groupArr = await res.text();
        groupArr = await JSON.parse(groupArr);
        // for this the names in map must be the same as the one's used to create group links
        groupArr = groupArr[name];
        console.log(groupArr);

        // now handle user interaction
        if (result) {
            for (const i of result){
                for(const jid of groupArr){
                    await ws.sendGeneralLinks(jid, i.link, i.innerText);
                    await ws.sendMessage(jid, { text: `Brought to you by ${base_uri}` });
                }
            }
            return;
        }
        return;
    }
}

// call main every 15 seconds
const x = 15 / 60;
main();
setInterval(main, x * 60 * 1000);