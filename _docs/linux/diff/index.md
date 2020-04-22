---
title: DIFF
permalink: /docs/linux/diff/
---
---
title: Diff - Folders Recursively
category: Linux
---

**Diff two separate folders recursively:**
```
diff --brief -Nr dir1/ dir2/
```

***
**Sources:**
* https://stackoverflow.com/questions/4997693/given-two-directory-trees-how-can-i-find-out-which-files-differ
---
title: Diff - Output two commands
category: Linux
---

**Diff the output of two separate commands:**
```
diff -W160 -y <(cat test | tr '[:upper:]' '[:lower:]' | sort -h | uniq) <(cat test2 | tr '[:upper:]' '[:lower:]' | sort -h | uniq) | grep \>
```

***
**Sources:**
* https://unix.stackexchange.com/questions/155806/how-do-i-diff-the-outputs-of-two-commands
