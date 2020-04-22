---
title: MT
permalink: /docs/linux/mt/
---
---
title: MT - LTO
category: Linux
---

mt -f /dev/nst0 <command>:
>status: Show the status of the drive.  
>rewind: Rewind the tape.  
>retension: Retension the tape.  
>erase: Erase the tape.  
>offline: Take the tape drive offline.  
>eod: Move forward on the tape to the end of data.
>eof, weof:	Write count EOF marks at current position.
>offline, rewoffl: Rewind the tape and, if applicable, unload the tape.


**Relabel a tape(fast):**
```
mt -f /dev/st0 rewind && mt -f /dev/st0 weof && mt -f /dev/st0 rewind
```

**Erase a tape bit by bit(Will take a lot of time):**
```
sudo dd if=/dev/zero of=/dev/st0 bs=512 count=1
```

>/dev/st0 will rewind to beginning of tape, but the /dev/nst0 won't

***
**Sources:**
* http://blog.ls-al.com/bacula-relabel-tape/
* https://www.safaribooksonline.com/library/view/linux-pocket-guide/9780596806347/re75.html
* http://knowledgebase.tolisgroup.com/?View=entry&EntryID=30
* http://bacula.10910.n7.nabble.com/Feature-Request-Remove-label-from-tape-from-bconsole-td25362.html
