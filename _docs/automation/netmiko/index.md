```
from pprint import pprint
from netmiko import ConnectHandler
from time import time
import json, os, threading, sys

def config_worker( ip, username, password, extra ):

    #---- Connect to the device ----
    print ("---- Connecting to device {0}".format( ip ))

    #---- Connect to the device
    session = ConnectHandler( device_type = "cisco_s300", ip = ip, username = username, password = password, global_delay_factor=2 )

    if extra == "extra":
        #---- Use CLI command to get configuration data from device
        print ("---- Retrieving result of extra command")
        config_data = session.send_command("show mac address-table",expect_string=r"#",delay_factor=6)

        #---- Write out configuration information to file
        print ("---- Storing extra command output: ", basepath + "extra/" + ip)
        with open( basepath + "extra/" + ip, "w" ) as config_out:  config_out.write( config_data )

    else:
        #---- Use CLI command to get configuration data from device
        print ("---- Retrieving configuration from device")
        config_data = session.send_command("show run",expect_string=r"#",delay_factor=6)

        #---- Use CLI command to save configuration on device
        session.send_command("wr",expect_string=r"Overwrite file",delay_factor=6)
        session.send_command("Y",expect_string=r"Copy succeeded",delay_factor=6)

        #---- Write out configuration information to file
        print ("---- Storing configuration: ", basepath + "configs/" + ip)
        with open( basepath + "configs/" + ip, "w" ) as config_out:  config_out.write( config_data )

    session.disconnect()

    return

#==============================================================================
# ---- Main: Get Configuration
#==============================================================================

#---- Define base path to run from anywhere
basepath = os.path.abspath(os.path.dirname(__file__)) + "/"

#---- Retrieve arguments if passed
if len(sys.argv) > 1:
    extra = sys.argv[1]
else:
    extra = None

#---- Retrieve creds from file
with open(basepath + "creds.json", "r") as f:
    creds = json.load(f)

username = creds["CISCO"]["USERNAME"]
password = creds["CISCO"]["PASSWORD"]

#---- Retrieve list of IPs from file
ips = [line.rstrip("\n") for line in open( basepath + "devices-cisco")]

starting_time = time()

config_threads_list = []

for ip in ips:
    print ("---- Creating thread for: ", ip)
    config_threads_list.append( threading.Thread( target=config_worker, args=( ip, username, password, extra, ) ) )

print ("---- Begin get config threading ----")
for config_thread in config_threads_list:
    config_thread.start()

for config_thread in config_threads_list:
    config_thread.join()

print ("---- End get config threading, elapsed time=", time() - starting_time)
```
---
title: Netmiko - backup-cron.sh.md
category: Automation
---

```
#!/bin/bash

python3 /x/backup-fortigate.py
python3 /x/backup-cisco.py

OUTPUT=`su -s /bin/bash -c 'cd /x/configs && git status 2>&1' x 2>&1`;

if [[ $OUTPUT != *"nothing to commit, working directory clean"* ]]; then
  OUTPUT2=`su -s /bin/bash -c 'cd /x/configs && git add . 2>&1 && git commit -m "nemiko Bash Auto Git Push" 2>&1 && git push 2>&1' x 2>&1`;
  eval $(echo $OUTPUT2 | mail -s "netmiko Bash Auto Git Push" x@x.x);
  curl -H "Content-Type: application/json" -d "{\"title\": \"netmiko Bash Auto Git Push\", \"text\": \"*****        *****\n\n $OUTPUT2 \", \"themeColor\": \"EA4300\", \"type\": \"\" }" https://x;
else
  exit;
fi
```
---
title: Netmiko - backup-fortigate.py.md
category: Automation
---

```
from scp import SCPClient
import os, paramiko, json

def fortigate_backup(ip, username, password):

    ssh = paramiko.client.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.client.AutoAddPolicy())

    print ("---- Connecting to device {0}".format( ip ))

    ssh.connect(ip, username = username, password = password, timeout = 180)

    with SCPClient(ssh.get_transport(), socket_timeout = 180) as scp:

        config_filename = basepath + "configs/" + ip

        print ("---- Getting and writing configuration from device: " + config_filename)

        scp.get("sys_config", config_filename)

        print ("---- Configuration stored from device: " + config_filename)

    return

#---- Define base path to run from anywhere
basepath = os.path.abspath(os.path.dirname(__file__)) + "/"

#---- Retrieve creds from file
with open(basepath + "creds.json", "r") as f:
    creds = json.load(f)

username = creds["FORTIGATE"]["USERNAME"]
password = creds["FORTIGATE"]["PASSWORD"]

#---- Retrieve list of IPs from file
ips = [line.rstrip("\n") for line in open(basepath + "devices-fortigate")]

for ip in ips:
    fortigate_backup(ip, username, password)
```
---
title: Netmiko - config-cisco.py.md
category: Automation
---

