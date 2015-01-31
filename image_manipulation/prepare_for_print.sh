#!/bin/bash

if [[ "$1" != "" ]]; then
	image=`cygpath -a -w "$1"`
	img_date=$(identify -format %[exif:DateTime] ${image}|cut -d ' ' -f1|awk 'BEGIN{ FS=":"} {print $3"-"$2"-"$1}')
	font="/cygdrive/c/Windows/Fonts/digital-7.ttf"
	font=`cygpath -a -w "$font"`
	output_img="${image%%.*}_DS.jpg"
	dim=$(identify -format "%w %h" "$image")
	width=${dim%% *}
	height=${dim#* }
	if [ $width -ge $height ]
	then
		pointsize=$(($width/30))
	 else
	 	pointsize=$(($height/30))
	fi
	if [[ ! -f "$output_img" ]]; then
		convert "$image" -auto-orient -gravity SouthEast -font "$font" -pointsize $pointsize -fill white -annotate +$pointsize+$pointsize "${img_date}" "$output_img"
	else
		echo $output_img exitst, skeeping.
	fi
fi