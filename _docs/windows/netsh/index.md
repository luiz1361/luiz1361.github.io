# IPv6 Disable


**Disabling all Windows firewall profiles:**
```
NetSh Advfirewall set allprofiles state off
```

***
**Sources:**
* http://www.windowsnetworking.com/kbase/WindowsTips/WindowsServer2008/AdminTips/Admin/QuicklyTurnONOFFWindowsFirewallUsingCommandLine.html

# SLAAC Disable

**Disabling SLAAC/RA for a certain network interface:**
```
netsh interface ipv6 set interface "vEthernet (vSwitch_External)" routerdiscovery=disabled
```
