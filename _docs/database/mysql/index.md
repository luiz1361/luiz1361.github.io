**Copy one DB to another DB with another name same instance:**
```bash
mysqldump db | mysql new_db
```

**Dump schema only to file:**
```
mysqldump -d -u user -p db
```

**Dump database to file:**
```
mysqldump db > dump.sql
```

**Dump all databases to file:**
```
/usr/bin/mysqldump -u user -pxxx --all-databases -r /var/backups/dumpall.sql
```

**Dump nicely backup database without causing lock:**
```bash
nice -n 10 ionice -c2 -n 7 mysqldump --all-databases -u user -pxxx--single-transaction --quick --lock-tables=false 2>/dev/null | nice bzip2 -c >/var/backups/dumpall.mysql.bz2
```

**Restore DB from file:**
```
mysql -u user -pxxx db < dump.sql
```
---
title: MySQL - Operation
category: Database
---

Create database:
```sql
CREATE DATABASE db;
```

**Drop database:**
```
DROP DATABASE db;
```

**Select table and export to CSV file:**
```sql
select * from table where id in (78,
80,
81,
152,
837) into outfile '/var/lib/mysql-files/output.csv' fields terminated by ',' enclosed by '"' lines terminated by '\n';
```

**Create a table:**
```
CREATE TABLE table
(
id int(11),
name varchar(80)
);
```

**Insert table:**
```
INSERT INTO tutorials_tbl
(tutorial_title, tutorial_author, submission_date)
VALUES
("JAVA Tutorial", "Sanjay", '2007-05-06'),
("JAVA Tutorial", "Sanjay", '2007-05-06');
```

**Modify table:**
```
ALTER TABLE contacts ADD email VARCHAR(60);
ALTER TABLE contacts ADD email VARCHAR(60) AFTER name;
ALTER TABLE contacts ADD email VARCHAR(60) FIRST;
ALTER TABLE position ADD PRIMARY KEY (staffid);
```

**Update table:**
```
UPDATE hs_hr_users SET user_password='xxx' WHERE id=USR001;
```

**Delete a table:**
```
DELETE FROM table where id = '1';
```
---
title: MySQL - Process Management
category: Database
---

**Monitor queries:**
```
sudo apt-get install mytop
mytop -u user -ppassword
```

**Monitor queries another way:**
```
SHOW FULL PROCESSLIST;
```

**Check database size:**
```
SELECT table_schema "Data Base Name", SUM( data_length + index_length) / 1024 / 1024 "Data Base Size in MB" FROM information_schema.TABLES GROUP BY table_schema ;
```

**Process management:**
```
Mysql> Kill (id);
mysqladmin -u debian-sys-maint processlist -p
```
---
title: MySQL - User Management
category: Database
---

**Create user:**
```
CREATE USER 'user'@'localhost' IDENTIFIED BY 'xxx';
CREATE USER 'user2'@'%' IDENTIFIED BY 'xxx';
```

**Set grant for user:**
```
GRANT ALL PRIVILEGES ON db.* TO 'user'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'user2'@'%';
```

**Set password for user:**
```
SET PASSWORD FOR 'user'@'localhost' = PASSWORD('xxx');
```

**Show permissions:**
```
SHOW GRANTS FOR 'root'@'localhost';
```

**Show all users:**
```
select user,host from mysql.user
```

**Revoke all privileges on database level:**
```
REVOKE ALL PRIVILEGES ON db.* FROM 'user'@'localhost';
```

**Drop user:**
```
DROP USER 'user'@'localhost';
```
