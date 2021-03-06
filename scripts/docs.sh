#!/bin/bash

for i in `find ../_docs -type f -name *.md -exec ls {} \;`; do
cat $i | (echo "---" && cat ) | sponge $i
cat $i | (echo $i | awk -F "/" '{ print "permalink: /docs/" $3 "/" $4 "/" }' && cat ) | sponge $i
cat $i | (echo $i | awk -F "/" '{ print "title: " toupper($4) }' && cat ) | sponge $i
cat $i | (echo "---" && cat ) | sponge $i
done
