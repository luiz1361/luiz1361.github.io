---
title: CLAMAV
permalink: /docs/linux/clamav/
---
---
title: Clamav - Detect Clean Malware
category: Linux
---

**Check default stack size:**
```
# ulimit -s
```

**Set new stack size:**
```
ulimit -s 65536
```

**Edit php.ini:**
```
mail.add_x_header = On
mail.log = /var/log/phpmail.log
```

>Steps above need to be performed first. After that look at the script below.

```
#!/bin/bash

clamscan -ri /var/www/x/* > /tmp/clamav_export
grep "FOUND" /tmp/clamav_export | cut -d : -f 1 > /tmp/malwares

# Break line will be the only separator
IFS=$'\n'

for x in `cat /tmp/malwares`; do

    # Create the folders before backing up the malware files
    mkdir -p `echo /tmp/backup$x | sed -e "s/\/[^\/]*$//"`

    # Backing up the malware files
    cp $x /tmp/backup$x

    # Excluding the malware files
    #rm $x
done

# Clean up the outbox queue:

for x in `grep "X-PHP-Originating-Script: 33:lib.php" /var/spool/nullmailer/queue/* | cut -d : -f 1`;do
    rm $x
done
```
