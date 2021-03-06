#!/usr/bin/env node
'use strict';
/*jshint devel:true*/

var childProcess = require('child_process');
var fs = require('fs');

function main (options) {
    if (!options) {
        return;
    }
    var commitMessagePath = options.commitPath;

    var preChar = options.preChar || '[';
    var postChar = options.postChar || ']';
    var delimChar = options.delimiter || '-';

    var projectName = options.projectName || '[A-Z]+';

    var regExpString = '^\\' + preChar + '?';
    regExpString += '(' + projectName + delimChar;
    regExpString += '[0-9]+\\' + postChar + '?' + ')';

    var detectRegExp = new RegExp(regExpString);

    var gitBranch = childProcess.execSync('git status --porcelain --long');
    gitBranch = gitBranch.toString().split('\n')[0].substring(10);
    var gitBranchPrefix = detectRegExp.exec(gitBranch);
    gitBranchPrefix = gitBranchPrefix ? gitBranchPrefix[0] : null;

    var commitMessage = fs.readFileSync(commitMessagePath, 'utf8');
    var commitBranch = detectRegExp.exec(commitMessage);
    commitBranch = commitBranch ? commitBranch[0] : null;

    var newCommitMessage;

    if (!commitBranch && !gitBranchPrefix) {
        console.log('Issue prefix not specified in commit and not on issue labeled branch, prepending NO-ISSUE...');
        newCommitMessage = preChar + 'NO-ISSUE' + postChar + ' ' + commitMessage;
    } else if (!commitBranch){
        console.log('Issue prefix not specified in commit, prepending branch issue prefix...');
        newCommitMessage = preChar + gitBranchPrefix + postChar + ' ' + commitMessage;
    } else {
        console.log('Issue prefix present in commit message, ignoring...');
        newCommitMessage = commitMessage;
    }
    fs.writeFileSync(commitMessagePath, newCommitMessage, 'utf8');
}

function getConfig () {
    var config = require('../../package.json').config.branchNameCommitModifier;
    config.commitPath = process.argv[2];
    main(config);
}

getConfig();
