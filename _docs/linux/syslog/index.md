**Run the command below to send a UDP message to a syslog server:**
```
nc -w0 -u 192.168.0.1 514 <<< "testing"
```
>Replace the ip 192.168.0.1 with your syslog server IP  
>-w0 set timeout to zero second, -u is to use UDP protocol, 514 represent port 514  

***
**Sources:**
* http://www.techiecorner.com/1496/how-to-send-message-to-syslog-server/
