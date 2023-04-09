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

let privNums = ["8815065180", "9667240912"];

const checkPriv = async (jid) => {
    let num = jid.substring(0, 10);
    for(let i in privNums) if(privNums[i]==num) return true;
    return false;
}

module.exports = applicationLogic = async (ws, chatUpdate) => {
    const replyM = async (jid, input_text) => {
        await ws.sendMessage(jid, { text: input_text })
    }
    messageObj = chatUpdate.messages[0];
    let senderJid = messageObj.key.remoteJid;
    let fromMe = messageObj.key.fromMe;
    let isGrp = (messageObj.key.participant) ? true : false;
    let grpId, groupMetadata;
    if(isGrp){
        grpId = messageObj.key.remoteJid;
        senderJid = messageObj.key.participant;
        groupMetadata = await ws.groupMetadata(grpId).catch(e => {});
    }
    console.log(messageObj);
    if(messageObj.messageStubParameters){
        console.log(grpId);
        // await replyM(grpId, "Alert Bot has been added to this group!");
        return;
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
                    case "manual":
                        if(!checkPriv(senderJid)) break;
                        const allGroupsJson = await JSON.parse(await readFile("./groups.json"));
                        let message="";
                        for(let i=1;i<args.length; i++) message+=`${args[i]} `;
                        for(let college in allGroupsJson){
                            if(args[0].toLowerCase()=='all' || college == args[0]){
                                for(let i=0; i<allGroupsJson[college].length; i++){
                                    await replyM(allGroupsJson[college][i], message);
                                }
                            }
                        }
                        await replyM(senderJid, "broadcast succeded");
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
                    case 'tagall':
                        if(!checkPriv(senderJid)){
                            await replyM(grpId, "you don't have enough privileges.");
                            break;
                        }
                        const participants = await groupMetadata.participants;
                        console.log(participants);
                        console.log(participants.map(a => a.id));
                        await ws.sendMessage(grpId, { text : '' , mentions: participants.map(a => a.id)});
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
                        if(groupJson[args[0]]===undefined) groupJson[args[0]] = [];
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


