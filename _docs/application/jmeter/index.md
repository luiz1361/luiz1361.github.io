---
title: JMETER
permalink: /docs/application/jmeter/
---
---
title: JMETER
permalink: /docs/application/jmeter/
---

# ssl_issue

**Try starting JMeter as:**
```
jmeter -Djsse.enableSNIExtension=false
```
>If it helps you can make the change permanent by adding the next line to system.properties file (located in JMeter's "bin" folder)

```
jsse.enableSNIExtension=false
```
>See Apache JMeter Properties Customization Guide for more information on different JMeter properties types and ways of setting and overriding them

***
**Sources:**
* http://www.jmeter-archive.org/SSL-Authentication-in-Jmeter-td5725043.html
