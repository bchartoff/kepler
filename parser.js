var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream'),
    moment = require('moment');

var instream = fs.createReadStream('data/horizons_results-neptune.txt');
var outstream = new stream;
outstream.readable = true;
outstream.writable = true;

var rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false
});

var count = 0;
var start = false;
var end = false;
var arr = [];
var currGroup = {};
var withinLn = 0;
var lnGroup = 0

rl.on('line', function(line) {
  if 
    (line == "$$SOE") {
     start = true;
  } 
  else if 
    (line == "$$EOE") {
     end = true;
  } 
  else if 
    (start === true && end !== true) {
      if 
        (withinLn == 0) {
          currGroup = {};
          var date = line.match(/(A\.D\. )(.*\))/);
          currGroup.time = date[2];
      } 
      else if 
        (withinLn == 1) {

          currGroup.pos = line.replace(/  /g, " ").trim().split(" ");
      }
      else if 
        (withinLn == 2) {
          currGroup.vel = line.replace(/  /g, " ").trim().split(" ");
      }
      else if 
        (withinLn == 3) {
      }
      else if 
        (withinLn == 4) {
          console.log(JSON.stringify(currGroup))
          withinLn = 0;
          lnGroup++;
          arr.push(currGroup)
      } 
      withinLn++;

  } else if 
    (start === true && end === true) {
      rl.write(arr);
  }

  count++;
    //Do your stuff ...
    //Then write to outstream
    // rl.write(null, {ctrl: true, name: 'u'});
});