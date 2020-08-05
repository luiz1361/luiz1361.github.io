**Open port 9999 on localhost to represent a connection to 10.0.0.4:22 from 172.16.0.5**
```
ssh -L 9999:10.0.0.4:22 luizm@172.16.0.5
```

**Get SSH public key fingerprintt for comparison in SHA256**
```
ssh-keygen -lf ~/.ssh/id_rsa.pub -E sha256
2048 SHA256:CxIuAEc3SZThY9XobrjJIHN61OTItAU0Emz0v/+15wY user@host (RSA)
```

**Get SSH public key fingerprintt for comparison in MD5**
```
ssh-keygen -lf ~/.ssh/id_rsa.pub -E md5
2048 f6:bf:4d:d4:bd:d6:f3:da:29:a3:c3:42:96:26:4a:41 user@host (RSA)
```
