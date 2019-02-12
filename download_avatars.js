var request = require('request');
var fs = require('fs')
var secrets = require('./secrets.js')

// Get input from command line
var [arg1, arg2] = process.argv.slice(2)

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath));       
}

function downloadImageByContributor(contributor) {
  const path = '.avatars/' + contributor.login
  downloadImageByURL(contributor['avatar_url'], `./avatars/${contributor['login']}.jpg`)
}

// Takes a contributor object and shows its properties
function showContributorAvatarUrl(contributor) {
  console.log(`${contributor.login}: ${contributor.avatar_url}`)
}

// Takes an array of contributor objects, show each
function showContributors(contributors) {
  contributors.forEach(showContributorAvatarUrl)
  // contributors.forEach(downloadImageByContributor)
}

// request url
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };  
  request(options, function(err, res, body) {
    const data = JSON.parse(body)
    cb(err, data);
  });
}

getRepoContributors(arg1, arg2, function(err, result) {
  if (err) {
    throw err
  }
  showContributors(result)
});
