---
title: SSHKEYGEN
permalink: /docs/linux/sshkeygen/
---
---
title: SSHKEYGEN - Random
category: Linux
---

**Generate private and public key. Run the following command and press enter twice:**
```
ssh-keygen -trsa -b4096 -f key.pem
```

**Using the private key for SSH connection:**
```
ssh -i ~/key.pem ubuntu@34.242.56.81
```
