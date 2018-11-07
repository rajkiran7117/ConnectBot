"use strict";
var request = require('request');
var SF = require('./SF_API');
var ST = require('./SetTemplate');
var loginUrl = process.env.login_url;

exports.sf = SF;

function firstEntity(nlp, name) {
	console.log('reached firstentity'+JSON.stringify(nlp));
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}
/*
function checkAccountStatus( sender){
	let status;
	SF.contactVisiblity(sender).then(function(results){
		console.log('checking account is aviable in sf '+results);
		var formattedcontcs = ST.formatAccountPrivate(results);
		console.log("formatted response in checkAccountInSalesforce is "+JSON.stringify(formattedcontcs));
		
		if(formattedcontcs.accountId == 'empty'){
			status = false;
		}
		else {
			status = true;
		}
	});
	console.log("check account status value"+status);
	return status;
}
*/
function handleMessage(message,sender) {
  // check greeting is here and is confident
	
	var attmnts = message.attachments;
	var stickerIds = message.sticker_id;
	console.log(stickerIds);
	if(stickerIds == '369239263222822'){
		botResponse({text: "Thank you so much :) "},sender);
		return;
	}
	console.log("attachments "+attmnts);
	if(attmnts != undefined){
		console.log("attachments inside loop "+attmnts);
		var urls = [];
		var bodyStringArray = {"partId":sender, "attmnts": attmnts};
		
		
		SF.uploadPhotos(bodyStringArray).then(function(results){
			var formresuls = ST.formatSendReminder(results);
			console.log("bot upload results"+JSON.stringify(formresuls));
			botResponse({text: formresuls},sender);
			return;
		});
		console.log();
		return;
	}
	
	let status;
	let participantId;
	var availCommands = [];
	availCommands.push("commands");
	availCommands.push("info");
	availCommands.push("events");
	availCommands.push("phonebook");
	availCommands.push("setup");
	availCommands.push("todo");
	availCommands.push("person");
	availCommands.push("documents");
	availCommands.push("help");
	
	var isUserCommand; 
	availCommands.forEach(function(command){
		if(message.text.toLowerCase() == command){
			isUserCommand = true;
		}
	});
	console.log("is user command? "+isUserCommand);
	
	//console.log("check account status value"+status);
	if(isUserCommand){
		//var isValidUser = checkAccountStatus(sender);
		
		SF.contactVisiblity(sender).then(function(results){
			console.log('checking account is aviable in sf '+results);
			var formattedcontcs = ST.formatAccountPrivate(results);
			console.log("formatted response in checkAccountInSalesforce is "+JSON.stringify(formattedcontcs));
			participantId = formattedcontcs.Id;
			if(formattedcontcs.accountId == 'empty'){
				status = "empty";
			}
			else {
				status = formattedcontcs.preferredchannel;
			}
		});
		console.log("status value before timeout is"+status);
		setTimeout(() => {
			console.log("status value is"+status);
			
			if(status == "empty"){
				botResponse({text: 'These commands are only available to current Connect-123 Interns/ Volunteers'},sender);
				return;
			}else if(status == "undefined" || status == "Email"){
				var quikReplyForLogin = [
			      	{
			          "content_type":"text",
			          "title":"Yes",
			          "payload":"connect123_account_linking___"+participantId,
			        },
			        {
			          "content_type":"text",
			          "title":"No",
			          "payload":"connect123_accountlinkingno"
			        }
			      ];
				botResponse({text: 'To use these commands you have to log in',quick_replies: quikReplyForLogin},sender);
				return;
			}
			else if(status == "FbBot"){
				processBot(message,sender,availCommands,participantId);
			}else {
				botResponse({text: "Technical Error. Please try later/ Contact your program co-ordinator \nRegards, \nConnect-123"},sender);
				return;
			}
			
		}, 2000);
	}else {
		processGeneralUsers(message,sender);
	}
	
	
}

