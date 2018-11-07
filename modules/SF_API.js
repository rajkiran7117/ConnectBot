"use strict";
var bodyParser = require('body-parser');
var nForceAuth = require('nforce'),
Promise = require('promise'),
//SFclientId ='3MVG9d8..z.hDcPIiJoaFcNQCdDyqq1f3adQwoqOsXEy74V5w4npSVjEP5NmM79Ik2Kpap14NB2zvZzp2E4eZ',
//SFSecret ='3105483709603369657',
//SFusername ='feuji@connect123.com.dev',
//SFpassword ='login@123'
SFclientId = process.env.SF_CONSUMER_KEY,
SFSecret = process.env.SF_CONSUMER_SECRET,
SFusername = process.env.SF_USER,
SFpassword = process.env.SF_PASSWORD,
SFSecurityToken = process.env.SF_SecurityToken

;

var AccessToken = '';
var connection = nForceAuth.createConnection({
	clientId: SFclientId,
	clientSecret: SFSecret,
	redirectUri: 'https://connect-123-bot.herokuapp.com/facebook',
	mode: 'single',
	autoRefresh:true});

connection.authenticate({ username: SFusername, password: SFpassword, securityToken: SFSecurityToken }, function(err,resp){
	 if (err) {
         console.log("Authentication error - " + err);
     } else {
         console.log('Authentication successful. Cached Token: ' + connection.oauth.access_token);
         AccessToken = resp.access_token;
         console.log('Authentication Access: ' + AccessToken);
     }
});
var setThecontactVisiblity = function(PSID,answer,account){
	
	
	var acc = nForceAuth.createSObject('Account');
	if(answer == 'yes'){
		acc.set('Visible_to_Other_Interns__c', true);
	}
	else if(answer == 'no') {
		acc.set('Visible_to_Other_Interns__c', false);
	}
	acc.set('Id', account);
	
	//acc.set('SLA__c', 'Gold');
	return new Promise(function(resolve, reject){
			connection.update({ sobject: acc}, function(err, resp){
			  if(!err){ 
				console.log('It worked!'); 
				var accountupdated = resp;
	  	    	console.log("QUERY Update for  IS");
	  	    	console.log(accountupdated);
	  	    	resolve(resp.success);
			  }
			  else {
				  console.error(err);
				  reject("AnError Occured in creating contact");
			  }
			});
		});
	
}

var uploadPhotos = function(jsonBodyPhoto){
	console.log("participant jsonbody in photo upload is "+JSON.stringify(jsonBodyPhoto));
	//console.log("participant attachments in photo upload is "+attArray);
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		//connection.query({query: "SELECT  Id, Name, Phone__c, Account__c, Account__r.Phone, Contact__r.MobilePhone , Account__r.Visible_to_Other_Interns__c FROM Project__c WHERE Account__r.Visible_to_Other_Interns__c = true and Destination__r.Name = '"+dest+"' and Facebook_PSID__c != '"+psid+"'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantDocuments",method:"POST",body: JSON.stringify(jsonBodyPhoto)}, function(err, res)
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("QUERY RESULT for getting contacts is: ");
		    	    	console.log(evenResult);
		    	    	resolve(res);
		   }
		   });
		});
}

var unlinkAccount = function(applId){
	console.log("reached unlinking in sf api");
	var acc = nForceAuth.createSObject('Account');
	acc.set('Preferred_Communication_Channel__c', 'Email');
	acc.set('Id', applId);
	console.log("applicant record is"+acc);
	
	//acc.set('SLA__c', 'Gold');
	return new Promise(function(resolve, reject){
			connection.update({ sobject: acc}, function(err, resp){
			  if(!err){ 
				console.log('update applicant worked!'); 
				var applupdated = resp;
	  	    	console.log("QUERY Update for  Account is");
	  	    	console.log(applupdated);
	  	    	resolve(resp.success);
			  }
			  else {
				  console.error(err);
				  reject("AnError Occured in creating contact");
			  }
			});
		});
}

var fetchContacts = function(psid){
	console.log('inside fetch contacts method'+psid);
	//console.log('inside fetch contacts method'+dest);
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		//connection.query({query: "SELECT  Id, Name, Phone__c, Account__c, Account__r.Phone, Contact__r.MobilePhone , Account__r.Visible_to_Other_Interns__c FROM Project__c WHERE Account__r.Visible_to_Other_Interns__c = true and Destination__r.Name = '"+dest+"' and Facebook_PSID__c != '"+psid+"'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantPhoneBook",urlParams:{"partId":psid}}, function(err, res)
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("QUERY RESULT for getting contacts is: ");
		    	    	console.log(evenResult);
		    	    	resolve(res);
		   }
		   });
		});
}

var contactVisiblity = function(PSID){
	console.log('inside contact visibility method'+PSID);
	 
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.query({query: "SELECT  Id,Name,Facebook_PSID__c, Preferred_Communication_Channel__c, Destination__pc, PersonContact.Destination__r.Name,Visible_to_Other_Interns_c__pc FROM Account WHERE Facebook_PSID__c ='"+PSID+"' And ispersonAccount =true and Account_status__c NOT IN ('Closed/Lost','Closed/Don\\'t Contact','Cancelled','Closed – Duplicate') Order By CreatedDate Desc" }, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("QUERY RESULT for infomation is: ");
		    	    	console.log(evenResult);
		   resolve(res.records);
		   }
		   });
		});
}
var checkExistingEmailInSf = function(PSID, participantId){
	console.log('inside checkExistingEmailInSf  method'+PSID);
	console.log('inside checkExistingEmailInSf email is  method'+participantId);
	
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.query({query: "SELECT  Id,Name, Facebook_PSID__c, Preferred_Communication_Channel__c, Destination__pc, PersonContact.Destination__r.Name,Visible_to_Other_Interns_c__pc FROM Account WHERE Id= '"+participantId+"'" }, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("QUERY RESULT for checkExistingEmailInSf is: ");
		    	    	console.log(evenResult);
		   resolve(res.records);
		   }
		   }); 
		});
}

