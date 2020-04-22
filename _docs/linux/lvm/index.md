---
title: LVM
permalink: /docs/linux/lvm/
---
---
title: LVM - Expand LV
category: Linux
---

**In this example we will work through expanding logical volume /var/centos/var from 5GB to 10GB. We currently have this logical volume mounted to /mnt.**
```
vgdisplay
```
>In this example we have 5GB of free space in the volume group, as shown by “Free PE / Size 1279 / 5.00 GiB”.

**Now it’s time to expand the logical volume. In the below example we are using the -L flag to increase by a size specified (M for Megabytes, G for Gigabytes, T for Terabytes). You can alternatively remove the + to increase to the amount specified rather than by the amount specified:**
```
lvextend -L+5G /dev/centos/var
```
>The above command will increases the logical volume /dev/centos/var by 5GB, currently it is already 5GB so this will increase it to a total of 10GB. You could achieve the same with “lvextend -L 10G /dev/centos/var” which will increase the logical volume to 10GB as well, as this is what was specified with no +. Alternatively if you instead want to just use all free space in the volume group rather than specifying a size to increase to, run “lvextend -l +100%FREE /dev/centos/var”.

**Now that the logical volume has been extended, we can resize the file system. This will extend the file system so that it takes up the newly created space inside the logical volume. The command may differ depending on the type of file system you are using, for ext3/4 based file systems:**
```
resize2fs /dev/centos/var
```

**Check partition:**
```
df -h
```

***
**Sources:**
* https://www.rootusers.com/lvm-resize-how-to-increase-an-lvm-partition/
---
title: LVM - Reduce LV
category: Linux
---

**Shrinking a root volume(Live CD):**
```
vgchange -a y
```

**Shrinking a non-root volume:**
```
umount /dev/centos/var
```

**Check for errors:**
```
e2fsck -fy /dev/centos/var
```

**Resize FS:**
```
resize2fs /dev/centos/var 4G
```

**Reduce to 5G:**
lvreduce -L 5G /dev/vg/disk-name

or

**Reduce by 5G:**
```
lvreduce -L -5G /dev/vg/disk-name
```

**Use all available space:**
```
resize2fs /dev/centos/var
```

**Remount:**
```
mount /dev/centos/var /mnt
```
---
title: LVM - Reduce PV
category: Linux
---

1.Boot on Ubuntu Desktop Live
1.Edit /etc/apt/sources.list and include the "universe" repositories
1.Run: ```apt-get install system-config-lvm```
1.Check if there are logical partitions at the end of the volume group ie. swap which needs to be deleted and recreated
1.Using gparted resize the physical volume accordingly
1.Back to system-config-lvm re-create the swap partition. In case it is required after the previous step
1.Reboot and run ```pvresize /dev/sdxx``` if ```pvs``` shows the wrong size
1.Fix swap partition accordingly: ```mkswap /dev/sdxx; swapon /dev/sdxx; vim /etc/fstab```
1.Check swap is back working: ```swapon -s```
