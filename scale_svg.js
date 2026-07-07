const fs = require('fs');
const file = process.argv[2];
const scale = parseFloat(process.argv[3]);

let content = fs.readFileSync(file, 'utf8');

content = content.replace(/([-\d.]+)/g, (match, num) => {
  if (num === '0') return '0';
  if (num === '1.0') return '1.0';
  if (num === '1.1') return '1.1';
  if (num === '2000') return '2000';
  if (num === '10') return (10 * scale).toFixed(2); // stroke-miterlimit
  return (parseFloat(num) * scale).toFixed(2).replace(/\.00$/, '');
});

console.log(content);
