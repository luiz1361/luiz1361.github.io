---
title: IOMMU
permalink: /docs/linux/iommu/
---
---
title: IOMMU - Enabling
category: Linux
---

**You can do this by setting the following in /etc/default/grub:**
```
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on"
```

**Update Grub:**
```
update-grub
```

**After reboot check with:**
```
dmesg | grep -e DMAR -e IOMMU
find /sys/kernel/iommu_groups/ -type l
```

**Making changes to VF persistent:**
```
sudo vi /etc/modprobe.d/ixgbe.conf
options ixgbe max_vfs=8
update-initramfs -u
```

**Checking after reboot/reload:**
```
lspci | grep -i ethernet
```
