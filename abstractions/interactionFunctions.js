// ______________________________INTERACTION Functions IMPLEMENTATION_____________________________
// Take care to define all here as a method of the ws object as they need to be accesible to other files
// without needing to import this file in the applicationLogic script 
// _____________________________________________________________
const { getBuffer } = require('./getBuffer.js')
module.exports = iFunctions = async (ws) => {
    const reply = async (input_text) => {
        await ws.sendMessage(messageObj.key.remoteJid, { text: input_text })
    }
    ws.reply = reply;

    // untested though
    ws.sendButtonMsg = async (jid, text = '', footer = '', but = []) => {
        let templateButtons = but
        var templateMessage = {
            text: text,
            footer: footer,
            templateButtons: templateButtons
        }
        await ws.sendMessage(jid, templateMessage);
    }

    ws.sendFile = async (jid, url, caption) => {
        const fileObj = {
            document: await getBuffer(url),
            mimetype: 'application/pdf',
            caption: caption
        }
	await ws.sendMessage(jid, fileObj);
    }

    ws.sendImage = async (jid, url, caption) => {
        const fileObj = {
            image: await getBuffer(url),
            caption: caption
        }
        await ws.sendMessage(jid, fileObj);
    }
    //________________________________________________________________________________________
}
