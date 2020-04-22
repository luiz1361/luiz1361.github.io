---
title: RUNDECK
permalink: /docs/automation/rundeck/
---
---
title: Rundeck - Dev.aclpolicy.md
category: Automation
---

```
by:
  group: dev
for:
  resource:
    - allow: [read]
  job:
    - allow: [run,read]
description: Developer role
```
---
title: Rundeck - apache_mod_rewrite.md
category: Automation
---

**Given an Apache VHOST configuration file x.config.changed containing the following extra block:**
```
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{REMOTE_ADDR} !^200.200.200.200
RewriteCond %{REMOTE_ADDR} !^192.168.1.
RewriteRule .* http://maintenance.x.x [R=302,L]
Header Set Cache-Control "max-age=0, no-store"
</IfModule>
```

**The script below would add the a subnet 192.168.1 and an opitional IP to be excluded from the rewrite rule forwarding requests to a maintenance page:**
```
#!/bin/bash

#Clean-up
sed -i '/RewriteCond/d' x.conf.changed

if [ -n "$1" ];then
INPUT="$(echo $1 | sed s/^/\!\^/g | sed s/\\./\\\\./g)"
sed -i '/RewriteEngine/a RewriteCond %{REMOTE_ADDR} !^192\.168\.1\.' x.conf.changed
sed -i '/RewriteEngine/a RewriteCond %{REMOTE_ADDR} '$INPUT'' x.conf.changed
else
sed -i '/RewriteEngine/a RewriteCond %{REMOTE_ADDR} !^192\.168\.1\.' x.conf.changed
fi

cp /x/x.conf.changed /etc/apache2/sites-available/x.conf

apache2ctl -k graceful
```

>To revert it is just replace files as x.conf.changed and x.conf.original
---
title: Rundeck - jaas-activedirectory.conf.md
category: Automation
---

```
activedirectory {
com.dtolabs.rundeck.jetty.jaas.JettyCachingLdapLoginModule required
debug="true"
contextFactory="com.sun.jndi.ldap.LdapCtxFactory"
providerUrl="ldap://x.x.x:389"
bindDn="x@x.x"
bindPassword="x"
authenticationMethod="simple"
forceBindingLogin="true"
userBaseDn="dc=x,dc=x"
userRdnAttribute="userPrincipalName"
userIdAttribute="userPrincipalName"
userPasswordAttribute="unicodePwd"
userObjectClass="user"
roleBaseDn="dc=x,dc=x"
roleNameAttribute="cn"
roleMemberAttribute="member"
roleObjectClass="group"
cacheDurationMillis="0"
reportStatistics="true";
};
```
---
title: Rundeck - rundeck-profile.md
category: Automation
---

