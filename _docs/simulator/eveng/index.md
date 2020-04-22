---
title: EVENG
permalink: /docs/simulator/eveng/
---
---
title: Eveng - Hyperv
category: Simulator
---

* Download ISO and install on Hyper-V
* After installation enable nested virtualisation: Set-VMProcessor -VMName "EVE-NG" -ExposeVirtualizationExtensions $True
* Add a second NIC for Cloud1
* Enable Mac Spoofing at the advanced settings on the NIC to allow bridging
---
title: Eveng - Idlepc
category: Simulator
---

**On the console of the eve-ng VM run:**
```
dynamips -P 7200 /opt/unetlab/addons/dynamips/c7200-adventerprisek9-mz.152-4.S7.image
```

**Run:**
```
CTRL + ] then key I
```

**Get the highest value which is better, copy it.**

**Edit /opt/unetlab/html/templates/c7200.php and change the default idlepc value**

**Reboot VM or kill the hanging dynamips process. The current folder you run the command will fill in with trash clean it up afterwards.**
---
title: Eveng - Macos Telnet Terminal
category: Simulator
---

**Reboot your Mac and hold the CMD + R keys**

**When presented with the recovery options, click Utilities at the top and choose Terminal**

**Type:**
```
csrutil disable
```

**Reboot as usual:**

**Make sure telnet is under /usr/bin/telnet and executable. Install via homebrew if not installed.**
