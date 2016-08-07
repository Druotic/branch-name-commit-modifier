#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var TARGET_PATH = path.resolve('./../../.git/hooks/commit-msg');
console.log(TARGET_PATH);
copyFile('index.js', TARGET_PATH, function (err) {
    if (err) {
        console.log('ERROR: ', err);
        return;
    }
    console.log('copied');
    childProcess.execSync('chmod u+x ' + TARGET_PATH);
});

function copyFile(source, target, cb) {
  console.log('Source: ', source, ' Target: ', target);
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on('error', function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on('error', function(err) {
    done(err);
  });
  wr.on('close', function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
