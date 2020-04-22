---
title: SED
permalink: /docs/linux/sed/
---
---
title: Sed - Random
category: Linux
---

**Search and print text starting from Word A until Word D on file:**
```
sed -n -e '/Word A/,/Word D/ p' file
```

**Search and replace inside single quotes:**
```
sed "s/'[^']*'/NOTFOUND/g" infile
```

**Search pattern and replace whole line:**
```
sed 's/.*TEXT_TO_BE_REPLACED.*/This line is removed by the admin./'
```

**Convert pattern to upper case:**
```
sed -i 's/wap..*/\U&\E/g' wap.cfg
```

Search and remove lines before and after match, add line numbers and remove after:

**For each file on current directory remove lines before and after matching pattern. Avoid removing duplicates by numbering lines before filter and removing numbering after. Using sponge for in place write of file being read:**
for i in `ls -1`; do nl $i | grep -v "$(nl $i | grep -B1 -A2 Name.*=*.Migration-Schedule.*)" | sed 's/^ *[0-9]\+.//g' | sponge $i;done
---
title: Sed - Recursive
category: Linux
---

**Grep lines matching certain keyword recursively. The result passed to xargs/sed which will only work on grep's result:**
```
grep -rl test ./* | xargs sed -i 's/test/test2/g'
```
