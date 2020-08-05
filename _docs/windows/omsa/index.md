# Warning Non Cert Disks

**Get rid of warnings for non Dell certified disks. This procedure works for Dell OMSA >= 8.5**

**Edit the following file:**
```
C:\Program Files\Dell\SysMgt\sm\stsvc.ini
```

**Change the following variable to no:**
```
NonDellCertifiedFlag=no
```

**Restart DSM SA Data Manager service.**

***
**Sources:**
* https://toughtechsite.wordpress.com/2017/12/03/the-case-of-non-certified-physical-drives-causing-warnings-in-dell-openmanage-omsa/
