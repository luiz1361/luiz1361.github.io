---
title: BIND
permalink: /docs/linux/bind/
---
---
title: Bind - Update db root hints
category: Linux
---

**The command below updates the db.root file:**
```
dig +bufsize=1200 +norec NS . @a.root-servers.net | egrep -v ';|^$' | sort > /etc/bind/db.root rndc reload
```

***
**Sources:**
* http://www.unixfu.ch/how-do-i-update-the-root-hints-data-file-for-bind-named-server/
