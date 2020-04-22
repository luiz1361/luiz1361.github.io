---
title: RASPBERRY
permalink: /docs/iot/raspberry/
---
---
title: Raspberry - Disable Blank Screen
category: IOT
---

```
sudo nano /etc/lightdm/lightdm.conf
```

**In that file, look for:**
```
[SeatDefault]
```

**Insert this line:**
```
xserver-command=X -s 0 dpms
```
---
title: Raspberry - Logstalgia
category: IOT
---

**Before ./configure && make && make install install the following dependencies:**
```
apt-get install libpcre3-dev glew-dev libglew-dev libsdl2-image-dev libboost-dev libglm-dev
```
---
title: Raspberry - moisture_ascii_emoji.py
category: IOT
---
```
from termcolor import colored
def print_ascii_red():
   print(colored(r"""
                -/oydmNNNNNNmdyo/-
            :odMMMMMMMMMNNMMMMMMMMMds:`
         -yNMMMMmho/-.`    `.-/oymMMMMNy:
       /dMMMMh+.                  ./hMMMMm+
     -dMMMNo`                        `+mMMMm:
    oMMMNo                              /mMMMy`
  `hMMMh.      .::.            .::.      `yMMMd`
  hMMMs     .smMMMMm:        -dMMMMNy-     +MMMd`
 oMMMy     :mddhyyydm`       ddhyyyhdm/     oMMMy
.NMMm`                                `+-    dMMM-
oMMM+      -+`                        `MMNy. :MMMy
hMMM.   .sNMM.                        `NMMMN.`NMMm
dMMM`  `NMMMM.       .:////:.          yMMMN. mMMm
hMMM.  `mMMMh    `+hMMMMMMMMMMdo.       -/:` `NMMm
oMMM+    ::-   `sNMMMMMMMMMMMMMMMy`          :MMMy
.NMMm`        .mMMMMMMMMMMMMMMMMMMN-         dMMM-
 oMMMy        dMMMMMMMMMMMMMMMMMMMMN`       oMMMy
  hMMMs      :MNmhyso+//////+ooshdNM+      +MMMd`
  `hMMMh`    `.                    `.    `yMMMd`
    oMMMNo`                             /mMMMy`
     -dMMMNo`                        `+mMMMm:
       :dMMMMh+.                  `/hMMMMm/
         -sNMMMMNho/-.`    `.-/oymMMMMNy:
            -odMMMMMMMMMMMMMMMMMMMMds
                -/oyhdmNNNNNmhyo/-
                   """, 'red'))

def print_ascii_green():
   print(colored(r"""

                 -:::::::::::::::.
             -:::`               .:::.
          -/:`                       -/:`
        -/.                             :/`
      `+.       `::`           `::`       /:
     :/        +MMMN/         oMMMN:       .+`
    ::        .MMMMMM.       -MMMMMN`       `o`
   -/         /MMMMMM:       +MMMMMM.        `o
   o          .NMMMMN`       -MMMMMN          -/
  :-           :NMMm-         /NMMm-           o
  o              ..             -.             +`
  o                                            /-
  o                                            +.
  /.      o:                           o-      o
  `o      :mo                        `hh`     .+
   /-      `ym:                     /mo       o
    +.       .yd+`                :dh-       +.
     /-        `+hho-`        `:sds-       `+.
      -+`         `:oyhhhhhhhhy+-         -+
        //                              -/.
          :/.                        `:/.
            .:::`                 -:::
                -::::::-----::::::`
                        ```
                   """, 'green'))
```
---
title: Raspberry - moisture_monitor.py
category: IOT
---
```
#!/usr/bin/python

import moisture_ascii_emoji
import RPi.GPIO as GPIO # This is the GPIO library we need to use the GPIO pins on the Raspberry Pi
import smtplib # This is the SMTP library we need to send the email notification
import time # This is the time library, we need this so we can use the sleep function

# Define some variables to be used later on in our script
# You might not need the username and password variable, depends if you are using a provider or if you have your raspberry pi setup to send emails
# If you have setup your raspberry pi to send emails, then you will probably want to use 'localhost' for your smtp_host
smtp_username = "enter_username_here" # This is the username used to login to your SMTP provider
smtp_password = "enter_password_here" # This is the password used to login to your SMTP provider
smtp_host = "x.x.x" # This is the host of the SMTP provider
smtp_port = 25 # This is the port that your SMTP provider uses
smtp_sender = "treeminator@x.x" # This is the FROM email address
smtp_receivers = ['x@x.x'] # This is the TO email address
# The next two variables use triple quotes, these allow us to preserve the line breaks in the string.
# This is the message that will be sent when NO moisture is detected
message_dead = """From: Treeminator <treeminator@x.x>
To: X <x@x.x>
Subject: Plant Dehydration
Howya,

It's me the IT Services Plant. I'm thirsty, please water me. Plant death imminent!!! :'(

This might be my last message.

Kind Regards,

IT Services Plant
Photosynthesis Specialist

