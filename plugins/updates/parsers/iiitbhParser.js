// all parsers are supposed to return list of objects where each object is an update of their college
// where each object will have two attributes & "innerText" and "link"
// ___________________________________
// returns data[manit] list of updates
const { load } = require("cheerio");
const base = "https://www.iiitbhopal.ac.in/media/notice";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

// needs a rewrite to be able to group links in linkArr, nsut one also needs

module.exports = async () => {
  var list = [];

  let res = await fetch(
    "https://www.iiitbhopal.ac.in/api/CMSData/GetNoticeData1?Category=Notice"
  );
  res = await res.json();
  // console.log(res);

  for (let i in res) {
    // %4 pe 1,2,3 remainder vale concat karne for link
    let link = "";
    for (let j in res[i]["NoticeData"].split(";")) {
      if (j % 4 == 0) {
        link += base;
        continue;
      }
      if (j % 4 == 3) link += ".";
      else link += "/";
      link += res[i]["NoticeData"].split(";")[j].toLowerCase();
      if (j % 4 == 3) {
        if (
          list.length == 0 ||
          list[list.length - 1].innerText != res[i]["Title"]
        )
          list.push({
            innerText: res[i]["Title"],
            linkArr: [],
          });
        list[list.length - 1].linkArr.push(link);
        link = "";
      }
    }
  }
  return list;
};

if (require.main === module) {
  (async () => {
    console.log(await require("./iiitbhParser.js")());
  })();
}
