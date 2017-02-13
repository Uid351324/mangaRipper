#!/bin/zsh
page="1s"
chapter="10s"
zparseopts -D -E -A Args -- d i:=file  #-aopt -bopt
js=${0:h}
function download () {
	loaderJS='/tmp/MangaLoader.user.js'
	if [[ ! -e "$loaderJS" ]]
	then
		wget --no-verbose --continue --show-progress 'https://greasyfork.org/scripts/692-manga-loader/code/Manga%20Loader.user.js' --output-document="$loaderJS" 
	fi
	url=$1
	casperjs --web-security=no --local-storage-path=/tmp/path --cookies-file=$HOME/mycookies.txt "$js/all.js" "$loaderJS" "$url"
	dir=`find . -type f -name 'links.txt' -printf '%h\n' -quit`
	curdir=$( pwd)
	cd "$dir"
	echo "$dir"
	i=1
	total=$(wc -l "links.txt")
	# exit
	# ttt=0
	while read -r link; do
# 		wget --no-verbose  --show-progress --continue --wait $page --input-file  "links.txt"
		name=$(python2 -c "import sys, urllib as ul; \
print  ul.unquote_plus(sys.argv[1]).split('/')[-1].split('&')[0].split('?')[0]" "$link")
		# wget --no-verbose  --show-progress --continue --wait $page  --output-document="$(printf %03d $i)_${name##*/}"  "$link"
		echo "$link > $name"
		curl  --header 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0' --header 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' --header 'Accept-Language: en-US,en;q=0.5' --header 'Content-Type: application/x-www-form-urlencoded' "$link" --header "Referer: $url" --output "$(printf %03d $i)_${name##*/}" -L
		# out=$? 
		# ttt=(( out + ttt ))
		(( i++ ))
		echo "$i / $total"
	done < "links.txt"
	rm "links.txt"
	cd $curdir
	zip -r "$dir.zip" "$dir"
	# out=$? 
	# ttt=(( out + ttt ))
	if   ((  ${+Args[-d]}    ))  ; then
		# if   [[   $ttt -eq 0  ]]  ; then
			rm -r "$dir"
			# echo "rm -r '$dir'"
		# fi;
	fi;
	sleep $chapter
}

# echo "0${file[-1]}0"


	if (( ${+Args[-i]} )); then
		# if  [  "${file[2]}"  -eq  "-"  ];  then
		# 	file[2]="/dev/stdin"
		# fi
		# while read -r url; do
		for url in $( cat "${file[-1]}" );
		do
			if [[ "$url" == "" ]]
				then
				continue
			fi
			 download "$url"
		done
		# done <$file[2]
		echo "from file  ${file[2]}"
	else
		echo "from args "
		for url in "$@" ; do
			download $url
		done
	fi

# echo ${0:h}