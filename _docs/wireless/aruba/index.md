---
title: ARUBA
permalink: /docs/wireless/aruba/
---
---
title: Aruba
permalink: /docs/wireless/
---

# Random

**Loading an alternative firmware image during boot via console port:**  
```
cpboot> def_part 0:1
```

**Make sure to save the configuration type:**  
```
cpboot> saveenv
```

**Re-load the controller type:**  
```
cpboot> bootf
```

**Checking inventory and serial number:**  
```
show inventory
```

**Monitoring system performance:**  
```
show cpuload  
show cpuload current  
show processes sort-by CPU  
show process monitor statistics  
show memory  
show storage  
show ap debug system-status ap-name wap-xxx-xxx  
```

**Restart an AP:**  
```
apboot ap-name wap-xxx-xxx
```

**To check transit traffic on controller:**  
```
show datapath session table
```

**Show mac addresses for APs:**  
```
show ap bss-table
```

***
**Sources:**
* http://community.arubanetworks.com/t5/Controller-Based-WLANs/How-do-I-back-up-the-flash-on-the-controller/ta-p/177838  
* http://community.arubanetworks.com/t5/Controller-Based-WLANs/Understanding-and-Troubleshooting-Master-Local-controller-issues/ta-p/239727  
* http://community.arubanetworks.com/t5/Wireless-Access/How-to-get-the-BSSID-available-with-an-AP/td-p/134077  