var fetchToDo = function(psid){
	console.log("inside fetchToDo Method"+psid);
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantReminders",urlParams:{"partId":psid}}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest get RESULT for infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
}

var fetchDocuments = function(psid){
	console.log("inside fetchDocuments Method"+psid);
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantDocuments",urlParams:{"partId":psid}}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest get RESULT for infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
}

var sendReminder = function(participantId){
	console.log("inside sendReminder Method"+participantId);
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantReminders",method:"PATCH",body: JSON.stringify({"applId":participantId})}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest PATCH RESULT for reminder infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
}

var seeGuestList = function(itemId, appId){
	console.log("inside seeguest list Method"+appId);
	return new Promise(function(resolve, reject){
		connection.query({query: "SELECT Name, Applicant__r.Name, Applicant__r.Account__r.Name FROM Event_Attendees__c where Applicant_Response__c IN ('Yes','May be') AND Event__c ='"+itemId+"' AND Applicant__c != '"+appId+"'" }, function(err, res)
		//connection.apexRest({uri:"/ParticipantDocuments",method:"POST",urlParams: {"attachId":attachmentId}}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex see guest list is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res.records);
		   }
		   });
		});
}

var emailMeCopy = function(attachmentId,parId){
	console.log("inside sendReminder Method"+attachmentId);
	console.log("inside sendReminder Method"+parId);
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantDocuments",method:"POST",urlParams: {"attachId":attachmentId,"partId":parId}}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest PATCH RESULT for reminder infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
}
var moreInfo = function(participantId){
	console.log('inside moreINfo method'+participantId)
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantInfo",urlParams:{"partId":participantId}}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest PATCH RESULT for reminder infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
}

var newLead = function(Id){
	var acc = nForceAuth.createSObject('Contact');
	acc.set('FirstName', 'Bot');
	acc.set('LastName', ' Name');
	acc.set('Phone', '800-555-2345');
	//acc.set('SLA__c', 'Gold');
	return new Promise(function(resolve, reject){
		connection.insert({ sobject: acc}, function(err, resp){
		  if(!err){ 
			  console.log('It worked!'); 
			var contactInserted = resp;
  	    	console.log("QUERY RESULT IS");
  	    	console.log(contactInserted);
  	    	resolve(resp.success);
		  }
		  else {
			  console.error(err);
			  reject("AnError Occured in creating contact");
		  }
		});
	});
}


 var IntialIntract = function(Id)
{
	return new Promise(function(resolve, reject){
	//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
	connection.query({query: "SELECT Name, Id,mobilephone  FROM User Where Division = '"+Id+"'" }, function(err, res)	
			{
	    if(err)
	    { console.error(err);
	    	reject("AnError Occured");}
	    	    else { 
	    	    	var contact = res;
	    	    	console.log("QUERY RESULT IS");
	    	    	console.log(contact);
	   resolve(res.records);
	   }
	   });
	});
};

var EventIntract = function(participantId)
{
	console.log('inside moreINfo method'+participantId)
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantEvents",urlParams:{"partId":participantId}}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest get RESULT for event infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
};

var sendRsvp = function(participantId, itemId, response){
	console.log('inside moreINfo method'+participantId)
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantEvents",method:"PATCH",body: JSON.stringify({"applId":participantId,"itemId":itemId,"response":response})}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest get RESULT for RSVP infomation is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
} 
var sendMessageToCoordinator = function(participantId, msg){
	console.log('inside send to prog coordinator method'+participantId)
	return new Promise(function(resolve, reject){
		//connection.query({query: "SELECT Name, Amount FROM Opportunity where Id ='0067F000004YR3c'" }, function(err, res)
		connection.apexRest({uri:"/ParticipantInfo",method:"POST",body: JSON.stringify({"psid":participantId,"msg":msg})}, function(err, res)	
				{
		    if(err)
		    { console.error(err);
		    	reject("AnError Occured");}
		    	    else { 
		    	    	var evenResult = res;
		    	    	console.log("apex rest get RESULT for send to program coordinator is: ");
		    	    	console.log(JSON.stringify(evenResult));
		    	    	resolve(res);
		   }
		   });
		});
} 

exports.uploadPhotos = uploadPhotos;
exports.seeGuestList = seeGuestList;
exports.sendMessageToCoordinator = sendMessageToCoordinator;
exports.sendRsvp = sendRsvp;
exports.emailMeCopy = emailMeCopy;
exports.fetchDocuments = fetchDocuments;
exports.sendReminder = sendReminder;
exports.fetchToDo = fetchToDo;
exports.checkExistingEmailInSf = checkExistingEmailInSf;
exports.unlinkAccount = unlinkAccount;
exports.fetchContacts = fetchContacts;
exports.setThecontactVisiblity = setThecontactVisiblity;
exports.contactVisiblity = contactVisiblity;
exports.moreInfo = moreInfo;
exports.newLead = newLead;
exports.EventIntract = EventIntract;
exports.IntialIntract = IntialIntract;
exports.connection = connection;
exports.AccessToken = AccessToken;