function processGeneralUsers(message,sender){
	var dintunderstand = true;
	const greeting = firstEntity(message.nlp, 'greetings');
	const thanks = firstEntity(message.nlp, 'thanks');
	  const greetingamount = firstEntity(message.nlp, 'amount_of_money');
	  const courseDetails = firstEntity(message.nlp, 'intent');
	  console.log('hellooooooooooo'+JSON.stringify(courseDetails));
	  
	  if (greeting && greeting.confidence > 0.6) {
		  //botResponse();
		  dintunderstand = false;
		  console.log('came to greeting');
		  botResponse({ text: 'Hi Good Day'},sender);
	  }
	  if (thanks && thanks.confidence > 0.6) {
		  //botResponse();
		  dintunderstand = false;
		  console.log('came to thanks');
		  botResponse({ text: 'I`m glad.'},sender);
	  }
	  if(courseDetails && courseDetails.confidence > 0.8){
		  console.log('came to courses'+courseDetails.value);
		  dintunderstand = false;
		  if(courseDetails.value == "courses"){
			  botResponse( { text: 'here are the list of courses available' },sender);
			  return;
		  }
		  if(courseDetails.value == "contact for Barcelona"){
			  var cMessage = ""	;	
			  SF.IntialIntract('Barcelona').then(function(results)
						{
						console.log("BEFORE ST CALL");	
						cMessage = ST.formatContact(results); 
						//botResponse({text:cMessage},sender);
						console.log("formatted response is "+cMessage);
						botResponse( { text: cMessage },sender);
					
						});
				//console.log("formatted response outsude  "+cMessage);
			  		//botResponse( { text: cMessage },sender);
		  }
		  if(courseDetails.value == "contact for Cape Town"){
			  var cMessage = ""	;	
			  SF.IntialIntract('Cape Town').then(function(results)
						{
						console.log("BEFORE ST CALL");	
						cMessage = ST.formatContact(results); 
						//botResponse({text:cMessage},sender);
						console.log("formatted response is "+cMessage);
						botResponse( { text: cMessage },sender);
					
						});
				//console.log("formatted response outsude  "+cMessage);
			  		//botResponse( { text: cMessage },sender);
		  }
		  if(courseDetails.value == "contact for Buenos Aires"){
			  var cMessage = ""	;	
			  SF.IntialIntract('Buenos Aires').then(function(results)
						{
						console.log("BEFORE ST CALL");	
						cMessage = ST.formatContact(results); 
						//botResponse({text:cMessage},sender);
						console.log("formatted response is "+cMessage);
						botResponse( { text: cMessage },sender);
					
						});
				//console.log("formatted response outsude  "+cMessage);
			  		//botResponse( { text: cMessage },sender);
		  }
		  if(courseDetails.value == "contact for Shanghai"){
			  var cMessage = ""	;	
			  SF.IntialIntract('Shanghai').then(function(results)
						{
						console.log("BEFORE ST CALL");	
						cMessage = ST.formatContact(results); 
						//botResponse({text:cMessage},sender);
						console.log("formatted response is "+cMessage);
						botResponse( { text: cMessage },sender);
					
						});
				//console.log("formatted response outsude  "+cMessage);
			  		//botResponse( { text: cMessage },sender);
		  }
		  if(courseDetails.value == "Destinations"){
			  var subBody1 = 
			  '{'+
			      '"media_type": "image",'+
			      '"url": "https://www.facebook.com/527608537575978/photos/a.542585452744953.1073741825.527608537575978/542585466078285/?type=1&theater",'+
			      '"buttons": ['+
			        '{'+
			            '"type": "web_url",'+
			            '"url": "https://www.connect-123.com/destinations/barcelona-spain/",'+
			            '"title": "View Barcelona in Website",'+
			         '}'+
			      ']'+
			   '}';  
			  var subBody2 = '{'+
				      '"media_type": "image",'+
				      '"url": "https://www.facebook.com/527608537575978/photos/a.542585452744953.1073741825.527608537575978/542585462744952/?type=1&theater",'+
				      '"buttons": ['+
				        '{'+
				            '"type": "web_url",'+
				            '"url": "https://www.connect-123.com/destinations/buenos-aires-argentina/",'+
				            '"title": "View Buenos Aires in Website",'+
				         '}'+
				      ']'+
				   '}'; 
			  var subBody3 = '{'+
		      '"media_type": "image",'+
			      '"url": "https://www.facebook.com/527608537575978/photos/a.542585452744953.1073741825.527608537575978/542585512744947/?type=1&theater",'+
			      '"buttons": ['+
			        '{'+
			            '"type": "web_url",'+
			            '"url": "https://www.connect-123.com/destinations/dublin-ireland/",'+
			            '"title": "View Dublin in Website",'+
			         '}'+
			      ']'+
			   '}';
			  var subBody4 = '{'+
		      '"media_type": "image",'+
			      '"url": "https://www.facebook.com/527608537575978/photos/a.542585452744953.1073741825.527608537575978/542585469411618/?type=1&theater",'+
			      '"buttons": ['+
			        '{'+
			            '"type": "web_url",'+
			            '"url": "https://www.connect-123.com/destinations/shanghai-china/",'+
			            '"title": "View Shanghai in Website",'+
			         '}'+
			      ']'+
			   '}';
			  var subBody5 ='{'+
		      '"media_type": "image",'+
			      '"url": "https://www.facebook.com/527608537575978/photos/a.542585452744953.1073741825.527608537575978/542592852744213/?type=3&theater",'+
			      '"buttons": ['+
			        '{'+
			            '"type": "web_url",'+
			            '"url": "https://www.connect-123.com/destinations/cape-town-south-africa/",'+
			            '"title": "View Cape Town in Website",'+
			         '}'+
			      ']'+
			   '}';
			  var bodyString1 = '{'
				   	+'"type":"template",'
				      +'"payload":{'
				        +'"template_type":"media",'
				        +'"elements":['
				          +subBody1
				        +']'
				      +'}'
				    +'}';
			  var bodyString2 = '{'
				   	+'"type":"template",'
				      +'"payload":{'
				        +'"template_type":"media",'
				        +'"elements":['
				          +subBody2
				        +']'
				      +'}'
				    +'}'; 
			  var bodyString3 = '{'
				   	+'"type":"template",'
				      +'"payload":{'
				        +'"template_type":"media",'
				        +'"elements":['
				          +subBody3
				        +']'
				      +'}'
				    +'}'; 
			  var bodyString4 = '{'
				   	+'"type":"template",'
				      +'"payload":{'
				        +'"template_type":"media",'
				        +'"elements":['
				          +subBody4
				        +']'
				      +'}'
				    +'}'; 
			  var bodyString5 = '{'
				   	+'"type":"template",'
				      +'"payload":{'
				        +'"template_type":"media",'
				        +'"elements":['
				          +subBody5
				        +']'
				      +'}'
				    +'}'; 
			 
			  botResponse( { attachment: bodyString1 },sender);
			  botResponse( { attachment: bodyString2 },sender);
			  botResponse( { attachment: bodyString3 },sender);
			  botResponse( { attachment: bodyString4 },sender);
			  botResponse( { attachment: bodyString5 },sender);
		  }
		  else if(courseDetails.value == "volunteer"){
			  var subBody = "";
			  subBody =  '{'
		          +'"title":"Welcome to Connect123",'
		          +'"image_url":"https://www.connect-123.com/wp-content/themes/connect123/images/connect123-logo.jpg",'
		          +'"subtitle":"We\'ve got the right Volunteer Programs for you.",'
		          +'"default_action": {'
		            +'"type": "web_url",'
		            +'"url": "https://www.connect-123.com/programs/volunteer/",'
		            +'"messenger_extensions": true,'
		            +'"webview_height_ratio": "tall",'
		            +'"fallback_url": "https://www.connect-123.com/programs/volunteer/"'
		          +'},'
		          +'"buttons":['
		            +'{'
		              +'"type":"web_url",'
		              +'"url":"https://connect-123.com",'
		              +'"title":"View Website"'
		            +'}'              
		          +']'   
		        +'},'
		        +'{'
		          +'"title":"Volunteer in Barcelona",'
		          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Barcelona-Mercat-de-La-Boqueria-de.jpg",'
		          +'"subtitle":"VOLUNTEER IN BARCELONA",'
		          +'"default_action": {'
		            +'"type": "web_url",'
		            +'"url": "https://www.connect-123.com/programs/volunteer/barcelona-spain/",'
		            +'"messenger_extensions": true,'
		            +'"webview_height_ratio": "tall",'
		            +'"fallback_url": "https://www.connect-123.com/programs/volunteer/barcelona-spain/"'
		          +'},'
		          +'"buttons":['
		            +'{'
		              +'"type":"web_url",'
		              +'"url":"https://www.connect-123.com/programs/volunteer/barcelona-spain/",'
		              +'"title":"View Website"'
		            +'}'              
		          +']'   
		        +'},'
		        +'{'
		        +'"title":"Volunteer in Buenos Aires",'
		        +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Cape-Town-South-Africa-20_960x261_crop_90.jpg",'
		        +'"subtitle":"The Paris of South America. VOLUNTEER IN BUENOS AIRES",'
		        +'"default_action": {'
		          +'"type": "web_url",'
		          +'"url": "https://www.connect-123.com/programs/volunteer/buenos-aires-argentina/",'
		          +'"messenger_extensions": true,'
		          +'"webview_height_ratio": "tall",'
		          +'"fallback_url": "https://www.connect-123.com/programs/volunteer/buenos-aires-argentina/"'
		        +'},'
		        +'"buttons":['
		          +'{'
		            +'"type":"web_url",'
		            +'"url":"https://www.connect-123.com/programs/volunteer/buenos-aires-argentina/",'
		            +'"title":"View Website"'
		          +'}'              
		        +']'   
		      +'},'
		      +'{'
		      +'"title":"Volunteer in Cape Town",'
		      +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Cape-Town-South-Africa-.jpg",'
		      +'"subtitle":"Wind Surfing in front of spectacular Table Mountain",'
		      +'"default_action": {'
		        +'"type": "web_url",'
		        +'"url": "https://www.connect-123.com/programs/volunteer/cape-town-south-africa/",'
		        +'"messenger_extensions": true,'
		        +'"webview_height_ratio": "tall",'
		        +'"fallback_url": "https://www.connect-123.com/programs/volunteer/cape-town-south-africa/"'
		      +'},'
		      +'"buttons":['
		        +'{'
		          +'"type":"web_url",'
		          +'"url":"https://connect-123.com",'
		          +'"title":"View Website"'
		        +'}'              
		      +']'   
		    +'}';
			  if(message.text.includes('Barcelona')) 
				  subBody = '{'
			          +'"title":"Volunteer in Barcelona",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Barcelona-Mercat-de-La-Boqueria-de.jpg",'
			          +'"subtitle":"Volunteer in Barcelona",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/volunteer/barcelona-spain/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/volunteer/barcelona-spain/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://www.connect-123.com/programs/volunteer/barcelona-spain/",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  if(message.text.includes('Buenos Aires'))
				  subBody = '{'
			          +'"title":"Volunteer in Buenos Aires",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Cape-Town-South-Africa-20_960x261_crop_90.jpg",'
			          +'"subtitle":"the Paris of South America",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/volunteer/buenos-aires-argentina/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/volunteer/buenos-aires-argentina/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://www.connect-123.com/programs/volunteer/buenos-aires-argentina/",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  if(message.text.includes('Cape Town'))
				  subBody = '{'
			          +'"title":"Volunteer in Cape Town",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Cape-Town-South-Africa-.jpg",'
			          +'"subtitle":"Wind Surfing in front of spectacular Table Mountain",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/volunteer/cape-town-south-africa/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/volunteer/cape-town-south-africa/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://www.connect-123.com/programs/volunteer/cape-town-south-africa/",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  
			  if(message.text.includes('Dublin'))
				  subBody = '{'
			          +'"title":"Volunteer in Dublin",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/02/Dublin-Malahide-Castle-Ireland_960x261_crop_90.jpg",'
			          +'"subtitle":"Volunteer In Dublin, Ireland",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/volunteer/dublin-ireland/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/volunteer/dublin-ireland/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://www.connect-123.com/programs/volunteer/dublin-ireland/",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  var bodyString = '{'
					   	+'"type":"template",'
					      +'"payload":{'
					        +'"template_type":"generic",'
					        +'"elements":['
					          +subBody
					        +']'
					      +'}'
					    +'}';
			  
			  botResponse( { attachment: bodyString },sender);
		  }
		  else if(courseDetails.value == "intership"){
			  var subBody = "";
			  subBody =  '{'
	          +'"title":"Welcome to Connect123",'
	          +'"image_url":"https://www.connect-123.com/wp-content/themes/connect123/images/connect123-logo.jpg",'
	          +'"subtitle":"We\'ve got the right Interships for you.",'
	          +'"default_action": {'
	            +'"type": "web_url",'
	            +'"url": "https://www.connect-123.com/programs/internships/",'
	            +'"messenger_extensions": true,'
	            +'"webview_height_ratio": "tall",'
	            +'"fallback_url": "https://connect-123.com"'
	          +'},'
	          +'"buttons":['
	            +'{'
	              +'"type":"web_url",'
	              +'"url":"https://connect-123.com",'
	              +'"title":"View Website"'
	            +'}'              
	          +']'   
	        +'},'
	        +'{'
	          +'"title":"Internships in Barcelona",'
	          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/03/90-La-Sagrada-Familia-Barcelona-531x716.jpg",'
	          +'"subtitle":"El Poble Espanyol at Sunset, near Montjuic in Barcelona",'
	          +'"default_action": {'
	            +'"type": "web_url",'
	            +'"url": "https://www.connect-123.com/programs/internships/barcelona-spain/",'
	            +'"messenger_extensions": true,'
	            +'"webview_height_ratio": "tall",'
	            +'"fallback_url": "https://www.connect-123.com/programs/internships/barcelona-spain/"'
	          +'},'
	          +'"buttons":['
	            +'{'
	              +'"type":"web_url",'
	              +'"url":"https://connect-123.com",'
	              +'"title":"View Website"'
	            +'}'              
	          +']'   
	        +'},'
	        +'{'
	        +'"title":"Internships in Buenos Aires",'
	        +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/03/Buenos_Aires_D--cembre_2007_-_Avenida_5_de_Mayo-e1475876066425-531x716.jpg",'
	        +'"subtitle":"the Paris of South America",'
	        +'"default_action": {'
	          +'"type": "web_url",'
	          +'"url": "https://www.connect-123.com/programs/internships/buenos-aires-argentina/",'
	          +'"messenger_extensions": true,'
	          +'"webview_height_ratio": "tall",'
	          +'"fallback_url": "https://www.connect-123.com/programs/internships/buenos-aires-argentina/"'
	        +'},'
	        +'"buttons":['
	          +'{'
	            +'"type":"web_url",'
	            +'"url":"https://connect-123.com",'
	            +'"title":"View Website"'
	          +'}'              
	        +']'   
	      +'},'
	      +'{'
	      +'"title":"Internships in Cape Town",'
	      +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/03/Cape-Town-Overview-531x716.jpg",'
	      +'"subtitle":"Wind Surfing in front of spectacular Table Mountain",'
	      +'"default_action": {'
	        +'"type": "web_url",'
	        +'"url": "https://www.connect-123.com/programs/internships/cape-town-south-africa/",'
	        +'"messenger_extensions": true,'
	        +'"webview_height_ratio": "tall",'
	        +'"fallback_url": "https://www.connect-123.com/programs/internships/cape-town-south-africa/"'
	      +'},'
	      +'"buttons":['
	        +'{'
	          +'"type":"web_url",'
	          +'"url":"https://connect-123.com",'
	          +'"title":"View Website"'
	        +'}'              
	      +']'   
	    +'}';
			  if(message.text.includes('Barcelona')) 
				  subBody = '{'
			          +'"title":"Internships in Barcelona",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/03/90-La-Sagrada-Familia-Barcelona-531x716.jpg",'
			          +'"subtitle":"El Poble Espanyol at Sunset, near Montjuic in Barcelona",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/internships/barcelona-spain/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/internships/barcelona-spain/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://connect-123.com",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  if(message.text.includes('Buenos Aires'))
				  subBody = '{'
			          +'"title":"Internships in Buenos Aires",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/03/Buenos_Aires_D--cembre_2007_-_Avenida_5_de_Mayo-e1475876066425-531x716.jpg",'
			          +'"subtitle":"the Paris of South America",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/internships/buenos-aires-argentina/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/internships/buenos-aires-argentina/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://connect-123.com",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  if(message.text.includes('Cape Town'))
				  subBody = '{'
			          +'"title":"Internships in Cape Town",'
			          +'"image_url":"https://www.connect-123.com/wp-content/uploads/2016/03/Cape-Town-Overview-531x716.jpg",'
			          +'"subtitle":"Wind Surfing in front of spectacular Table Mountain",'
			          +'"default_action": {'
			            +'"type": "web_url",'
			            +'"url": "https://www.connect-123.com/programs/internships/cape-town-south-africa/",'
			            +'"messenger_extensions": true,'
			            +'"webview_height_ratio": "tall",'
			            +'"fallback_url": "https://www.connect-123.com/programs/internships/cape-town-south-africa/"'
			          +'},'
			          +'"buttons":['
			            +'{'
			              +'"type":"web_url",'
			              +'"url":"https://connect-123.com",'
			              +'"title":"View Website"'
			            +'}'              
			          +']'   
			        +'}';
			  
			  
			  var bodyString = '{'
					   	+'"type":"template",'
					      +'"payload":{'
					        +'"template_type":"generic",'
					        +'"elements":['
					          +subBody
					        +']'
					      +'}'
					    +'}';
			  
			  botResponse( { attachment: bodyString },sender);
			  return;
		  }
	  }
	  if(dintunderstand == true){
		  var quikReply = [
		      	{
		          "content_type":"text",
		          "title":"Yes",
		          "payload":"person_msg___"+message.text,
		        },
		        {
		          "content_type":"text",
		          "title":"No",
		          "payload":"person_msg___no"
		        }
		      ];
		  botResponse( { text: 'sorry i dont know what you mean. would you like to send this to a staff member?', quick_replies:quikReply },sender);
		  return;
	  }
}
function processBot(message, sender,availCommands, participantId){
	var dintunderstand = true;
	message.text = message.text.toLowerCase();
	var isUserCommand; 
	availCommands.forEach(function(command){
		if(message.text.toLowerCase() == command){
			isUserCommand = true;
		}
	});
	
	if(!isUserCommand){
		return;
	}
	if(message.text == 'documents'){
		
		dintunderstand = false;
		SF.fetchDocuments(participantId).then(function(results){
			var docMsg = ST.formatDocuments(results);
			console.log(" fromatter msg in webhook"+JSON.stringify(docMsg));
			
			console.log("formatted response in fbwebhook for documents is "+JSON.stringify(docMsg));
			if(docMsg.accountId == "empty"){
				botResponse({text:"no documents available"},sender);
				return;
			}
			botResponse( docMsg ,sender); 
			return;
		});
		return;
		
	}
	if(message.text == 'phonebook'){
		dintunderstand = false;
		//SF.contactVisiblity(sender).then(function(results){
		//console.log('phonebook called'+results);
		//var formattedconts = ST.formatAccountPrivate(results); 
		//botResponse({text:cMessage},sender); commands
		//console.log("formatted response in setup is "+JSON.stringify(formattedconts));
		//var destin = formattedconts.destination;
		//console.log("destin is "+destin);
		SF.fetchContacts(participantId).then(function(results){
			var formattedContacts = ST.formatPhoneBook(results);
			console.log("finally contacts are: "+JSON.stringify(formattedContacts));
			botResponse(formattedContacts,sender);
			return;
		});
		//});
	}
	if(message.text == 'setup'){
		var isVisibl;
		dintunderstand = false;
		//console.log('Setup called'+results);
		SF.contactVisiblity(sender).then(function(results){
			console.log('create setup called'+results);
			var formattedInfo = ST.formatAccountPrivate(results);; 
			//botResponse({text:cMessage},sender);
			console.log("formatted response in setup is "+formattedInfo);
			isVisibl = formattedInfo.visible;
			console.log("is visible? "+isVisibl);
			//botResponse( conMsg ,sender); 
			//return;
			console.log("is visible after sf call "+isVisibl);
			var setupButtons =[];
			if(isVisibl == false){
				setupButtons.push({"type":"postback",
					               "payload":"account_private_yes",
					               "title":"make contact visible"
						         });
			}
			else if(isVisibl == true){
				setupButtons.push({
				              "type":"postback",
				              "payload":"account_private_no",
				              "title":"Make contact private"
					        });
			}
			
			setupButtons.push({
				              "type":"postback",
				              "payload":"account_unlinking",
				              "title":"Logout"
				            });
			var conMsg =  {
				      "type":"template",
				      "payload":{
				        "template_type":"generic",
				        "elements":[
				    			{
				          "title":"Setup",
				        
				          "buttons":setupButtons
				        }      
				        ]
				      }
				    };
			console.log("formatted response in info is "+conMsg);
			botResponse({attachment : conMsg},sender);
			return;
		});
		return;
	}
	
	if(message.text == 'todo'){
		dintunderstand = false;
		SF.fetchToDo(participantId).then(function(results){
			console.log('todo is called after calling rest services : '+results);
			var todoTemplate = ST.formatTodoTasks(results); 
			//botResponse({text:cMessage},sender);
			console.log("formatted response in fbwebhook for formatetodotasks is "+JSON.stringify(todoTemplate));
			if(todoTemplate.accountId == "empty"){
				botResponse( {text:"no pending tasks."} ,sender); 
				return;
			}
			botResponse( todoTemplate ,sender); 
			return;
		});
		return;
	}
	
	if(message.text == 'info'){
		dintunderstand = false;
		SF.moreInfo(participantId).then(function(results){
			console.log('create info called'+results);
			var conMsg = ST.formatInformation(results);; 
			//botResponse({text:cMessage},sender);
			console.log("formatted response in info is "+JSON.stringify(conMsg));
			
			botResponse( conMsg ,sender); 
			return;
			
		});
		return;
	}
	
	if(message.text == 'create contact'){
		dintunderstand = false;
		SF.newLead().then(function(results){
			console.log('create contact called');
			var conMsg = results; 
			//botResponse({text:cMessage},sender);
			console.log("formatted response in create contact is "+conMsg);
			if(conMsg == true)
			botResponse( { text: 'Registration Succesful' },sender);
			return;
			
		});
		return;
	}
	if(message.text == 'events'){
		dintunderstand = false;
		
		  SF.EventIntract(participantId).then(function(results)
			{
			console.log("BEFORE ST CALL");	
			var cMessage = ""	;	
			cMessage = ST.formatEvent(results); 
			console.log("formatted response in fbwebhook for formatetodotasks is "+JSON.stringify(cMessage));
			if(cMessage.msg == "No upcoming events"){
				botResponse( {text:"No upcoming events"} ,sender); 
				return;
			}
			botResponse( cMessage ,sender); 
			return;
			});
		return;  
	}
	
	if(message.text == 'commands' || message.text == 'help'){
		dintunderstand = false;
		var commlist = 'Here is the list of commands available to you: \n\n'+
						'Todo – See any pending tasks you need to complete\n\n'+
						'Documents – This shows your documents and files\n\n'+
						'Events – Upcoming events in your destination\n\n'+
						'Info – Review the information that we have on file for you\n\n'+
						'Phonebook – See the Connect-123 participants in your destination\n\n'+ 
						'Setup – Your account settings\n\n'+
						'Commands – See this list again\n\n'+
						'And if you want to send a message to your program coordinator, just start typing!\n'; 
		//var availCommands = [];
		//availCommands.push("info");
		//availCommands.push("events");
		//availCommands.push("phonebook");
		//botResponse( getCommandsAttachment(availCommands),sender);
		//availCommands = [];
		//availCommands.push("setup");
		//availCommands.push("todo");
		//availCommands.push("documents");
		//setTimeout(() => {
			botResponse({text:commlist},sender);
		//}, 500);
		
		return;
	}
	
}
function getCommandsAttachment(availCommands){
	//var availCommands = [];
	
	//availCommands.push("info");
	//availCommands.push("events");
	//availCommands.push("phonebook");
	//availCommands.push("setup");
	//availCommands.push("todo");
	//availCommands.push("person");
	//availCommands.push("documents");
	var elements = [];
	var desc = "\n";
	availCommands.forEach(function(command){
		//desc = "\n";
		if(command == 'info'){
			desc += "Here are the list : \nInfo : Your current information about the Internship/Volunteer.";
		}if(command == 'events'){
			desc += "\nEvents : To view upcoming Events  at your destination.";
		}if(command == 'phonebook'){
			desc += "\nPhonebook : list of interns/volunteers at your destination.";
		}if(command == 'setup'){
			desc += "\nSetup : You can choose to hide your contact and also logout.";
		}if(command == 'todo'){
			desc += "\nTodo : List of pending Tasks.";
		}if(command  == 'documents'){
			desc += "\nDocuments : your personal documents.";
		}
		elements.push({
			 	"type":"postback",
	            "payload":""+command,
	            "title":""+command
		});
	});
	console.log(JSON.stringify(elements));
	var commandsAttach = 
						{
							"attachment":{
								"type": "template",
								"payload": {
									"template_type": "button",
									"text":" "+desc,
									"buttons": elements
								}
							}
						};
	return commandsAttach;
}
function processPostback(payload, sender, participant){
	let reminderStatus;
	let emailStatus;
	var availCommands = [];
	availCommands.push("info");
	availCommands.push("events");
	availCommands.push("phonebook");
	availCommands.push("setup");
	availCommands.push("todo");
	availCommands.push("person");
	availCommands.push("documents");
	var isUserCommand = false;
	availCommands.forEach(function(command){
		if(payload.toLowerCase() == command){
			isUserCommand = true;
		}
	});
	if(isUserCommand){
		processBot({text: payload},sender,availCommands, participant)
		
	}
	 if(payload == 'account_unlinking'){
		 var quikReply = [
		      	{
		          "content_type":"text",
		          "title":"Yes",
		          "payload":"account_unlinking_yes",
		        },
		        {
		          "content_type":"text",
		          "title":"No",
		          "payload":"account_unlinking_no"
		        }
		      ];
	 
		 botResponse( {text: "You will not recieve further notifications from Connect-123 via bot. \n Are You Sure to log out? ",quick_replies: quikReply} ,sender);
	 }else if(payload == 'account_private_yes'){
		 var cMessage = ""	;	
		  SF.contactVisiblity(sender).then(function(results)
			{
				console.log("BEFORE ST CALL"+results);	
				cMessage = ST.formatAccountPrivate(results);
				//botResponse({text:cMessage},sender);
				console.log("formatted response is "+cMessage);
				if(cMessage.visible == "none"){
					botResponse( { text: 'Your data is missing. Please contact your program co-ordinator' }, sender);
					return;
				}
				if(cMessage.visible == true){
					botResponse( { text: 'your contact is made visible already' }, sender);
					return;
				}else if(cMessage.visible == false){
					var updated ="";
					SF.setThecontactVisiblity(sender, 'yes', cMessage.accountId).then(function(innerresults)
					{
						console.log('inner results '+innerresults);
						updated = ST.setTheAccountPrivate(innerresults);
						console.log("updated in fb webhook is "+updated);
					});
					console.log("updated in fb webhook is "+updated);
					botResponse( { text: 'We made your contact  visible to other interns' }, sender);
					return;
				}
				
			});
		  return;
	 }
	 else if(payload == 'account_private_no'){
		 var cMessage = ""	;	
		  SF.contactVisiblity(sender).then(function(results)
			{
				console.log("BEFORE ST CALL"+results);	
				cMessage = ST.formatAccountPrivate(results);
				//botResponse({text:cMessage},sender);
				console.log("formatted response is "+cMessage);
				if(cMessage.visible == "none"){
					botResponse( { text: 'Your data is missing. Please contact your program co-ordinator' }, sender);
					return;
				}
				if(cMessage.visible == false){
					botResponse( { text: 'your contact is made private already' }, sender);
					return;
				}else if(cMessage.visible == true){
					var updated ="";
					SF.setThecontactVisiblity(sender, 'no', cMessage.accountId).then(function(innerresults)
					{
						console.log('inner results '+innerresults);
						updated = ST.setTheAccountPrivate(innerresults);
						console.log("updated in fb webhook is "+updated);
					});
					console.log("updated in fb webhook is "+updated);
					botResponse( { text: 'We made your contact private and is not visible to other interns' }, sender);
					return;
				}
				
			});
		  return;
	 }else if(payload.startsWith("Send_Reminder")){
		var splitString = payload.split("___");
		var msg = splitString[1];
		
		
		if(msg == "" && msg == undefined){
			botResponse( { text: 'Reminder could not be sent. Please try later' },sender);
			return;
		}else if(msg != undefined){
			SF.sendReminder(msg).then(function(results){
				var formattedMessage = ST.formatSendReminder(results).replace("\\\\", '');
				console.log("after formatting");
				reminderStatus = JSON.parse(formattedMessage);
				console.log("formatted message in send reminder in fbwebhok"+JSON.stringify(reminderStatus));
			});
			console.log("after sf call "+reminderStatus);
			setTimeout(() => {
				console.log("status value is"+reminderStatus);
				if(reminderStatus.status == "Failed"){
					botResponse( { text: 'Reminder could not be sent to your referrer. Please try later'},sender);
					return;
				}else if(reminderStatus.status == "success"){
					botResponse( { text: reminderStatus.msg},sender);
					return;
				}
			}, 2000);
			
			return;
		}
	}else if(payload.startsWith("Email Me Copy")){
		var splitString = payload.split(":::");
		var msg = splitString[1];
		if(msg == "" && msg == undefined){
			botResponse( { text: 'email could not be sent. Please try later' },sender);
			return;
		}else if(msg != undefined){
			SF.emailMeCopy(msg,participant).then(function(results){
				console.log("before formatting");
				var formattedMessage = ST.formatSendReminder(results).replace("\\\\", '');
				console.log("after formatting");
				emailStatus = JSON.parse(formattedMessage);
				console.log("formatted message in email me copy in fbwebhok"+JSON.stringify(emailStatus));
				console.log("msg value is"+emailStatus.msg);
				
				botResponse( { text: emailStatus.msg},sender);
			});
			return;
		}
	}else if(payload.startsWith("Un-Rsvp")){
		var splitString = payload.split("___");
		var msg = splitString[1];
		if(msg == "" && msg == undefined){
			botResponse( { text: 'Please try later' },sender);
			return;
		}else if(msg != undefined){
			SF.sendRsvp(participant,msg,'No').then(function(results){
				console.log("before formatting");
				var formattedMessage = ST.formatSendReminder(results).replace("\\\\", '');
				console.log("after formatting");
				emailStatus = JSON.parse(formattedMessage);
				console.log("formatted message in email me copy in fbwebhok"+JSON.stringify(emailStatus));
				console.log("msg value is"+emailStatus.msg);
				
				botResponse( { text: emailStatus.msg},sender);
				var availCommands = [];
				availCommands.push("commands");
				availCommands.push("info");
				availCommands.push("events");
				availCommands.push("phonebook");
				availCommands.push("setup");
				availCommands.push("todo");
				availCommands.push("person");
				availCommands.push("documents");
				processBot({text: 'events'}, sender,availCommands, participant);
				return;
			});
			
			return;
		}
	}else if(payload.startsWith("Rsvp")){
		var splitString = payload.split("___");
		var msg = splitString[1];
		if(msg == "" && msg == undefined){
			botResponse( { text: 'Please try later' },sender);
			return;
		}else if(msg != undefined){
			SF.sendRsvp(participant,msg,'Yes').then(function(results){
				console.log("before formatting");
				var formattedMessage = ST.formatSendReminder(results).replace("\\\\", '');
				console.log("after formatting"+formattedMessage);
				formattedMessage = JSON.parse(formattedMessage);
				//console.log("formatted message in email me copy in fbwebhok"+JSON.stringify(formattedMessage));
				console.log("msg value is"+JSON.stringify(formattedMessage));
				botResponse( { text: formattedMessage.msg},sender);
				console.log("msg value is"+(formattedMessage.itemPrice));
				if(formattedMessage.itemPrice != undefined && formattedMessage.itemPrice != '0'){
					console.log('inside pay attachment');
					var itemName = formattedMessage.itemName;
					var ItemPrice= formattedMessage.itemPrice;
					var payUrl = formattedMessage.url;
					if(ItemPrice != ''){
						var payAttachment = {
											"attachment":{
												"type":"template",
												"payload":{
											        "template_type":"button",
											        "text":"Pay now for "+itemName,
											        "buttons":[
											          {
											            "type":"web_url",
											            "url": payUrl,
											            "title":"Pay Now "+ItemPrice
											          }
											        ]
											      }
											}
										};
					botResponse( payAttachment,sender);
					console.log('after pay attchament');
					return;
					}
					
				}
				var availCommands = [];
				availCommands.push("commands");
				availCommands.push("info");
				availCommands.push("events");
				availCommands.push("phonebook");
				availCommands.push("setup");
				availCommands.push("todo");
				availCommands.push("person");
				availCommands.push("documents");
				processBot({text: 'events'}, sender,availCommands, participant);
				return;
			});
			
			
			return;
		}
	}else if(payload.startsWith("guest_list")){
		var splitString = payload.split("___");
		var msg = splitString[1];
		if(msg == "" && msg == undefined){
			botResponse( { text: 'Please try later' },sender);
			return;
		}else if(msg != undefined){
			SF.seeGuestList(msg,participant).then(function(results){
				console.log("before formatting");
				var glist = ST.formatGuestList(results);
				console.log(JSON.stringify(glist));
				if(glist.msg)
				{
					botResponse({text: glist.msg},sender);
				}else if(glist.guests){
					console.log("glist guests"+glist.guests)
					botResponse({text: glist.guests},sender);
				}else {
					botResponse({text : 'Please try later.'},sender);
				}
				
				return;
			});
		}
	}
}

function botSenderActionResponse(recipient)
{
	request({
 		url: 'https://graph.facebook.com/v2.6/me/messages',
 		qs: {access_token:process.env.FB_TOKEN},
         method: 'POST',
         json: {
        	 messaging_type: "RESPONSE",
        	 recipient: {id: recipient},
             sender_action: "mark_seen"
         	}
 		},function(error, response, body) {
             if (error) {
                 console.log('Error sending message: ', error);
               } else if (response.body.error) {
                 console.log('Error: ', response.body.error);
               }
 	});
	request({
 		url: 'https://graph.facebook.com/v2.6/me/messages',
 		qs: {access_token:process.env.FB_TOKEN},
         method: 'POST',
         json: {
        	 messaging_type: "RESPONSE",
        	 recipient: {id: recipient},
             sender_action: "typing_on"
         	}
 		},function(error, response, body) {
             if (error) {
                 console.log('Error sending message: ', error);
               } else if (response.body.error) {
                 console.log('Error: ', response.body.error);
               }
 	});
	 
}

function botResponse(message, recipient)
{
	console.log(message);
	request({
 		url: 'https://graph.facebook.com/v2.6/me/messages',
 		qs: {access_token:process.env.FB_TOKEN},
         method: 'POST',
         json: {
        	 messaging_type: "RESPONSE",
        	 recipient: {id: recipient},
             sender_action: "typing_on"
         	}
 		},function(error, response, body) {
             if (error) {
                 console.log('Error sending message: ', error);
               } else if (response.body.error) {
                 console.log('Error: ', response.body.error);
               }
 	});
	//setTimeout(
		//    function() {
	request({
 		url: 'https://graph.facebook.com/v2.6/me/messages',
 		qs: {access_token:process.env.FB_TOKEN},
         method: 'POST',
         json: {
        	 messaging_type: "RESPONSE",
        	 recipient: {id: recipient},
             sender_action: "typing_off"
         	}
 		},function(error, response, body) {
             if (error) {
                 console.log('Error sending message: ', error);
               } else if (response.body.error) {
                 console.log('Error: ', response.body.error);
               }
 	});
		  //  },2000);
	//setTimeout(
    //function() {
    	
    	request({
    		url: 'https://graph.facebook.com/v2.6/me/messages',
    		qs: {access_token:process.env.FB_TOKEN},
            method: 'POST',
            json: {
            	messaging_type: "RESPONSE",
            	recipient: {id: recipient},
                message: message
            	}
    		},function(error, response, body) {
                if (error) {
                    console.log('Error sending message: ', error);
                    request({
                 		url: 'https://graph.facebook.com/v2.6/me/messages',
                 		qs: {access_token:process.env.FB_TOKEN},
                         method: 'POST',
                         json: {
                        	 messaging_type: "RESPONSE",
                        	 recipient: {id: recipient},
                             sender_action: "typing_off"
                         	}
                 		},function(error, response, body) {
                             if (error) {
                                 console.log('Error sending message: ', error);
                               } else if (response.body.error) {
                                 console.log('Error: ', response.body.error);
                               }
                 	});
                  } else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                  }
    	});
    //}, 2500);
    setTimeout(
     function() {
    	request({
     		url: 'https://graph.facebook.com/v2.6/me/messages',
     		qs: {access_token:process.env.FB_TOKEN},
             method: 'POST',
             json: {
            	 messaging_type: "RESPONSE",
            	 recipient: {id: recipient},
                 sender_action: "typing_off"
             	}
     		},function(error, response, body) {
                 if (error) {
                     console.log('Error sending message: ', error);
                   } else if (response.body.error) {
                     console.log('Error: ', response.body.error);
                   }
     	});
    }, 1000);	
}

