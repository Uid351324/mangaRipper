var casper = require('casper').create({   
     verbose: true, 
     logLevel: 'info',
    waitTimeout: 20000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22',
    pageSettings: {
      webSecurityEnabled: false,
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false         // use these settings
    }
});
// casper.options.remoteScripts.push("https://greasyfork.org/scripts/692-manga-loader/code/Manga%20Loader.user.js");
casper.options.clientScripts.push(casper.cli.get(0));
casper.options.viewportSize = {width: 800, height: 20};
if(!casper.cli.has(1) )
{

casper.echo("no url\n");
casper.exit();
}
else
{

casper.echo("url: " + casper.cli.get(1) + "\n");
}

var url = casper.cli.get(1);

var fs = require('fs');
var stream ;
var last=" ";
var name;
var k=0;
function getStaff(){
	casper.wait(2000, function() {
	        // casper.echo("I've waited for a second.");
	        var list = casper.getElementsAttribute('body img', 'src');
			 casper.echo("size: "+ list.length);
			// casper.echo("last "+last + " ?= " +list[list.length-1]);

			 // casper.capture('example'+k+'.png');
			 k++;
	        if(last != list[list.length-1])
	        {
		        last = list[list.length-1];
		        casper.scrollToBottom();
		        casper.then(getStaff);
		    }
		    else
		    {

				name = this.getTitle()
				casper.echo("Title: "+name);
		    }
	    });
}

casper.start(url, function(){
	// casper.capture('exampleA.png');
	casper.evaluate(function(){
		localStorage.setItem('mLoadNum', '99');
	});

	casper.wait(500, function() {casper.reload();});
});
casper.then(function(){
	this.click('body > button');
	getStaff();
});

casper.run(function() {
	// casper.capture('exampleC.png');

    // this.echo(pages.toString());
	// stream.flush();
	// stream.close();
	var cname = name;
	var subs = ['Page 1 | Batoto!', '| Batoto!', '- Manga Stream', 'online in high quality',
				'Read manga'];//TODO: add more title cleaners
	for( var i=0; i< subs.length;i++)
	{
		cname = cname.replace(subs[i], '');
	}
	name = cname.trim();

	var list = casper.getElementsAttribute('body img', 'src');
	// require('utils').dump( casper.getElementsAttribute('body img', 'src'));
	// casper.echo("size2 " + list.length);
	// require('utils').dump( casper.getElementsInfo('body img', 'src'));

	fs.makeDirectory(name);
	stream = fs.open( name + '/links.txt', 'w');
	for(var i =0; i < list.length; i++)
	{
		stream.write(list[i]+'\n');
	}
	stream.flush();
	stream.close();
    this.exit();
});