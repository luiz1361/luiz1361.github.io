##Required on all Nagios servers

**Installing the required packages:**
```
apt-get install wget gcc python3-openssl python-dev git python-pip build-essential libssl-dev libffi-dev php5-curl
```

**Installing the HTTP web socket:**
```
pip install diesel
```

**Installing Nagios-API:**
```
cd /etc/nagios3/
git clone https://github.com/zorkian/nagios-api.git
cd nagios-api/
```

**Checking if the Nagios-API service is working properly:**
```
./nagios-api -p 8090 -c /var/lib/nagios3/rw/nagios.cmd -s /var/cache/nagios3/status.dat -l /var/log/nagios3/nagios.log
```

**Creating the Nagios-API service:**
```
touch /etc/init.d/nagios-api
chmod a+x /etc/init.d/nagios-api
vim /etc/init.d/nagios-api
```
```
#!/bin/bash
case $1 in
start) start-stop-daemon --start --exec /etc/nagios3/nagios_api --pidfile /var/run/nagios-api.pid --background
       ;;
stop)  start-stop-daemon --stop --pidfile /var/run/nagios-api.pid
       ;;
esac
```

**Creating the Nagios-API start-up script:**
```
touch /etc/nagios3/nagios_api
chmod a+x /etc/nagios3/nagios_api
vim /etc/nagios3/nagios_api
```
```
#!/bin/bash
/etc/nagios3/nagios-api/nagios-api -p 8090 -c /var/lib/nagios3/rw/nagios.cmd -s /var/cache/nagios3/status.dat -l /var/log/nagios3/nagios.log &>> /var/log/nagios3/nagios-api.log &
```

##Required only where the Nagdash web service will be installed

**Download https://github.com/lozzd/Nagdash**

**Move it to /usr/share/nagios3/**

**Rename the PHP configuration file:**
```
mv config.php.example config.php
```

**Edit the PHP configuration file and insert all Nagios instances on that i.ie:**
```
$nagios_hosts = array(
   array("hostname" => "127.0.0.1", "port" => "8090", "protocol" => "http", "tag" => "A", "tagcolour" => "#336699"),
   array("hostname" => "192.168.1.1", "port" => "8090", "protocol" => "http", "tag" => "B", "tagcolour" => "#696969"),
   array("hostname" => "192.168.1.1", "port" => "8090", "protocol" => "http", "tag" => "C", "tagcolour" => "#4169E1"),
```

**Edit the Nagios3 Apache settings in /etc/nagios3/apache.conf:**

```
Alias /nagdash /usr/share/nagios3/Nagdash-master/htdocs
<DirectoryMatch (/usr/share/nagios3/Nagdash-master/htdocs)>
       Options FollowSymLinks
       DirectoryIndex index.php index.html
       AllowOverride AuthConfig
       Order Allow,Deny
       Allow From All
       AuthName "Nagios Access"
       AuthType Basic
       AuthUserFile /etc/nagios3/htpasswd.users
       require valid-user
</DirectoryMatch>
```

##Nagdash Filters

**If you want to filter out all the excess alerts such as printers, press space bar (you may have to click onto the page for the key press to register) You'll be presented with the nagdash options screen find the section called "Hostname regex" and paste this code into it:**
```
^((?!PROJECTOR|PRINTER|PLOTTER).)*$
```
---
title: Nagios3 - SMS Teams
category: Linux
---

**Nagios contact configured with custom host and service notifications for SMS:**
```
define contact {
       alias SMS
       contact_name sms
       service_notification_period 24x7
       service_notification_options w,u,c,r
       service_notification_commands notify-by-sms-service
       host_notification_period 24x7
       host_notification_options d,r
       host_notification_commands notify-by-sms-host
}

define command {
       command_name notify-by-sms-service
       command_line /x/sms_nagios.sh $HOSTNAME$ $SERVICEDESC$ $SERVICESTATE$
}

define command {
       command_name notify-by-sms-host
       command_line /x/sms_nagios.sh $HOSTNAME$ $HOSTDESC$ $HOSTSTATE$
}
```

**Nagios contact configured with custom host and service notifications for MS Teams:**
define contact {
       alias Teams
       contact_name teams
       service_notification_period 24x7
       service_notification_options w,u,c,r
       service_notification_commands notify-by-teams-service
       host_notification_period 24x7
       host_notification_options d,r
       host_notification_commands notify-by-teams-host
}

define command {
       command_name notify-by-teams-service
       command_line /x/msteams_nagios.sh $NOTIFICATIONTYPE$ 'curl -H "Content-Type: application/json" -d "{\"title\": \"$NOTIFICATIONTYPE$ alert - $HOSTNAME$/$SERVICEDESC$ is $SERVICESTATE$\", \"text\": \"*****        *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$ ($SERVICENOTESURL$)\n\nHost: $HOSTNAME$ ($HOSTALIAS$)\n\nAddress: $HOSTADDRESS$\n\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info: $SERVICEOUTPUT$\", \"themeColor\": \"EA4300\", \"type\": \"\", \"potentialAction\": [{\"@context\": \"http://schema.org\", \"@type\": \"ViewAction\", \"name\": \"x\", \"target\": [\"https://x.x.x.x/x\"]}] }" https://x
}

define command {
       command_name notify-by-teams-host
       command_line /x/msteams_nagios.sh $NOTIFICATIONTYPE$ 'curl -H "Content-Type: application/json" -d "{\"title\": \"$NOTIFICATIONTYPE$ alert - $HOSTNAME$ is $HOSTSTATE$\", \"text\": \"*****        *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nHost: $HOSTNAME$ ($HOSTALIAS$)\n\nAddress: $HOSTADDRESS$\nnState: $HOSTSTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info: $HOSTOUTPUT$\", \"themeColor\": \"EA4300\", \"type\": \"\", \"potentialAction\": [{\"@context\": \"http://schema.org\", \"@type\": \"ViewAction\", \"name\": \"x\", \"target\": [\"https://x.x.x.x/x\"]}] }" https:x
}
