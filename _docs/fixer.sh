#!/bin/bash

for i in `find . -type f -name *.md -exec ls {} \;`; do
cat $i | (echo "---" && cat ) | sponge $i
cat $i | (echo $i | awk -F "/" '{ print "permalink: /docs/" $2 "/" $3 "/" }' && cat ) | sponge $i
cat $i | (echo $i | awk -F "/" '{ print "title: " toupper($3) }' && cat ) | sponge $i
cat $i | (echo "---" && cat ) | sponge $i
done
