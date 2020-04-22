---
title: NFS
permalink: /docs/linux/nfs/
---
---
title: NFS - Random
category: Linux
---

##Server

**On Ubuntu/Debian systems, the steps are generally:**

**Install the nfs-kernel-server package**
```
sudo apt-get install nfs-kernel-server
```

**Start the portmap daemon (will automatically start once nfs is present at boot time)**
```
sudo /etc/init.d/portmap start
```

**Edit /etc/exports adding lines for each exported filesystem, for example:**
```
echo "/mnt/test 172.x.x.x/16(rw,sync,no_subtree_check)" >> /etc/exports
```

>If running Ubuntu 16.04(Xenial) make sure to add the no_root_squash which is disabled by default.

**Tell NFS to re-read that file or restart teh NFS daemon:**
```
sudo exportfs -a #service nfs-kernel-server restart
```
>Any extra exports, just add to the file and re-read. Nice and simple.

##Client

**On Ubuntu/Debian the nfs client is generally pre-installed.**

**Just to be sure install the following package:**
```
apt-get install nfs-common
```

**Add a line to the fstab, eg**
```
echo "172.x.x.x:/mnt/test /mnt/test nfs defaults,noatime,sync,rsize=8192,wsize=8192,tcp,timeo=14,intr 0 0" >> /etc/fstab
```

**Start the portmap daemon (will automatically start once nfs is present at boot time)**
```
sudo /etc/init.d/portmap start
```

**Tell linux to mount all nfs filesystems**
```
sudo mount -t nfs -a
```
