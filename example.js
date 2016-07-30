'use strict';
/* jshint devel:true */
const childProcess = require('child_process');
const fs = require('fs');

let jiraDetectRegExp = new RegExp(/^\[?([A-Z]+-[0-9]+\]?)/);
let commitMessagePath = process.argv[2];

let branchName = childProcess.execSync('git status --porcelain --long');
branchName = branchName.toString().split('\n')[0].substring(10);
let branchPrefix = jiraDetectRegExp.exec(branchName);
branchPrefix = branchPrefix ? branchPrefix[0] : null;

let commitMessage = fs.readFileSync(commitMessagePath, 'utf8');
let commitBranch = jiraDetectRegExp.exec(commitMessage);
commitBranch = commitBranch ? commitBranch[0] : null;

let newCommitMessage;

if (!commitBranch && !branchPrefix) {
    console.log('Jira prefix not specified in commit and not on Jira labeled branch, prepending [NO-JIRA]...');
    newCommitMessage = '[NO-JIRA] ' + commitMessage;
} else if (!commitBranch){
    console.log('Jira prefix not specified in commit, prepending branch Jira prefix...');
    newCommitMessage = '[' + branchPrefix + '] ' + commitMessage;
} else {
    console.log('Jira prefix present in commit message, ignoring...');
    newCommitMessage = commitMessage;
}

fs.writeFileSync(commitMessagePath, newCommitMessage, 'utf8');
