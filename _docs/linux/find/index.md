---
title: FIND
permalink: /docs/linux/find/
---
---
title: Find - Items Older Than
category: Linux
---

**Option 1 - (Slower) To search files older than 10 days with OR condition and print sum of file size in MB:**
```
find /data/msuser/msinstance/media/resources/ -mtime +10 -type f \( -name "*original.mp4" -o -name "*original.flv" -o -name "*original.mkv" \) -print0 | du --files0-from=- -hc | tail -n1
```

**Option 2 - (Faster) To search files older than 10 days with OR condition and print sum of file size in KB:**
```
find /data/msuser/msinstance/media/resources/ -maxdepth 2 -mtime +10 -type f \( -name "*original.mp4" -o -name "*original.flv" -o -name "*original.mkv" \) -printf "%k\n" | awk '{t+=$1}END{print t}'
```

**To search for files in /target_directory and all its sub-directories, that have been modified in the last 60 minutes:**
```
find /target_directory -type f -mmin -60
```

**To search for files in /target_directory and all its sub-directories, that have been modified in the last 2 days:**
```
find /target_directory -type f -mtime -2
```

**To search for files in /target_directory and all its sub-directories no more than 3 levels deep, that have been modified in the last 2 days:**
```
find /target_directory -type f -mtime -2 -depth -3
```

**You can also specify the range of update time. To search for files in /target_directory and all its sub-directories, that have been modified in the last 7 days, but not in the last 3 days:**
```
find /target_directory -type f -mtime -7 ! -mtime -3
```

>All these commands so far only print out the locations of files that are matched. You can also get detailed file attributes of recently modified files, using "-exec" option as follows.

**To search for files in /target_directory (and all its sub-directories) that have been modified in the last 60 minutes, and print out their file attributes:**
```
find /target_directory -type f -mmin -60 -exec ls -al {} \;
```

**Alternatively, you can use xargs command to achieve the same thing:**
```
find /target_directory -type f -mmin -60 | xargs ls -l
```

>Note that files that have been "created" within the specified time frame will also matched by these commands.

***
**Sources:**
* http://xmodulo.com/how-to-find-recently-modified-files-on-linux.html