```
prog="rundeckd"
[ -e /etc/sysconfig/$prog ] && . /etc/sysconfig/$prog
[ -e /etc/default/$prog ] && . /etc/default/$prog
RDECK_INSTALL="${RDECK_INSTALL:-/var/lib/rundeck}"
RDECK_BASE="${RDECK_BASE:-/var/lib/rundeck}"
RDECK_CONFIG="${RDECK_CONFIG:-/etc/rundeck}"
RDECK_CONFIG_FILE="${RDECK_CONFIG_FILE:-$RDECK_CONFIG/rundeck-config.properties}"
RDECK_SERVER_BASE="${RDECK_SERVER_BASE:-$RDECK_BASE}"
RDECK_SERVER_CONFIG="${RDECK_SERVER_CONFIG:-$RDECK_CONFIG}"
RDECK_SERVER_DATA="${RDECK_SERVER_DATA:-$RDECK_BASE/data}"
RDECK_PROJECTS="${RDECK_PROJECTS:-$RDECK_BASE/projects}"
RUNDECK_TEMPDIR="${RUNDECK_TEMPDIR:-/tmp/rundeck}"
RUNDECK_WORKDIR="${RUNDECK_TEMPDIR:-$RDECK_BASE/work}"
RUNDECK_LOGDIR="${RUNDECK_LOGDIR:-$RDECK_BASE/logs}"
RDECK_JVM_SETTINGS="${RDECK_JVM_SETTINGS:- -Xmx768m -Xms256m -XX:MaxMetaspaceSize=256m -server}"
RDECK_TRUSTSTORE_FILE="${RDECK_TRUSTSTORE_FILE:-$RDECK_CONFIG/ssl/truststore}"
RDECK_TRUSTSTORE_TYPE="${RDECK_TRUSTSTORE_TYPE:-jks}"
JAAS_LOGIN="${JAAS_LOGIN:-true}"
JAAS_CONF="${JAAS_CONF:-$RDECK_CONFIG/jaas-loginmodule.conf}"
LOGIN_MODULE="${LOGIN_MODULE:-RDpropertyfilelogin}"
RDECK_HTTP_PORT=${RDECK_HTTP_PORT:-4440}
RDECK_HTTPS_PORT=${RDECK_HTTPS_PORT:-4443}
if [ -z "$JAVA_CMD" ] && [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ] ; then
  JAVA_CMD=$JAVA_HOME/bin/java
  PATH=$PATH:$JAVA_HOME/bin
  export JAVA_HOME
elif [ -z "$JAVA_CMD" ] ; then
  JAVA_CMD=java
fi
for jar in $(find $RDECK_INSTALL/cli -name '*.jar') ; do
  CLI_CP=${CLI_CP:+$CLI_CP:}$jar
done
for war in $(find $RDECK_INSTALL/bootstrap -name '*.war') ; do
  EXECUTABLE_WAR=$war
done
RDECK_JVM="-Drundeck.jaaslogin=$JAAS_LOGIN \
           -Djava.security.auth.login.config=/etc/rundeck/jaas-activedirectory.conf \
           -Dloginmodule.name=activedirectory \
           -Drdeck.config=$RDECK_CONFIG \
           -Drundeck.server.configDir=$RDECK_SERVER_CONFIG \
           -Dserver.datastore.path=$RDECK_SERVER_DATA/rundeck \
           -Drundeck.server.serverDir=$RDECK_INSTALL \
           -Drdeck.projects=$RDECK_PROJECTS \
           -Drdeck.runlogs=$RUNDECK_LOGDIR \
           -Drundeck.config.location=$RDECK_CONFIG_FILE \
           -Djava.io.tmpdir=$RUNDECK_TEMPDIR \
           -Drundeck.server.workDir=$RUNDECK_WORKDIR \
           -Dserver.http.port=$RDECK_HTTP_PORT \
           -Drdeck.base=$RDECK_BASE"
RDECK_JVM="$RDECK_JVM $RDECK_JVM_SETTINGS"
if [ -n "$RUNDECK_WITH_SSL" ] ; then
  RDECK_SSL_OPTS="${RDECK_SSL_OPTS:- -Djavax.net.ssl.trustStore=$RDECK_TRUSTSTORE_FILE -Djavax.net.ssl.trustStoreType=$RDECK_TRUSTSTORE_TYPE -Djava.protocol.handler.pkgs=com.sun.net.ssl.internal.www.protocol}"
  RDECK_JVM="$RDECK_JVM -Drundeck.ssl.config=$RDECK_SERVER_CONFIG/ssl/ssl.properties -Dserver.https.port=${RDECK_HTTPS_PORT} ${RDECK_SSL_OPTS}"
fi
unset JRE_HOME
umask 002
rundeckd="$JAVA_CMD $RDECK_JVM $RDECK_JVM_OPTS -jar $EXECUTABLE_WAR --skipinstall"
```
---
title: Rundeck - project.properties.md
category: Automation
---

