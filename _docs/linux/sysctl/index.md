---
title: SYSCTL
permalink: /docs/linux/sysctl/
---
---
title: Sysctl - Disable IPv6
category: Linux
---

**Edit /etc/sysctl.conf with 1 to disable and 0 to enable:**
```
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
```

**To apply the changes use -p:**
```
sudo sysctl -p
```
>You will see this output in the terminal:
```
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
```

**To Double check:**
```
cat /proc/sys/net/ipv6/conf/all/disable_ipv6
```
>If it reports ‘1′ means you have disabled IPV6. If it reports ‘0‘ then please follow Step 4 and Step 5.  

***
**Sources:**
*https://support.purevpn.com/how-to-disable-ipv6-linuxubuntu
