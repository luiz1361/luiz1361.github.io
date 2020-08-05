**Customizing /etc/resolv.conf:**
```
rm /etc/resolv.conf
```
>It is a symlink to /run/resolvconf/resolv.conf

**Now create a new file and add your custom changes:**
```
vim /etc/resolv.conf
```
---
title: WSL - SMB Share
category: Windows
---

**Assuming you have a network map location X: on the Windows host:**
```
sudo mount -t drvfs 'X:' /mnt/x
```
