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
        getUserRepos(accessToken,function(repos) {
            var reposJson = JSON.parse(repos);
            console.log("SIZE " + reposJson.length);
            for (var repo in reposJson) {
                console.log(reposJson[repo].full_name);
            }
            res.write(repos);
            res.send();
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

function getUserRepos(token,callback){
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
        
app.listen(8080);
