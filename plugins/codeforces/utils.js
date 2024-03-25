// Codeforces Plugin

const fs = require('fs').promises;

const getRandomQuestion = async () => {
  const baseUrl = "https://codeforces.com/api/problemset.problems";
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

  try {
    const response = await fetch(baseUrl);
    const responseData = await response.json();

    if (responseData.status !== "OK") {
      return -1;
    }

    const problems = responseData.result.problems;
    const probIndex = getRandomInt(problems.length);
    const problem = problems[probIndex];

    return `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
  } catch (error) {
    return -2;
  }
};

const getRankList = async (grpId, roundNumber) => {
  let url = `https://codeforces.com/api/contest.standings?contestId=${roundNumber}&from=1&showUnofficial=true&handles=`;
  let map = await returnLookupMap();
  map = map[grpId];
  for (let number in map){
    let handle = map[number];
    url+=handle;
    url+=";";
  }
  url = url.substring(0, url.length - 1);
  try {
    const response = await fetch(url);
    const contestData = await response.json();

    if (contestData.status !== "OK") {
      return -1;
    }

    const rows = contestData.result.rows;
    
    const mp = {};
    for (let i in rows){
      if(mp[rows[i].party.members[0]["handle"]]==undefined) mp[rows[i].party.members[0]["handle"]] = {};
      mp[rows[i].party.members[0]["handle"]]["rank"] = rows[i].rank;
    }

    for (let row in rows){
      const user = rows[row];
      const results = user.problemResults;
      if(mp[user.party.members[0]["handle"]]["questions"]==undefined) mp[user.party.members[0]["handle"]]["questions"] = [];
      for (let problemIdx of results.keys()){
        if(results[problemIdx].points) mp[user.party.members[0]["handle"]]["questions"].push(String.fromCharCode(problemIdx + 'A'.charCodeAt(0)));
      }
    }
    
    return mp;

  } catch (error) {
    console.error("Error fetching submission data:", error);
    return -2;
  }
};

const getVerificationResult = async (url, handle) => {
  const submissionUrl = `https://codeforces.com/api/user.status?handle=${handle}`;
  try {
    const response = await fetch(submissionUrl);
    const submissionData = await response.json();

    if (submissionData.status !== "OK") {
      return -1;
    }

    const latestSubmission = submissionData.result[0];
    // console.log(latestSubmission);
    if ((latestSubmission.problem.contestId == url.split("/").slice(-2, -1)) && (latestSubmission.problem.index == url.split("/").slice(-1)) && (latestSubmission.verdict == "COMPILATION_ERROR")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching submission data:", error);
    return -2;
  }
};

const handleVerificationResult = async (result, number, grpId, handle) => {
  try {
    if (!result) return;
    const filePath = './data/mapCF.json';
    let map = {};
    try {
      const jsonData = await fs.readFile(filePath, 'utf8');
      map = JSON.parse(jsonData);
    } catch (error) {
      console.error('Error reading mapCF.json:', error);
    }
    if(map[grpId]==undefined) map[grpId] = {};
    map[grpId][number] = handle;
    await fs.writeFile(filePath, JSON.stringify(map, null, 2));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const returnLookupMap = async () => {
  try {
    const jsonData = await fs.readFile('./data/mapCF.json', 'utf8');
    const lookupMap = JSON.parse(jsonData);
    return lookupMap;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const lookupMap = async (number, grpId) => {
  try {
    let map = await returnLookupMap();
    map = map[grpId];
    if(map==undefined) return `Codeforces Account for ${number} not found`;
    number = `91${number}@s.whatsapp.net`;
    if (map.hasOwnProperty(number)) {
      return `Codeforces Account for ${number} as linked is ${map[number]}`;
    } else {
      return `Codeforces Account for ${number} not found`;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {getRandomQuestion, getVerificationResult, handleVerificationResult, returnLookupMap, lookupMap, getRankList};
