module.exports = async (ws, json) => {
    for(let i in json.presences){
        i = json.presences[i];
        var d = new Date(0);
        d.setUTCSeconds(i.lastSeen);
        d=d.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        await ws.sendMessage("918815065180@s.whatsapp.net", {text: `Status: ${i.lastKnownPresence}\nLastSeen: ${d}`});
    }
    return;
}

if(require.main===module){
    (async ()=> {
        const res = await require("./stalkHandler.js")();
        console.log(res);
    })();
}