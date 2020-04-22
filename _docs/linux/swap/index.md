---
title: SWAP
permalink: /docs/linux/swap/
---
---
title: Swap - Random
category: Linux
---

**To create a swap partition after installation, create an empty partition that should have no holes. You can then format this partition with:**
```
sudo mkswap /dev/sdX
```
>Replacing /dex/sdX with your partition. Mount this partition as swap with

```
sudo swapon -U UUID
```
>Where UUID is that of your /dev/sdX as read from this:

```
blkid /dev/sdX
```

**Bind your new swap in /etc/fstab by adding this line:**
```
UUID=xxx    none    swap    sw      0   0
```

>If you want to use your swap for hibernating then you need to update the UUID in /etc/initramfs-tools/conf.d/resume with this content RESUME=UUID=xxx. Don't forget to $ sudo update-initramfs -u
---
title: Swatch - Random
category: Linux
---

swatchdog.pl started out as swatch, the "simple watchdog" for activity monitoring log files produced by UNIX's syslog facility. It has since been evolving into a utility that can monitor just about any type of log. The name has been changed to satisfy a request made by the old Swiss watch company.

When you install the swatch package for the first time it will only provide you the /usr/bin/swatch command. It doesn't provide you any example or a daemon script, you are suppose to do that from the scratch.

**How to set it up - Ubuntu**

**Updating and upgrading all Linux packages before we start the installation:**
```
apt-get update && apt-get upgrade
```

**Installing the swatch package:**
```
apt-get install swatch
```

**Creating the swatch directory and the swatch configuration file:**
```
mkdir /etc/swatch
vim /etc/swatch/swatch.conf
```
```
watchfor /server reached MaxClients setting/
exec "/etc/swatch/apache2grestart.sh"
```

**It will watchfor "server reached MaxClients setting" expression, if it finds it it will execute the "/etc/swatch/apache2grestart.sh" script.**

**Creating the action script:**
```
vim /etc/swatch/apache2grestart.sh
#!/bin/bash
apache2ctl -k graceful
echo "The Apache2 service was gracefully restarted, due to MaxClients limit." | mail -s "Swatch - Apache2 restart Magni" x@x.x
```

**It will restart the Apache2 daemon and send an e-mail describing that.**

**Applying execution permissions to the action script:**
```
chmod +x /etc/swatch/apache2grestart.sh
```

**Running swatch as a daemon:**
```
vim /etc/init.d/swatchd
#!/bin/sh
start()
{
/usr/bin/swatch --config-file=/etc/swatch/swatch.conf --tail-file=/var/log/apache2/error.log --pid-file=/var/run/swatch.pid --daemon > /dev/null >&1
}
stop()
{
PID=`cat /var/run/swatch.pid`
kill $PID
done
}
case $1 in
start)
start
exit 0
;;
stop)
stop
exit 0
;;
restart)
stop
start
exit 0
;;
*)
echo "Usage: $0 { start | stop | restart }"
exit 1
;;
esac
```
>The log file whith will be watched is /var/log/apache2/error.log, another files could be included. If you need to do that the script must be customized creating a different PID for each file which will be a different Linux process.

**Applying execution permissions to the daemon:**
```
chmod +x /etc/init.d/swatchd
```

**Making the watcher daemon run on the start up:**
```
sudo update-rc.d swatchd defaults
```

**Starting the daemon without restart the server:**
```
/etc/init.d/swatchd start
```

**Verifying if the daemon is running properly:**
```
ps aux | grep swatch
root      3933  0.0  0.0   7648   900 pts/1    S+   11:12   0:00 grep swatch
root     32097  0.0  0.0  44288 10364 ?        Ss   10:58   0:00 /usr/bin/swatch --config-file=/etc/swatch/swatch.conf --tail-file=/var/log/apache2/error.log --pid-file=/var/run/swatch.pid --daemon
```
>As we can see the daemon is runnning, the configuration file and the watched log file are correct.

**Verifying if the daemon is working properly:**
```
echo "server reached MaxClients setting" >> /var/log/apache2/error.log
```
>It should restart the Apache2 daemon and send an e-mail.
