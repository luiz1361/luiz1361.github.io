---
title: KIMCHI
permalink: /docs/linux/kimchi/
---
---
title: Kimchi - Install
category: Linux
---

```
sudo apt-get install nginx
wget https://github.com/kimchi-project/kimchi/releases/download/2.5.0/wok-2.5.0-0.noarch.deb
wget http://kimchi-project.github.io/gingerbase/downloads/latest/ginger-base.noarch.deb
wget https://github.com/kimchi-project/kimchi/releases/download/2.5.0/kimchi-2.5.0-0.noarch.deb
sudo dpkg -i wok-2.5.0-0.noarch.deb
sudo apt-get install -f
sudo service wokd start
sudo dpkg -i ginger-base.noarch.deb
sudo apt-get install -f
sudo service wokd restart
sudo reboot
sudo dpkg -i kimchi-2.5.0-0.noarch.deb
sudo apt-get install -f
sudo reboot
```
Change port at the Nginx config: ```sudo nano /etc/nginx/conf.d/wok.conf```
Look for the following line: ```listen 0.0.0.0:8001 ssl;``` and change it to: ```listen 0.0.0.0:443 ssl;```
Also locate inside of location, config: ```proxy_redirect http://127.0.0.1:8010/ https://$host:8001/;``` and change this to: ```proxy_redirect http://127.0.0.1:8010/ https://$host:443/;```
Change the port in the Wok config: ```sudo nano /etc/wok/wok.conf```
Uncomment the following line: ```#proxy_port = 8001```
Change it to: ```proxy_port = 443```
```
sudo service wokd restart
sudo service nginx restart
```
Now you can open the web interface on ```https://Server_IP```

***
**Sources:**
* http://www.ubuntuboss.com/ubuntu-server-16-04-as-a-hypervisor-using-kvm-and-kimchi-for-vm-management/>
