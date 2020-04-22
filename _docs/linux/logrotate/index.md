---
title: LOGROTATE
permalink: /docs/linux/logrotate/
---
---
title: Logrotate - Adding Custom Log
category: Linux
---

**Command to force logrotate to run:**
```
logrotate -v -f /etc/logrotate.d/someapp.conf
```

or

```
logrotate -v -f /etc/logrotate.conf
```


**Dry run in debug mode:**
```
logrotate -d /etc/logrotate.d/someapp.conf
```

or

```
logrotate -d /etc/logrotate.conf
```

**Using copytruncate to avoid deleting the original file:**
```
cat > /etc/logrotate.d/at << EOF
/var/www/at/config/docker-at-prod/log/*.log{
            rotate 7 #keep 7 logs on disk        
            daily #rotate daily        
            missingok #If the log file is missing, go on to the next one without issuing an error        
            notifempty # Do not rotate the log if it is empty        
            copytruncate #Truncate the original log file to zero size in place after creating a copy, instead of moving the old log file and optionally creating a new one.        
            delaycompress #Postpones the compression of log files to the next rotation of log files        
            compress #archived log files to be compressed (in gzip format),
}
EOF
```

**To verify if a particular log is indeed rotating or not and to check the last date and time of its rotation, check the /var/lib/logrotate/status file. This is a neatly formatted file that contains the log file name and the date on which it was last rotated.**
```
cat /var/lib/logrotate/status
```

***
**Sources:**
* https://www.rosehosting.com/blog/how-to-use-logrotate-to-manage-logs-on-ubuntu/
