const fs = require('fs');
const file = fs.readFileSync('./traceroute.dump.txt', { encoding: 'utf8' });

const traceroute = fs.readFileSync('./traceroute.txt', { encoding: 'utf8' });
const splitlines = file.split('\n').map(e => e.split(' '));

const ord = n => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

const findHop = ip => {
  for (let [i, hop] of Object.entries(traceroute.split('\n').splice(1))) {
    if (hop.includes(ip)) {
      return ord(~~i + 1);
    }
  }
  console.log('hop not found for', ip);
  process.exit(1);
};

for (let line of splitlines) {
  if (line.includes('NXDomain')) {
    console.log('- DNS Non-Existent Domain for <LOOKUP PORT>');
    console.log(line.join(' '), '\n');
  } else if (line.includes('PTR?')) {
    let rev = line[7]
      .substr(0, line[7].length - 14)
      .split('.')
      .reverse()
      .join('.');
    let hop = findHop(rev);
    console.log(`- DNS Pointer - Reverse Lookup of ${hop} Hop`);
    console.log(line.join(' '), '\n');
  } else if (line.includes('PTR')) {
    console.log(line.join(' '), '\n');
  } else if (line.includes('ICMP')) {
    let ip = line[2];
    let hop = findHop(ip);
    if (line.includes('unreachable')) {
      console.log(`- Unreachable ${hop} Hop (Probably Blocked by Firewall)`);
    } else {
      console.log(`- ${hop} Hop`);
    }
    console.log(line.join(' '), '\n');
  } else if (line.includes('UDP,')) {
    console.log('(UDP to Destination)', '\n');
  } else if (line.includes('ServFail')) {
    console.log('- DNS ServFail (Not sure what this is)');
    console.log(line.join(' '), '\n');
  } else {
    console.log('how did i get here');
    console.log(line.join(' '), '\n');
  }
}
