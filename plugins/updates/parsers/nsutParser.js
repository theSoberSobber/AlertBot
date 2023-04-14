// all parsers are supposed to return list of objects where each object is an update of their college
// where each object will have two attributes & "innerText" and "link"
// ___________________________________
// returns data[manit] list of updates
const { load } = require("cheerio");
const base = "http://nsut.ac.in";

module.exports = async () => {
  var list = [];

  const res = await fetch("http://nsut.ac.in/en/news");
  const html = await res.text();
  const $ = await load(html);
  $('div[class="views-row"]')
    .find("div > div > span > a")
    .each(function (_index, element) {
      const optimisedLink = $(element).attr("href").startsWith("http")
        ? $(element).attr("href")
        : base + $(element).attr("href");
      if (
        list.length == 0 ||
        list[list.length - 1].innerText != $(element).text()
      )
        list.push({
          innerText: $(element).text(),
          linkArr: [],
        });
      list[list.length - 1].linkArr.push(optimisedLink);
    });
  return list;
};

if (require.main === module) {
  (async () => {
    console.log(await require("./nsutParser.js")());
  })();
}