```
from pprint import pprint
from netmiko import ConnectHandler
from time import time
import json, os, threading, sys

def config_worker( ip, username, password ):

    #---- Connect to the device ----
    print ("---- Connecting to device {0}".format( ip ))

    #---- Connect to the device
    session = ConnectHandler( device_type = "cisco_s300", ip = ip, username = username, password = password, global_delay_factor=2 )

    #---- Use CLI command to set configuration data on device
    print ("---- Setting configuration on device")
    config_data = session.config_mode()
    config_data += session.send_command("no ip telnet server",expect_string=r"#",delay_factor=6)
#    config_data += session.send_command_timing("clock timezone " " 0 minutes 0 \n",strip_command = False)
#    config_data += session.send_command_timing("clock summer-time web recurring eu \n",strip_command = False)
#    config_data += session.send_command_timing("clock source sntp \n",strip_command = False)
#    config_data += session.send_command_timing("sntp unicast client enable \n",strip_command = False)
#    config_data += session.send_command_timing("sntp unicast client poll \n",strip_command = False)
#    config_data += session.send_command_timing("sntp server x.x.x.x poll \n",strip_command = False)
#    config_data += session.send_command_timing("logging host x.x.x.x port 6514 \n",strip_command = False)
#    config_data += session.send_command_timing("logging origin-id hostname \n",strip_command = False)
#    config_data += session.send_command_timing("no logging console \n",strip_command = False)
#    config_data += session.send_command_timing("no passwords complexity enable \n",strip_command = False)
#    config_data += session.send_command_timing("passwords aging 0 \n",strip_command = False)
#    config_data += session.send_command_timing("snmp-server server \n",strip_command = False)
#    config_data += session.send_command_timing("snmp-server community public ro x.x.x.x view Default \n",strip_command = False)
#    config_data += session.send_command_timing("no ip http server \n",strip_command = False)
#    config_data += session.send_command_timing("encrypted radius-server key x \n",strip_command = False)
#    config_data += session.send_command_timing("encrypted radius-server host x.x.x.x key x \n",strip_command = False)
#    config_data += session.send_command_timing("ip http authentication aaa login-authentication radius local \n",strip_command = False)
#    config_data += session.send_command_timing("aaa authentication login SSH radius local \n",strip_command = False)
#    config_data += session.send_command_timing("aaa authentication login Telnet local \n",strip_command = False)
#    config_data += session.send_command_timing("aaa authentication login Console local \n",strip_command = False)
#    config_data += session.send_command_timing("aaa accounting login start-stop group radius \n",strip_command = False)
#    config_data += session.send_command_timing("line ssh \n",strip_command = False)
#    config_data += session.send_command_timing("login authentication SSH \n",strip_command = False)
#    config_data += session.send_command_timing("password x encrypted \n",strip_command = False)
#    config_data += session.send_command_timing("exit \n",strip_command = False)
#    config_data += session.exit_config_mode()
#    config_data += session.send_command_timing("wr",strip_command = False)
#    config_data += session.send_command_timing("Y",strip_command = False)
    print (config_data)
    session.disconnect()

    return

#==============================================================================
# ---- Main: Get Configuration
#==============================================================================

#---- Define base path to run from anywhere
basepath = os.path.abspath(os.path.dirname(__file__)) + "/"

#---- Retrieve creds from file
with open(basepath + "creds.json", "r") as f:
    creds = json.load(f)

username = creds["CISCO"]["USERNAME"]
password = creds["CISCO"]["PASSWORD"]

#---- Retrieve list of IPs from file
ips = [line.rstrip("\n") for line in open( basepath + "devices-cisco")]

starting_time = time()

config_threads_list = []

for ip in ips:
    print ("---- Creating thread for: ", ip)
    config_threads_list.append( threading.Thread( target=config_worker, args=( ip, username, password, ) ) )

print ("---- Begin get config threading ----")
for config_thread in config_threads_list:
    config_thread.start()

for config_thread in config_threads_list:
    config_thread.join()

print ("---- End get config threading, elapsed time=", time() - starting_time)
```
---
title: Netmiko - creds.json.sample.md
category: Automation
---

```
{
  "CISCO": {
    "USERNAME": "cisco_radius_ro",
    "PASSWORD": "12345"
  },
  "FORTIGATE": {
    "USERNAME": "fortigate_scp_ro",
    "PASSWORD": "12345"
  }
}
```
---
title: Netmiko - crontab.md
category: Automation
---

```
00 1 * * *      root    /x/backup-cron.sh
```
---
title: Netmiko - devices-cisco.sample
category: Automation
---

```
192.168.0.1
```
---
title: Netmiko - devices-fortigate.sample.md
category: Automation
---

```
192.168.0.2
```
