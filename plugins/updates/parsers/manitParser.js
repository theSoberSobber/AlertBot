// all parsers are supposed to return list of objects where each object is an update of their college
// where each object will have two attributes & "innerText" and "link"
// ___________________________________
// returns data[manit] list of updates
const { load } = require("cheerio");
const base = "http://www.manit.ac.in";

module.exports = async () => {
  var list = [];

  const res = await fetch("http://www.manit.ac.in/");
  const html = await res.text();
  const $ = await load(html);
  $('div[class="modal-body quick"]')
    .find("div > p > a")
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
