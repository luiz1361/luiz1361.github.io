---
title: POWERSHELL
permalink: /docs/windows/powershell/
---
---
title: Powershell - Allow Script Execution
category: Windows
---

**The command below will allow script execution in unrestricted mode:**
```
Set-ExecutionPolicy Unrestricted
```
---
title: Powershell - Get Member AD Group
category: Windows
---

**Retrieve AD group members:**
```
Get-ADGroupMember -Identity "Domain Users" |%{get-aduser $_.SamAccountName | s
elect userPrincipalName }
```
---
title: Powershell - Get SAS ID
category: Windows
---

**The command below returns the SAS id from all SAS interfaces:**
```
Get-InitiatorPort
```
