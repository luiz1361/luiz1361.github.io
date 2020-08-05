**Dump database:**
```
pg_dump db > dump.sql
```

**Dump all DBs and compress in GZIP with nice:**
```
su postgres -c /usr/bin/pg_dumpall | nice -n15 gzip -c --fast > /var/backups/dumpall.sql.gz
```

**Dump server and restore on server2 at the same time:**
```
pg_dump -C -h server -U user db | psql server2 -U user db
```

**Dump DB from server to local file:**
```
pg_dump -C -h server -U username db > /root/dump.sql
```

**Dump single table from db and restore on database db2:**
```
pg_dump -t table db | psql db2
```

**Dump single table:**
```
pg_dump db -t table > /root/dump.sql
```

**Restore dump from file:**
```
psql -h server -U user db < dump.sql
```

**Restore single table:**
```
psql db < /root/dump.sql
```
---
title: PostgreSQL - Logging
category: Database
---

**Modify /etc/postgresql/9.5/main/postgresql.conf:**
```
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql.log'
log_line_prefix = '[%m] – %p %q- %u@%h:%d – %a '
log_statement = 'all'
```

**Modify /etc/logrotate.d/postgresql-common:**
```
/var/lib/postgresql/9.5/main/pg_log/*.log {
       daily
       rotate 10
       copytruncate
       delaycompress
       compress
       notifempty
       missingok
       su root root
}
```
---
title: PostgreSQL - Operation
category: Database
---

**Operation commands:**
```
* \q quit
* \l list databases
* \du list users
* \dt list tables
* \d+ tablename - describe table
* \z - To view the grant table, use the following command:
```

**Select and export to CSV:**
```
COPY (SELECT * FROM mdl_user WHERE idnumber = '') TO '/tmp/test.csv' WITH CSV;
```

**Create DB setting its owner:**
```
createdb database -O owner
```

**Create database:**
```
CREATE DATABASE jerry;
```

**Delete database:**
```
dropdb database
```

**Rename sequence:**
```
ALTER SEQUENCE id_seq_player RENAME TO player_id_seq;
```

**Copy table:**
```
select * into newtable from oldtable
```

**Select number of rows for a large table quick:**
```
SELECT reltuples AS approximate_row_count FROM pg_class WHERE relname = 'file';
```

**Select number of rows for a large table slow:**
```
select (*) from file;
```

**Select table:**
```
SELECT * from users where userid = '111';
```

**Select table less or equal:**
```
select * from mdl_user where lastaccess <= '1437840728';
```

**Count table rows:**
```
SELECT COUNT(*) from mdl_user WHERE suspended = '1';
```

**Set unsalted MD5 hash:**
```
UPDATE users SET password = 'xxx' WHERE userid = '1111111';
```

**Update table:**
```
UPDATE mdl_user SET suspended = '0' WHERE idnumber = ('111','222','333');
```

**Update table less or equal:**
```
update mdl_user set password='unsaltedhash' where lastaccess <= '1437840728';
```

**Truncate table:**
```
TRUNCATE ONLY mdl_user;
```

***
**Sources:**
* https://stackoverflow.com/questions/36361860/change-sequence-name-in-postgresql
* https://stackoverflow.com/questions/6601978/completely-copying-a-postgres-table-with-sql
* https://www.heatware.net/databases/postgres-tables-auto-vacuum-analyze/
---
title: PostgreSQL - Process Management
category: Database
---

**Check last vacuum:**
```
select relname,last_vacuum, last_autovacuum, last_analyze, last_autoanalyze from pg_stat_user_tables;
```

**Check running queries:**
```
SELECT * from pg_stat_activity
```

**Check size of database:**
```
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;
```

**Check size of tables:**
```
SELECT
    table_name,
    pg_size_pretty(table_size) AS table_size,
    pg_size_pretty(indexes_size) AS indexes_size,
    pg_size_pretty(total_size) AS total_size
FROM (
    SELECT
        table_name,
        pg_table_size(table_name) AS table_size,
        pg_indexes_size(table_name) AS indexes_size,
        pg_total_relation_size(table_name) AS total_size
    FROM (
        SELECT ('"' || table_schema || '"."' || table_name || '"') AS table_name
        FROM information_schema.tables
    ) AS all_tables
    ORDER BY total_size DESC
) AS pretty_sizes;
```
---
title: PostgreSQL - User Management
category: Database
---

**Connect to database with specific user:**
```
psql -d db -U user
psql -h host -d db -U user -W
```

**Create user and do not prompt for password:**
```
CREATE USER user WITH PASSWORD 'password';
```

**Create user and prompt for its password:**
```
createuser user -P
```

**Delete user:**
```
dropuser user
```

**Grant privileges:**
```
GRANT ALL PRIVILEGES ON TABLE table TO user;
GRANT ALL PRIVILEGES ON TABLE table_id_seq TO user;
GRANT ALL PRIVILEGES ON DATABASE db to user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user;
```

**If cannot be dropped because some objects depend on it:**
```
REASSIGN OWNED BY user TO postgres;
ALTER TABLE transaction_information OWNER TO postgres;
ALTER SEQUENCE transaction_information_id_seq OWNER TO postgres;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM user;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM user;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM user;
REVOKE USAGE ON SCHEMA public FROM user;
DROP USER user;
```

**Change user password:**
```
alter user user with password 'password';
```
