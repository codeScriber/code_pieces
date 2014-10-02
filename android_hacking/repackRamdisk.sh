#!/bin/bash

if [ "$1x" = "x" ]; then
	echo "Usage: $0 [dir of ramdisk files]"
	exit 1
fi
cd $1
find . | cpio -o -H newc | gzip > ../newramdisk.cpio.gz

