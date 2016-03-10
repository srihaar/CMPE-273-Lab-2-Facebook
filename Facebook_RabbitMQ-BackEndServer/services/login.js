var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";
var pass = require('password-hash-and-salt');
function signup(req, callback){
	
	var res = {};
	console.log("In handle request Signup:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userprofile');
		coll.insert({email:req.email,password:req.password,firstName:req.firstName,lastName:req.lastName,gender:req.gender}, function(err, user){
	
	
	if(user){
		res.code = "200";
		res.value=req;
		//res.value = "Succes Login";
		
	}
	else{
		res.code = "401";
		res.value = "Failed Login";
	}

	console.log("Response"+res);
	
	callback(null, res);
	});
	});
	mongo.close();
}

function handle_request(req, callback){
	
	var res = {};
	
	
	var email = req.email;
	var password = req.password;
	console.log("username is:" + email);
	console.log("password is:" + password);
	var firstname={};
	var login=[];
	console.log("In handle request Login:"+ email);
	pass(password).hash(
			function(error, hash){
				if(error){
					throw error;
				}
				login.hash = hash;
				if(login.hash){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userprofile');
		console.log("User"+email);
			coll.find({email: email}, function(err, user){
	if(user){
		user_password=user.password;
		console.log(user.password);
		pass(password).verifyAgainst(user_password, function(error, verified) {
	        if(error)
	            throw new Error('Something went wrong!');
	        console.log("verified value:"+verified);
	        if(!verified) {
	        	res.code = "401";
	    		res.value = "Failed Login";
	        } else {
	    
		res.code = "200";
		res.email = user.email;
		res.firstName = user.firstName;
	}
		});
	}
	callback(null, res);
		});
	});
	}
				});
	mongo.close();
}


function storePersonalData(req, callback){
	
	var res = {};
	
	var summary=req.summary;
	var work=req.work;
	var education=req.education;
	var contact=req.contact;
	var life_events=req.life_events;
	var music=req.music;
	var shows=req.shows;
	var sports=req.sports;
	var email=req.email;
	
	console.log("In handle request Store Personal Data:"+ req.summary);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userprofile');
		coll.update({"email":email},{$set:{"overview":summary}}, function(err, user){
		if(err){
			res.code = "401";
			res.value = "Failed Insertion";
		}
		else{
			var coll = mongo.collection('work');
			coll.insert({email:email,work:work}, function(err, user){
			if(err){
				res.code = "401";
				res.value = "Failed Insertion";
			}
			else{
				var coll = mongo.collection('education');
				coll.insert({email:email,education:education}, function(err, user){
				if(err){
					res.code = "401";
					res.value = "Failed Insertion";
				}
				else{
					var coll = mongo.collection('contacts');
					coll.insert({email:email,contact:contact}, function(err, user){
					if(err){
						res.code = "401";
						res.value = "Failed Insertion";
					}
					else{
						var coll = mongo.collection('lifeevents');
						coll.insert({emailid:email,lifeevents:life_events}, function(err, user){
						if(err){
							res.code = "401";
							res.value = "Failed Insertion";
						}
						else{
							var coll = mongo.collection('interests');
							coll.insert({email:email,music:music,shows:shows,sports:sports}, function(err, user){
								if(err){
									res.code = "401";
									res.value = "Failed Insertion";
								}
								else{
									res.code = "200";
									res.value="Success";
								}
							
								callback(null, res);
							});
						}
						});
					}
					});
				}
				});
			}
			});
		}
		});	
	});
	mongo.close();
}

function redirectToHomepage(req, callback){
	
	var res = {};
	var friends=[];
	var email = req.email;
	var firstname={};
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('friends');
		console.log("User"+email);
			coll.find({emailID: email},{friendEmailID:1,_id:0}).toArray( function(err, user){
	if(user){
		for(var i=0;i<user.length;i++){
			console.log("Friend"+user[i].friendEmailID);
			friends.push(user[i].friendEmailID);
			}
		friends.push(email);
		console.log("Friends "+JSON.stringify(friends));
		var collect = mongo.collection('newsfeed');
		collect.find({emailID: {$in:friends}},{ firstName: 1,_id:0,newsfeed:1}).sort( { date: -1 } ).toArray( function(err, newsfeed){
		
		if(newsfeed){
			console.log("Newsfeed "+JSON.stringify(newsfeed));
			res.code = "200";
			res.newsfeed=newsfeed
			res.value = "Succes Login";
			}
			else{
				res.code = "401";
				res.value = "Failed Login";
			}
		});
	}

	callback(null, res);
		});
	});
	mongo.close();
}


