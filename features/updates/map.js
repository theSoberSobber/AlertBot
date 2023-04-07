// import your colleges parser here
// const manitParser = require('./parsers/manitParser.js');

// ______________________________________________

module.exports = {
    // add your colleges name here
    // IMPORTANT - please add the same name that you used while creating your AlertBot groups
    // If you haven't got your group yet then visit `${base_uri}/[collegeName]/group`
    // write keys in lower case only, for example don't write MANIT instead of manit
    "manit": require('./parsers/manitParser.js')
    // "dtu": require('./parsers/dtuParser.js')
}
