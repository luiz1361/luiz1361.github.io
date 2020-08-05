First of all you will need to figure out the device's IP and ideally reserve it on the DHCP.

**Details to get a HS100 turning off and on via Python3:**
```
apt-get install python3 pip
wget https://github.com/GadgetReactor/pyHS100/archive/master.zip
unzip master.zip
cd pyHS100-master/
pip install click-datetime
python3 setup.py install
```

**Python script to turn on:**
from pyHS100 import SmartPlug, SmartBulb
from pprint import pformat as pf
plug = SmartPlug("172.17.250.196")
plug.turn_on()
print("Hardware: %s" % pf(plug.hw_info))
print("Full sysinfo: %s" % pf(plug.get_sysinfo())) # this prints lots of information about the device

**Python script to turn off:**
```
from pyHS100 import SmartPlug, SmartBulb
from pprint import pformat as pf
plug = SmartPlug("172.17.250.196")
plug.turn_off()
print("Hardware: %s" % pf(plug.hw_info))
print("Full sysinfo: %s" % pf(plug.get_sysinfo())) # this prints lots of information about the device
```
