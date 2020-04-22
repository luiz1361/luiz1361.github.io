---
title: MDADM
permalink: /docs/linux/mdadm/
---
---
title: MDADM - After OS Install
category: Linux
---

**If on live cd, if cat /proc/mdstat doesn’t work:**
```
sudo apt-get install mdadm
sudo mdadm --assemble --scan
```

**Wiping out:**
```
cat /proc/mdstat
sudo umount /dev/md200
sudo mdadm --stop /dev/md200
sudo mdadm --remove /dev/md200
```

**Listing all devices:**
```
lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
```

**Zeroing superblock of all disks:**
```
sudo mdadm --zero-superblock /dev/sdc
```

**Edit ```/etc/fstab``` and ```/etc/mdadm/mdadm.conf```**

**Make changes of /etc/mdadm/mdadm.conf live on boot:**
```
sudo update-initramfs -u
```

**Listing all devices:**
```
lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
```

**Creating RAID:**
```
mdadm --create --verbose /dev/md200 --level=6 --raid-devices=4 /dev/sda /dev/sdb /dev/sdc /dev/sdd
cat /proc/mdstat
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

**Make changes of /etc/mdadm/mdadm.conf live on boot:**
```
sudo update-initramfs -u
```

**Creating LVM:**
```
sudo pvcreate /dev/md200
sudo vgcreate vg-md1000 /dev/md200
sudo lvcreate -l 100%FREE -n lv-md1000 vg-md1000
sudo mkfs.ext4 -F /dev/vg-md1000/lv-md1000
sudo mkdir -p /mnt/md1000
sudo mount /dev/vg-md1000/lv-md1000 /mnt/md1000
echo '/dev/mapper/vg--md1000-lv--md1000 /mnt/md1000 ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

***
**Sources:**
* https://www.linux.com/learn/how-rescue-non-booting-grub-2-linux
* https://ubuntuforums.org/showthread.php?t=884556
---
title: MDADM - Slowing Down Rebuild
category: Linux
---

**You can pause a rebuild with this:**
```
echo "idle" > /sys/block/md0/md/sync_action
```

>Assuming md0 is your md device. However, mdadm will commence rebuilding on an "event" which it isn't clear what that would be. I suspect a read or write to the array will kick off the rebuild again - so often this command does nothing obvious as the rebuild stops and then immediately restarts. If you have multiple md devices, then this will cause mdadm to rebuild the next one that needs it.

**To throttle the rebuild, you can use:**
```
echo 5000 > /proc/sys/dev/raid/speed_limit_max
```
>This will limit the rebuild maximum throughput to 5Mb/s.

**You can see the current resync speed by doing:**
```
cat /proc/mdstat
```

***
**Sources:**
* http://superuser.com/questions/625722/reducing-linux-software-raid-rebuild-speed
