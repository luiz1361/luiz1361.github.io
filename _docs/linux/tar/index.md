**Using tar and ssh to transfer data from machine src /data to local dir /databkp:**
```
ssh user@src "tar czpf - /data" | tar xzpf - -C /databkp
```

**From local /data to machine dst to remote dir /databkp :**
tar cpf - /data | ssh user@dst "tar xpf - -C /databkp"

***
**Sources:**
* http://meinit.nl/using-tar-and-ssh-to-efficiently-copy-files-preserving-permissions
* https://www.cyberciti.biz/faq/howto-use-tar-command-through-network-over-ssh-session/
* http://superuser.com/questions/748565/create-tar-with-multiple-directories-and-file-locations
* https://www.cyberciti.biz/hardware/unix-linux-basic-tape-management-commands/
