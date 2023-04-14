#!/usr/bin/node
const map = require("./map.js");
const { readFile, writeFile } = require("fs/promises");
// const fetch = require("node-fetch");

async function checkAndReturn(pathOfDump, name) {
  // the name and parser are coming from the map
  const gotTest = await map[name]();
  let file;
  try {
    file = await readFile(pathOfDump, "utf-8");
  } catch (e) {
    console.log("Failed to read file!" + e);
    return [];
  }
  let toTest;
  file = await JSON.parse(file);
  if (!file[name]) {
    file[name] = [];
  }
  toTest = file;
  if(toTest[name]===undefined) toTest[name]=[];
  toTest = toTest[name];
  const diff = [];

  // console.log("===============TO TEST=========");
  // console.log(toTest);
  // console.log("===============GOT TEST=========");
  // console.log(gotTest);
  if (toTest) {
    for (const e of gotTest) {
      if (!toTest.filter((item) => item.linkArr[0] === e.linkArr[0]).length)
        diff.push(e);
    }
    if (!diff.length) return [];
  }
  file[name] = gotTest;
  console.log("i am the dfference array", diff);
  await writeFile(pathOfDump, JSON.stringify(file), "utf-8");

  return diff;
}

module.exports = {
  checkAndReturn,
};
