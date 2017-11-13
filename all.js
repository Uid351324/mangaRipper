var casper = require('casper').create({   
       verbose: true, 
       logLevel: 'debug',
    waitTimeout: 20000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22',
    pageSettings: {
      // webSecurityEnabled: false,
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false         // use these settings
    }
});
// casper.options.remoteScripts.push("https://greasyfork.org/scripts/692-manga-loader/code/Manga%20Loader.user.js");
casper.options.clientScripts.push(casper.cli.get(0));
casper.options.viewportSize = {width: 800, height: 2000};
if(!casper.cli.has(1) )
{

	casper.echo("no url\n");
	casper.exit();
}
else
{

	casper.echo("url: " + casper.cli.get(1) + "\n");
}
var tmpfile=false;
if(casper.cli.has(2) )
{
	tmpfile=true;
	file=casper.cli.get(2);
}
var url = casper.cli.get(1);

var fs = require('fs');
var stream ;
var last=" ";
var name;
var k=0;
var imgSelector = 'body img';
var imgSrc = 'src';
var webtoons = false;
var len = 0;
var timer = 3;
if(url.indexOf('webtoons.com') != -1)
{
	imgSelector = '#_imageList ._images';
	imgSrc = 'data-url';
	casper.echo("webtoons ");
	webtoons=true;
}
else if(url.indexOf('gameofscanlation.moe') != -1)
{
	imgSelector = '.avatar';
	imgSrc = 'src';
	casper.echo("webtoons ");
	webtoons=true;
}
else if(url.indexOf('mangaseeonline.us') != -1)
{
	imgSelector = '.fullchapimage img';
	imgSrc = 'src';
	casper.echo("webtoons ");
	webtoons=true;
}
else
{
	casper.echo("not webtoons ");
}
function getStaff(){
	casper.wait(2500, function() {
			this.log("getStaff", "info");
	        casper.echo("I've waited for a second.");
	        var list = casper.getElementsAttribute(imgSelector, imgSrc);
			 casper.echo("size: "+ list.length + " / " + len);
			 casper.echo("last "+last + " ?= " +list[list.length-1]);

			   // casper.capture('example'+k+'.png');
			 k++;
	        if(last != list[list.length-1] || len > list.length )
	        {
		        last = list[list.length-1];
		        casper.scrollToBottom();
		        casper.then(getStaff);
		        timer = 3;
		    }
		    else if (timer > 0)
		    {
		    	last = list[list.length-1];
		        casper.scrollToBottom();
		        if(timer == 1)
		        {
		        	casper.scrollTo(0,0);
		        }
		        casper.then(getStaff);
		        timer = timer - 1 ;
		        casper.echo("timer: "+ timer);
		    }
		    else
		    {

				name = this.getTitle()
				casper.echo("Title: "+name);
		    }
	    });
}
function getRootUrl(url) {
  return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}
casper.on('page.resource.requested', function(requestData, networkRequest) {
    if (requestData.url.indexOf(getRootUrl(url)) !== 0) {
    	this.echo(getRootUrl(url) + " !=" +requestData.url );
        networkRequest.abort();
    }
});
casper.start(url, function(){
	   // casper.capture('/tmp/exampleA1.png');
	   this.log("start", "info");
	casper.evaluate(function(){
		localStorage.setItem('mLoadNum', '99');
	   this.log("evaluate", "info");
	});
	   // casper.capture('/tmp/exampleA2.png');
	casper.wait(1000, function() {len =  this.getElementsAttribute('#page_select option', 'value').length/2;});
	casper.echo("len: "+ len);
	if(webtoons != true)
		{
		 // casper.wait(500, function() {casper.capture('/tmp/exampleA5.png');});
		   // casper.capture('/tmp/exampleA3.png');
		}
});
casper.then(function(){
// 	 casper.capture('exampleB1.png');
this.log("then", "info");

	if(webtoons != true)
	{
		this.click('body > button');
this.log("click", "info");
	}
	 // casper.capture('exampleB2.png');
this.log("clicked", "info");
	getStaff();
this.log("staffgot", "info");
});

casper.run(function() {
	 // casper.capture('exampleC.png');

    // this.echo(pages.toString());
	// stream.flush();
	// stream.close();
	var cname = name;
	var subs = ['Page 1 | Batoto!', '| Batoto!', '- Manga Stream', 'online in high quality',
				'Read manga', 'Page 1', " ::", "::", "::", 'Jaimini\'s Box', '| Game of Scanlation'];//TODO: add more title cleaners

	for( var i=0; i< subs.length;i++)
	{
		cname = cname.replace(subs[i], '');
	}
	cname = cname.split("- Read")[0];
	name = cname.trim();

	var list = casper.getElementsAttribute(imgSelector, imgSrc);
	// require('utils').dump( casper.getElementsAttribute('body img', 'src'));
	// casper.echo("size2 " + list.length);
	// require('utils').dump( casper.getElementsInfo('body img', 'src'));

	fs.makeDirectory(name);
	if(tmpfile)
	{
		streamt = fs.open( file , 'w');
		streamt.write(name+'\n');
		streamt.flush();
		streamt.close();
	}
	stream = fs.open( name + '/links.txt', 'w');
	casper.echo("full size: "+ list.length);
	for(var i =0; i < list.length; i++)
	{
		stream.write(list[i]+'\n');
	}
	stream.flush();
	stream.close();
    this.exit();
});
