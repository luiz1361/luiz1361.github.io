```
#!/bin/bash

OUTPUT=`su -s /bin/bash -c 'cd /x && git checkout package-lock.json 2>&1 && git pull 2>&1' x 2>&1`;

if [[ $OUTPUT = *"origin/staging"* ]]; then
  eval $(echo $OUTPUT | mail -s "x Docker Bash Auto Git Pull" x@x.x);
  cd /x/ && docker-compose up -d --force-recreate --build;
  curl -H "Content-Type: application/json" -d "{\"title\": \"x Docker Bash Auto Git Pull\", \"text\": \"*****        *****\n\n $OUTPUT \", \"themeColor\": \"EA4300\", \"type\": \"\" }" https://x;
else
  exit;
fi
```