function accountUnlink(recipient)
{
	console.log("reached unlink"+recipient);
	request({
		url: 'https://graph.facebook.com/v2.6/me/unlink_accounts',
		qs: {access_token:process.env.FB_TOKEN},
        method: 'POST',
        json: {
            psid: recipient
        	}
		},function(error, response, body) {
            if (error) {
                console.log('Error unlinking accoount: ', error);
              } else if (response.body.error) {
                console.log('Error: ', response.body.error);
              }
	});
	
	SF.contactVisiblity(recipient).then(function(results){
		console.log('checking account is aviable in sf from unlink account method in webhook '+results);
		var appl = ST.formatAccountPrivate(results);
		console.log("formatted response in unling account is "+JSON.stringify(appl));
		//var appl = formattedcontcs.Id;
		if(appl.accountId != "empty"){
			//botResponse({text: "You have logged out. You will recieve only email updates from Connect-123 if any"},recipient);
			
			SF.unlinkAccount(appl.Id).then(function(results){
				
			});
			
		}else {
			botResponse({text: "Unknown Error Occurred. Please try again later/Contact your program coordinator"},recipient);
			return;
		}
		
	});
	
}

function botTransfer(text, recipient){
	console.log("reached bot transfer "+recipient);
	SF.sendMessageToCoordinator(recipient, text).then(function(results){
		var formresuls = ST.formatSendReminder(results);
		console.log("bot transger results"+JSON.stringify(formresuls));
		botResponse({text: formresuls},recipient);
	});
	
	return;
	request({
		url: 'https://graph.facebook.com/v2.6/me/pass_thread_control',
		qs: {access_token:process.env.FB_TOKEN},
        method: 'POST',
        json: {
	        	recipient: {id: recipient},
	        	target_app_id : "263902037430900",
	        	metadata: text 
        	}
		},function(error, response, body) {
            if (error) {
                console.log('Error transferring bot: ', error);
              } else if (response.body.error) {
                console.log('Error: ', response.body.error);
              }
	});
}

