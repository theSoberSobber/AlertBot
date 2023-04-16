const {readFile, writeFile} = require("fs/promises");
module.exports = async (ws, i, ori, stalkerJid) => {
    let toTest = await JSON.parse(await readFile("./data/stalkData.json", "utf-8"));
    const ppUrl = await ws.profilePictureUrl(ori, 'image');
    if(!toTest[ori]) toTest[ori]={};
    if(!(toTest[ori]?.ppUrl==ppUrl)){
        await ws.sendMessage(stalkerJid, {text: `${ori.substring(0,12)}\nnew pfp: ${ppUrl}`});
        await ws.sendImage(stalkerJid, ppUrl, `${ori.substring(0,12)}'s new pfp`);
        toTest[ori].ppUrl = ppUrl;
        await writeFile("./data/stalkData.json", JSON.stringify(toTest));
    }
    return;
}