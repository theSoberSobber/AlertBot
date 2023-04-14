const prefix = "/";
const { writeFile, readFile } = require("fs/promises");

const checkAndParse = async (body) => {
  if (body[0] == prefix) {
    let command = body.replace(prefix, "").trim().split(/ +/).shift();
    let args = body.trim().split(/ +/).slice(1);
    return { command, args };
  }
  return 0;
};

const getIp = async () => {
  try {
    let ip = await fetch("https://checkip.amazonaws.com/");
  } catch (err) {
    console.log("Fetch Failed!");
  }
  ip = await ip.text();
  return ip;
};
require("../../AlertBot.config.js");

const checkPriv = async (jid) => {
  let num = jid.substring(0, 10);
  for (let i in privNums) if (privNums[i] == num) return true;
  return false;
};

module.exports = applicationLogic = async (ws, chatUpdate) => {
  const replyM = async (jid, input_text) => {
    await ws.sendMessage(jid, { text: input_text });
  };
  messageObj = chatUpdate.messages[0];
  let senderJid = messageObj.key.remoteJid;
  let fromMe = messageObj.key.fromMe;
  let isGrp = messageObj.key.participant ? true : false;
  let grpId, groupMetadata;
  if (isGrp) {
    grpId = messageObj.key.remoteJid;
    senderJid = messageObj.key.participant;
    groupMetadata = await ws.groupMetadata(grpId).catch((e) => {});
  }
  if (messageObj.messageStubParameters?.length) {
    console.log(grpId);
    const grpName = messageObj.messageStubParameters[0];
    await replyM(
      grpId,
      `Alert Bot has been successfully added to ${grpName}!
Use /help to proceed further ✨
Use /list to see the list of currently supported colleges.
If your college isn't in the list, use /contact to inform us about it.`
    );
    return;
  }
  messageObj = messageObj.message;
  // ________________________________________________
  // API ENDS HERE
  // ________________________________________________
  if (!fromMe) {
    if (messageObj?.conversation) {
      // normal text
      let body = messageObj.conversation.toLowerCase();
      if ((await checkAndParse(body)) && !isGrp) {
        const { command, args } = await checkAndParse(body);
        switch (command) {
          case "ping":
            await replyM(senderJid, "pong.");
            break;
          case "ssh":
            if (!checkPriv(senderJid)) break;
            const ip = await getIp();
            await replyM(senderJid, `ssh u0_a343@${ip} -p 8022`);
            break;
          case "help":
            let helpTxt = `╔════════
╠══ *AlertBot@2023*
╠ ${prefix}help
╠ ${prefix}list
╠ ${prefix}setup <cName>
╠ ${prefix}debug <option>
╠══ ${prefix}debug jid
╠══ ${prefix}debug current
╠ ${prefix}manual <cName> <message>
╠ ${prefix}ping
╠ ${prefix}ssh
╠ ${prefix}unregister
╠ ${prefix}contact
╠ ${prefix}github
╚════════`;
            await replyM(senderJid, helpTxt);
            break;
          case "list":
            let listTxt = "";
            for (let name in require("../updates/map.js"))
              listTxt += `${name}\n`;
            await replyM(senderJid, listTxt.substring(0, listTxt.length - 1));
            break;
          case "contact":
            await replyM(
              senderJid,
              `Pavit: +918815065180
Krrish: +919667240912`
            );
            break;
          case "github":
            await replyM(
              senderJid,
              `https://github.com/theSoberSobber/AlertBot`
            );
            break;
          case "debug":
            if (args[0] == "current")
              await replyM(senderJid, await readFile("./data/groups.json"));
            else await replyM(senderJid, "too few or invalid argument(s).");
            break;
          case "manual":
            if (!checkPriv(senderJid)) break;
            const allGroupsJson = await JSON.parse(
              await readFile("./data/groups.json")
            );
            let message = "";
            for (let i = 1; i < args.length; i++) message += `${args[i]} `;
            for (let college in allGroupsJson) {
              if (args[0].toLowerCase() == "all" || college == args[0]) {
                for (let i = 0; i < allGroupsJson[college].length; i++) {
                  await replyM(allGroupsJson[college][i], message);
                }
              }
            }
            await replyM(senderJid, "broadcast succeded");
            break;
          default:
            await replyM(senderJid, "not a valid command.");
            break;
        }
      }
      if ((await checkAndParse(body)) && isGrp) {
        const { command, args } = await checkAndParse(body);
        switch (command) {
          case "ping":
            await replyM(grpId, "pong.");
            break;
          case "debug":
            if (args[0] == "jid") await replyM(grpId, grpId);
            else if (args[0] == "current")
              await replyM(grpId, await readFile("./data/groups.json"));
            else await replyM(grpId, "too few or invalid argument(s).");
            break;
          case "help":
            let helpTxt = `╔════════
╠══ *AlertBot@2023*
╠ ${prefix}help
╠ ${prefix}list
╠ ${prefix}setup <cName>
╠ ${prefix}debug <option>
╠══ ${prefix}debug jid
╠══ ${prefix}debug current
╠ ${prefix}manual <cName> <message>
╠ ${prefix}ping
╠ ${prefix}ssh
╠ ${prefix}unregister
╠ ${prefix}contact
╠ ${prefix}github
╚════════`;
            await replyM(grpId, helpTxt);
            break;
          case "tagall":
            if (!checkPriv(senderJid)) {
              await replyM(grpId, "you don't have enough privileges.");
              break;
            }
            const participants = await groupMetadata.participants;
            // console.log(participants);
            // console.log(participants.map(a => a.id));
            await ws.sendMessage(grpId, {
              text: "",
              mentions: participants.map((a) => a.id),
            });
            break;
          case "setup":
            let f = 0;
            if (args[0] === undefined) {
              // console.log("bhai pura de", grpId);
              await replyM(grpId, "too few or invalid argument(s).");
              break;
            }
            const groupJson = await JSON.parse(
              await readFile("./data/groups.json")
            );
            for (let college in groupJson) {
              if (college == args[0]) {
                for (let i = 0; i < groupJson[college].length; i++) {
                  if (groupJson[college][i] == grpId) {
                    await replyM(grpId, "group already registered.");
                    f = 1;
                    break;
                  }
                }
              }
            }
            if (f) break;
            if (groupJson[args[0]] === undefined) groupJson[args[0]] = [];
            groupJson[args[0]].push(grpId);
            await writeFile("./data/groups.json", JSON.stringify(groupJson));
            await replyM(grpId, `group has been registered.`);
            break;
          case "list":
            let listTxt = "";
            for (let name in require("../updates/map.js"))
              listTxt += `${name}\n`;
            await replyM(grpId, listTxt.substring(0, listTxt.length - 1));
            break;
          case "contact":
            await replyM(
              grpId,
              `Pavit: +918815065180
Krrish: +919667240912`
            );
            break;
          case "github":
            await replyM(grpId, `https://github.com/theSoberSobber/AlertBot`);
            break;
          case "unregister":
            let fl = 0;
            const groupAllJson = await JSON.parse(
              await readFile("./data/groups.json")
            );
            for (let college in groupAllJson) {
              for (let i = 0; i < groupAllJson[college].length; i++) {
                if (groupAllJson[college][i] == grpId) {
                  await groupAllJson[college].splice(i, 1);
                  await writeFile(
                    "./data/groups.json",
                    JSON.stringify(groupAllJson)
                  );
                  await replyM(
                    grpId,
                    `group successfully removed from AlertBot for college ${college}.`
                  );
                  fl = 1;
                }
              }
            }
            if (fl) break;
            await replyM(grpId, "group isn't regsitered to AlertBot.");
          default:
            await replyM(grpId, "not a valid command.");
            break;
        }
      }
    }
    if (messageObj?.extendedTextMessage) {
      // extendedTextMessage
      let body = messageObj.extendedTextMessage.text.toLowerCase();
    }
    if (messageObj?.videoMessage) {
      // video message
      let body = messageObj.videoMessage.caption.toLowerCase();
    }
    if (messageObj?.imageMessage) {
      // image message
      let body = messageObj.imageMessage.caption.toLowerCase();
    } else return;
  }
};