function sInterpret(text, sender){
	//var salutation = text.match(/Hello/i); 
	//if(text.match(/Hello/i) || text.match(/hello/i) || text.match(/Hi/i) || text.match(/hi/i)){
	
	handleMessage(text,sender);
	//}
}

exports.webhookGet = function(req,res)
{
	if (
		    req.param
		    ('hub.mode') == 'subscribe' &&
		    req.param('hub.verify_token') == 'token'
		  ) {
		    res.send(req.param('hub.challenge'));
		  } else {
		    res.sendStatus(400);
		    
		  }
	console.log("Get method first");
};

exports.webhookPost = function(req,res)
{	
	var messaging_events = req.body.entry[0].messaging;
	//console.log("webhook post "+messaging_events[0].sender.id);
	//console.log("session"+JSON.stringify(req.session));
	console.log("webhook post "+JSON.stringify(req.body));
	if(messaging_events != undefined && messaging_events.length >= 0){
		botSenderActionResponse(messaging_events[0].sender.id);
	}else {
		return;
	}
	
	for(var i = 0; i < messaging_events.length; i++){
		var event = messaging_events[i];
		console.log(messaging_events.length);
		var sender = event.sender.id;
		let loginstatus;
		let userparticipantId;
		var postBackMessage = event.postback;
		var accountLink = event.account_linking;
		//var quickReply = event.message.quick_reply;
		if(accountLink != undefined){
			if(accountLink.status == 'linked'){
				var gret = 'Welcome,\n'+
							'We will use Facebook Messenger to communicate with each other throughout your Connect-123 experience. You will be able to complete checklist items, review documents, and RSVP for events. Please be sure to stay on the lookout for notifications we send you so you won’t miss a thing!\n'+
							'Here is the list of commands available to you:\n\n '+
							'Todo – See any pending tasks you need to complete\n\n'+
							'Documents – This shows your documents and files\n\n'+
							'Events – Upcoming events in your destination\n\n'+
							'Info – Review the information that we have on file for you\n\n'+
							'Phonebook – See the Connect-123 participants in your destination\n\n'+ 
							'Setup – Your account settings\n\n'+
							'Commands – See this list again\n\n'+
							'And if you want to send a message to your program coordinator, just start typing!\n';
				botResponse( { text: gret },sender);
				break;
				
			}
		}
		if(event.referral && event.referral.ref != undefined && event.referral.ref != ""){
			SF.checkExistingEmailInSf(sender,event.referral.ref).then(function(results){
				var applDetails = ST.formatAccountPrivate(results);
				console.log("formatted results in fbwebhook for referral is "+JSON.stringify(applDetails));
				console.log("account id check is "+applDetails.accountId != "empty");
				if(applDetails.accountId != "empty"){
					if(applDetails.fbId != "null" && applDetails.preferredchannel != 'FbBot'){
						var url = loginUrl+event.referral.ref; 
						var loginbutton = '{'+
					      '"type":"template",'+
					      '"payload":{'+
					        '"template_type":"button",'+
					        '"text":"Hi '+applDetails.name+', Welcome to Connect-123 on Facebook Messenger—stay connected like never before. Type Commands for a full list of tools , Please Verify your Email address first",'+
					        '"buttons":['+
					          '{'+
					            '"type":"account_link",'+
					            '"url":"'+url+'"'+
					          '}'+
					        ']'+
					      '}'+
					    '}';
						
						
						console.log("before bot response");
						botResponse( {attachment: loginbutton} ,sender);
						console.log("after bot response");
					}else {
						//botResponse({text:"Hi"},sender);
					}
					
					return;
				}else {
					botResponse({text:"Your details could not be found. Please contact your program Co-ordinator"},sender);
					return;
				}
				 
			 });
		}
		if(event.message){
			console.log("message inside event.message 1463 line"+JSON.stringify(event.message));
			//console.log("FACEBOOK ID IS:" +sender);
			//botResponse({text:'Hello I am AWESOME BOT to help you'}, sender);
			var payL = event.message.quick_reply;
			if(payL && payL.payload){
				if(payL.payload == 'account_unlinking_yes'){
					accountUnlink(sender);
					break;
					
				}
				else if(payL.payload == 'account_unlinking_no'){
					botResponse( { text: 'Thank you' },sender);
					break;
				}else if(payL.payload.startsWith("person_msg")){
					var splitString = payL.payload.split("___");
					var msg = splitString[1];
					if(msg == "no"){
						botResponse( { text: 'Okay, message is not sent' },sender);
						break;
					}else if(msg != undefined){
						//botResponse( { text: 'Thank you, your msg is sent to our executive, he will chat with you shortly \n '+msg },sender);
						botTransfer(msg, sender);
						break;
					}
					
				}else if(payL.payload.startsWith('connect123_account_linking')){
					var splitString = payL.payload.split("___");
					 var msg = splitString[1];
					 var url = loginUrl;
					 if(msg != undefined && msg != ""){
						 url = url+'?id='+msg;
					 }
					 //var url = 'https://dev-connect-123.cs13.force.com/application/facebooklogin?id='+referral.ref; 
						var botLoginLink = '{'+
					      '"type":"template",'+
					      '"payload":{'+
					        '"template_type":"button",'+
					        '"text":"Please verify your email address",'+
					        '"buttons":['+
					          '{'+
					            '"type":"account_link",'+
					            '"url":"'+url+'"'+
					          '}'+
					        ']'+
					      '}'+
					    '}';
					botResponse( {attachment: botLoginLink} ,sender);
					break;
				}else if(payL.payload == 'connect123_accountlinkingno'){
					
					botResponse( {text: "Ok"} ,sender);
					break;
				}
				
			}else {
				sInterpret(event.message, sender);
			}
			
			
		}else if(event.postback){
			console.log("FACEBOOK ID in PostBack:" +JSON.stringify(event.postback));
			if (event.postback.payload === 'Hello_Get_Started'){
				 botResponse( { text: 'Welcome to Connect-123.' },sender);
				 var referral = event.postback.referral;
				 //let emailExists = false;
				 if(referral != undefined && referral.ref != undefined && referral.ref != ""){
					 SF.checkExistingEmailInSf(sender,referral.ref).then(function(results){
						var applDetails = ST.formatAccountPrivate(results);
						console.log("formatted results in fbwebhook for referral is "+JSON.stringify(applDetails));
						console.log("account id check is "+applDetails.accountId != "empty");
						if(applDetails.accountId != "empty"){
							var url = loginUrl+referral.ref; 
							var loginbutton = '{'+
						      '"type":"template",'+
						      '"payload":{'+
						        '"template_type":"button",'+
						        '"text":"To securely connect your Facebook Messenger account to the Connect-123 system, please click Log In below and, when prompted, enter the primary email address you have been using to communicate with us.",'+
						        '"buttons":['+
						          '{'+
						            '"type":"account_link",'+
						            '"url":"'+url+'"'+
						          '}'+
						        ']'+
						      '}'+
						    '}';
							
							
							console.log("before bot response");
							botResponse( {attachment: loginbutton} ,sender);
							console.log("after bot response");
							return;
						}else {
							botResponse({text:"Your details could not be found. Please contact your program Co-ordinator"},sender);
							return;
						}
						 
					 });
				 }else {
					 
				 }
			 }
			 else if(event.postback.payload.startsWith('connect123_account_linking')){
				 var splitString = event.postback.payload.split("___");
				 var msg = splitString[1];
				 var url = loginUrl;
				 if(msg != undefined && msg != ""){
					 url = url+'?id='+msg;
				 }
				 var botLoginLink = '{'+
								      '"type":"template",'+
								      '"payload":{'+
								        '"template_type":"button",'+
								        '"text":"Hi, Please Click Login to verify your account.",'+
								        '"buttons":['+
								          '{'+
								            '"type":"account_link",'+
								            '"url":"'+url+'"'+
								          '}'+
								        ']'+
								      '}'+
								    '}';
				 botResponse( {attachment: botLoginLink} ,sender);
			 }else {
				 SF.contactVisiblity(sender).then(function(results){
					console.log('checking account is aviable in sf '+results);
					var formattedcontcs = ST.formatAccountPrivate(results);
					console.log("formatted response in checkAccountInSalesforce is "+JSON.stringify(formattedcontcs));
					userparticipantId = formattedcontcs.Id;
					if(formattedcontcs.accountId == 'empty'){
						loginstatus = "empty";
					}
					else {
						loginstatus = formattedcontcs.preferredchannel;
					}
				});
				console.log("status value before timeout is"+loginstatus);
				setTimeout(() => {
						console.log("status value is"+loginstatus);
						
						if(loginstatus == "empty"){
							botResponse({text: 'These commands are only available to current Connect-123 Interns/ Volunteers'},sender);
							return;
						}else if(loginstatus == "undefined" || loginstatus == "Email"){
							var quikReplyForLogin = [
						      	{
						          "content_type":"text",
						          "title":"Yes",
						          "payload":"connect123_account_linking___"+userparticipantId,
						        },
						        {
						          "content_type":"text",
						          "title":"No",
						          "payload":"connect123_accountlinkingno"
						        }
						      ];
							botResponse({text: 'You have to log in for this',quick_replies: quikReplyForLogin},sender);
							return;
						}else if(loginstatus == 'FbBot') {
							processPostback(event.postback.payload, sender, userparticipantId);
						}
				 },2000);
			 }
		}
	}
	res.sendStatus(200);
};

