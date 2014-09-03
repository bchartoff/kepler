var fs = require('fs'),
    readline = require('line-by-line'),
    stream = require('stream'),
    moment = require('moment');
    _ = require('underscore');    


var root = 'data/';
var dir = 'comet/';

var count = 0;

var arr = [];
var currGroup = {};
var withinLn = 0;

var files = fs.readdirSync(root+dir);
files = _.reject(files, function(f){
            return f == ".DS_Store"
        })

files.forEach(function (file) {
  if (file !== ".DS_STORE") {
    start = false;
    end = false;

    fs.readFileSync(root + dir + file).toString().split('\r').forEach(function (line) {

      if 
        (line == "$$SOE") {
         start = true;
      } 
      else if 
        (line == "$$EOE") {
         end = true;
      } 
      else if 
        (start === true && end === false) {

          if 
            (withinLn == 0) {
              // console.log(line)
              currGroup = {};
              var date = line.match(/(A\.D\. )(.*\))/);
              currGroup.time = date[2];
              withinLn++;
          } 
          else if 
            (withinLn == 1) {
              currGroup.pos = line.replace(/  /g, " ").trim().split(" ");
               withinLn++;              
          }
          else if 
            (withinLn == 2) {
              currGroup.vel = line.replace(/  /g, " ").trim().split(" ");
               withinLn++;              
          }
          else if 
            (withinLn == 3) {
              arr.push(currGroup);
              withinLn = 0;
          }


      } 
    });
    // rl.on('end', function() {
    //   // file.close();
    //   count++;
    //   if (count == files.length) {
    //     fs.writeFileSync(root+"comets.json", JSON.stringify(arr, null, 4));
    //   }
    // });

    // rl.on('error', function (err) {
    //     console.log(err)
    // });

      count++;
      console.log(arr.length, count, files.length)
      if (count == files.length) {
        fs.writeFileSync(root+"comets.json", JSON.stringify(arr, null, 4));
      }
    }
});