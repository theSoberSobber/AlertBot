#!/usr/bin/node
const map = require('./map.js');
const { readFile, writeFile } = require('fs/promises');
// const fetch = require("node-fetch");

async function checkAndReturn(pathOfDump, name) {
    // the name and parser are coming from the map
    // console.log(map[name]);
    const gotTest = await map[name]();
    // console.log(gotTest);
    let file = await readFile(pathOfDump, "utf-8");

    let toTest = await JSON.parse(file);
    toTest = toTest[name];
    // for some reason toTest ke parameters are inaccesible, is it converting to JSON?
    // const testJson =  {
    //     "a": ["b", "c"]
    // }
    // console.log(testJson);
    // console.log(toTest);
    // const c = "manit";
    // console.log(toTest[c]);

    const diff = [];
    
    for (const e of gotTest)
        if (!(toTest.filter(item => item.link === e.link).length))
            diff.push(e);

    if (!diff.length)
        return 0;

    file[name] = gotTest;
    console.log(file);
    await writeFile(pathOfDump, file, "utf-8");
    console.log('I wrote data.json')

    return diff;
}

module.exports = {
    checkAndReturn
}

if (require.main === module) {
    checkAndReturn("C:/Users/Pavit Chhabra/Desktop/Chapter-BOTs/AlertBot/data.json", "manit");
}