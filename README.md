# branch-name-commit-modifier

This module installs a commit-msg hook that will prepend a project issue number inferred from either the commit message or the current branch name. More details in the examples section below.

### Usage:

In your package.json add the field `config` and then add a subfield titled `branchNameCommitModifier`.

This is where you will put your options.

E.G.
```
{
  "name": "cool-stuff",
  "version": "1.0.0",
  "description": "this is some cool stuff",
  "main": "index.js",
  "scripts": {
    "test": "rm -rf /"
  },
  "author": "big dumb idiot face",
  "license": "MIT",
  "config": {
    "branchNameCommitModifier": {
      "preChar": "{",
      "postChar": "}",
      "projectName": "TESTPROJECT"
    }
  }
}
```

### Options:
`preChar` : this is the character that will appear before the issue prefix.

`postChar` : this is the character that will appear after the issue prefix.

`delimiter` : this is the character that will appear between the project name and the issue number.

`projectName` : this is the name of the project that will be searched for.

### Default options:

```javascript
{
    preChar: '[',
    postChar: ']',
    delimiter: '-'
}
```
The default for `projectName` is any sequence of characters A-Z.

The following will match the default `projectName` value.

```
AWESOMEPROJECT
EXPLODINGcapybaras
LearnToChopOnions
```

The follow will NOT match the default `projectName` value.

```
AWESOME-PROJECT
E-X-P-L-O-D-I-N-G*c%a%p%y%b%a^r%a@s
1337pr0j3ct
```

Therefore, if you need to use something like the previous specify a value for your `projectName` field.


### Examples:
config:
```
"config": {
  "branchNameCommitModifier": {
    "preChar": "{",
    "postChar": "}",
    "projectName": "TESTPROJECT"
}
```

current branch name `TESTPROJECT-9999`

commit command: `commit -m "TESTPROJECT-0001 fixing issue 0001."`

actual commit message value: `"TESTPROJECT-0001 fixing issue 0001."`

__Note:__ since you did not include the prefix character or the postfix character it did not include them in the actual commit message.

------------

same config & branch name as before

commit command: `commit -m "updated the stuff in the files."`

actual commit message value: `"{TESTPROJECT-9999} updated the stuff in the files."`

------------
config:
```
"config": {
  "branchNameCommitModifier": {
    "preChar": "{",
    "postChar": "}",
    "projectName": "TESTPROJECT"
}
```
current branch name `where am i`

commit command: `commit -m "idk what im doing lol."`

actual commit message value: `"{NO-ISSUE} idk what im doing lol."`

------------

### More details:

The commit message value will always take precedence over the branch name value.

If there are any errors during install it may be a permissions issue as the install scripts tries to do the following:

1. Copy the `index.js` into the project's `.git/hooks/commit-msg`
2. Add execute permissions to the newly copied file.

Therefore, if you wish to fix any errors you can try doing the preceding steps manually.
