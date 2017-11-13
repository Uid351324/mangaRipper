var casper = require('casper').create({   
     // verbose: true, 
     // logLevel: 'debug',
    waitTimeout: 20000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22',
    pageSettings: {
      webSecurityEnabled: false,
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false         // use these settings
    }
});
var site =casper.cli.get(0);
var pages =casper.cli.get(1);

function downloadImage()
{
	// casper.evaluate(function () {
	this.echo(url);
	var url = this.getElementAttribute('#image', 'src');
	var file = url.slice(url.lastIndexOf("/")+1, url.indexOf("?"));
	// require('utils').dump();
	// require('utils').dump(this.getElementInfo('#image'));
	this.download(url, file);
// });
	/* body... */
}
casper.echo(site);
casper.start();
casper.thenOpen(site, downloadImage);

for(i = 2 ;i<=pages; ++i)
{
	casper.echo(site+i+".html");
	casper.thenOpen(site+i+".html", downloadImage );
}

casper.run();