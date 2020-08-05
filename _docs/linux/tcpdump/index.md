```
tcpdump -i br0 -n not port 22  -w - | ssh user@192.168.1.1 "cat > /home/user/tcpdump.pcap
```

* Tells it to listen on the bridge interface
* Not to resolve hostnames (which would slow capture and may result in droppedpackets)
* To exclude SSH traffic (so I don't see my own ssh traffic)
* To write the file in binary format instead of text output.
* Then pipes the output to to a remote server in /home/user/tcpdump.pcap
* The extension will allow the file to be easily recognized by Wireshark.
