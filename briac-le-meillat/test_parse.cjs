const fs = require('fs');
const content = fs.readFileSync('src/content/rt/cb-etude.md', 'utf-8');
const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
console.log('Match:', !!match);
if(match) console.log(match[1]);
