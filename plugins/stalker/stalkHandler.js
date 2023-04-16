require("../../AlertBot.config.js");
module.exports = async (ws, json) => {
    const stalkerJid = `91${stalkerNum}@s.whatsapp.net`;
    for(let i in json.presences) for(let target in targetNums){
        if(i.substring(2,12)==targetNums[target]){
            await require("./utils/presenceUpdates.js")(ws, json.presences[i], i, stalkerJid);
            // cus they can only perform these activities if they are online :)
            // so these are perfect to group with their presence update
            await require("./utils/aboutUpdates.js")(ws, json.presences[i], i, stalkerJid);
            await require("./utils/pfpUpdates.js")(ws, json.presences[i], i, stalkerJid);
        }
    }
    return;
}