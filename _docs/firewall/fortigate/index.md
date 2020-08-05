**List existing ARP entries:**
```
get system arp
```

**Add static ARP entry:**
```
config system arp-table
        edit %value%
        set interface %int%
        set ip 192.168.0.100
        set mac 00:00:00:00:00:00
End
```

>%value% – create or edit entry number.  
>%int% – Interface name (wan1, wan2,internal,dmz).  

**Delete ARP entries:**  
```
config system arp-table
        delete %value%
end
```

>%value% – is the entry number you want to delete.

**Clear ARP cache entries:**
```
execute clear system arp table
```
---
title: Fortigate - Backup
category: Firewall
---

**Automatically backup to Forticloud:**
```
config system central-management
set mode backup
set type fortiguard
end

config system auto-script
edit "backup"
set interval 86400
set repeat 0
set start auto
set script "execute backup config management-station AUTO_BACKUP"
next
end
```

**Ensure USB flash device is connected and working:**
```
get hardware status
execute usb-disk list
```

**Backup config as backupoffirewall to usb device:**
```
execute backup config usb backupoffirewall
```

**Restore configuration from file on USB called backupoffirewall:**
```
execute restore config usb backupoffirewall
```
---
title: Fortigate - HA
category: Firewall
---

```
lugs # get system ha status
Model: FortiGate-200B
Mode: a-p
Group: 0
Debug: 0
ses_pickup: disable
Master:128 lugs             FGxxx 0
number of vcluster: 1
vcluster 1: work 169.254.0.1
Master:0 FGxxx

lugs # diagnose sys ha status
HA information
Statistics
        traffic.local = s:0 p:66574906949 b:54380137189690
        traffic.total = s:0 p:66574906949 b:54380137189690
        activity.fdb  = c:0 q:0

Model=200, Mode=2 Group=0 Debug=0
nvcluster=1, ses_pickup=0, delay=0

HA group member information: is_manage_master=1.
FGxxx, 0. Master:128 lugs

vcluster 1, state=work, master_ip=169.254.0.1, master_id=0:
FGxxx, 0. Master:128 lugs(prio=0, rev=0)

lugs # diagnose sys ha showcsum
is_manage_master()=1, is_root_master()=1
debugzone
global: 8d 72 7e 57 34 12 6a 5f 34 3b 2b 7f c0 c0 18 93
root: c0 b4 f4 9f 13 5f 5a 1b a8 b4 9b 7d 36 84 e0 6d
all: 28 53 5f 3e 97 38 3a 3c e4 fa 48 fe b2 5e 6a d5

checksum
global: 8d 72 7e 57 34 12 6a 5f 34 3b 2b 7f c0 c0 18 93
root: c0 b4 f4 9f 13 5f 5a 1b a8 b4 9b 7d 36 84 e0 6d
all: 28 53 5f 3e 97 38 3a 3c e4 fa 48 fe b2 5e 6a d5
```
---
title: Fortigate - Health Check
category: Firewall
---

**Monitoring multiple targets:**
```
config system link-monitor
    edit "one"
        set server "8.8.8.8" "8.8.4.4" "1.2.3.4" "5.6.7.8"
        set status disable
    next
end
```
***
**Sources:**
* http://help.fortinet.com/cli/fos50hlp/54/Content/FortiOS/fortiOS-cli-ref-54/config/system/link-monitor.htm
* https://forum.fortinet.com/tm.aspx?m=124816
---
title: Fortigate - IPSEC VPN
category: Firewall
---

>Every once in a while you may experience some issues with certain IPSec VPN tunnels. For this reason it might be useful to know how to clear SA sessions that are stuck.**

**To flush a tunnel use the following command:**
```
diag vpn tunnel flush <phase1 name>
```

>It is very important to specify the phase1 name, if you forget to specify this the Fortigate will flush ALL tunnels.


**You can also reset a tunnel, in this case the Fortigate will completely re-negotiate the IPSec VPN:**
```
diag vpn tunnel reset <phase1 name>
```

>As with the flush do not forget the phase1 name or you will reset all your tunnels.

***
**Sources:**
* https://itzecurity.blogspot.com/2013/07/ipsecvpn-flush-and-reset-tunnels.html
---
title: Fortigate - Logging
category: Firewall
---

**Enable logging per firewall policy:**
```
config firewall policy
edit <policy id>
set logtrafffic-start enable
end
end
```

**Set severity log globally to information level:**
```
config log memory filter
get
set severity information
end
```
>The Log all events must be enabled via GUI per policy as well.

**Ignore broadcast log messages on log files:**
```
config log setting
set local-in-deny disable
end
```
>The default is enable.

**This example shows how to enable logging to a remote Syslog server, configure an IP address and port for the server, and set the facility type to user:**
```
config log syslogd setting
 set status enable
 set server 220.210.200.190
 set port 514
 set facility user
end

config log syslogd filter
 set severity error
 end
```

**How to display the configuration for logging to a remote syslog server:**
```
show log syslogd setting
```

>If the show command returns you to the prompt, the settings are at default.

***
**Sources**
*http://docs.forticare.com/fgt/admin/01-28008-0002-20050909_FortiGate-60_Administration_Guide.pdf
*http://kc.forticare.com/default.asp?id=1580&Lang=1&SID=
*https://forum.fortinet.com/tm.aspx?m=101103
---
title: Fortigate - MTU Jumbo
category: Firewall
---

```
config system interface
  edit "port7"
      set mtu-override enable
      set mtu 9000
```

***
**Sources:**
* https://forum.fortinet.com/tm.aspx?m=150869>
---
title: Fortigate - Ping and ARP
category: Firewall
---

**Ping and get ARP response to retrieve MAC:**
```
exec ping <IP address>
get system arp | grep <IP address>
```

***
**Source:**
* https://forum.fortinet.com/tm.aspx?m=122977
---
title: Fortigate - Routing
category: Firewall
---

**Retrieve routing table:**
```
get router info routing-table
```
---
title: Fortigate - SCP
category: Firewall
---

**First ensure SSH is allowed on the interface you are attempting to access:**
```
config system interface
edit <interface>
set allowaccess ping https ssh
end
```

**Now enable SCP:**
```
config system global
set admin-scp enable
end
```

**To run a backup of the running configuration:**
```
scp admin@<ip>:sysconfig <local-file>
```
>In order to retrieve configuration regarding other users you must authenticate using a high privileged account.

***
**Sources:**
* https://www.packetbin.com/snippets/fortinet-fortigate-allow-scp-to-the-firewall
---
title: Fortigate - Sniffing
category: Firewall
---

**Sniff traffic for any interface using port 5060 for any protocol:**
```
diag sniffer packet any 'port 5060'
```

**Sniff traffic for interface port16 for source or destination host 192.168.0.1 and port 5060 for any protocol:**
```
diag sniffer packet port16 'host 192.168.0.1 and port 5060'
```
---
title: Fortigate - SSL VPN
category: Firewall
---

**Change SSL VPN port:**
```
set port 443
set source-interface "wan1"
```
