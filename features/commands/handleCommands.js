const prefix = "/";

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
    if(!fromMe && !isGrp){
        if(messageObj.conversation){
            // normal text
            let body = messageObj.conversation.toLowerCase();
            if(await checkAndParse(body)){
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
        }
        if(messageObj.extendedTextMessage){
            // extendedTextMessage
            let body =  messageObj.extendedTextMessage.text.toLowerCase();
            await replyM(senderJid, "please send a normal text message.");
        }
        if(messageObj.videoMessage){
            // video message
            let body = messageObj.videoMessage.caption.toLowerCase();
            await replyM(senderJid, "please send a normal text message.");
        }
        if(messageObj.imageMessage){
            // image message
            let body = messageObj.imageMessage.caption.toLowerCase();
            await replyM(senderJid, "please send a normal text message.");
        }
    }
}



