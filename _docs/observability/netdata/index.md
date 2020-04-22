---
title: NETDATA
permalink: /docs/observability/netdata/
---
---
title: Netdata - Bind Named
category: Observability
---

```
sudo cat > /etc/netdata/node.d/named.conf << EOL
{
    "enable_autodetect": true,
    "update_every": 1,
    "servers": [
        {
            "name": "local",
            "url": "http://localhost:8888/xml/v3/server",
            "update_every": 1
        }
    ]
}

/etc/bind/named.conf.options
statistics-channels {
        inet 127.0.0.1 port 8888 allow { 127.0.0.1; };
        inet ::1 port 8888 allow { ::1; };
};
EOL
sudo /etc/init.d/bind9 restart
sudo apt install nodejs-legacy
sudo service netdata restart
```
