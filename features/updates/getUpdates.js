#!/usr/bin/node
const map = require('./map.js');
const { readFile, writeFile } = require('fs/promises');
// const fetch = require("node-fetch");

async function checkAndReturn(pathOfDump, name) {
    // the name and parser are coming from the map
    const gotTest = await map[name]();
    let file;
    try {
        file = await readFile(pathOfDump, "utf-8");
    } catch (e){
        console.log("Failed to read file!" + e);
        return [];
    }

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

    await writeFile(pathOfDump, JSON.stringify(file), "utf-8");

    return diff;
}

module.exports = {
    checkAndReturn
}