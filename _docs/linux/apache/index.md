**In case of using Apache2 with shib2 module and htpasswd add the following line to the VHOST otherwise the htpasswd authentication won't work:**
```
ShibCompatValidUser On
```
---
title: Apache - Headers
category: Linux
---
**Custom security headers, might be added to a VHOST:**
```
<IfModule mod_headers.c>
  Header set X-Content-Type-Options nosniff
  Header always set x-xss-protection "1; mode=block"
  Header always set x-frame-options "SAMEORIGIN"
  Header set Content-Security-Policy "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.jsdelivr.net *.facebook.net *.fontawesome.com *.pingdom.net ajax.googleapis.com *.google-analytics.com;"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubdomains;"
  Header edit Set-Cookie ^(.*)$ $1;HttpOnly;Secure
</IfModule>
```
---
title: Apache - Htpasswd
category: Linux
---
**Ignore IP and prompt for htpasswd for others:**
```
<Directory /var/www/admin>
        Order deny,allow
        Allow from 1.1.1.1
        Deny from all
        AuthType Basic
        AuthUserFile /etc/apache2/pass.htpasswd
        AuthName "Auth"
        require valid-user
        Satisfy Any
</Directory>
```
---
title: Apache - Modspeed
category: Linux
---
**Procedure to install Google's modspeed:**
```
wget https://dl-ssl.google.com/dl/linux/direct/mod-pagespeed-stable_current_amd64.deb
sudo dpkg -i mod-pagespeed-*.deb
service apache2 restart
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
```

***
**Sources:**
* https://askubuntu.com/questions/599112/google-chrome-ppa-upgrade-invalid-signature
* https://www.digitalocean.com/community/tutorials/how-to-get-started-with-mod_pagespeed-with-apache-on-an-ubuntu-and-debian-cloud-server
---
title: Apache - Redirect Proxy
category: Linux
---
**Example of redirect HTTP to HTTPS and regular reverse proxy:**
```
<VirtualHost x.x.x.x:80 [x:x:x:x::x]:80>
        ServerAdmin x@x.x
        ServerName x.x.x
        ServerAlias xx.x.x
        LogLevel warn
        CustomLog /var/log/apache2/access.log combined
        CustomLog "|/usr/bin/logger -t apache -p local6.info" combined
        ErrorLog "|$tee -a /var/log/apache2/error_log |/usr/bin/logger -t apache -p local6.info"
        Redirect permanent / https://x.x.x/
</VirtualHost>

<VirtualHost x.x.x.x:443 [x:x:x:x::x]:443>
        ServerAdmin x@x.x
        ServerName x.x.x
        ServerAlias xx.x.x
        LogLevel warn
        CustomLog /var/log/apache2/access.log combined
        CustomLog "|/usr/bin/logger -t apache -p local6.info" combined
        ErrorLog "|$tee -a /var/log/apache2/error_log |/usr/bin/logger -t apache -p local6.info"
        ProxyRequests Off
        <Proxy *>
                Order deny,allow
                Allow from all
        </Proxy>
        ProxyPass / http://x.x.x.x:9191/
        ProxyPassReverse / http://x.x.x.x:9191/
        ServerSignature On
        SSLEngine on
        SSLCertificateFile    /etc/apache2/ssl/x.crt
        SSLCertificateKeyFile /etc/apache2/ssl/x.key
        SSLCertificateChainFile /etc/apache2/ssl/sf_bundle-g2-g1.crt
</VirtualHost>
```

**In case of invalid cert ie. self-signed at target add the following lines to 443 VHOST:**
```
SSLProxyVerify none
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
SSLProxyCheckPeerExpire off
SSLProxyEngine On
```

**In case you need to preserve the original host address ie. SAML, Shibboleth, etc.:**
```
UseCanonicalName On
ProxyPreserveHost On
```
---
title: Apache - Syslog
category: Linux
---

**Unless directly specified the file /etc/apache2/conf-enabled/other-vhosts-access-log.conf can host global log settings:**
```
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" %v" combined_custom
CustomLog /var/log/apache2/access.log combined_custom
CustomLog "|/usr/bin/logger -t apache -p local6.info" combined_custom
ErrorLog "|$tee -a /var/log/apache2/error_log |/usr/bin/logger -t apache -p local6.info"
```

>Saves separate files and combine access and error logs on /var/log/syslog facility local6  
>The first pipe is code for Apache to fork a new command, but it's probably not forking a whole new shell, which would allow you to use a new pipe, but instead exec'ing the command, so everything is treated as a command argument, including the new pipe etc. You can likely go around it by wrapping it into a shell, using two methods, one is explicitly:  
>ErrorLog "|/bin/sh -c 'tee ... | logger ...'"  
>And the other is implicitly, using the prefix keyword |$:  
>ErrorLog "|$tee ... | logger ..."  
>The root cause is a change in Apache 2.4, cf. http://httpd.apache.org/docs/2.4/upgrading.html:  
>On Unix platforms, piped logging commands configured using either ErrorLog or CustomLog were invoked using /bin/sh -c in 2.2 and earlier. In 2.4 and later, piped logging commands are executed directly. To restore the old behaviour, see the piped logging documentation.

***
**Sources:**
* https://serverfault.com/questions/699122/apache-errorlog-piping-fail
