// ______________________________INTERACTION Functions IMPLEMENTATION_____________________________
// Take care to define all here as a method of the ws object as they need to be accesible to other files
// without needing to import this file in the applicationLogic script 
// _____________________________________________________________
const { getBuffer } = require('./getBuffer.js')
const axios = require('axios');
module.exports = iFunctions = async (ws) => {
    ws.sendGeneralLinks = async (jid, url, caption) => {
            let mime = '';
            console.log(url);
            let res = await axios.head(url)
            mime = res.headers['content-type']
            if(mime === "application/pdf"){
                await ws.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf'})
            }
            if(mime.split("/")[0] === "image"){
                await ws.sendMessage(jid, { image: await getBuffer(url), caption: caption})
            }
            else {
                // it's probably a directory, so just send the link
                await ws.sendGeneralLinks(jid, { text: `${caption}, Link: ${url}` })
            }
    }
    //________________________________________________________________________________________
}