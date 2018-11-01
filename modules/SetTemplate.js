"use strict";
var bodyParser = require('body-parser');
var formatAccountPrivate = function(privateAccount){
	console.log('private contact in set tempaltes '+JSON.stringify(privateAccount ));
	if(privateAccount.length == 0){
		return {"msg":"Your data is not found in salesforce", "visible": "none", "accountId": "empty" ,"fbId":"empty","preferredchannel":"empty"};
	}
	//log is 
	console.log("visiblity field  is : "+privateAccount[0].get("visible_to_other_interns_c__pc" ));
	console.log("destination is: "+privateAccount[0].get("personcontact").get("destination__r").name);
	var isVisible = {"name":""+privateAccount[0].get("name"),"fbId":""+privateAccount[0].get("Facebook_PSID__c"),"preferredchannel": ""+privateAccount[0].get("Preferred_Communication_Channel__c"),"Id":""+privateAccount[0].get("Id"),"msg":"success", "visible": privateAccount[0].get("visible_to_other_interns_c__pc"), "destination": ""+privateAccount[0].get("personaccount.Destination__r").name };
	console.log("json sending to sf api is --> "+isVisible);
	return isVisible;
}   

var formatSendReminder = function(results){
	console.log('formatSendReminder in set tempaltes'+JSON.stringify(results));
	return results;
}

var formatGuestList = function(guestsList){
	console.log(JSON.stringify(guestsList));
	if(guestsList.length == 0){
		return {"msg":"Nobody has responded yet"};
	}else {
		var guestmsg = "No. Of Guests: "+guestsList.length+"\n";
		console.log(guestsList[0].get("Name"));
		//console.log(guestsList[0].get("Applicant__r").get("Account__r"));
		var guests = "";
		guestsList.forEach(function(guest){
			guests += "\n"+guestsList[0].get("Applicant__r").Name;
		});
		console.log("guest are : "+guests);
		return {"guests":guestmsg+guests};
	}	 
	
}

var formatDocuments = function(results){ 
	console.log('formatDocuments in set tempaltes'+JSON.stringify(results));
	if(results.length == 0){
		return {"msg":"no documents available", "visible": "none", "accountId": "empty" ,"fbId":"empty","preferredchannel":"empty"};
	}
	console.log('formattodo in set tempaltes after checking length'+JSON.stringify(results));
	return{
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": results
			}
		}
	};
}

var formatTodoTasks = function(results){
	console.log('formattodo in set tempaltes'+JSON.stringify(results));
	if(results.length == 0){
		return {"msg":"Your have no pending items at this stage", "visible": "none", "accountId": "empty" ,"fbId":"empty","preferredchannel":"empty"};
	}
	console.log('formattodo in set tempaltes after checking length'+JSON.stringify(results));
	//log is 
	//console.log("visiblity field  is : "+privateAccount[0].get("Account__r").Visible_to_Other_Interns__c);
	for(var i=0; i<results.length;i++){
		//console.log(results[i].buttons);
		if(results[i].buttons.length == 0){
			delete results[i].buttons;
		}
	}
	console.log("after deleting"+JSON.stringify(results));
	return{
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": results
			}
		}
	};
	
	//return isVisible;
}

var formatCheckUser= function(privateAccount){
	
	console.log('private contact in set tempaltes '+JSON.stringify(privateAccount));
	var checkUser = [];
	if(privateAccount.length == 0){
		checkUser.push({"msg":"Your data is not found in salesforce", "visible": "none", "accountId": "empty" });
	}
	else {
		checkUser.push({"msg":"success", "visible": privateAccount[0].get("Account__r").Visible_to_Other_Interns__c, "accountId": ""+privateAccount[0].get("Account__c"), "destination": ""+privateAccount[0].get("Destination__r").Name });
	}
	var actualJson = [];
	if(checkUser.accountId == 'empty'){
		actualJson.push({"validuser":false});
	}
	else {
		actualJson.push({"validuser":true});
	}
	
	return actualJson;
}

var formatPhoneBook = function(phoneBook){
	console.log('phone book in set tempaltes'+JSON.stringify(phoneBook));
	if(phoneBook.length == 0){
		return {"text":"no matching interns found."};
	}
	if(phoneBook.length == 1){
		console.log("inside length 1");
		if(phoneBook[0].title == 'Arrival Info Not Set'){
			var attchJson =
			{
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "button",
						"text":"Please finalize your travel dates, and then we will show you a list of who will be there at the same time as you.",
						"buttons":[
						   {
							   "type":"web_url",
					            "url":phoneBook[0].subtitle,
					            "title":"Enter Travel Dates"
						   }
						  ]
					}
				}
			};
			return attchJson;
		}
			
	}
	
	//var isVisible = {"msg":"success", "visible": privateAccount[0].get("Account__r").Visible_to_Other_Interns__c, "accountId": ""+privateAccount[0].get("Account__c") }
	var elements = [];
	/*
	console.log(phoneBook[0].get("Contact__r").MobilePhone);
	phoneBook.forEach(function(contact){
		elements.push({
            	
            	  "type": "phone_number",
            	  "title":contact.get("Name"),
            	  "payload":""+contact.get("Contact__r").MobilePhone
		});
	});*/
	return{
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": phoneBook
			}
		}
	}; 
}

