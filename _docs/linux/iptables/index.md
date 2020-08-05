**To block specific port number such tcp port # 5050, enter:**
```
iptables -A OUTPUT -p tcp --dport 5050 -j DROP
```

**To block tcp port # 5050 for an IP address 192.168.1.2 only, enter:**
```
iptables -A OUTPUT -p tcp -d 192.168.1.2 --dport 5050 -j DROP
```

**Show NAT rules**
```
iptables -nvL -t nat
```
