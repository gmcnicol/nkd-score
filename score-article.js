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

const Transform = require("stream").Transform;

class ScoreArticle extends Transform {
  
  constructor(opts) {
    opts = {
      readableObjectMode: true,
      writableObjectMode: true
    };
    
    super(opts);
  }
  
  
  _transform(chunk, encoding, callback) {
    chunk.red = chunk.paragraphs.reduce(function (total, currentValue) {
      return total + currentValue.red;
    }, 0);
    
    chunk.green = chunk.paragraphs.reduce(function (total, currentValue) {
      return total + currentValue.green;
    },0);
    
    chunk.blue = chunk.paragraphs.reduce(function (total, currentValue) {
      return total + currentValue.blue;
    }, 0);
    
    chunk.yellow = chunk.paragraphs.reduce(function (total, currentValue,) {
      return total + currentValue.yellow;
    }, 0);
    
    callback(null, chunk);
  }
}

module.exports = ScoreArticle;