var setTheAccountPrivate = function(prvAccount){
	console.log("updated results is"+prvAccount);
	return 'Success';
}

var formatInformation = function(infos){
	console.log(infos);
	var mess ="";
	if(infos.length == 0 ){
		mess ={"text":"No Information Available"};
	}else {
		mess = infos;
	}
	return mess;
	/*
	var elements = [];
	console.log(infos[0].get("Name"));
	var refText ="";
	if(infos[0].get("Number_of_References__c") != null && infos[0].get("Number_of_References__c") != undefined){
		refText = infos[0].get("Number_of_References__c")+" uploaded";
	}else {
		refText = "No reference letters were uploaded";
	}
	
	var attach = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "airline_checkin",
				 "intro_message": "Hi "+infos[0].get("Name")+", \nContact Number:"+infos[0].get("Phone__c")+"\nEmail: "+infos[0].get("Email__c")+"\nReference Letters: "+refText,
		         "locale": "en_US",
		         "pnr_number": ""+infos[0].get("Airline_PNR__c"),
		         "checkin_url": "https:\/\/www.airline.com\/check-in",  
		         "flight_info": [
		             {
		               "flight_number": ""+infos[0].get("Flight_Number__c"),
		               "departure_airport": {
		                 "airport_code": "SFO",
		                 "city": ""+infos[0].get("Billing_City__c"),
		                 "terminal": "T4",
		                 "gate": "G8"
		               },
		               "arrival_airport": {
		                 "airport_code": "SEA",
		                 "city": ""+infos[0].get("Destination__r").Name,
		                 "terminal": "T4",
		                 "gate": "G8"
		               },
		               "flight_schedule": {
		                 "boarding_time": "2016-01-05T15:05",
		                 "departure_time": "2016-01-05T15:45",
		                 "arrival_time": "2016-01-06T17:30"
		               }
		             }
		           ]
			}
		}
	};*/
	return attach;
	
}
var formatContact = function(contacts)
{
	/*var elements = [];
	console.log(contacts.get("Title"));
	contacts.forEach(function(contact){
		elements.push({
			title: contact.get("Name"),
            subtitle: contact.get("ContactId__r").Name + " · " + contact.get("ContactId__r").MobilePhone,
            "buttons":[{
            	"type":"postback",
            	"title":"View Opportunity",
            	"payload": "View_Opportunity," + contact.getId() + "," + contact.get("Name")
            	
            }]
		});
	});
	return{
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": elements
			}
		}
	};*/
	
	///OLD GOLD START HERE
	console.log("REACHED ST");
	var responsetext = "Hello";
	console.log(contacts[0]);
	var sName = " ";
	//console.log("NAME");
	//console.log(sName);
	var sMobilePhone = " ";
	var OpptyName = contacts[0].get("Name");
	var OpptyAmount = contacts[0].get("mobilephone");
	if(!OpptyAmount){
		OpptyAmount = " No Contact";
	}
	
	//responsetext = "Hello '"+ sName +"', Your Phone Number in our database is'"+ sMobilePhone +"' , Thanks for reaching us !,\r\n  Opprotunity Assinged You and details are: \r\n Oppotunity Name:'"+ OpptyName +"'\r\n Oppotunity Amount:'"+ OpptyAmount +"'";
	responsetext = "Hello  Please contact "+ OpptyName+" This is his Contact "+OpptyAmount;
	console.log(responsetext);

	return responsetext;
};
var formatEvent = function(elements)
{
	if(elements.length == 0){
		return {"msg":"No upcoming events"};
	}
	console.log('format events in set tempaltes after checking length'+JSON.stringify(elements));
	console.log("events in format events is "+elements);
	return{
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": elements
			}
		}
	};
	
	///OLD GOLD START HERE
	console.log("REACHED ST");
	var responsetext = "Hello";
	console.log(contacts[0]);
	var sName = " ";
	//console.log("NAME");
	//console.log(sName);
	var sMobilePhone = " ";
	var EventName = contacts[0].get("Name");
	var EventDescription = contacts[0].get("Description__c");
	
	
	//responsetext = "Hello '"+ sName +"', Your Phone Number in our database is'"+ sMobilePhone +"' , Thanks for reaching us !,\r\n  Opprotunity Assinged You and details are: \r\n Oppotunity Name:'"+ OpptyName +"'\r\n Oppotunity Amount:'"+ OpptyAmount +"'";
	responsetext = "Hello  this event "+ EventName+" \n Details:"+EventDescription;
	console.log(responsetext);

	return responsetext;
};

exports.formatGuestList = formatGuestList;
exports.formatDocuments = formatDocuments;
exports.formatSendReminder = formatSendReminder;
exports.formatTodoTasks = formatTodoTasks;
exports.formatPhoneBook = formatPhoneBook;
exports.setTheAccountPrivate = setTheAccountPrivate;
exports.formatAccountPrivate = formatAccountPrivate;
exports.formatInformation = formatInformation;
exports.formatEvent = formatEvent; 
exports.formatContact = formatContact; 
