---
title: VYOS
permalink: /docs/firewall/vyos/
---
---
title: VyOS - Install
category: Firewall
---

1. Download vyos-1.1.7-amd64.iso
1. Boot from ISO and run #install system
1. Copy from production /config/config.boot, /etc/openvpn/easy-rsa and /etc/bacula/bacula-fd.conf placing them on the same location
1. Run ```addgroup nobody```
1. Add the following in sources.list:
    ```
    deb http://archive.debian.org/debian squeeze main
    deb http://archive.debian.org/debian squeeze-lts main
    ```
1. Add the following in /etc/apt/apt.conf (create it if it doesn't already exist):
    ```
    Acquire::Check-Valid-Until false;
    ```
1. Run:
    ```
    apt-get update && apt-get install bacula-fd
    ```
1. Under 'configure' mode run:
    ```
    load
    commit
    save
    ```
1. On Hyper-V host:
    ```
    Set-VMNetworkAdapterVlan -Trunk -AllowedVlanIdList "1-4094" -VMName "bron" -VMNetworkAdapterName "Network Adapter" -NativeVlanId 0
    Get-VMNetworkAdapterVlan
    ```

***
**Sources:**
* https://wiki.vyos.net/wiki/1.0.0/release_notes
* https://wiki.vyos.net/wiki/1.1.0/release_notes#1.1.7
---
title: VyOS - Random
category: Firewall
---

**Set IP on an interface:**
```
set interfaces ethernet eth1 address 10.10.10.1/24
```

**Create a DHCP pool:**
```
set service dhcp-server shared-network-name DHCP_Pool_ETH1 subnet 10.10.10.0/24
edit service dhcp-server shared-network-name DHCP_Pool_ETH1 subnet 10.10.10.0/24
set start 10.10.10.24 stop 10.10.10.250
set default-router 10.10.10.1
set dns-server 10.10.10.1
set domain-name tendo.local
```

**Create a static DHCP entry:**
```
edit service dhcp-server shared-network-name DHCP_Pool_ETH1 subnet 10.10.10.0/24
set static‐mapping WinXP-2 ip‐address 10.10.10.100
set static‐mapping WinXP-2 mac‐address 00:0c:29:9a:70:ca
```

**Verification commands:**
```
show service dhcp-server
show dhcp server statistics
show dhcp server leases
show interfaces ethernet eth1
```

**Set IP on a VLAN interface:**
```
set interfaces ethernet eth1 vif 100 address 192.168.100.254/24
```

**Define a static route:**
```
set protocols static route 172.17.17.133/32 next-hop 172.20.0.19
```
