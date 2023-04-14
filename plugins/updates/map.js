// import your colleges parser here
// const manitParser = require('./parsers/manitParser.js');

// ______________________________________________

module.exports = {
  // add your colleges name here
  // IMPORTANT - please add the same name that you used while registering your AlertBot groups
  // If you haven't got your group yet then make a group, add the bot and run "/setup dtu"
  // write keys in lower case only, for example don't write MANIT instead of manit
  iiitbh: require("./parsers/iiitbhParser.js"),
  iitg: require("./parsers/iitgParser.js"),
  manit: require("./parsers/manitParser.js"),
  nsut: require("./parsers/nsutParser.js"),
};
