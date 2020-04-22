---
title: API
permalink: /docs/devnet/api/
---
---
title: API - Netconf,restconf,grpc
category: DevNet
---

* YANG: Data Modeling Language like MIB for SNMP but human readable
* NETCONF: XML older SSH+TCP, Transaction (all or nothing, all at once), confirmation of result(SNMP need to set and get to confirm)
* RESTCONF: JSON newer HTTPS, can use Postman.
* gRPC: Google's version, same transport protocol inside Google. Streaming telemetry, send information as soon as it is available.

>Use pyang -f to read .yang files
