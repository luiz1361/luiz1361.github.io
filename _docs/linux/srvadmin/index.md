**Installation steps for Ubuntu 16:**
```
gpg --keyserver hkp://pool.sks-keyservers.net:443 --recv-key 1285491434D8786F
gpg -a --export 1285491434D8786F | sudo apt-key add -
apt-get update
apt-get install srvadmin-all
```

***
**Sources:**
* http://linux.dell.com/repo/community/ubuntu/
