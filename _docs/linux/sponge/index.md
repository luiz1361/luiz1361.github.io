**To read and write to same file using pipe:**
```
apt-get install moreutils
sed "s/root/toor/" /etc/passwd | grep -v joey | sponge /etc/passwd
```
>Sponge is part of the moreutils package
