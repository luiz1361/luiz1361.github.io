---
title: API
permalink: /docs/dev/api/
---
---
title: API - atg.sh
category: Dev
---

```
#!/bin/bash

# Retrieve Token from application
token=$(curl --silent --location --request POST "https://x.x.x/api/v1/auth/login" \
  --header "Content-Type: application/json" \
  --data "{
        \"email\" : \"x@x.x\",
        \"password\" : \"x\"
}" | jq .token | sed s/\"//g)

# Using token request some data
curl --silent --location --request GET "https://x.x.x/api/v1/reports/x" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $token " | jq
```
---
title: API - Cloudflare
category: Dev
---

```
#!/bin/bash

# Get the list of records and export results to file called records. ie. Postman
# Run Grep on records file exporting as records_id:
# grep '"id":\|"name":' records  | grep -B1 \"....x.x.x | grep -v '\-\-' | sed s/" "//g | sed s/,//g  | grep id | sed s/\"id\"\:\"//g  | sed s/\"//g > records_id
# The iteration below deletes all records found in records_id:

while read p; do
    curl -X DELETE "https://api.cloudflare.com/client/v4/zones/x/dns_records/$p" \
        -H "X-Auth-Email: x@x.x" \
        -H "X-Auth-Key: x" \
        -H "Content-Type: application/json" &
done <page2_idw
```
---
title: API - Cylance
category: Dev
---

```
sudo apt-get install build-essential libssl-dev libffi-dev python-dev virtualenv
virtualenv cylance_api && cd cylance_api
source ./bin/activate
pip install jwt
pip install PyJWT==1.5.3
pip install requests
pip install uuid
pip install datetime
pip install pandas
```

```
cat <<EOF >jwt.cy
import jwt # PyJWT version 1.5.3 as of the time of authoring.
import uuid
import requests # requests version 2.18.4 as of the time of authoring.
import json
from datetime import datetime, timedelta
# 30 minutes from now
timeout = 1800
now = datetime.utcnow()
timeout_datetime = now + timedelta(seconds=timeout)
epoch_time = int((now - datetime(1970, 1, 1)).total_seconds())
epoch_timeout = int((timeout_datetime - datetime(1970, 1, 1)).total_seconds())
jti_val = str(uuid.uuid4())
tid_val = "e9154fcc-ac30-48d6-a617-79e2f8589d1a" # The tenant's unique identifier.
app_id = "091975be-da3e-443a-9f5c-5340424cc21e" # The application's unique identifier.
app_secret = "8d0410c7-e230-4f70-8e02-756787568592" # The application's secret to sign the auth token with.
AUTH_URL = "https://protectapi-euc1.cylance.com/auth/v2/token"
claims = {
 "exp": epoch_timeout,
 "iat": epoch_time,
 "iss": "http://cylance.com",
 "sub": app_id,
 "tid": tid_val,
 "jti": jti_val
 # The following is optional and is being noted here as an example on how one can restrict
 # the list of scopes being requested
 # "scp": "policy:create, policy:list, policy:read, policy:update"
}
headers = {"Content-Type": "application/json; charset=utf-8"}
encoded = jwt.encode(claims, app_secret, algorithm='HS256', headers=headers).decode('utf-8')
print "auth_token:\n" + encoded + "\n"
payload = {"auth_token": encoded}
resp = requests.post(AUTH_URL, headers=headers, data=json.dumps(payload))
print "http_status_code: " + str(resp.status_code)
print "access_token:\n" + json.loads(resp.text)['access_token'] + "\n"
EOF
```

***
**Sources:**
* https://support.cylance.com/s/article/CylancePROTECT-User-API-Guide
---
title: API - Slack
category: Dev
---

**Post to channel:**
```
curl -X POST \
     -H "Authorization: Bearer xxx" \
     -H "Content-type: application/json; charset=utf-8" \
    --data '{"channel": "xxx", "text":"We'\''ve xxx, <@UF7BMAWCT>, xxx:\n>xxx: xxx", "username":"xxx", "icon_emoji":":xxx:"}' \
https://slack.com/api/chat.postMessage
```

**Read public channel:**
```
curl -s https://slack.com/api/channels.history\?token\=xxx\&channel\=Cxxx\&pretty\=1
```

**Read private channel:**
```
curl -s https://slack.com/api/groups.history\?token\=xxx\&channel\=Gxxx\&pretty\=1
```
