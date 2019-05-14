const fs = require("fs");
const Snoowrap = require("snoowrap");
//const Snoostorm = require("snoostorm");
const creds = JSON.parse(fs.readFileSync("creds.json"));
var commentedPosts = JSON.parse(fs.readFileSync("commentedPosts.json"))
const settings = JSON.parse(fs.readFileSync("settings.json"))
const adjectives = JSON.parse(fs.readFileSync("adjectives.json"));
const adverbs =  JSON.parse(fs.readFileSync("adverbs.json"));
const nouns = JSON.parse(fs.readFileSync("nouns.json"));
const expletives = JSON.parse(fs.readFileSync("expletives.json"));
const r = new Snoowrap({
  userAgent: "random-insults-bot",
  clientId: creds.client,
  clientSecret: creds.secret,
  username: creds.username,
  password: creds.password
});
setInterval(cycle, parseInt(settings.interval))
//cycle();
var cycleTime = 0
function cycle() {
  if(cycleTime >= settings.subreddits.length) {
    cycleTime = 0;
  }
  r.getSubreddit(settings.subreddits[cycleTime]).getControversial().then(insult);
  cycleTime++;
}

function insult(posts) {
  var post = posts[parseInt(Math.random()*posts.length)];
  //console.log(post);
  if(!commentedPosts.includes(post.id)) {
    var adverbChoice = ["",randomChoice(adverbs) + " "];
    var adverb = randomChoice(adverbChoice);
    var adjective = randomChoice(adjectives);
    var expletive = randomChoice(expletives);
    var noun = randomChoice(nouns);
    var insult = "you " + adverb + adjective + " " + expletive + " " + noun
    console.log(insult + " in " + settings.subreddits[cycleTime-1]);
    post.reply(insult);
    commentedPosts.push(post.id);
    var json = JSON.stringify(commentedPosts);
    fs.writeFile("commentedPosts.json",json,"utf8",callback);
  } else {
    //console.log("no new posts");
  }
}

function callback(err, data) {
  if (err){
    console.log(err);
  }
}

function randomChoice(list) {
  return list[parseInt(Math.random()*list.length)];
}
