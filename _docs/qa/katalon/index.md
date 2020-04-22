---
title: KATALON
permalink: /docs/qa/katalon/
---
---
title: Katalon - Headless Ubuntu
category: Test
---

**Install required packages:**
```
sudo apt-get install xvfb firefox openjdk-8-jre
```

**Edit /etc/systemd/system/xvfb.service:**
```
[Unit]
Description=Xvfb service
[Service]
ExecStart=/usr/bin/Xvfb :1 -screen 0 1280x1024x24 -ac +extension GLX +render -noreset
[Install]
WantedBy=multi-user.target
```

**Start now and also make sure it starts on boot:**
```
systemctl daemon-reload
systemctl start xvfb
systemctl enable xvfb
```

**Run it starting from ./katalon folder:**
```
export DISPLAY=":1" && ./katalon -noSplash  -runMode=console -consoleLog -projectPath="/x/moodle_shib_login/moodle_shib_login.prj" -retry=0 -testSuitePath="Test Suites/Moodle Suite" -executionProfile="default" -browserType="Firefox (headless)" 2>/dev/null | grep '\[PASSED\]'
```
