---
title: P2V
permalink: /docs/linux/p2v/
---
---
title: P2V - Manual
category: Linux
---

**Boot from a live media ie. System Rescue 6.0.3. That should contain most if not all utilities required**

**Scan for all volume groups:**
```
lvm vgscan -v
```

**Activate all volume groups:**
```
lvm vgchange -a y
```

**List all logical volumes:**
```
lvm lvs –a
```

**With this information, and the volumes activated, you should be able to mount the volumes:**
```
mount /dev/volumegroup/logicalvolume /mountpoint
```

**Create a new Linux server with the same version and the required LVM and space settings:**

**Open a live Ubuntu ISO and mount the new partitions**

**Create a backup on a different folder of the following:**
```
/boot/
/lib/modules
/etc/modules
/etc/lilo.conf
/etc/fstab
/etc/mtab
/dev/
/proc
/sys
/tmp
/run
/mnt
/media
/lost+found
```

**Rsync the production server to this one via ```sudo rsync -ahPHAXx --delete root@ip:/mnt/sdxx /mnt/folder/sdax```**

**Move the folder from the backup to the folder above**

**Now reboot and enjoy**

**The same process applies to non LVM servers just excluding the LVM part**
