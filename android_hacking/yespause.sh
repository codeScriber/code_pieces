#!/bin/bash 

DEFUALT=10
DEFAULT_PAUSE=2

while getopts ":p:n:" opt; do
	case $opt in
		p)
		  pauseTime=$OPTARG
		  ;;
		n) 
		  numEcho=$OPTARG
		  ;;
		\?)
		  echo "Invalid option: -$OPTARG" >&2
		  exit 1
		  ;;
		:)
		  echo "Option -$OPTARG requires an argument." >&2
		  exit 1
		  ;;
	esac
done
shift $((OPTIND-1))

if [ -z $pauseTime ]; then
	pauseTime=${DEFAULT_PAUSE}
fi
if [ -z $numEcho ]; then
	numEcho=${DEFUALT}
fi

for (( c=1; c<=${numEcho}; c++ ))
do
	echo y
	sleep ${pauseTime}
done

