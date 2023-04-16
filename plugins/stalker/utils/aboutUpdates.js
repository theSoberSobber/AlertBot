const {readFile, writeFile} = require("fs/promises");
module.exports = async (ws, i, ori, stalkerjid) => {
    let toTest = await JSON.parse(await readFile("./data/stalkData.json", "utf-8"));
    let about;
    try{
        about = await ws.fetchStatus(ori);
    } catch (err){
        await ws.sendMessage(stalkerjid, {text: `${ori.substring(0,12)} doesn't allow you to view their about.`});
        return;
    }
    if(!toTest[ori]) toTest[ori]={};
    if(!(toTest[ori]?.status==about?.status && toTest[ori]?.setAt==about?.setAt)){
        await ws.sendMessage(stalkerjid, {text: `${ori.substring(0,12)}\nnew about: ${about.status}\nSetAt: ${about.setAt}`});
        toTest[ori].status = about.status;
        toTest[ori].setAt = about.setAt.toString();
        await writeFile("./data/stalkData.json", JSON.stringify(toTest));
    }
    return;
}