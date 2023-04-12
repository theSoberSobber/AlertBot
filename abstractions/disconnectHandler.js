const {Boom} = require("@hapi/boom");
module.exports = async (DisconnectReason, lastDisconnect) => {
  let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
  if (reason === DisconnectReason.badSession) {
    console.log(`Bad Session File, Please Delete Session and Scan Again`);
  } else if (reason === DisconnectReason.connectionClosed) {
    console.log("Connection closed, reconnecting....");
  } else if (reason === DisconnectReason.connectionLost) {
    console.log("Connection Lost from Server, reconnecting...");
  } else if (reason === DisconnectReason.connectionReplaced) {
    console.log(
      "Connection Replaced, Another New Session Opened, Please Close Current Session First"
    );
  } else if (reason === DisconnectReason.loggedOut) {
    console.log(`Device Logged Out, Please Scan Again And Run.`);
  } else if (reason === DisconnectReason.restartRequired) {
    console.log("Restart Required, Restarting...");
  } else if (reason === DisconnectReason.timedOut) {
    console.log("Connection TimedOut, Reconnecting...");
  } else ws.end(`Unknown DisconnectReason: ${reason}|${connection}`);
};