...

Disclaimer:
...
"""
# This is the message that will be sent when moisture IS detected again
message_alive = """From: Treeminator <treeminator@x.x>
To: X <x@x.x>
Subject: Plant Dehydration
The panic is over! I have water again :)
"""
# This is our sendEmail function
def sendEmail(smtp_message):
    localtime = time.asctime( time.localtime(time.time()) )
    try:
        smtpObj = smtplib.SMTP(smtp_host, smtp_port)
#        smtpObj.login(smtp_username, smtp_password) # If you don't need to login to your smtp provider, simply remove this line
        smtpObj.sendmail(smtp_sender, smtp_receivers, smtp_message)
        print "Successfully sent email", localtime
    except smtplib.SMTPException:
        print "Error: unable to send email", localtime
# Set our GPIO numbering to BCM
GPIO.setmode(GPIO.BCM)
# Define the GPIO pin that we have our digital output from our sensor connected to
channel = 21
# Set the GPIO pin to an input
GPIO.setup(channel, GPIO.IN)
# This line tells our script to keep an eye on our gpio pin and let us know when the pin goes HIGH or LOW
GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime=300)
# This is an infinte loop to keep our script running
previousstate = 0
while True:
    localtime = time.asctime( time.localtime(time.time()) )
    if GPIO.input(channel) == 1:
        state = 1
        print "Water Level: Critical. Please water me, I'm thirsty.", localtime
        moisture_ascii_emoji.print_ascii_red()
        if previousstate != state:
            sendEmail(message_dead)
            previousstate = state
    else:
        state = 0
        print "Water Levels: OK. The panic is over.", localtime
        moisture_ascii_emoji.print_ascii_green()
        if previousstate != state:
            sendEmail(message_alive)
            previousstate = state
    # This line simply tells our script to wait 0.1 of a second, this is so the script doesnt hog all of the CPU
    time.sleep(5)
```
---
title: Raspberry - SSH VNC
category: IOT
---

* In Raspbian Jessie ssh may already be enabled by default but if not open a terminal and type:
```
sudo raspi-config
```

* select 7 Advanced Options
* select A4 SSH
* You’ll be asked if you want enable SSH Select Yes.
* To find the IP address of you pi open a terminal and type:
```
hostname -I
```
* On another computer open terminal(Linux) or command line in Windows, I’m using Ubuntu and type;
```
ssh pi@<YOUR Raspberry Pi IP ADDRESS>
```
* It will prompt you for your password. NOTE: the default password for the user pi is raspberry, you can now change this.
* Now install VNC Server on the Raspberry pi open Terminal, and type:
```
sudo apt-get install tightvncserver
```
* To start VNC Server, type:
```
Tightvncserver
```
* You’ll be asked to set a password to access the pi. You’ll need this when you try to access the pi from another computer.
* To run VNCServer at Startup
* You will normally want the VNC Server to run automatically after the Raspberry Pi reboots, open a terminal and type:
```
cd /home/pi
cd .config
mkdir autostart
cd autostart
```
* Create a new autostart file for TightVNC by typing the following:
```
sudo leafpad tightvnc.desktop
```
* This will open the default text editor (leafpad) with a blank file called tightvnc.desktop Edit the contents of the file with the following text:
```
[Desktop Entry]
Type=Application
Name=TightVNC
Exec=vncserver :1
StartupNotify=false
```

* Connecting to Raspberry Pi via VNC
* On another PC open Remina (or other VNC Client)
```
server address is IP-Address-of-Your-pi:1 (note :1 which defines display 1)
```
* Username is pi
* Password is: whatever you set for Tightvnc

* You should now have a VNC connection to your pi.
* This is all fine if you want to run the pi headless and administer it remotely but, if like me you want to run a pi with a monitor attached as a display sign for example then you will need to be able to display the same monitor output on both HDMI and VNC. Remember from above the pi was displaying session :0 and VNC displayed session :1
* To achieve this I used X11VNC rather than TightVNC

* Install X11VNC open a Terminal and type:
```
sudo apt-get install x11vnc
x11vnc -storepasswd
```

* As with TighVNC before we need to set X11VNC to autostart in a terminal type:
```
cd /home/pi
cd .config
mkdir autostart [You can miss this step if you’ve already created the directory]
cd autostart
sudo leafpad x11vnc.desktop
```

* Type the following text into the x11vnc.desktop file:
```
[Desktop Entry]
Encoding=UTF-8
Type=Application
Name=X11VNC
Comment=
Exec=x11vnc -forever -usepw -display :0 -ultrafilexfer
StartupNotify=false
Terminal=false
Hidden=false
```
>Note: If you created an autostart file for TightVNC as above, then remember to either remove this file from the autostart directory or delete it, otherwise when you reboot your pi it will try and start both TightVNC and X11VNC.
You should now be able to connect to your Raspberry pi using your VNC client with the IP address of your pi (without the :1) and it should display the same output as the Rasperry pi HDMI monitor.
