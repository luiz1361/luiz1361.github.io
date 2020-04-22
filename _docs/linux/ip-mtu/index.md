---
title: IP-MTU
permalink: /docs/linux/ip-mtu/
---
---
title: IP - Flush IP 
category: Linux
---

```
ip addr flush dev enp101s0f0
```
---
title: IP - MTU Jumbo
category: Linux
---

**Checking current MTU:**
```
ip link show | grep mtu
```

**Setting MTU:**
```
ip link set eth0 mtu 9000
```

>PS: This is not permanent.

***
**Sources:**
* https://linuxconfig.org/how-to-enable-jumbo-frames-in-linux
