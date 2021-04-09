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
"use strict";
const puppeteer = require("puppeteer");

async function clickAgree(page) {
  await page.waitForSelector("div#UtypeNotLoginPopup.login-popup-container div.login-popup.popup-sub div.content p.login-popu-para span.login-btn-normal");
  await page.evaluate(_ => {
    NonLoginPrivateUser();
  });
}

async function getParagraphText(page, currentParagraph) {
  let text = await page.evaluate(p => p.textContent, currentParagraph);
  text = text.replace(/\r?\n|\r/g, " ").trim();
  return text.toLowerCase();
}

async function processContent(page) {
  await page.waitForSelector("#ArticleContent");
  const content = await page.$$("#ArticleContent p");
  let paragraphs = [];
  
  for (let i = 0; i < content.length; i++) {
    const currentParagraph = content[i];
    let text = await getParagraphText(page, currentParagraph);
    if (!!text) {
      paragraphs.push({text: text});
    }
  }
  return paragraphs;
}

module.exports = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 3840, height: 2160});
  await page.goto(url.href);
  await clickAgree(page);
  let paragraphs = await processContent(page);
  await browser.close();
  return paragraphs;
};
