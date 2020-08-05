# 0x800f0954

**Try this first, CMD as admin with ISO mounted on D:**
```
Add-WindowsCapability -Online -Name NetFx3~~~~ -Source D:\sources\sxs
```

**As a temporary workaround, change the registry key “UseWUServer” to 0. It is located at:**
```
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU
```

>Reboot is required

***
**Source:**
* https://www.westechs.com/error-0x800f0954-when-installing-dot-net-on-windows-10/