function newsfeedSave(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function redirectToGroups(req, callback){
	
	var res = {};
	var email = req.email;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('groups');
		console.log("User"+email);
		coll.find({emailID: email},{friendEmailID:1,_id:0}).toArray(function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function redirectToCreateGroup(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function createGroup(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function redirectToDeleteGroup(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function deleteGroup(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function redirectToViewGroup(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function deleteMemberFromGroup(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var firstName= req.firstName;
	var date = req.date;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newsfeed');
		console.log("User"+email);
		coll.insert({emailID:email,newsfeed:post,firstName:firstName,date:date}, function(err, user){
	
		if(user){
			res.code = "200";
			res.value="Successfully Posted";
			//res.value = "Succes Login";
			
		}
		else{
			res.code = "401";
			res.value = "Failed";
		}

	callback(null, res);
		});
	});
	mongo.close();
}

function acceptedRequest(req, callback){
	
	var res = {};
	var post = req.post;
	var email = req.email;
	var frndEmail=req.frndEmail;
	var firstName= req.name;
	//console.log("In handle request Login:"+ req.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('friends');
		console.log("User"+email);
		coll.update({"emailID":email,"friendEmailID":frndEmail},{$set:{"status":"Friend"}}, function(err, user){		
			if(err){
				res.code = "401";
				res.value = "Failed Insertion";
			}
			else{
				var coll = mongo.collection('friends');
				coll.update({"emailID":frndEmail,"friendEmailID":email},{$set:{"status":"Friend"}}, function(err, user){		
					if(err){
					res.code = "401";
					res.value = "Failed Insertion";
				}
				else{
					res.code = "200";
					res.value="Success";
				}
				});
			}
		callback(null, res);
		});
	});
	mongo.close();
}

function getFriends(req, callback){
	
	var res = {};
	
	
	var email = req.email;
	console.log("username is:" + email);
	var firstname={};
	var friends=[];
	console.log("In handle request Login:"+ email);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('friends');
		console.log("User"+email);
			coll.find({"emailID" : email, "status" : "Friend"}).toArray(function(err, user){
				if(err){
					res.code = "401";
					res.value = "Failed Insertion";
				}
				else{
						for(var i=0;i<user.length;i++){
						console.log("Friend"+user[i]);
						friends.push(user[i]);
						}
					res.friends=user;
					var coll = mongo.collection('friends');
					coll.find({"emailID" : email, "status" : "Waiting"}).toArray(function(err, user){
							if(err){
								res.code = "401";
								res.value = "Failed Insertion";
					}
				else{
					res.friendsWaiting=user;
					var coll = mongo.collection('friends');
					coll.find({"emailID" : email, "status" : "Requesting"}).toArray(function(err, user){
							if(err){
								res.code = "401";
								res.value = "Failed Insertion";
								}
							else{
								res.friendsRequesting=user;
								res.code = "200";
								res.value="Success";
								}
					});
				}
				});
				}
	callback(null, res);
		});
	});
	mongo.close();
}

function addFriend(req, callback){
	
	var res = {};
	
	var friend=req.friend;
	var email=req.email;
	var firstName=req.firstName;
	console.log("first Name"+firstName);
	console.log("In handle request Store Personal Data:"+ req.friend);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('userprofile');
		coll.find({"firstName" : friend},{firstName:1,_id:0,lastName:1,email:1}).toArray( function(err, results){
			if(err){
			res.code = "401";
			res.value = "Failed Insertion";
			res.status="fail";
		}
		else{
			console.log("Else"+results);
				//console.log(results[0]);
				if(results.length>0){
				var friendEmailID=results[0].email;
			var coll = mongo.collection('friends');
			coll.find({"emailID":email, "friendEmailID":friendEmailID}).toArray( function(err, results){
				if(err){
				res.code = "401";
				res.value = "Failed Insertion";
				res.status="fail";
			}
			else{
				if(results.length>0){
					var status=results[0].status;
					console.log("friend email ID found in friend table");
					if(status=="Waiting"){
						console.log("waiting");
						res.code = "200";
						res.value="Success";
						res.status="waiting";
					}
					else if(status=="Friend"){
						console.log("already friends");
						res.code = "200";
						res.value="Success";
						res.status="FriendAlready";
					}
				}
				else{
					var status="Waiting";
					console.log("new friend.waiting status");
					var coll = mongo.collection('friends');
					coll.insert({"emailID":email,"friendEmailID":friendEmailID,"status":status,"firstName":friend}, function(err, user){
					if(err){
						res.code = "401";
						res.value = "Failed Insertion";
					}
					else{
						var status="Requesting";
						console.log("requested friend db entry");
						var coll = mongo.collection('friends');
						coll.insert({"emailID":friendEmailID,"friendEmailID":email,"status":status,"firstName":firstName}, function(err, user){
						if(err){
							res.code = "401";
							res.value = "Failed Insertion";
						}	
						else{
							console.log("inserting frnd request data to friend database");
							res.code = "200";
							res.value="Success";
							res.status="Request Sent";
						}

					callback(null, res);
						});
					}
						});
					}
			}
					});
			
				}
		}
				});
			});
	mongo.close();
}


exports.addFriend=addFriend;
exports.getFriends=getFriends;
exports.acceptedRequest=acceptedRequest;
exports.newsfeedSave = newsfeedSave;
exports.redirectToHomepage = redirectToHomepage;
exports.handle_request = handle_request;
exports.signup = signup;
exports.storePersonalData = storePersonalData;
exports.redirectToGroups=redirectToGroups;
exports.redirectToCreateGroup=redirectToCreateGroup;
exports.createGroup=createGroup;
exports.redirectToDeleteGroup=redirectToDeleteGroup;
exports.deleteGroup=deleteGroup;
exports.redirectToViewGroup=redirectToViewGroup;
exports.deleteMemberFromGroup=deleteMemberFromGroup;