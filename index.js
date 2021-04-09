/*
 * Copyright (c) 2020 Gareth McNicol
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

const ConvertCompanyStream = require("./convert-company-stream");
const fetchRssForCompanyAsStream = require("./fetch-company-feed");
const FeedParser = require("feedparser");

const ApplyFilterRules = require("./apply-filter-rules");
const ScrapeCompanyNews = require("./scrape-company-news");
const ScoreParagraphs = require("./score-paragraphs");
const ScoreArticle = require("./score-article");

(async () => {
  const feedParser = new FeedParser({readableObjectMode: true});
  const convertCompanyStream = new ConvertCompanyStream();
  const applyFilterRules = new ApplyFilterRules();
  const scrapeCompanyNews = new ScrapeCompanyNews();
  const scoreParagraphs = new ScoreParagraphs();
  const scoreArticle = new ScoreArticle();
  scoreArticle.on("data", (data) => {
      console.log(`${data.date}: ${data.title} - red ${data.red} - green ${data.green} - y ${data.yellow} - b: ${data.blue}`);
    }
  );


  scrapeCompanyNews.on("data", data => console.log(data.paragraphs));
  const args = process.argv.slice(2);
  const stream = await fetchRssForCompanyAsStream(args[0]);
  stream.pipe(feedParser)
    .pipe(convertCompanyStream)
    //.pipe(applyFilterRules)
    .pipe(scrapeCompanyNews)
    .pipe(scoreParagraphs)
    .pipe(scoreArticle);
})();
