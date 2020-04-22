---
title: GREP
permalink: /docs/linux/grep/
---
---
title: Grep - Random
category: Linux
---

**For BSD or GNU grep you can use -B num to set how many lines before the match and -A numfor the number of lines after the match:**
```
grep -B 3 -A 2 foo README.txt
```

**If you want the same number of lines before and after you can use -C num:**
```
grep -C 3 foo README.txt
```

**To remove -- from output**
```
grep --no-group-separator ...
```
