module.exports = async (ws, i, ori, stalkerJid) => {
    console.log(i);
    if(i.lastKnownPresence=="unavailable"){
        if(i.lastSeen===undefined){
            await ws.sendMessage(stalkerJid, {text: `${ori.substring(0,12)} has last seen and/or online disabled for you or everyone. If they change their settings, bot would start working again :)`});
            return;
        }
        let d = new Date(0);
        d.setUTCSeconds(i.lastSeen);
        d=d.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        await ws.sendMessage(stalkerJid, {text: `${ori.substring(0,12)}\nStatus: ${i.lastKnownPresence}\nLastSeen: ${d}`});
        return;
    } else {
        // if there is a presence update status can't be undefined, otherwise there just wouldn't be a status update
        await ws.sendMessage(stalkerJid, {text: `${ori.substring(0,12)}\nStatus: ${i.lastKnownPresence}`});
        return;
    }
}