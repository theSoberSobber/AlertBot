require("../../AlertBot.config.js");
module.exports = notifyMe = async (ws, gotTest) => {
  for (let i in debugNums) {
    // await ws.sendMessage(`91${debugNums[i]}@s.whatsapp.net`, {text: `The ip has changed, here's the ssh command as of now`,});
    await ws.sendMessage(`91${debugNums[i]}@s.whatsapp.net`, {
      text: `ssh u0_a343@${gotTest} -p 8022`,
    });
  }
  return;
};
