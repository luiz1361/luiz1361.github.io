---
title: NMAP
permalink: /docs/linux/nmap/
---
---
title: NMAP - Fast Discovery
category: Linux
---

```
nmap -sP -T5 --min-parallelism 100 --max-parallelism 256 172.16.0.0/16 -oG - | awk '/Up$/{print $2 $3}' | nl
```

>T5: From 1-5, 5 = insane and 3 = normal speed  
>-oG-: Greppable output  
>awk: IP and reverse name of Up devices
