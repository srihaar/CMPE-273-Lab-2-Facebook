//super simple rpc server example
var amqp = require('amqp')
, util = require('util');


/**
 * Module dependencies.
 */
var login = require('./services/login');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.action == "login")
			{
				login.handle_request(message, function(err,res){
	
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			else
				if(message.action == "signup")
				{
					login.signup(message, function(err,res){
		
						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
				}
				else
					if(message.action == "storePersonalData")
					{
						login.storePersonalData(message, function(err,res){
			
							//return index sent
							cnn.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						});
					}
					else
						if(message.action == "redirectToHomepage")
						{
							login.redirectToHomepage(message, function(err,res){
				
								//return index sent
								cnn.publish(m.replyTo, res, {
									contentType:'application/json',
									contentEncoding:'utf-8',
									correlationId:m.correlationId
								});
							});
						}
						else
							if(message.action == "newsfeedSave")
							{
								login.newsfeedSave(message, function(err,res){
					
									//return index sent
									cnn.publish(m.replyTo, res, {
										contentType:'application/json',
										contentEncoding:'utf-8',
										correlationId:m.correlationId
									});
								});
							}
							else
								if(message.action == "redirectToGroups")
								{
									login.newsfeedSave(message, function(err,res){
						
										//return index sent
										cnn.publish(m.replyTo, res, {
											contentType:'application/json',
											contentEncoding:'utf-8',
											correlationId:m.correlationId
										});
									});
								}
								else
									if(message.action == "redirectToCreateGroup")
									{
										login.newsfeedSave(message, function(err,res){
							
											//return index sent
											cnn.publish(m.replyTo, res, {
												contentType:'application/json',
												contentEncoding:'utf-8',
												correlationId:m.correlationId
											});
										});
									}
									else
										if(message.action == "createGroup")
										{
											login.newsfeedSave(message, function(err,res){
								
												//return index sent
												cnn.publish(m.replyTo, res, {
													contentType:'application/json',
													contentEncoding:'utf-8',
													correlationId:m.correlationId
												});
											});
										}
										else
											if(message.action == "redirectToDeleteGroup")
											{
												login.newsfeedSave(message, function(err,res){
									
													//return index sent
													cnn.publish(m.replyTo, res, {
														contentType:'application/json',
														contentEncoding:'utf-8',
														correlationId:m.correlationId
													});
												});
											}
											else
												if(message.action == "deleteGroup")
												{
													login.newsfeedSave(message, function(err,res){
										
														//return index sent
														cnn.publish(m.replyTo, res, {
															contentType:'application/json',
															contentEncoding:'utf-8',
															correlationId:m.correlationId
														});
													});
												}
												else
													if(message.action == "redirectToViewGroup")
													{
														login.newsfeedSave(message, function(err,res){
											
															//return index sent
															cnn.publish(m.replyTo, res, {
																contentType:'application/json',
																contentEncoding:'utf-8',
																correlationId:m.correlationId
															});
														});
													}
													else
														if(message.action == "deleteMemberFromGroup")
														{
															login.newsfeedSave(message, function(err,res){
												
																//return index sent
																cnn.publish(m.replyTo, res, {
																	contentType:'application/json',
																	contentEncoding:'utf-8',
																	correlationId:m.correlationId
																});
															});
														}
														else
															if(message.action == "acceptedRequest")
															{
																login.acceptedRequest(message, function(err,res){
													
																	//return index sent
																	cnn.publish(m.replyTo, res, {
																		contentType:'application/json',
																		contentEncoding:'utf-8',
																		correlationId:m.correlationId
																	});
																});
															}
															else
																if(message.action == "getFriends")
																{
																	login.getFriends(message, function(err,res){
														
																		//return index sent
																		cnn.publish(m.replyTo, res, {
																			contentType:'application/json',
																			contentEncoding:'utf-8',
																			correlationId:m.correlationId
																		});
																	});
																}
																else
																	if(message.action == "addFriend")
																	{
																		login.addFriend(message, function(err,res){
															
																			//return index sent
																			cnn.publish(m.replyTo, res, {
																				contentType:'application/json',
																				contentEncoding:'utf-8',
																				correlationId:m.correlationId
																			});
																		});
																	}
														
		});
	});
});