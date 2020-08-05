```
sudo apt update
sudo apt install git
sudo apt build-dep e2fsprogs  # see https://askubuntu.com/q/158871/158442 to enable source package support
cd $(mktemp -d)
git clone -b v1.44.2 https://git.kernel.org/pub/scm/fs/ext2/e2fsprogs.git e2fsprogs
cd e2fsprogs
./configure
make
cd resize
./resize2fs
sudo umount /dev/mapper/target-device
sudo ./e2fsck -fn /dev/mapper/target-device
sudo ./resize2fs -fb /dev/mapper/target-device
sudo ./resize2fs -fp /dev/mapper/target-device
sudo ./e2fsck -fn /dev/mapper/target-device
sudo mount /dev/mapper/target-device
```
---
title: Resize2fs - fs 5pc lost space
category: Linux
---

**When a file system is created, 5% of all blocks are reserved for the super user (for writing logs etc.).If this disk is only for storing files (and e.g. doesn't contain /var/) you can set this to 0% (or you may keep 1% just in case):**
```
tune2fs -m 0 /dev/sda5
```

***
**Sources:**
* http://askubuntu.com/questions/79981/df-h-shows-incorrect-free-space
