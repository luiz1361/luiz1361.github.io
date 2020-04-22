---
title: AWK
permalink: /docs/linux/awk/
---
---
title: AWK - Random
category: Linux
---
**Print only the last element:**
```
awk '{print $NF}' File1
```

**Print all columns except the last one:**
```
awk 'BEGIN{FS=OFS="/"}{$NF=""; NF--; print}'
```

**Only remove comma in between double quotes. Applies to a comma delimited file ie. 123,"ABC, DEV 23",345,534.202,NAME:**
```
awk -F'"' -v OFS='' '{ for (i=2; i<=NF; i+=2) gsub(",", "", $i) } 1' infile
```
>The -F" makes awk separate the line at the double-quote signs, which means every other field will be the inter-quote text. The for-loop runs gsub, short for globally substitute, on every other field, replacing comma (",") with nothing (""). The 1 at the end invokes the default code-block: { print $0 }.
