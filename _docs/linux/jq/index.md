---
title: JQ
permalink: /docs/linux/jq/
---
---
title: JQ - Random
category: Linux
---

**Output between quotes:**
```
curl -s https://api.chucknorris.io/jokes/random | jq '.value + .icon_url’
```

**Output with no quotes:**
```
curl -s https://api.chucknorris.io/jokes/random | jq -r '.value + .icon_url’
```

**Email string with id number same line based on sub-element:**
```
curl -s https://reqres.in/api/users?page=2 | jq '.data[]' | jq -r '"\(.id) \(.email)”'
```

**Same above but only for elements on id 4:**
```
curl -s https://reqres.in/api/users?page=2 | jq '.data[]' | jq 'select(.id==4)' | jq '"\(.id) \(.email)"'
```
