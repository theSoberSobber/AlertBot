const { default: makeWASocket, useMultiFileAuthState, jidNormalizedUser } = require("@adiwajshing/baileys");

const pino = require('pino');
const { readFile } = require('fs/promises');

const { checkAndReturn } = require('./features/updates/getUpdates.js');
const pathOfDump = "./data.json";
const map = require('./features/updates/map.js');

const { getBuffer } = require('./abstractions/getBuffer.js');

async function startBot(){

    const { state, saveCreds} = await useMultiFileAuthState('sesi');
    try {
        const ws = makeWASocket({
	logger: pino({ level: 'silent' }),
	//printQRInTerminal: true,
	//work tempelate message 
	patchMessageBeforeSending: (message) => {
	const requiresPatch = !!(
  	message.buttonsMessage
  	|| message.templateMessage
  	|| message.listMessage
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
	browser: ["Ichigo Kurosaki", "Safari", "3.0"],
	auth: state
	})
        require('./abstractions/interactionFunctions.js')(ws);
        require('./AlertBot.config.js');
        const debug_jid = `${countryCode}${debugNum}@s.whatsapp.net`;
        if (ws.user && ws.user.id) ws.user.jid = jidNormalizedUser(ws.user.id)
        // _______________________________________________________________

        ws.ev.on('connection.update', async (update) => {
            const { connection } = update;
            try {
                if (connection === "open") {
                    console.log("Connection Successful!");
                    ws.sendMessage(debug_jid, { text: 'Connected Successfully' })
                }
                else if (connection === "close") {
                    console.log("Connection Closed!")
                    console.log('Restarting!')
                    startBot();
                }
            } catch (e) {
                console.log('Restarting!')
                startBot();
            }
        })

        // ______________________________________________________________
        // listen every X minutes for updates on the college website
        // handles user interaction, actual checking is done by checkAndReturn from getUpdates()
        // checkAndReturn returns updates list if that college has any
        // and returns 0 if that college has none
        // so main iterates over map and calls checkAndReturn for all and handles the subsequent interaction then

	const main = async() => {
            // require('./features/ipHandler/ipHandler.js')(ws, './ip.txt');
            for(let name in map){
                const result = await checkAndReturn(pathOfDump, name);
                // fetch all current group(s) associated with AlertBot
                // see https://github.com/theSoberSobber/Groups-AlertBot for more info on how Dynamic groups are generated!
                const res = await fetch(`https://alert-bot.vercel.app/groupIds`);
                let groupArr = await res.text();
                try {
			        groupArr = await JSON.parse(groupArr);
		        } catch(err) {
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
                if (result.length!=0){
                    for(const jid of groupArr){
                        for (const i of result){
                           console.log(i.link);
			   try {
                                if(i.link.slice(-4) == ".pdf"){
				    await ws.sendFile(jid, i.link, i.innerText);
                                } else if (i.link.slice(-4) == ".jpg") {
                                    await ws.sendImage(jid, i.link, i.innerText);
                                } else {
                                    await ws.sendMessage(jid, { text: `${i.innerText}, Link: ${i.link}` })
                                }
                            } catch (e) {
                                console.log("Error sending result data" + e)
                                console.log("Restarting!")
                                startBot();
                            }
                        }
			await ws.sendMessage(jid, { text: `Brought to you by https://alert-bot.vercel.app` })
                    }
                }
            }
        }


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
