# Send SMS

```bash
#!/bin/bash

NUMBERS=(111111111111 111111111111)

hostname=$1
service=$2
state=$3

function send_sms() {
        local num=$1
        local mesg=$2
        echo "sending to $num"
        echo "api_id: x
                user: x
                password: x
                From: X
                To: $num
                Text: $mesg" | mail sms@messaging.clickatell.com
}

MSG="Alert: $hostname $service $state"

for number in ${NUMBERS[@]}; do
        send_sms $number "$MSG"
done
```
