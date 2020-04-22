---
title: GPT
permalink: /docs/linux/gpt/
---
---
title: GPT - Corrupted Partition
category: Linux
---

**Issue might occur changing VHD size:**
```
sudo gdisk /dev/sda
```
>P to print and w to write after a reboot if gparted can't read GPT table

***
**Sources:**
* https://askubuntu.com/questions/386752/fixing-corrupt-backup-gpt-table
