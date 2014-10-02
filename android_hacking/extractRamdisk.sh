#!/bin/bash

if [ $# -lt 2 ]; then
	echo "Usage: $0 [ramdisk file] [dir to extract]"
	exit 1
fi

if [ ! -f $1 ]; then
	echo "$1 is not a file or does not exists!"
	exit 1
fi

if [ -f $2 ] && [ ! -d $2 ] ; then
	echo "$2 is a file, can't extract to a file"
	exit 1
elif [ ! -d $2 ] ; then
	mkdir $2
fi
cp $1 $2
cd $2
gunzip -c $1| cpio -i
rm $1
