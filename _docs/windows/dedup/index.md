---
title: DEDUP
permalink: /docs/windows/dedup/
---
---
title: DEDUP
permalink: /docs/windows/dedup/
---

# Disabling w2k12r2

>Disabling Data De-duplication doesn’t “undupe” the data already “duped”.

>If you disable Data DeDuplication via the GUI or Powershell, it does not actually undo the work it has done.   Worse, if you have disabled, you also cannot run a garbage cleanup command (which cleans up the data created by the deduplication technology).

>So, its important that you leave Data Deduplication enabled, but EXCLUDE the entire drive first.   Then, run the following two commands (which will take ages to run dependant on the amount of data you have).

**The unoptimise command:**
```
start-dedupjob -Volume <VolumeLetter> -Type Unoptimization
```
**Check the status:**
```
get-dedupjob
```
**Clean up the garbage:**
```
start-dedupjob -Volume <VolumeLetter> -Type GarbageCollection
```
**Check the status:**
```
get-dedupjob
```
**Once you have both of the above done, and it will take a while, you can remove the deduplication role from your server.**

**If need to stop a dedupjob:**
```
Stop-DedupJob -Volume "D:"
```

***
**Sources:**
* https://technet.microsoft.com/en-us/library/hh848439.aspx
* http://nickwhittome.com/2014/10/01/disabling-data-deduplication-on-windows-server-2012r2/
