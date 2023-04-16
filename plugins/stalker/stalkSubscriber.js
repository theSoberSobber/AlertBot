module.exports = async (ws, targetNums) => {
    for(let i in targetNums) await ws.presenceSubscribe(`91${targetNums[i]}@s.whatsapp.net`);
    return;
}