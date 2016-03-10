var ejs = require("ejs");
var mq_client = require('../rpc/client');
var pass = require('password-hash-and-salt');
exports.usersignup=function(req,res){
	var firstName=req.param("firstName");
	var lastName=req.param("lastName");
	var email=req.param("email");
	var confirmEmail=req.param("confirmEmail");
	var password=req.param("signupPassword");
	var gender=req.param("gender");
	var myuser = [];
	var msg_payload;
	pass(password).hash(
			function(error, hash) {
				if (error) {
						console.log(error);
				}
					//saving the hash
				myuser.hash = hash;
				if (myuser.hash) {
		
					msg_payload = { "email": email, "password": myuser.hash, "firstName": firstName, "lastName": lastName, "gender":gender, "action":"signup"};
				
console.log("In POST Request = email:"+ email +" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("successfully inserted");
				req.session.email=results.value.email;
				req.session.username=results.value.firstName;
				console.log("username and email session created"+results.value.email+"  "+results.value.firstName);
				res.send({"status":"success" , 'msg': 'Account created successfully'});
			
			}
			else {    
				
				res.send({"status":"fail" , 'msg': 'failed insertion'});
			}
		}  
	});
				}
			});
};


exports.gettingStarted=function(req,res){
	console.log("username and email session created in getting started"+req.session.email+"  "+req.session.username);
	if(req.session.email){
		res.render("gettingStarted",{'username':req.session.username,'email':req.session.email});
	}
	else{
		res.redirect('/');
	}
};


exports.storePersonalData=function(req,res){
	var summary=req.param("summary");
	var work=req.param("worktextbox1");
	var education=req.param("education");
	var contact=req.param("contact");
	var life_events=req.param("life_events");
	var music=req.param("music");
	var shows=req.param("shows");
	var sports=req.param("sports");
	var email =req.session.email;
	
	var msg_payload = { "summary": summary, "email":email,"work": work, "education": education, "contact": contact, "life_events":life_events, "music":music,"shows":shows,"sports":sports, "action":"storePersonalData"};
	
	console.log("In POST Request stor Personal Data");
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 200){
					console.log("successfully inserted");
					res.send({"status":"success" , 'msg': 'Personal Data saved successfully'});
				
				}
				else {    
					
					res.send({"status":"fail" , 'msg': 'Personal Data failed'});
				}
			}  
		});
};



exports.checklogin = function(req,res)
{
	var username, password;
	var email = req.param("email");
	password = req.param("password");
	var user=[];
	
	var msg_payload = { "email": email, "password": password,"action":"login"};
	
	console.log("In POST Request = UserName:"+ email+" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				req.session.email=results.email;
				req.session.username=results.firstName;
				console.log("initialized");
				console.log("email id and password found in database. Email:"+req.session.email+"firstName:"+req.session.username);
				res.send({"status":"success" , 'msg': 'success'});
			}
			else {    

				console.log("No Such user found");
				res.send({"status":"fail" , 'msg': 'No Such User'});
			}
		}  
	});
	
};
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

exports.redirectToHomepage = function(req,res)
{
	console.log("entered redirect function");
	//Checks before redirecting whether the session is valid
	if(req.session.email)
	{
		var summary;
		var education;
		var work;
		var contact;
		var lifeevents;
		var newsFeed;
		var email=req.session.email;
		
		
		var msg_payload = { "email": email, "action":"redirectToHomepage"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 200){
					
					newsfeed=results.newsfeed;
					console.log("Newsfeed "+JSON.stringify(newsfeed));
					res.render("homepage",{'username':req.session.username,'newsfeed':newsfeed});
					
				}
			}  
		});
	}
	else
	{
		res.redirect('/');
	}
};

exports.newsfeedSave=function(req,res){
	if(req.session.email){
		var email = req.session.email;
		var post=req.param("post");
		var firstName=req.session.username;
		var date=new Date();
		//var getfirstName_query="select firstName from userprofile where email='"+req.session.email+"'";
		
		var msg_payload = { "email": email, "post":post, "firstName":firstName, "date":date, "action":"newsfeedSave"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': err});
			}
			else 
			{
				if(results.code == 200){
					
					console.log("inserting data to post database");
					res.send({"status":"success" , 'msg': 'successfully posted'});
					
				}
			}  
		});

	}else{
		res.redirect('/');
	}
};



