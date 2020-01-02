const PDFDocument = require('pdfkit');
const fs = require('fs');
const request = require('request');

const options = {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  };
 
 const https = require('https')

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
questions();

function getProfile(username, color) {

//get basic profile details
profile = '';
 https.get(`https://api.github.com/users/${username}` , options, (resp) => {
let data = '';

 
 resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
      profile = JSON.parse(data);
    getStars(profile, username, color);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

//get stars info
function getStars(profile, username, color){
stars = '';
https.get(`https://api.github.com/users/${username}/starred`, options, (resp) => {
    let data = '';
 
 resp.on('data', (chunk) => {
    data += chunk;

    
  });

  resp.on('end', () => {
    stars = JSON.parse(data);
    getImage(profile, stars, username, color);
    //console.log(JSON.parse(data).length);
    //questions();
  });


}).on("error", (err) => {
  console.log("Error: " + err.message);
});
};
};

function getImage(profile, stars, username, color) {
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download(profile.avatar_url, `${profile.login}.png`, function(){
  console.log('done');
  generatePDF(profile, stars, username, color)
});
}

function generatePDF(profile, stars, username, color) {
    //console.log(profile);
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream(`${profile.login}.pdf`));
    doc.fillColor(`${color}`)
    doc.image(`${profile.login}.png`, 50, 100, {width: 50, height: 50})
   .fontSize(25)
   .text(profile.login, 100, 100)
   //.image(profile.avatar_url, 100, 100)
   .fontSize(15)
   .text("location:", 100, 125)
   .text(profile.location, 110, 150)
   .text("profile link:", 100, 175)
   .text(profile.html_url, 110, 200)
   .text("blog:", 100, 225)
   .text(profile.blog, 110, 250)
   .text("bio:", 100, 275)
   .text(profile.bio, 110, 300)
   .text("repos:", 100, 325)
   .text(profile.public_repos, 110, 350)
   .text("followers:", 100, 375)
   .text(profile.followers, 110, 400)
   .text("following:", 100, 425)
   .text(profile.following, 110, 450)
   .text("stars:", 100, 475)
   .text(stars.length, 110, 500);
   doc.end();
}

    // console.log(JSON.parse(data).login);
    // console.log(JSON.parse(data).avatar_url);
    // console.log(JSON.parse(data).location);
    // console.log(JSON.parse(data).html_url);
    // console.log(JSON.parse(data).blog);
    // console.log(JSON.parse(data).bio);
    // console.log(JSON.parse(data).public_repos);
    // console.log(JSON.parse(data).followers);
    // console.log(JSON.parse(data).following);


// var userName = "";
// var userColour = "";

function questions() {
rl.question("What is your username? ", function(username) {
    rl.question("What is your favorite color? ", function(color) {
        console.log(`${username}, favorite color is ${color}`);
        getProfile(username, color);
        // generatePDF(profile, stars);
        rl.close();
    });
});
};

function close() {
rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});
}


// const questions = [
  
// ];

// function writeToFile(fileName, data) {
 
// }

// function init() {

// init();
// }