module.exports = async (ws, path_ipFile) => {
    const {readFile, writeFile} = require('fs/promises');
    let gotTest = await fetch("https://checkip.amazonaws.com/");
    gotTest = await gotTest.text();
    console.log(gotTest);
    const toTest = await readFile(path_ipFile, "utf-8")

    if(!(toTest===gotTest)){
        const newUrl = `http://${gotTest}:3000/groupIds/`;
        const res = await fetch(newUrl);
        let obj = await res.text();
        obj = await JSON.parse(obj);
        for (const collegeName in obj){
            for(const jid of obj[collegeName]){
                console.log(jid);
                const message = `the IP for the server has changed, we're sorry for the inconvineance caused.
The new URL for your college is ${gotTest}:3000/${collegeName}/group`
                await ws.sendMessage(jid, { text: message });
                await ws.sendMessage(jid, { text: `Brought to you by https://alert-bot.vercel.app` });
            }
        }
        await writeFile(path_ipFile, gotTest, "utf-8");
    }
}