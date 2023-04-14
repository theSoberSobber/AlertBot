// ______________________________INTERACTION Functions IMPLEMENTATION_____________________________
// Take care to define all here as a method of the ws object as they need to be accesible to other files
// without needing to import this file in the applicationLogic script
// _____________________________________________________________
const { getBuffer } = require("./utils/getBuffer.js");
const { readFile, writeFile } = require("fs/promises");

module.exports = iFunctions = async (ws) => {
  ws.temp = ws.sendMessage;
  ws.sendMessage = async () => {};

  ws.sendMessage = async (jid, messageObj) => {
    let tempStore = await readFile("./data/store.json", "utf-8");
    tempStore = await JSON.parse(tempStore);
    let sent = await ws.temp(jid, messageObj);
    tempStore[sent.key.id] = sent;
    await writeFile("./data/store.json", JSON.stringify(tempStore), "utf-8");
  };

  const reply = async (input_text) => {
    await ws.sendMessage(messageObj.key.remoteJid, { text: input_text });
  };
  ws.reply = reply;

  // untested though
  ws.sendButtonMsg = async (jid, text = "", footer = "", but = []) => {
    let templateButtons = but;
    var templateMessage = {
      text: text,
      footer: footer,
      templateButtons: templateButtons,
    };
    return await ws.sendMessage(jid, templateMessage);
  };

  ws.sendFile = async (jid, url, caption = "") => {
    const fileObj = {
      document: await getBuffer(url),
      mimetype: "application/pdf",
      caption: caption,
    };
    return await ws.sendMessage(jid, fileObj);
  };

  ws.sendImage = async (jid, url, caption = "") => {
    const fileObj = {
      image: await getBuffer(url),
      caption: caption,
    };
    return await ws.sendMessage(jid, fileObj);
  };
  //________________________________________________________________________________________
};
