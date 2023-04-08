const prefix = "/";
const { writeFile } = require('fs');
const { readFile } = require('fs/promises');

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
        console.log(messageObj);
        if(messageObj.conversation){
            // normal text
            let body = messageObj.conversation.toLowerCase();
            if(await checkAndParse(body)){
                const {command, args} = await checkAndParse(body);
                if(!isGrp){
                    console.log("DM Command", command, args);
                    switch (command){
                    case "ping":
                        await replyM(senderJid, "pong.");
                        break;
                    case "ssh":
                        const ip = await getIp();
                        await replyM(senderJid, `ssh u0_a343@${ip} -p 8022`);
                        break;
                    case "addJid":
                        // "/register manit {jid}"
                        await replyM(senderJid, "adding group to DB");
                        let groupArr =  await readFile("./groups.json");
                        for(i in groupArr) if(i==args[0]) groupArr[i].push(args[1]);
                        await writeFile("./groups.json", JSON.stringify(groupArr));
                        await replyM(senderJid, "added");
                        break;
                    default :
                        await replyM(senderJid, "not a valid command.");
                        break;
                    }
                    printQRInTerminal: true,

                } else {
                    console.log("Group Command", command, args);
                    switch(command){
                        case "ping":
                        await replyM(grpId, "pong.");
                            break;
                        case "debug":
                            if(args[0]=="jid") await replyM(senderJid, senderJid);
                            else await replyM(senderJid, "atleast 1 parameter required");
                            break;
                        case "setup":
                            // "/register manit"
                            await replyM(senderJid, "starting auto setup...");
                            let groupArr =  await readFile("./groups.json");
                            for(i in groupArr) if(i==args[0]) groupArr[i].push(senderJid);
                            await writeFile("./groups.json", JSON.stringify(groupArr));
                            await replyM(senderJid, "alertbot auto registration complete.");
                            break;
                    }
                }
            }
        }
        if(messageObj.extendedTextMessage){
            // extendedTextMessage
            let body =  messageObj.extendedTextMessage.text.toLowerCase();
            if(await checkAndParse(body)){
                const {command, args} = await checkAndParse(body);
                if(!isGrp){
                    console.log("DM Command", command, args);
                    switch (command){
                    case "ping":
                        await replyM(senderJid, "pong.");
                        break;
                    case "ssh":
                        const ip = await getIp();
                        await replyM(senderJid, `ssh u0_a343@${ip} -p 8022`);
                        break;
                    case "addJid":
                        // "/register manit {jid}"
                        await replyM(senderJid, "adding group to DB");
                        let groupArr =  await readFile("./groups.json");
                        for(i in groupArr) if(i==args[0]) groupArr[i].push(args[1]);
                        await writeFile("./groups.json", JSON.stringify(groupArr));
                        await replyM(senderJid, "added");
                        break;
                    default :
                        await replyM(senderJid, "not a valid command.");
                        break;
                    }
                } else {
                    console.log("Group Command", command, args);
                    switch(command){
                        case "debug":
                            if(args[0]=="jid") await replyM(grpId, senderJid);
                            else await replyM(grpId, "insufficient or invalid parameters.");
                            break;
                        case "setup":
                            // "/register manit"
                            await replyM(grpId, "starting auto setup...");
                            let groupArr =  await readFile("./groups.json");
                            for(i in groupArr) if(i==args[0]) groupArr[i].push(senderJid);
                            await writeFile("./groups.json", JSON.stringify(groupArr));
                            await replyM(grpId, "alertbot auto registration complete.");
                            break;
                    }
                }
            }
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