```
#Project X configuration, generated
#Sun Jan 06 17:09:04 GMT 2019
resources.source.3.type=file
project.jobs.gui.groupExpandLevel=1
resources.source.2.config.includeServerNode=false
project.ssh-authentication=privateKey
resources.source.3.config.generateFileAutomatically=true
resources.source.3.config.includeServerNode=false
service.FileCopier.default.provider=jsch-scp
project.nodeCache.delay=30
project.nodeCache.enabled=true
resources.source.2.config.generateFileAutomatically=false
project.disable.executions=false
project.ssh-command-timeout=0
resources.source.2.config.writeable=false
project.ssh-keypath=/var/lib/rundeck/.ssh/id_rsa
service.NodeExecutor.default.provider=jsch-ssh
resources.source.2.config.format=resourcexml
resources.source.2.config.file=/var/rundeck/projects/x/etc/resources.xml
project.name=x
resources.source.3.config.format=resourcexml
project.disable.schedule=false
project.ssh-connect-timeout=0
resources.source.2.config.requireFileExists=false
resources.source.3.config.file=/var/rundeck/projects/x/etc/resources.xml
resources.source.1.config.directory=/var/rundeck/projects/x/etc
resources.source.1.type=directory
resources.source.3.config.writeable=false
resources.source.3.config.requireFileExists=false
project.nodeCache.firstLoadSynch=true
resources.source.2.type=file
```
---
title: Rundeck - Readme.md
category: Automation
---

**/etc/rundeck/jaas-activedirectory.conf:**
* providerUrl: IP Address Or FQDN of your Domain Controller
* bindDn: LDAP Bind User Distinguished Name
* bindPassword: Password of the LDAP Bind User
* userBaseDn: Distinguished name to use as a search base for finding users.
* roleBaseDn: OU where the rundeck security groups are.

>Make sure permissions are as follows for new files chown rundeck:rundeck ... && chmod 640 ...

**The /etc/rundeck/profile file needs to be altered to activate the module activedirectory and to informthe location of the jaas configuration file**

**Defining rundeckadmins AD group permissions /etc/rundeck/rundeckadmins.aclpolicy**

**Defining runusersadmins AD group permissions /etc/rundeck/rundeckusers.aclpolicy**

**Nearly sure this is not required /var/rundeck/projects/x/acls/Dev.aclpolicy**

**Defines project settings /var/rundeck/projects/x/etc/project.properties**

**Defines resources for project as nodes /var/rundeck/projects/x/etc/resources.xml**

***
**Sources:**
* http://yallalabs.com/devops/howto-integrate-rundeck-active-directory-authentication/
---
title: Rundeck - resources.xml.md
category: Automation
---

```
<?xml version="1.0" encoding="UTF-8"?>

<project>
  <node name="x.x.x.x" description="x" tags="" hostname="x.x.x.x" osArch="amd64" osFamily="unix" osName="Linux" osVersion="4.15.0-39-generic" username="x"/>
  <node name="y.y.y.y" description="y" tags="" hostname="y.y.y.y" osArch="amd64" osFamily="unix" osName="Linux" osVersion="4.15.0-39-generic" username="x"/>
</project>
```
---
title: Rundeck - rundeckadmins.aclpolicy.md
category: Automation
---

```
description: Admin, all access.
context:
  project: '.*' # all projects
for:
  resource:
    - allow: '*' # allow read/create all kinds
  adhoc:
    - allow: '*' # allow read/running/killing adhoc jobs
  job:
    - allow: '*' # allow read/write/delete/run/kill of all jobs
  node:
    - allow: '*' # allow read/run for all nodes
by:
  group: rundeckadmins

---

description: Admin, all access.
context:
  application: 'rundeck'
for:
  resource:
    - allow: '*' # allow create of projects
  project:
    - allow: '*' # allow view/admin of all projects
  project_acl:
    - allow: '*' # allow admin of all project-level ACL policies
  storage:
    - allow: '*' # allow read/create/update/delete for all /keys/* storage content
by:
  group: rundeckadmins
```
---
title: Rundeck - rundeckusers.aclpolicy.md
category: Automation
---

```
description: Dev, all access.
context:
  project: '.*' # all projects
for:
  resource:
    - allow: [read] # allow read/create all kinds
  job:
    - allow: [read,run] # allow read/write/delete/run/kill of all jobs
  node:
    - allow: [read,run] # allow read/run for all nodes

by:
  group: rundeckusers

---

description: Dev, all access.
context:
  application: 'rundeck'
for:
  resource:
    - allow: [read] # allow create of projects
  project:
    - allow: [read] # allow view/admin of all projects
  storage:
    - allow: [read] # allow read/create/update/delete for all /keys/* storage content
by:
  group: rundeckusers
```
