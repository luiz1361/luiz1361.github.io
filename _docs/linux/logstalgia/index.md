---
title: LOGSTALGIA
permalink: /docs/linux/logstalgia/
---
---
title: Logstalgia - Over SSH
category: Linux
---

```
ssh -x -p22 -l <username> x.x.x.x tail -f /var/log/apache2/access.log | logstalgia --sync
```
