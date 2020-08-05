**DD Linux to Linux over SSH:**
```
dd if=/dev/sda | gzip | ssh root@target 'gzip -d | dd of=/dev/sda'
```
