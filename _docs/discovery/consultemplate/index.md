---
title: CONSULTEMPLATE
permalink: /docs/discovery/consultemplate/
---
---
title: Consultemplate - Random
category: Discovery
---

**Example of consul template using Consul:**
```
./consul-template -template "find_address.tpl:hashicorp_address.txt"
```

**find_address.tpl:**
```
{% raw %}{{ key "/hashicorp/street_address" }}{% endraw %}
```

**Example of consul template using Vault:**
```
{% raw %}{{ with secret "secret/data/base_test" }}
Password: {{ .Data.data.a }}{{ end }}{% endraw %}
```
