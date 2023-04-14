module.exports = notifyMe = async (ws, gotTest) => {
  ws.sendMessage("918815065180@s.whatsapp.net", {
    text: `hey the new ip is ${gotTest}`,
  });
};
