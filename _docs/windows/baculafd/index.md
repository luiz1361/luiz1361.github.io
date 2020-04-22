---
title: BACULAFD
permalink: /docs/windows/baculafd/
---
---
title: Baculafd
permalink: /docs/windows/baculafd/
---

# Install

1.First of all download http://www.silentinstall.org/ to create the MSI
1.Run psexec and install the silent MSI:
    ```
    PsExec.exe \\machine -u "domain\user" -p "" -h msiexec /i "c:\bacula.msi" /quiet /norestart
    ```
1.Allow firewall port on remote PC:
    ```
    PsExec.exe \\machine -u "domain\user" -p "" -h netsh advfirewall firewall add rule name="Bacula 9102" dir=in action=allow protocol=TCP localport=9102
    ```
