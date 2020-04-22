---
title: CONSUL
permalink: /docs/discovery/consul/
---
---
title: Consul - Random
category: Discovery
---

**Ports:**
```
API/UI: 8500
```

**Enviroment variables:**
```
export CONSUL_HTTP_TOKEN=<your_token_here>
```

**Runnning on client mode:**
```
exec consul agent -config-dir /etc/consul.d/client
```

**Example client config:**
```
{
    "server": false,
    "datacenter": "eu-west-1",
    "data_dir": "/var/consul",
    "ui_dir": "/home/consul/dist",
    "log_level": "INFO",
    "enable_syslog": true,
    "start_join": ["10.20.1.149"]
}
```

**Example service check:**
```
{
  "services": [{
    "name": "ruby",
    "checks": [{
      "id": "web-ping",
      "http": "http://127.0.0.1",
      "interval": "15s"
    }]
  }]
}
```
