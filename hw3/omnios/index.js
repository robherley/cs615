const fs = require('fs');
const file = fs.readFileSync('./traceroute.snoop.txt', { encoding: 'utf8' });

const traceroute = fs.readFileSync('./traceroute.txt', { encoding: 'utf8' });
const splitlines = file.split('\n');

const ord = n => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

const findHop = ip => {
  for (let [i, hop] of Object.entries(traceroute.split('\n'))) {
    if (hop.includes(ip)) {
      return ord(~~i + 1);
    }
  }
  console.log('hop not found for', ip);
  process.exit(1);
};

for (let _line of splitlines) {
  let line = _line.split(/\s+/);
  if (line.includes('DNS')) {
    if (line.includes('Error:')) {
      if (line.includes('3(Name')) {
        console.log('- DNS Name Error');
      } else {
        console.log('- DNS Server Fail Error (Probably Firewall)');
      }
      console.log(_line, '\n');
    } else {
      let rev = line[7]
        .substr(0, line[7].length - 14)
        .split('.')
        .reverse()
        .join('.');
      let hop = findHop(rev);
      console.log(`- DNS Pointer - Reverse Lookup of ${hop} Hop`);
      console.log(_line);
    }
  } else if (line.includes('ICMP')) {
    let ip = line[line.indexOf('->') - 1];
    let hop = findHop(ip);
    if (line.includes('unreachable')) {
      console.log(`- ${hop} Hop - UDP Unreachable`);
    } else {
      console.log(`- ${hop} Hop`);
    }
    console.log(_line, '\n');
  } else if (line.includes('UDP')) {
    // let ip = line[line.indexOf('->') + 1];
    // let hop = findHop(ip);
    // console.log(line);
    console.log('(UDP to Destination)', '\n');
    // console.log(_line, '\n');
  } else {
    console.log('how did i get here');
    console.log(_line, '\n');
  }
}
