// all parsers are supposed to return list of objects where each object is an update of their college
// where each object will have two attributes & "innerText" and "link"
// ___________________________________
// returns data[manit] list of updates
const { load } = require('cheerio');
const base = 'https://www.iitg.ac.in/iitg_post_category?cate=ZHBsTmd0Y0VWdkJTRzU0ZU92bHAwdz09';

module.exports = async () => {
    var list = [];

    const res = await fetch('https://www.iitg.ac.in/iitg_post_category?cate=ZHBsTmd0Y0VWdkJTRzU0ZU92bHAwdz09');
    const html = await res.text();
    const $ = await load(html);
    $('tbody').find('tbody > tr > td > a').each(function (_index, element) {
        const optimisedLink = (($(element).attr('href').startsWith('http'))) ? $(element).attr('href') : (base + $(element).attr('href'));
        list.push({
            innerText: $(element).text(),
            linkArr: [optimisedLink],
        });
    });
    return list;
}

if(require.main=== module){
    (async ()=> {
        console.log(await require("./iitgParser.js")());
    })();
};