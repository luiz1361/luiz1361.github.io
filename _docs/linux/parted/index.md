**To create partitions larger than 2TB GPT needs to be used instead of MBR:**
```
#parted /dev/sdb
(parted) mklabel gpt
(parted) unit TB
(parted) mkpart primary 0.00TB 3.00TB
(parted) print
(parted) quit
```

***
**Sources:**
* http://www.cyberciti.biz/tips/fdisk-unable-to-create-partition-greater-2tb.html
