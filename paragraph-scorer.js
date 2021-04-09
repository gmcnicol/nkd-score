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

/*
 red
 challenging, difficult, unpredictable, lower, poor, difficult, tough, below expectations, Brexit
 
 green
 exceeding expectations, positive, favourable, profit up, excellent, transformational
 
 yellow
 in line with expectations, cash
 
 blue
 debt, borrowings
 */

const RED = /challenging|difficult|unpredictable|lower|poor|tough|below expectations|brexit/gi;
const GREEN = /exceeding expectations|positive|favourable|profit up|excellent|transformational/gi;
const BLUE = /debt|borrowings/gi;
const YELLOW = /in line with expectations|cash/gi;

function getTextScoreForRegex(text, regex) {
  const match = text.match(regex);
  return match ? match.length : 0;
}

function getRedScore(paragraph) {
  return getTextScoreForRegex(paragraph.text, RED);
}

function getGreenScore(paragraph) {
  return getTextScoreForRegex(paragraph.text, GREEN);
}

module.exports = (paragraph) => {
  paragraph.red = getRedScore(paragraph);
  paragraph.green = getGreenScore(paragraph);
  paragraph.blue = getTextScoreForRegex(paragraph.text, BLUE);
  paragraph.yellow = getTextScoreForRegex(paragraph.text, YELLOW);
  return paragraph;
};