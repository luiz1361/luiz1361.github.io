---
title: RSYNC
permalink: /docs/linux/rsync/
---
---
title: Rsync - Random
category: Linux
---

**Transfer only new files from source to destination using password file**
```
0 1 * * * root rsync --ignore-existing -arv -e "sshpass -f '/x/secret' ssh -o StrictHostKeyChecking=no" --progress x@x.x.x:/x/* /x/x/x > /dev/null 2>&1
```

**Transfer modified and new files from source to destination using password file**
```
0 1 * * * root rsync -arv -e "sshpass -f '/x/secret' ssh -o StrictHostKeyChecking=no" --progress /x/x/x/* x@x.x.x:/x.x.x > /dev/null 2>&1
```

**The special thing wbout this is -W, --whole-file which won't do delta or file and transfer it as a whole which helps on really large files that were heavily changed:**
```
rsync -arv -e "sshpass -f '/x/secret' ssh -q -o StrictHostKeyChecking=no" --progress -hWPHAXx --delete --ignore-errors x@x:/x /x > /dev/null 2>&1
```

**Rsync using custom port:**
```
rsync -rvz -e 'ssh -p 2222' --progress ./dir user@host:/path
```
