// Modules

var request = require('request');
var fs = require('fs')
var secrets = require('./secrets.js')

// Functions

// Get input from command line

const downloadImageByURL = (url, filePath) => {
  request.get(url)
    .on('error', function (err) {
      throw err
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath));       
}

const downloadImageByContributor = (contributor) => {
  const path = '.avatars/' + contributor.login
  downloadImageByURL(contributor['avatar_url'], `./avatars/${contributor['login']}.jpg`)
}

// Takes a contributor object and shows its properties
const showContributorAvatarUrl = (contributor) => {
  console.log(`${contributor.login}: ${contributor.avatar_url}`)
}

// Takes an array of contributor objects, show each
const showContributors = (contributors) => {
  contributors.forEach(showContributorAvatarUrl)
  // contributors.forEach(downloadImageByContributor)
}

// request url
const getRepoContributors = (repoOwner, repoName, cb) => {
  const options = {
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

const getArguments = () => {
  const [repoOwner, repoName] = process.argv.slice(2)
  if (repoOwner === undefined || repoName === undefined) {
    console.error('error: not enough arguments')
    console.error('usage: node download_avatars.js [repo-owner] [repo-name]')
    process.exit(1)
  }
  return { repoOwner, repoName }
}

// Main program

const { repoOwner, repoName } = getArguments()

getRepoContributors(repoOwner, repoName, function(err, result) {
  if (err) {
    throw err
  }
  showContributors(result)
});

