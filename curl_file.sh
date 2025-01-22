#!/bin/bash

if [ $# -ne 2 ]
then
    echo "usage: $0 <url> <filename>"
    exit 1
fi

url=$1
filename=$2
if ! [ -f $filename ]
then 
    curl -q $url -o $filename
fi