exports.redirectToGroups=function(req,res){
	if(req.session.email){
		var admin;
		var email = req.session.email;
		var member;
		
		var msg_payload = { "email": email,"action":"redirectToGroups"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': err});
			}
			else 
			{
				if(results.code == 200){
					member=results;
					console.log(results);
					res.render("groups",{'admin':admin,'members':member,'username':req.session.username});
				
				}
			}  
		});


		/*
		var get_groupadmin_query="select * from groups where groupadmin='Yes' and groupmembers='"+req.session.email+"'";
		mysql.getDataFromDatabase(get_groupadmin_query, function(err, results) {
			if(err){
				res.render("error");
			}else{
				admin=results;
				console.log(admin);
				var get_groupmember_query="select * from groups where groupadmin='No' and groupmembers='"+req.session.email+"'";
				mysql.getDataFromDatabase(get_groupmember_query, function(err, results) {
					if(err){
						res.render("error");
					}
					else{
						member=results;
						console.log(results);
						res.render("groups",{'admin':admin,'members':member,'username':req.session.username});
					}
					
				})
			}
		})*/
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToCreateGroup=function(req,res){
	if(req.session.email){
		var friendsList;
		var email = req.session.email;var email = req.session.email;
		var msg_payload = { "email": email, "action":"redirectToCreateGroup"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': err});
			}
			else 
			{
				if(results.code == 200){
					
					var groups=results;
					res.render("createGroup",{"friendsList":friendsList,'username':req.session.username,'groups':groups});
				
				}
			}  
		});


		/*
		get_friends_query="select firstname,friendEmailID from friends where emailID='"+req.session.email+"' and status='Friend'";
		mysql.getDataFromDatabase(get_friends_query, function(err, results) {
			if(err){
				
			}
			else{
				friendsList=results;
				console.log(friendsList);
				var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
				mysql.getDataFromDatabase(get_groups_query, function(err, results) {
					if(err){
						
					}
					else{
						var groups=results;
						res.render("createGroup",{"friendsList":friendsList,'username':req.session.username,'groups':groups});
					}
				})
			}
		})*/
	}
	else{
		res.redirect('/');
	}
};

exports.createGroup=function(req,res){
	if(req.session.email){
		//var creategroup_query="insert into groups values";
		var members=req.param("members");
		var groupName=req.param("groupName");
		var email = req.session.email;
		var msg_payload = { "email": email, "members":members, "groupName":groupName, "action":"createGroup"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': 'Error in creating groups.Please try again later'});
			}
			else 
			{
				if(results.code == 200){
					
					res.send({"status":"success" , 'msg': 'Group created successfully'});	
				}
			}  
		});

		/*
		creategroup_query+="(?,'Yes',?,?),";
		var searchgroup_query="select * from groups where groupname='"+groupName+"'";
		mysql.getDataFromDatabase(searchgroup_query, function(err, results) {
			if(results.length>0){
				res.send({"status":"fail" , 'msg': 'Group already present'});
			}
			else{
				for(var i=0;i<members.length;i++){
					console.log(members[i].firstname+""+members[i].email);
					creategroup_query+="('"+groupName+"','No','"+members[i].email+"','"+members[i].firstname+"'),";
				}
				creategroup_query=creategroup_query.substring(0,creategroup_query.length-1);
				params=[groupName,req.session.email,req.session.username];
				mysql.insertDatatoDatabase(creategroup_query, params, function(err, results) {
					if(err){
						res.send({"status":"fail" , 'msg': 'Error in creating groups.Please try again later'});
					}else{
						res.send({"status":"success" , 'msg': 'Group created successfully'});
					}
				})
			}
		})*/
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToDeleteGroup=function(req,res){
	if(req.session.email){
		var group_admin;
		var email = req.session.email;
		var msg_payload = { "email": email, "group_admin":group_admin, "action":"redirectToDeleteGroup"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': err});
			}
			else 
			{
				if(results.code == 200){
					
					res.render("deleteGroup",{'group_admin':group_admin,'username':req.session.username,'groups':results});
				}
			}  
		});


		/*
		var get_groups_admin_query="select * from groups where groupmembers='"+req.session.email+"' AND groupadmin='Yes'";
		mysql.getDataFromDatabase(get_groups_admin_query, function(err, results) {
			if(err){
				
			}
			else{
				group_admin=results;
				console.log(group_admin);
				var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
				mysql.getDataFromDatabase(get_groups_query, function(err, results) {
					if(err){
						
					}
					else{
						res.render("deleteGroup",{'group_admin':group_admin,'username':req.session.username,'groups':results});
					}
				});
			}
		})*/
	}
	else{
		res.redirect('/');
	}
}

exports.deleteGroup=function(req,res){
	if(req.session.email){
		var group_name=req.param("groupname");
		console.log('Group Name',group_name);
		var email = req.session.email;
		var msg_payload = { "group_name": group_name, "action":"deleteGroup"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': err});
			}
			else 
			{
				if(results.code == 200){
					
					var location='/deleteGroup'
						res.redirect(location);
				}
			}  
		});

		
		/*
		group_delete_query="delete from groups where groupname='"+group_name+"'";
		console.log(group_delete_query.sql);
		mysql.execQuery(group_delete_query,function(err,results){
			if(err){
				console.log("error");
				return "error";
			}
			else{
				var location='/deleteGroup'
				res.redirect(location);
			}
		})*/
	}
	else{
		res.redirect('/');
	}
}

