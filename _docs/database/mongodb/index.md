---
title: MONGODB
permalink: /docs/database/mongodb/
---
---
title: MongoDB - Dump Restore
category: Database
---

**Dump DB from mLAB:**
```
mongodump -h x.mlab.com:15799 -u mongo-admin -p root --authenticationDatabase admin -d db -o /x/dumps
```

**Dump DB from Docker host:**
```
mongodump -h 127.0.0.1:27017 -u root -p x --authenticationDatabase admin -d db -o dump/
```

**Restore locally no auth:**
```
mongorestore --db db /root/dumps/db/
```

**Restore locally with auth:**
```
mongorestore --username root --password 'x' --authenticationDatabase admin --db db /x/dumps/db/
```

**Restore in mLAB:**
```
mongorestore -h x.mlab.com:15799 -u mongo-admin -p root --authenticationDatabase admin -d db /x/dumps
```

**Restore productions in staging:**
```
rm -R /var/lib/docker/volumes/x/_data/dump/x/
cp -R /var/lib/docker/volumes/xxx/_data/dump/x /var/lib/docker/volumes/x/_data/dump/x/
mongorestore --drop --username root --password 'x' --authenticationDatabase admin --db db /data/db/dump/x/
```

**Dump DB from container:**
```
45 */1 * * * root /usr/bin/docker exec x sh -c "mongodump -h 127.0.0.1:27017 -u root -p x --authenticationDatabase admin -d x -o /x/x/x/" > /dev/null 2>&1
```

**Dump collection as JSON from container:**
```
45 */1 * * * root /usr/bin/docker exec x sh -c "mongoexport -h 127.0.0.1:27017 -u root -p x -c x --authenticationDatabase admin -d x -o /x/x/x/x.json" > /dev/null 2>&1
```

**Restore DB from container:**
```
5 0 * * 0 root /usr/bin/docker exec x sh -c "mongorestore -h 127.0.0.1:27017 --drop --username root --password 'x' --authenticationDatabase admin --db x /x/db/dump/x/" > /dev/null 2>&1
```
---
title: MongoDB - Operation
category: Database
---

**Connecting locally:**
```
mongo
```

**Show databases:**
```
show databases
```

**Connect to admin database and authenticate against it:**
```
use admin
db.auth( "root", "xxx")
```

**Activating database authentication, edit ```/etc/mongodb.conf``` and change:**
```
auth = true
```

**Show all collections:**
```
show collections;
```

**Dropping a DB:**
```
use db
db.dropDatabase()
```

**Select all from collection test:**
```
db.test.find()
```

**Select id from collection:**
```
db.test.find( { _id: ObjectId("xxx") } )
```

**Update date based on oid:**
```
db.test.update( { _id: ObjectId("5bd07c89f9e2690020069a78") }, { $set : { "date" : new ISODate("2018-09-29T14:00:00.000Z") } });
```

**Prepare bulk update modifying date variable based on diff between nightly backup and most dump in json format:**
```
grep -A 2000000 xxx dump.json | awk -F ',' '{ print $1 " " $2 }' | sed s/'{"_id":{"$oid":"'//g | sed s/'"date":{"$date":"'//g | sed s/'"}'//g | sed s/T19:/T20:/g | sed s/T18:/T19:/g | sed s/T17:/T18:/g | sed s/T15:/T16:/g | sed s/T14:/T15:/g | sed s/T13:/T14:/g | sed s/T12:/T13:/g | sed s/T11:/T12:/g | sed s/T10:/T11:/g | sed s/T09:/T10:/g | sed s/T08:/T09:/g | awk -F " " '{ print "db.test.update( { _id: ObjectId(\""$1"\") }, { $set : { \"date\" : new ISODate(\""$2"\") } });"}' > /root/dump_mod
```

***
**Sources:**
* https://docs.mongodb.com/manual/reference/method/db.collection.find/
* https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac
