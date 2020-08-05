**In case Windows EFS is enabled double check permissions:**
```
mount -t cifs -o username=x,password=x --verbose -o sec=ntlmv2,vers=3.0,rw -t cifs //x/x /mnt/Shared/
echo "//x/x/ /root/Shared/ cifs username=x,password=x,sec=ntlmv2,vers=3.0,iocharset=utf8,noperm 0 0" >> /etc/fstab
```
