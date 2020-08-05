```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv C0A52C50
```
>Relevant part hkp://xxx:80
---
title: APT - Error GPG Key
category: Linux
---
**When updating repository and get the error below, add the key based on last 8 characters:**
```
Reading package lists... Done
W: GPG error: http://deb.opera.com stable Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY F9A2F76A9D1A0061
W: You may want to run apt-get update to correct these problems
```

**Workaround**:
```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 9D1A0061
sudo apt-get update
```
---
title: APT - Hash Mismatch
category: Linux
---
```
sudo rm -rf /var/lib/apt/lists/*
sudo apt clean
sudo apt update
```

***
**Sources:**
* https://askubuntu.com/questions/41605/trouble-downloading-packages-list-due-to-a-hash-sum-mismatch-error
---
title: APT - Hold Unhold
category: Linux
---
```
sudo apt-mark hold <package>
sudo apt-mark unhold <package>
```
---
title: APT - Old Ubuntu Repo
category: Linux
---
**To access old Ubuntu repositories, take a look at http://old-releases.ubuntu.com/**

**Edit etc/apt/sources.list and change CODENAME to your distribution's code name, e.g. jaunty:**
```
deb http://old-releases.ubuntu.com/ubuntu/ CODENAME main restricted universe multiverse
deb http://old-releases.ubuntu.com/ubuntu/ CODENAME-updates main restricted universe multiverse
deb http://old-releases.ubuntu.com/ubuntu/ CODENAME-security main restricted universe multiverse
#Optional
#deb http://old-releases.ubuntu.com/ubuntu/ CODENAME-backports main restricted universe multiverse
```

***
**Sources:**
* http://superuser.com/questions/339537/where-can-i-get-the-repositories-for-old-ubuntu-versions
---
title: APT - Timeout
category: Linux
---
```
/etc/apt/apt.conf.d/99timeoutAcquire::http::Timeout "10";Acquire::ftp::Timeout "10";
```
