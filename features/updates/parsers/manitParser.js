// all parsers are supposed to return list of objects where each object is an update of their college
// where each object will have two attributes & "innerText" and "link"
// ___________________________________
// returns data[manit] list of updates
const { load } = require('cheerio');

module.exports = async () => {
    var list = [];

    const res = await fetch('http://www.manit.ac.in/')
    const html = await res.text();
    const $ = load(html);
    $('div[class="modal-body quick"]').find('div > p > a').each(function (_index, element) {
        list.push({
            innerText: $(element).text(),
            link: $(element).attr('href'),
        })
    });
    return list;
}