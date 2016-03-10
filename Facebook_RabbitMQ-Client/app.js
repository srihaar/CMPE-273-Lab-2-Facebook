var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , login = require('./routes/login')
  , home = require('./routes/home')
  , path = require('path');


//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: true,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*
app.get('/', routes.index);

app.get('/signin',home.sign_in);
//app.post('/signin', home.after_sign_in);
app.get('/success_login', home.success_login);
app.get('/fail_login', home.fail_login);
app.get('/gettingStarted',login.gettingStarted);
app.get('/homepage',login.redirectToHomepage);
app.get('/logout',login.logout);
app.get('/signup',function(req,res){
	res.render("signup.ejs");
});
app.get('/login',function(req,res){
	res.render("login.ejs");
});
//POST Requests
app.post('/signup',home.signup);
app.post('/checklogin',login.checklogin);
app.post('/postNewsfeed',login.newsfeedSave);
app.post('/storePersonalData',login.storePersonalData);
app.post('/usersignup',login.usersignup);
*/

//GET
app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/homepage',login.redirectToHomepage);
//app.get('/editProfile',login.redirectToEditProfile);
//app.get('/viewProfile',login.redirectToViewProfile);
app.get('/groups',login.redirectToGroups);
app.get('/createGroup',login.redirectToCreateGroup);
app.get('/deleteGroup',login.redirectToDeleteGroup);
app.get('/viewGroup',login.redirectToViewGroup);
app.get('/groups/viewGroup',login.redirectToViewGroup);
app.get('/gettingStarted',login.gettingStarted);
app.get('/friends',login.getFriends);
app.get('/signup',login.redirectToSignup);
app.get('/logout',login.logout);
//POST
app.post('/checklogin',login.checklogin);
app.post('/logout',login.logout);
app.post('/usersignup',login.usersignup);
app.post('/storePersonalData',login.storePersonalData);
app.post('/addFriend',login.addFriend);
app.post('/postNewsfeed',login.newsfeedSave);
app.post('/acceptedRequest',login.acceptedRequest);
app.post('/createGroup',login.createGroup);
app.post('/deleteGroup',login.deleteGroup);
app.post('/deleteMemberFromGroup',login.deleteMemberFromGroup);
//app.post('/editProfileAftersignin',login.storeUserDetails);
//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});