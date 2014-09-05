var fs = require('fs'),
    readline = require('line-by-line'),
    stream = require('stream'),
    moment = require('moment');
    _ = require('lodash');    


// var root = 'data/';
var root = "/data/";

var body;

var count = 0;

var arr = [];
var currGroup = {};
var groupCount = 0;
var withinLn = 0;
var groupOut = {};


parseFiles("/data/comet/", "comets.json", false)
parseFiles("/data/planets/", "planets.json", true)

function parseFiles(dir, output, groupSummary) {
  var files = fs.readdirSync(__dirname + dir);
  files = _.reject(files, function(f){
              return f == ".DS_Store";
          });

  files.forEach(function (file) {
      start = false;
      end = false;
      groupCount = 0;

      //can break a lodash each loop?
      _.each(fs.readFileSync(__dirname + dir + file).toString().split('\r') ,function (line) {

          if 
            (line == "$$SOE") {
             start = true;
          } 
          else if 
            (line == "$$EOE") {
             end = true;
          } 
          else if 
            (line.indexOf("Target body name") > -1) {
              body = line.match(/(Target body name: )(.*\))/)[2];
          }
          else if 
            (start === true && end === false) {

              if 
                (withinLn == 0) {
                  // console.log(line)
                  currGroup = {};
                  var date = line.match(/(A\.D\. )(.*\))/);

                  // "time": "2012-Jan-01 00:00:00.0000 (CT)"
                  // 2014-Jul-06 21:00:00.0000 (CT)

                  currGroup.time = moment(date[2].trim(), "YYYY-MMM-DD HH:mm:ss.SSSS ----");
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
                  groupCount++;
              }
          } 
        
      });

      count++;

      if (groupSummary === true) {
        groupOut[body] = arr[0];
      } 

      if (count == files.length) {
          var out = {}
          out[body] = arr;
          if (groupSummary === true) {
            var first = _.first(groupOut);
            fs.writeFileSync(__dirname + root + output, JSON.stringify(groupOut, null, 4));

          } else {
            fs.writeFileSync(__dirname + root + output, JSON.stringify(out, null, 4));
          }
        
      }

    
  });
}