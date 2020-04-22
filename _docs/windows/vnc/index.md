---
title: VNC
permalink: /docs/windows/vnc/
---
---
title: VNC - Change Password PSEXEC
category: Windows
---

**Query current password:**
```
PsExec.exe \\machine REG QUERY HKLM\Software\TightVNC\Server  /v Password
```

**Set password for agent control:**
```
PsExec.exe \\machine REG ADD HKLM\Software\TightVNC\Server /v ControlPassword /t REG_BINARY /d xxx
```

**Set password for remote access:**
```
PsExec.exe \\machine REG ADD HKLM\Software\TightVNC\Server /v Password /t REG_BINARY /d xxx
```

>The password is encoded, Google VNC Password Encoder/Decoder
