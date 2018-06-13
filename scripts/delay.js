#!/usr/bin/env node
var args = process.argv.slice(2)
var delay = args[0]

if (delay != parseInt(delay)) {
  return console.error('incorrect delay value: ' + delay);
}

console.log(`Delaying ${(delay / 1000).toFixed(2)} seconds...`);
// setTimeout(function() {process.exit(0)}, delay);

let total = 0;
const interval = 1000;
const intervalTimer = setInterval(() => {
  total += interval;
  if (total >= delay) {
    return process.exit(0);
  }
  if (total % 5000 === 0) { console.log(`${((delay - total) / 1000).toFixed(2)}s of delay remaining...`); }
}, 1000);
