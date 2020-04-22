---
title: VSCODE
permalink: /docs/windows/vscode/
---
---
title: VSCODE - SSH FS Sudo
category: Windows
---

**Ctrl+Shift+P and edit "Preferences: Open Settings(JSON)" or "settings.json" changing:**
```
"sftpCommand": "sudo /usr/lib/openssh/sftp-server"
```

***
**Sources:**
* https://github.com/SchoofsKelvin/vscode-sshfs/issues/28
---
title: VSCODE - Sync Settings
category: Windows
---

**sync_settings_different_pcs visual studio code**

**Credentials:**
```
GitHub Token: x
GitHub Gist: x
GitHub Gist Type: Secret
```

1. Install Settings Sync in VS Code
1. Generate a Personal Access Token From Github
>So in Github, you’ll go to: Settings / Developer settings / Personal access tokens / Generate New Token / Click the checkbox next to “Create gists”
1. Upload Your VS Code Settings: ```Sync: Update/Upload Settings```
1. Download Your Settings on a New Machine: ```Sync: Download Settings```

***
**Sources:**
* https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync
* https://itnext.io/settings-sync-with-vs-code-c3d4f126989
