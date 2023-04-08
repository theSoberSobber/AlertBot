const prefix = "/";
const {writeFile, readFile} =  require("fs/promises");

const checkAndParse = async (body) => {
    if (body[0]==prefix){
        let command = body.replace(prefix, '').trim().split(/ +/).shift();
        let args = body.trim().split(/ +/).slice(1);
        return {command, args};
    }
    return 0;
}

const getIp = async () => {
    let ip = await fetch("https://checkip.amazonaws.com/");
    ip = await ip.text();
    return ip;
}

module.exports = applicationLogic = async (ws, chatUpdate) => {
    const replyM = async (jid, input_text) => {
        await ws.sendMessage(jid, { text: input_text })
    }
    messageObj = chatUpdate.messages[0];
    let senderJid = messageObj.key.remoteJid;
    let fromMe = messageObj.key.fromMe;
    let isGrp = (messageObj.key.participant) ? true : false;
    let grpId;
    if(isGrp){
        grpId = messageObj.key.remoteJid;
        senderJid = messageObj.key.participant;
    }
    messageObj=messageObj.message;
    // ________________________________________________
    // API ENDS HERE
    // ________________________________________________
    if(!fromMe){

        if(messageObj.conversation){
            // normal text
            let body = messageObj.conversation.toLowerCase();
            if(await checkAndParse(body) && !isGrp){
                const {command, args} = await checkAndParse(body);
                switch (command){
                    case "ping":
                        await replyM(senderJid, "pong.");
                        break;
                    case "ssh":
                        const ip = await getIp();
                        await replyM(senderJid, `ssh u0_a343@${ip} -p 8022`);
                        break;
                    default :
                        await replyM(senderJid, "not a valid command.");
                        break;
                }
            }
            if(await checkAndParse(body) && isGrp){
                const {command, args} = await checkAndParse(body);
                switch(command){
                    case "ping":
                        await replyM(grpId, "pong.");
                        break;
                    case "debug":
                        if(args[0]=="jid") await replyM(grpId, grpId);
                        else await replyM(grpId, "too few or invalid argument(s).");
                        break;
                    case "setup":
                        let f=0;
                        if(args[0]===undefined){
                            console.log("bhai pura de", grpId);
                            await replyM(grpId, "too few or invalid argument(s).");
                            break;
                        }
                        const groupJson = await JSON.parse(await readFile("./groups.json"));
                        for(let college in groupJson){
                            if(college==args[0]){
                                for(let i=0; i<groupJson[college].length; i++){
                                    if(groupJson[college][i]==grpId){
                                        await replyM(grpId, "group already registered.");
                                        f=1;
                                        break;
                                    }
                                }
                            }
                        }
                        if(f) break;
                        groupJson[args[0]] = [];
                        groupJson[args[0]].push(grpId);
                        await writeFile("./groups.json", JSON.stringify(groupJson));
                        await replyM(grpId, `group has been registered.`);
                        break;
                    case "current":
                        await replyM(grpId, await readFile("./groups.json"));
                        break;
                    default :
                        await replyM(grpId, "not a valid command.");
                        break;
                }
            }
        }
        if(messageObj.extendedTextMessage){
            // extendedTextMessage
            let body =  messageObj.extendedTextMessage.text.toLowerCase();
        }
        if(messageObj.videoMessage){
            // video message
            let body = messageObj.videoMessage.caption.toLowerCase();
        }
        if(messageObj.imageMessage){
            // image message
            let body = messageObj.imageMessage.caption.toLowerCase();
        }
    }
}


