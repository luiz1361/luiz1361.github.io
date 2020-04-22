---
title: NRPE
permalink: /docs/linux/nrpe/
---
---
title: NRPE - Centos Epel
category: Linux
---

**If CentOS 7:**
```
rpm -Uvh http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-11.noarch.rpm
```
**If CentOS 8:**
```
rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
```

```
yum --enablerepo=epel -y install nrpe nagios-plugins
yum --enablerepo=epel -y list nagios-plugins*
sudo systemctl enable nrpe.service
sudo systemctl start nrpe.service
```

***
**Sources:**
* https://tecadmin.net/install-nrpe-on-centos-rhel/
---
title: NRPE - check_file_change.sh
category: Linux
---

#!/bin/bash
if [ `find /var/local/lib/x/ -type f -mmin -120 | wc -l` -ge 20 ]
    then
        echo "OK - 20 or more files were changed during the last 120 minutes in /var/local/lib/x/"
    else
        echo "CRITICAL - Less than 20 files were changed during the last 120 minutes in /var/local/lib/x/"
fi
---
title: NRPE - Error Check Disk
category: Linux
---

**The steps below deal with the issue DISK CRITICAL - /sys/kernel/debug/tracing is not accessible: Permission denied**

```
sudo chown root:root /usr/lib/nagios/plugins/check_disk
sudo chmod u+s /usr/lib/nagios/plugins/check_disk
sudo chmod o+x /usr/lib/nagios/plugins/check_disk
```

or

**Ignore the partition from check. If you read manpage carefully, you can use -A to check all path, then use -I to ignore path that match regex:**
```
/usr/lib64/nagios/plugins/check_disk -w 10% -c 5% -A -I '/drop-zone/*'
```

***
**Sources:**
* https://bugs.launchpad.net/ubuntu/+source/nagios-plugins/+bug/1516451
---
title: NRPE - nrpe.cfg
category: Linux
---

log_facility=daemon
pid_file=/var/run/nagios/nrpe.pid
server_port=5666
nrpe_user=nagios
nrpe_group=nagios
allowed_hosts=127.0.0.1,x.x.x.x/24

dont_blame_nrpe=0
allow_bash_command_substitution=0
debug=0
command_timeout=60
connection_timeout=300
command[check_users]=/usr/lib/nagios/plugins/check_users -w 5 -c 10
command[check_load]=/usr/lib/nagios/plugins/check_load -w 15,10,5 -c 30,25,20
command[check_zombie_procs]=/usr/lib/nagios/plugins/check_procs -w 5 -c 10 -s Z
command[check_total_procs]=/usr/lib/nagios/plugins/check_procs -w 150 -c 200
command[check_dataincoming]=/usr/local/bin/check_file_change.sh
command[check_disk]=/usr/lib/nagios/plugins/check_disk -w 10% -c 5% -W 10% -K 5%
include=/etc/nagios/nrpe_local.cfg
include_dir=/etc/nagios/nrpe.d/
