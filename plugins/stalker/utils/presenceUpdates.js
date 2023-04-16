module.exports = async (ws, i, ori, stalkerJid) => {
    if(i.lastKnownPresence=="unavailable"){
        let d = new Date(0);
        d.setUTCSeconds(i.lastSeen);
        d=d.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        await ws.sendMessage(stalkerJid, {text: `${ori.substring(0,12)}\nStatus: ${i.lastKnownPresence}\nLastSeen: ${d}`});
        return;
    } else {
        await ws.sendMessage(stalkerJid, {text: `${ori.substring(0,12)}\nStatus: ${i.lastKnownPresence}`});
        return;
    }
}