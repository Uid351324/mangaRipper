# mangaRipper
manga ripper using Manga Loader userscript

requirements: [casperjs](  http://casperjs.org ), [manga-loader userscript]( https://greasyfork.org/scripts/692-manga-loader/ )

###all.js
js script for casperjs that pull all links to images from site supported by manga-loader

usage:
```shell
casperjs --web-security=no --local-storage-path="lspath" --cookies-file="mycookies.txt" "pathto/all.js" "pathto/manga-loader.js" "$url"
```
this creates directory named tile-of-url containing file links.txt with all links to images.

some sites require login/no-bot/session info copy them from browser cookies in apropreate format to "mycookies.txt" file.
###ripManga.zsh
example zsh shell script that uses all.js, download images and zips them to archive
```shell
./ripManga.zsh url1 [ulr2...]  
```
options:
```shell
-i #read urls from file, use '-' for stdin
-d #delete directory ino which images was downloaded
```
