const fs = require('fs');
const file = fs.readFileSync('./traceroute.snoop.txt', { encoding: 'utf8' });

const traceroute = fs.readFileSync('./traceroute.txt', { encoding: 'utf8' });
const splitlines = file.split('\n').map(e => e.split(' '));