exports.redirectToViewGroup=function(req,res){
	if(req.session.email){
			var groupMembers;
			var groupName=req.param('groupName');
			var email = req.session.email;
			var msg_payload = { "email": email, "groupName":groupName, "action":"redirectToViewGroup"};
			
			console.log("In POST Request = UserName:"+ email);
			
			mq_client.make_request('login_queue',msg_payload, function(err,results){
				
				console.log(results);
				if(err){
					res.send({"status":"fail" , 'msg': err});
				}
				else 
				{
					if(results.code == 200){
						
						groups=results.groups;
						res.render("viewGroup",{'groupName':groupName,'groupMembers':groupMembers,'username':req.session.username,'groups':groups});
					
					}
				}  
			});

			/*
			var get_groupMembers_query="select * from groups where groupname='"+groupName+"'";
			mysql.getDataFromDatabase(get_groupMembers_query, function(err, results) {
				if(err){
					
				}
				else{
					if(results.length>0){
						groupMembers=results;
						console.log(groupMembers);
						var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
						var groups;
						mysql.getDataFromDatabase(get_groups_query, function(err, results) {
							if(err){
								
							}
							else{
								groups=results;
								res.render("viewGroup",{'groupName':groupName,'groupMembers':groupMembers,'username':req.session.username,'groups':groups});
							}
						})
					}
				}
			})*/
	}
	else{
		res.redirect('/');
	}
};

exports.deleteMemberFromGroup=function(req,res){
	if(req.session.email){
		var groupMember = req.param("member");
		var groupName = req.param("groupName");
		var email = req.session.email;
		var msg_payload = { "groupMember": groupMember, "groupName":groupName, "action":"deleteMemberFromGroup"};
		
		console.log("In POST Request = UserName:"+ email);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				res.send({"status":"fail" , 'msg': err});
			}
			else 
			{
				if(results.code == 200){
					
					var location='/viewGroup?groupName='+groupName;
					res.redirect(location);
					
				}
			}  
		});

		/*
		var groupMember_deleteQuery="delete from groups where groupname='"+groupName+"' AND groupmembers='"+groupMember+"'";
		mysql.execQuery(groupMember_deleteQuery, function(err, results) {
			if(err){
				res.redirect('/');
			}
			else{
				var location='/viewGroup?groupName='+groupName;
				res.redirect(location);
			}
		});*/
	}
};



exports.acceptedRequest=function(req,res){
	if(req.session.email){
		var name=req.param("name");
		var frndEmail=req.param("emailid");
		var email = req.session.email;
		var post=req.param("post");
		//////
		var msg_payload = { "email": email,"frndEmail":frndEmail,"post":post, "name":name,"action":"acceptedRequest"};
				
				console.log("In POST Request = UserName:"+ email);
				
				mq_client.make_request('login_queue',msg_payload, function(err,results){
					
					console.log(results);
					if(err){
						res.send({"status":"fail" , 'msg': err});
					}
					else 
					{
						if(results.code == 200){
							
							console.log("inserting data to post database");
							res.send({"status":"success" , 'msg': 'successfully posted'});
							
						}
					}  
				});
	}
	else{
		res.redirect('/');
	}
};

exports.getFriends=function(req,res){
	if(req.session.email){
		var email = req.session.email;
		var friends;
		var friendsWaiting;
		var friendsRequesting;
		//////
		var msg_payload = { "email": email,"firstName":req.session.username,"action":"getFriends"};
				
				console.log("In POST Request = UserName:"+ email);
				
				mq_client.make_request('login_queue',msg_payload, function(err,results){
					
					console.log(results);
					if(err){
						res.send({"status":"fail" , 'msg': err});
					}
					else 
					{
						if(results.code == 200){
							friends=results.friends;
							friendsWaiting=results.friendsWaiting;
							friendsRequesting=results.friendsRequesting;
							console.log("length"+friends.length);
							
							console.log("Friends"+friends);
							res.render('friends',{'username':req.session.username,'friends':friends,'friendsWaiting':friendsWaiting,'friendsRequesting':friendsRequesting});
						}
					}  
				});
	}
	else{
		res.redirect('/');
	}
};
exports.addFriend=function(req,res){
	if(req.session.email){
		var email = req.session.email;
		var friend=req.param("friend");
		//var post=req.param("post");
		//////
		var msg_payload = { "email": email,"friend":friend,"firstName":req.session.username,"action":"addFriend"};
				
				console.log("In POST Request = UserName:"+ email);
				
				mq_client.make_request('login_queue',msg_payload, function(err,results){
					
					console.log("Results"+results);
					if(err){
						res.send({"status":"fail" , 'msg': err});
					}
					else 
					{
						if(results.code == 200){
							
							console.log("inserting data to post database");
							res.send({"status":results.status , 'msg': 'successfully posted'});
							
						}
					}  
				});
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToSignup=function(req,res){
	res.render("Signup");
};
