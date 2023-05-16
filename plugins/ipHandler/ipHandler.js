module.exports = async (ws, path_ipFile) => {
  const { readFile, writeFile } = require("fs/promises");
  const { setData } =  require("./updateGist.js");
  let gotTest = await fetch("https://checkip.amazonaws.com/");
  gotTest = await gotTest.text();
  console.log(gotTest);
  const toTest = await readFile(path_ipFile, "utf-8");
  if (!(toTest === gotTest)) {
    await require("./notifyMe.js")(ws, gotTest);
    await writeFile(path_ipFile, gotTest, "utf-8");
    await setData({ip: gotTest});
  }
};