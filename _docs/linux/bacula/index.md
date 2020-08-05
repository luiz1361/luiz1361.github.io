#
# Bacula Administration Tool (bat) configuration file
#

Director {
  Name = xxx-dir
  DIRport = 9101
  address = xxx.xxx.com
  Password = "xxx"
}
---
title: Bacula - BAT
category: Linux
---

**Installing Bacula Console QT, still need to edit bat.conf including connection details to Bacula Director:**
```
apt-get install bacula-console-qt
```
---
title: Bacula - Downgrade FD 7 Bionic
category: Linux
---
```
apt-get update && apt-get dist-upgrade
apt-get remove bacula-fd
apt-get autoremove
wget http://mirrors.kernel.org/ubuntu/pool/universe/b/bacula/bacula-common_7.0.5+dfsg-4build1_amd64.deb
wget http://mirrors.kernel.org/ubuntu/pool/universe/b/bacula/bacula-fd_7.0.5+dfsg-4build1_amd64.deb
dpkg -i bacula-common_7.0.5+dfsg-4build1_amd64.deb
dpkg -i bacula-fd_7.0.5+dfsg-4build1_amd64.deb
apt-mark hold bacula-common
apt-mark hold bacula-fd
apt-get update && apt-get dist-upgrade
```

**Edit /etc/systemd/system/bacula-fd.service:**
```
[Unit]
Description=Bacula File Daemon service
Documentation=man:bacula-fd(8)
Requires=network.target
After=network.target
RequiresMountsFor=/var/lib/bacula /etc/bacula /usr/sbin
# from http://www.freedesktop.org/software/systemd/man/systemd.service.html
[Service]
Type=forking
User=root
Group=root
Environment="CONFIG=/etc/bacula/bacula-fd.conf"
EnvironmentFile=-/etc/default/bacula-fd
ExecStartPre=/usr/sbin/bacula-fd -c $CONFIG
ExecStart=/usr/sbin/bacula-fd -c $CONFIG
ExecReload=/bin/kill -HUP $MAINPID
SuccessExitStatus=15
Restart=on-failure
RestartSec=60
PIDFile=/run/bacula/bacula-fd.9102.pid
[Install]
WantedBy=multi-user.target
```

```
systemctl daemon-reload
systemctl start bacula-fd
systemctl enable bacula-fd
```

***
**Sources:**
* https://medium.com/@benmorel/creating-a-linux-service-with-systemd-611b5c8b91d6
---
title: Bacula - Limit Bandwidth
category: Linux
---
**Changing this will affect all jobs:**
```
FileDaemon {
  Name = localhost-fd
  Working Directory = /some/path
  Pid Directory = /some/path
  ...
  Maximum Bandwidth Per Job = 5Mb/s
}
```

**Changing only for a specific Job:**
```
Job {
  Name = locahost-data
  FileSet = FS_localhost
  Accurate = yes
  ...
  Maximum Bandwidth = 5Mb/s
  ...
}
```

**Changing on a live job:**
```
setbandwidth limit=1000 jobid=10
```

***
**Sources:**
* https://www.bacula.org/9.2.x-manuals/en/main/New_Features_in_7_0_0.html#SECTION007111000000000000000
---
title: Bacula - Mark Volume Full
category: Linux
---
```
update volume=Migrated-Jobs-0059 volstatus=Full
```
---
title: Bacula - Update DB Pool to Reflect Conf
category: Linux
---
```
*update
Update choice:
     1: Volume parameters
     2: Pool from resource
     3: Slots from autochanger
     4: Long term statistics
Choose catalog item to update (1-4):2
```
>If decreasing volumes for a certain pool the current number of volumes needs to be lower than the new value. Run **delete volume=xxx** to get rid of volumes to set the new limit.
