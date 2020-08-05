**Steps to solve the error ```MediaKit reports not enough space on device for requested operation.``` when trying to format disk via Disk Utility on MacOS:**

**Firstly we need to identify the mount name of our disk (hard drive):**
```
diskutil list
```

**Before any operations on the disk we must unmount it:**
```
diskutil unmountDisk force disk2
```

**Now we will write zeros to the disk (this will erase the entire disk):**
```
sudo dd if=/dev/zero of=/dev/rdisk2 bs=1024 count=1024
```

**Let’s now try to partition the disk. This will be the GUID Partition Table (GPT) and the Journaled HFS+ format of file system:**
```
diskutil partitionDisk disk2 GPT JHFS+ "Elements" 0g
```

***
**Sources:**
* https://mycyberuniverse.com/how-fix-mediakit-reports-not-enough-space-on-device.html
