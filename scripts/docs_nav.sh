#!/bin/bash

for i in `ls -1 ../_docs/`;do
	echo "- title: $i"
  echo "  docs:"
	for j in `ls -1 ../_docs/$i`;do
		echo "    - link: /docs/$i/$j/"
	done
done > ../_data/docs_nav.yml
