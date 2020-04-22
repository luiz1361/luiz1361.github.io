---
title: CRON
permalink: /docs/linux/cron/
---
---
title: Cron - All Users
category: Linux
---

**List crontab jobs configured at user level:**
```
for user in $(cut -f1 -d: /etc/passwd); do crontab -u $user -l; done
```
---
title: Cron - Git
category: Linux
---

```bash
*/5 * * * *   root    bash /x/autopull.sh > /dev/null 2>&1
```
