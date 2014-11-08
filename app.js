var page = require('webpage').create();
var system = require('system');

var userAgents = [
'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
'Mozilla/5.0 (compatible; MSIE 10.0; Macintosh; Intel Mac OS X 10_7_3; Trident/6.0)',
'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 7.1; Trident/5.0)',
'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)',
'Mozilla/5.0 ( ; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6',
'Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1090.0 Safari/536.6',
'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/19.77.34.5 Safari/537.1',
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.22 (KHTML, like Gecko) Chrome/19.0.1047.0 Safari/535.22',
'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10',
'Mozilla/5.0 (Windows NT 6.1; rv:15.0) Gecko/20120716 Firefox/15.0a2',
'Mozilla/5.0 (Windows NT 6.1; rv:12.0) Gecko/20120403211507 Firefox/14.0.1',
'Mozilla/5.0 (Windows NT 6.1; de;rv:12.0) Gecko/20120403211507 Firefox/12.0',
'Mozilla/5.0 (compatible; Windows; U; Windows NT 6.2; WOW64; en-US; rv:12.0) Gecko/20120403211507 Firefox/12.0'];

var ua = userAgents[Math.floor(Math.random() * userAgents.length)];

page.settings.userAgent = ua;

var url = 'http://sgforums.com/forums/1501/topics/485839';

page.onResourceRequested = function(requestData, request){
	if (requestData.url.indexOf("http://localhost") >= 0){
		//allow file protocol
	}
	else{
		//only download the page
		if (requestData.url != url){
			//	console.log("Abort");
				request.abort();
		}
	}
};


page.onResourceReceived = function(resource){
	if (resource.stage != 'end'){
		return;
	}

	if (url == resource.url && resource.redirectURL){
		url = resource.redirectURL;
	}
};


page.open(url, function() {
	
	page.injectJs("jQuery2.0.3.js");

	
	parsePage();
		
	phantom.exit(); 
	
  
});

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onError = function(msg, trace) {
	//do nothing
	//console.log("Error occured"+msg);
};


// Step 1
function parsePage() {

	

	
	var res = page.evaluate(function(url){



			var sites = {
			    "sgclub":{
			    "findTag":"table[id^='post']",
			    "findName":"a.bigusername",
			    "findText":"div[id^='post_message_']",
			    "findDate":"td.thead"
			    }, 
			    "animeboards":{
			    "findTag":"table[id^='post']",
			    "findName":"a.bigusername",
			    "findText":"div[id^='post_message_']",
			    "findDate":"td.thead"
			    },
			    "singaporebikes":{
			    "findTag":"table[id^='post']",
			    "findName":"a.bigusername",
			    "findText":"div[id^='post_message_']",
			    "findDate":"td.thead"
			    },
			    "sgforums":{
			    "findTag":".combined_post",
			    "findName":"div.author div.name",
			    "findText":"div[id^='post-body-']",
			    "findDate":"div.date"
			    }
			};


			forumName = "sgforums";
			var fTag = sites[forumName].findTag;
			var fName = sites[forumName].findName;
			var fText = sites[forumName].findText;
			var fDate = sites[forumName].findDate;
			var arr = [];

	
			$(fTag).each(function(index){

				var entry = $(this);

				var poster = entry.find(fName);

				poster = poster.text().trim();

				var text = entry.find(fText);    //dont know why we need this .slice(1,2);

				text = text.text().trim();

				var postDate = entry.find(fDate);
				
				postDate = postDate.first().text().trim();
				

				var myobj = { 'poster': poster, 'text': text, 'post_date' : postDate, 'location': 'Singapore', 'country': 'SG'};

				arr.push(myobj);


			});
			return arr;
	},url);

	console.log("##START##");
	console.log(JSON.stringify(res, undefined, 4));
	console.log("##END##");
	console.log("##URL=" + url);
 
}