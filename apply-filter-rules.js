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

const {Transform} = require("stream");
const RulesEngine = require("node-rules");
const moment = require("moment");

const now = moment();
const R = new RulesEngine();

const rules = [
  {
    "name": "article less than a year old",
    "condition": function (R) {
      const pubdate = moment(this.date);
      const years = moment.duration(pubdate.diff(now)).asYears();
      R.when(Math.abs(years) <= 2);
    },
    "consequence": function (R) {
      this.inDateRange = true;
      R.next();
    }
  },
  {
    "name": "article has results in title",
    "condition": function (R) {
      const title = this.title;
      const isReport = ["report", "results"].some(function (value) {
        return title.toLowerCase().indexOf(value) >= 0;
      });
      R.when(isReport);
    },
    "consequence": function (R) {
      this.isResult = true;
      R.next();
    }
  },
  {
    "name": "article has interim in title",
    "condition": function (R) {
      R.when(this.title.toLowerCase().indexOf("interim") >= 0);
    },
    "consequence": function (R) {
      this.isInterim = true;
      R.next();
    }
  },
  {
    "name": "article has preliminary in title",
    "condition": function (R) {
      R.when(this.title.toLowerCase().indexOf("preliminary") >= 0);
    },
    "consequence": function (R) {
      this.isPreliminary = true;
      R.next();
    }
  },
  {
    "name": "article has full year in title",
    "condition": function (R) {
      R.when(this.title.toLowerCase().indexOf("full year") >= 0);
    },
    "consequence": function (R) {
      this.isFullYear = true;
      R.next();
    }
  },
  {
    "name": "article has final in title",
    "condition": function (R) {
      R.when(this.title.toLowerCase().indexOf("final") >= 0);
    },
    "consequence": function (R) {
      this.isFullYear = true;
      R.next();
    }
  },
];
R.register(rules);

class ApplyFilterRules extends Transform {
  
  constructor(opts) {
    opts = opts || {};
    opts.writableObjectMode = true;
    opts.readableObjectMode = true;
    super(opts);
  }
  
  
  _transform(chunk, encoding, callback) {
    let pub = this;
    R.execute(chunk, function (result) {
      if (result.inDateRange && result.isResult) {// (result.isFullYear || result.isInterim || result.isPreliminary)) {
        pub.push(chunk);
      }
    });
    
    callback();
  }
}

module.exports = ApplyFilterRules;