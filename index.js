var express = require('express');
var querystring = require('querystring');
var https = require('https');
var app = express();

//app.set('view engine', 'html');
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret:'VmBO4r35NLkY8G9'}));
    app.use(express.logger());
    app.use(express.static(__dirname+'/client'));
    app.use(app.router);
    app.use(function(req,res) {
        res.redirect('/');
    });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/',function(req, res){
    res.sendfile('client/index.html');
});

app.get('/authenticated', function(req,res) {
    res.sendfile('client/index.html');
});

app.get('/api',function(req,res) {
    var code = req.query.code;
    retrieveAccessToken(code,function(access){
        var accessJson = JSON.parse(access); 
        var accessToken = accessJson.access_token;
        getUserInfo(accessToken,function(userString) {
            var userInfo = JSON.parse(userString);
            var userLogin = userInfo.login;
            getUserRepos(accessToken,function(repoString) {
                var repos = JSON.parse(repoString);
                getRepoCommits(accessToken,repos,userLogin, function(repoCommits) {
                    console.log(repoCommits.length);
                    var minWeek, maxWeek; 
                    var additions = 0, deletions = 0, commits = 0;
                    for (var i=0;i<repoCommits.length;i++) {
                        for (var j=0;j<repoCommits[i].length;j++) {
                            if (!minWeek || minWeek > repoCommits[i][j].w) {
                                minWeek = repoCommits[i][j].w; 
                            }
                            if (!maxWeek || maxWeek < repoCommits[i][j].w) {
                                maxWeek = repoCommits[i][j].w;
                            } 
                            additions += repoCommits[i][j].a;
                            deletions += repoCommits[i][j].d;
                            commits += repoCommits[i][j].c;
                        }
                    }
                    var returnData = {
                        totalAdditions : additions,
                        totalDeletions : deletions,
                        totalCommits : commits,
                        earliestWeek : minWeek,
                        latestWeek : maxWeek
                    };
                    res.write(JSON.stringify(returnData)); 
                    res.send();
                    //getCommitStats(accessToken,commits, function(stats) {
                    //    console.log(stats);
                    //});
                });
                for (var repo in repos) {
                    console.log(repos[repo].full_name);
                }
                //res.write(repoString);
                //res.send();
            });
        });
    });
});

function retrieveAccessToken(code,callback) {
    var accessToken = '';

    var data = querystring.stringify({
        'client_id':'f637de5188550a885cbb',
        'client_secret':'aeaa53172885b798c8687a4d8d3eb207974086fa', //Not actually my secret key, nice try.
        'code':code
    });
    console.log(data);
    
    var options = {
        host: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };
    
    var request = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            accessToken += chunk;
        });
        res.on('end', function(chunk) {
            console.log(accessToken);
            callback(accessToken);
        })
    });

    request.on('error',function(err) {
        console.log(err);
    });
    request.write(data);
    request.end();
};

function getUserInfo(token,callback) {
    var returnData = '';

    var options = {
        host: 'api.github.com',
        path: '/user',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'token '+token,
            'Content-Type': 'application/x-www-form-urlencoded'
            //'Content-Length': data.length
        }
    };
    
    var request = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            returnData += chunk;
        });
        res.on('end', function(chunk) {
            //console.log(returnData);
            callback(returnData);
        })
    });

    request.on('error',function(err) {
        callback(err);
        console.log(err);
    });
    //request.write(data);
    request.end();
}

function getUserRepos(token,callback) {
    var returnData = '';

    // I don't know why setting query param
    // for access token doesn't work

    //var data = querystring.stringify({
    //    'access_token':token
    //});
    //console.log(data);
    
    var options = {
        host: 'api.github.com',
        path: '/user/repos',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'token '+token,
            'Content-Type': 'application/x-www-form-urlencoded'
            //'Content-Length': data.length
        }
    };
    
    var request = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            returnData += chunk;
        });
        res.on('end', function(chunk) {
            //console.log(returnData);
            callback(returnData);
        })
    });

    request.on('error',function(err) {
        callback(err);
        console.log(err);
    });
    //request.write(data);
    request.end();
}

function getRepoCommits(token,repos,user,callback) {
    var weeklyStats = [];
    var totalParsed = 0;

    repos.forEach(function(repo, i) {
        var returnChunk = '';
        var full_name = repo.full_name;
        var options = {
            host: 'api.github.com',
            path: '/repos/'+full_name+'/stats/contributors',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'token '+token,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        
        var request = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                returnChunk += chunk;
            });
            res.on('end', function(chunk) {
                //console.log(returnChunk);
                var stats = JSON.parse(returnChunk);
                //console.log("NUMBER"+ stats.length);
                //console.log("STATUSCODE "+res.statusCode);
                totalParsed++;
                for (var j=0;j<stats.length;j++) {
                    if (stats[j].author.login == user) {
                        weeklyStats.push(stats[j].weeks);
                    }
                }
                if (totalParsed == repos.length) {
                    //console.log(weeklyStats);
                    callback(weeklyStats);
                }
            })
        });

        request.on('error',function(err) {
            callback(err);
            console.log(err);
        });
        request.end();
    });
}

function getCommitStats(token,commits,callback) {
    var returnData = {
        additions: 0,
        deletions: 0,
        total: 0
    };

    for (var i=0; i<commits.length; i++) {
        var commit = JSON.parse(commits[i]);
        var returnChunk = '';
        var slicedUrl = commit.url.substring(22);
        console.log(slicedUrl);
        var options = {
            host: 'api.github.com',
            path: slicedUrl,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'token '+token,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        
        var request = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                returnChunk += chunk;
            });
            res.on('end', function(chunk) {
                var stats = JSON.parse(chunk).stats;
                returnData.additions += stats.additions;
                returnData.deletions += stats.deletions;
                returnData.total += stats.total;
                console.log(returnData);
                if (i == repos.length-1) {
                    callback(returnData);
                }
            })
        });

        request.on('error',function(err) {
            callback(err);
            console.log(err);
        });
        request.end();
    }
}
        
app.listen(8080);
