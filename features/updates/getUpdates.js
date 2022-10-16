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

    let toTest;
    file = await JSON.parse(file);
    if(!file[name]){
        file[name] = [];
    }
    toTest = file;
    toTest = toTest[name]
    const diff = [];

    if(!toTest[name]){    
        for (const e of gotTest)
            if (!(toTest.filter(item => item.link === e.link).length))
                diff.push(e);

        if (!diff.length)
            return 0;
    }
    file[name] = gotTest;
    console.log(file);
    await writeFile(pathOfDump, JSON.stringify(file), "utf-8");
    // console.log('I wrote data.json')

    return diff;
}

module.exports = {
    checkAndReturn
}

if (require.main === module) {
    checkAndReturn("C:/Users/Pavit Chhabra/Desktop/Chapter-BOTs/AlertBot/data.json", "manit");
}