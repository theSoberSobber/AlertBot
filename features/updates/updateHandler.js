const { readFile, writeFile } = require("fs/promises");
// ______________________________________________________________
// listen every X minutes for updates on the college website
// handles user interaction, actual checking is done by checkAndReturn from getUpdates()
// checkAndReturn returns updates list if that college has any
// and returns 0 if that college has none
// so main iterates over map and calls checkAndReturn for all and handles the subsequent interaction then

const { checkAndReturn } = require("./getUpdates");
const pathOfDump = "./data.json";
const map = require("./map.js");

const updateHandler = async (ws) => {
  // require('./features/ipHandler/ipHandler.js')(ws, './ip.txt');
  for (let name in map) {
    const result = await checkAndReturn(pathOfDump, name);
    // fetch all current group(s) associated with AlertBot
    // see https://github.com/theSoberSobber/Groups-AlertBot for more info on how Dynamic groups are generated!
    // const res = await fetch(`https://alert-bot.vercel.app/groupIds`);
    // let groupArr = await res.text();
    let groupArr = await readFile("./groups.json");
    try {
      groupArr = await JSON.parse(groupArr);
    } catch (err) {
      // fall back on a old cached info.json
      // TODO : Build Mechanism to cache info.json
      //   groupArr = await readFile("../../info.json");
      //   groupArr = await JSON.parse(groupArr);
      continue;
    }
    // for this the names in map must be the same as the one's used to create group links
    groupArr = groupArr[name];
    // console.log(groupArr);
    // const result =0;
    // now handle user interaction
    if (result.length != 0) {
      for (const jid of groupArr) {
        for (const i of result) {
          // console.log(i.linkArr);
          for (let j = 0; j < i.linkArr.length; j++) {
            try {
              if (i.linkArr[j].slice(-4) == ".pdf") {
                await ws.sendFile(jid, i.linkArr[j]);
              } else if (i.linkArr[j].slice(-4) == ".jpg") {
                await ws.sendImage(jid, i.linkArr[j]);
              } else {
                await ws.sendMessage(jid, {
                  text: i.linkArr[j],
                });
              }
            } catch (e) {
              console.log("Error sending result data" + e);
              console.log("Restarting!");
              return;
            }
          }
          await ws.sendMessage(jid, {text: i.innerText});
        }
        await ws.sendMessage(jid, {
          text: `Brought to you by https://alert-bot.vercel.app`,
        });
      }
    }
  }
};

module.exports = {
  updateHandler,
};
