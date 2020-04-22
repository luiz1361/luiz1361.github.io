---
title: USERMOD
permalink: /docs/linux/usermod/
---
---
title: Usermod - Swap User IDs
category: Linux
---

```
usermod -u <NEWUID> <LOGIN>
groupmod -g <NEWGID> <GROUP>
find / -user <OLDUID> -exec chown -h <NEWUID> {} \;
find / -group <OLDGID> -exec chgrp -h <NEWGID> {} \;
usermod -g <NEWGID> <LOGIN>
```
