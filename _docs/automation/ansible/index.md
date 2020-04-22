---
title: ANSIBLE
permalink: /docs/automation/ansible/
---
---
title: Ansible - Add Host Ubuntu
category: Automation
---

**Install pre-requisites:**
```
apt-get install ssh python
```

**Do not prompt for password when user is a member of sudo group:**
```
visudo
%sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

**Add pub-key on authorized_keys file to allow login using priv-key:**
```
useradd x
mkdir /home/x/.ssh
echo "ssh-rsa x x@x.x" > /home/x/.ssh/authorized_keys
chmod 664 /home/x/.ssh/authorized_keys
chown -R x.x /home/x/.ssh
sudo usermod -aG sudo x
```

**This is still a manual task, working on conditional rules to ignore x.x.x.x(MX Relay):**
```
/etc/postfix/main.cf:
myorigin = /etc/mailname
relayhost = x.x.x.x
```
---
title: Ansible - Add Host Windows
category: Automation
---

**Run the Powershell below on Windows nodes to enable WinRM:**
```
https://github.com/ansible/ansible/blob/devel/examples/scripts/ConfigureRemotingForAnsible.ps1
```

**Run the Powershell above on Windows nodes remotely via psexec to enable WinRM:**
```
psexec \\myserver -accepteula -nobanner -s -u DOMAIN\Administrator powershell -ExecutionPolicy Bypass -Command "iwr https://raw.githubusercontent.com/ansible/ansible/devel/examples/scripts/ConfigureRemotingForAnsible.ps1 -UseBasicParsing | iex"
```

**Configuration at server end to allow AD authentication:**
```
cat > /etc/ansible/hosts << EOF
[windows]
172.16.0.1
172.16.0.2
EOF
cat > /etc/ansible/group_vars/windows.yml << EOF
ansible_user: xxx
ansible_password: xxx
ansible_port: 5986
ansible_winrm_server_cert_validation: ignore
ansible_connection: winrm
ansible_winrm_transport: basic
EOF
```
---
title: Ansible - group_vars_servers
category: Automation
---

```
ansible_ssh_user: x
```
---
title: Ansible - group_vars_windows_ad.yml
category: Automation
---

ansible_user: x@x.x
ansible_password: x
ansible_connection: winrm
ansible_winrm_transport: kerberos
ansible_port: 5986
ansible_winrm_server_cert_validation: ignore
ansible_winrm_scheme: https
---
title: Ansible - group_vars_windows_x.yml
category: Automation
---

```
ansible_user: x
ansible_password: x
ansible_connection: winrm
ansible_port: 5986
ansible_winrm_server_cert_validation: ignore
ansible_winrm_scheme: https
```
---
title: Ansible - group_vars_windows_y.yml
category: Automation
---

```
ansible_user: x
ansible_password: x
ansible_connection: winrm
ansible_port: 5986
ansible_winrm_server_cert_validation: ignore
ansible_winrm_scheme: https
```
---
title: Ansible - Kerberos
category: Automation
---

**Install dependencies:**
```
sudo apt-get install python-dev libkrb5-dev krb5-user python3-pip
pip3 install pywinrm[kerberos]
```

**Edit ```/etc/krb5.conf```:**
```
[libdefaults]
        default_realm = X.X
[realms]
        X.X = {
                kdc = x.x.x
                kdc = y.y.y
        }
[domain_realm]
        .x.x = X.X
        x.x = X.X
```

**Get a Kerberos ticket:**
```
kinit -C x@x.x
```

**List Kerberos tickets:**
```
klist

Ticket cache: FILE:/tmp/krb5cc_0
Default principal: x@X.X

Valid starting       Expires              Service principal
06/26/2019 13:46:17  06/26/2019 23:46:17  krbtgt/X@X.X
        renew until 06/27/2019 13:46:15
```

**Removes existing Kerberos tickets:**
```
kdestroy -A
```
---
title: Ansible - Output YAML
category: Automation
---

**Edit /etc/ansible/ansible.cfg:**
```
# Use the YAML callback plugin.
stdout_callback = yaml
# Use the stdout_callback when running ad-hoc commands:
bin_ansible_callbacks = True
```

***
**Sources:**
* https://www.jeffgeerling.com/blog/2018/use-ansibles-yaml-callback-plugin-better-cli-experience
---
title: Ansible - Random Ubuntu
category: Automation
---

**Get uptime of all Ubuntu hosts:**
```
ansible -m shell -a 'uptime' ubuntu
```

**Get update status of all ubuntu hosts:**
```
ansible -m shell -a '/usr/lib/update-notifier/apt-check --human-readable' ubuntu
```

**Get upgradable packages of all ubuntu hosts:**
```
ansible -m shell -a 'sudo apt-get update | apt list --upgradable' ubuntu
```

**Grep relayhost of all ubuntu hosts:**
```
ansible -m shell -a 'cat /etc/postfix/main.cf | grep relayhost' ubuntu
```

**Check DNS servers of all ubuntu hosts:**
```
ansible -m shell -a 'cat /etc/resolv.conf' ubuntu
```

**Check password hash of user user on all ubuntu hosts:**
```
ansible -m shell -a 'cat /etc/shadow | grep user' ubuntu
```

**Get all variables from node finn:**
```
ansible -m setup finn | grep finn
```

**Run playbook on all except boo:**
```
ansible-playbook --limit 'all:!bad_host' playbook.yml
```

**Run playbook on host-ubuntu host:**
```
ansible-playbook /etc/ansible/ubuntu_pb.yml -l host-ubuntu
```

**Run only tag netdata from playbook on ns2:**
```
ansible-playbook /etc/ansible/ubuntu_pb.yml --tags=netdata -l ns2
  - name: Copying custom netdata health alarms
    tags: netdata
```
---
title: Ansible - Random Windows
category: Automation
---

**Get systeminfo of all Windows hosts:**
```ansible windows -m raw -a "systeminfo"```

**Get variables from all Windows hosts:**
```ansible windows -m setup```

**Install via chocolatey:**
```ansible x.x.x -m win_chocolatey  -a "name=winscp.install state=absent"```
---
title: Ansible - scripts_20auto-upgrades
category: Automation
---

```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Download-Upgradeable-Packages "1";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
```
---
title: Ansible - scripts_50unattended-upgraded
category: Automation
---

```
Unattended-Upgrade::Allowed-Origins {
        "${distro_id}:${distro_codename}-security";
};

Unattended-Upgrade::Package-Blacklist {
};
```
---
title: Ansible - scripts_aliases
category: Automation
---

```
abuse: x@x.x
backups: x@x.x
bacula: x@x.x
clamav: x@x.x
ftp: x@x.x
gavinmc: x@x.x
helpdesk: x@x.x
hostmaster: x@x.x
logcheck: x@x.x
mailer-daemon: x@x.x
mbenc: x@x.x
news: x@x.x
nobody: x@x.x
noc: x@x.x
otrs: x@x.x
postmaster: x@x.x
rancid-admin-routers: x@x.x
rancid-admin-switches: x@x.x
rancid-admin-firewalls: x@x.x
rancid-firewalls: x@x.x
rancid-routers: x@x.x
rancid-switches: x@x.x
root: x@x.x
security: x@x.x
usenet: x@x.x
webmaster: x@x.x
www: x@x.x
www-data: x@x.x
```
---
title: Ansible - scripts_bashrc
category: Automation
---

```
#!/bin/bash
# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# don't put duplicate lines in the history. See bash(1) for more options
# ... or force ignoredups and ignorespace
HISTCONTROL=ignoredups:ignorespace

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=100000
HISTFILESIZE=100000
HISTTIMEFORMAT='%F %T '

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "$debian_chroot" ] && [ -r /etc/debian_chroot ]; then
	debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
	xterm-color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
	if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
	# We have color support; assume it's compliant with Ecma-48
	# (ISO/IEC-6429). (Lack of such support is extremely rare, and such
	# a case would tend to support setf rather than setaf.)
	color_prompt=yes
	else
	color_prompt=
	fi
fi

if [ "$color_prompt" = yes ]; then
	PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
	PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
	PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
	;;
*)
	;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
	test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
	alias ls='ls --color=auto'
	#alias dir='dir --color=auto'
	#alias vdir='vdir --color=auto'

	alias grep='grep --color=auto'
	alias fgrep='fgrep --color=auto'
	alias egrep='egrep --color=auto'
	alias rgrep='rgrep --color=auto'
fi

# some more ls aliases
alias ll='ls -alF'
alias lh='ls -alFh'
alias la='ls -A'
alias l='ls -CF'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
	. ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
#if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
#	. /etc/bash_completion
#fi

# system
alias lskernels='dpkg --get-selections | grep linux'
alias lspackages='dpkg --get-selections'
alias swapclear='sudo swapoff -a && sudo swapon -a'
alias full-upgrade='sudo apt-get update && sudo apt-get dist-upgrade -y'
alias aptud='sudo apt-get update'
alias aptug='sudo apt-get upgrade'

# files
alias rmempty='find . -type d -empty -delete'
alias rmpyc='find . -name *.pyc -type f -delete && find . -name __pycache__ -type d -delete'
```
---
title: Ansible - scripts_cron-apt
category: Automation
---

MAILTO="x@x.x"
MAILON="always"
---
title: Ansible - scripts_health.d_net.conf
category: Automation
---

```
# you can disable an alarm notification by setting the 'to' line to: silent

# -----------------------------------------------------------------------------
# net traffic overflow

 template: interface_speed
       on: net.net
       os: *
    hosts: *
 families: *
     calc: ( $nic_speed_max > 0 ) ? ( $nic_speed_max) : ( nan )
    units: Mbit
    every: 10s
     info: The current speed of the physical network interface

 template: 1m_received_traffic_overflow
       on: net.net
       os: linux
    hosts: *
 families: *
   lookup: average -1m unaligned absolute of received
     calc: ($interface_speed > 0) ? ($this * 100 / ($interface_speed * 1000)) : ( nan )
    units: %
    every: 10s
     warn: $this > (($status >= $WARNING)  ? (80) : (85))
     crit: $this > (($status == $CRITICAL) ? (85) : (90))
    delay: down 1m multiplier 1.5 max 1h
     info: interface received bandwidth usage over net device speed max
       to: silent

 template: 1m_sent_traffic_overflow
       on: net.net
       os: linux
    hosts: *
 families: *
   lookup: average -1m unaligned absolute of sent
     calc: ($interface_speed > 0) ? ($this * 100 / ($interface_speed * 1000)) : ( nan )
    units: %
    every: 10s
     warn: $this > (($status >= $WARNING)  ? (80) : (85))
     crit: $this > (($status == $CRITICAL) ? (85) : (90))
    delay: down 1m multiplier 1.5 max 1h
     info: interface sent bandwidth usage over net device speed max
       to: silent

# -----------------------------------------------------------------------------
# dropped packets

# check if an interface is dropping packets
# the alarm is checked every 1 minute
# and examines the last 10 minutes of data
#
# it is possible to have expected packet drops on an interface for some network configurations
# look at the Monitoring Network Interfaces section in the proc.plugin documentation for more information

template: inbound_packets_dropped
      on: net.drops
      os: linux
   hosts: *
families: *
  lookup: sum -10m unaligned absolute of inbound
   units: packets
   every: 1m
    warn: $this >= 5
   delay: down 1h multiplier 1.5 max 2h
    info: interface inbound dropped packets in the last 10 minutes
      to: silent

template: outbound_packets_dropped
      on: net.drops
      os: linux
   hosts: *
families: *
  lookup: sum -10m unaligned absolute of outbound
   units: packets
   every: 1m
    warn: $this >= 5
   delay: down 1h multiplier 1.5 max 2h
    info: interface outbound dropped packets in the last 10 minutes
      to: sysadmin

template: inbound_packets_dropped_ratio
      on: net.packets
      os: linux
   hosts: *
families: *
  lookup: sum -10m unaligned absolute of received
    calc: (($inbound_packets_dropped != nan AND $this > 0) ? ($inbound_packets_dropped * 100 / $this) : (0))
   units: %
   every: 1m
    warn: $this >= 0.1
    crit: $this >= 2
   delay: down 1h multiplier 1.5 max 2h
    info: the ratio of inbound dropped packets vs the total number of received packets of the network interface, during the last 10 minutes
      to: silent

template: outbound_packets_dropped_ratio
      on: net.packets
      os: linux
   hosts: *
families: *
  lookup: sum -10m unaligned absolute of sent
    calc: (($outbound_packets_dropped != nan AND $this > 0) ? ($outbound_packets_dropped * 100 / $this) : (0))
   units: %
   every: 1m
    warn: $this >= 0.1
    crit: $this >= 2
   delay: down 1h multiplier 1.5 max 2h
    info: the ratio of outbound dropped packets vs the total number of sent packets of the network interface, during the last 10 minutes
      to: sysadmin


# -----------------------------------------------------------------------------
# FIFO errors

# check if an interface is having FIFO
# buffer errors
# the alarm is checked every 1 minute
# and examines the last 10 minutes of data

template: 10min_fifo_errors
      on: net.fifo
      os: linux
   hosts: *
families: *
  lookup: sum -10m unaligned absolute
   units: errors
   every: 1m
    warn: $this > 0
   delay: down 1h multiplier 1.5 max 2h
    info: interface fifo errors in the last 10 minutes
      to: sysadmin


# -----------------------------------------------------------------------------
# check for packet storms

# 1. calculate the rate packets are received in 1m: 1m_received_packets_rate
# 2. do the same for the last 10s
# 3. raise an alarm if the later is 10x or 20x the first
# we assume the minimum packet storm should at least have
# 10000 packets/s, average of the last 10 seconds

template: 1m_received_packets_rate
      on: net.packets
      os: linux freebsd
   hosts: *
families: *
  lookup: average -1m unaligned of received
   units: packets
   every: 10s
    info: the average number of packets received during the last minute

template: 10s_received_packets_storm
      on: net.packets
      os: linux freebsd
   hosts: *
families: *
  lookup: average -10s unaligned of received
    calc: $this * 100 / (($1m_received_packets_rate < 1000)?(1000):($1m_received_packets_rate))
   every: 10s
   units: %
   warn: $this > (($status >= $WARNING)?(200):(5000))
   crit: $this > (($status >= $WARNING)?(5000):(6000))
options: no-clear-notification
   info: the % of the rate of received packets in the last 10 seconds, compared to the rate of the last minute (clear notification for this alarm will not be sent)
     to: sysadmin
```
---
title: Ansible - scripts_mailname
category: Automation
---

x.x
---
title: Ansible - scripts_motd.sh
category: Automation
---

```
 ===========================================================

    Welcome to 123456789

    Access  to  and  use of this server is  restricted to those
    activities expressly permitted by the system administration
    staff. If you're not sure if it's allowed, then DON'T DO IT.

```
---
title: Ansible - scripts_nrpe.cfg
category: Automation
---

```
#############################################################################
# Sample NRPE Config File
# Written by: Ethan Galstad (nagios@nagios.org)
#
# Last Modified: 11-23-2007
#
# NOTES:
# This is a sample configuration file for the NRPE daemon.  It needs to be
# located on the remote host that is running the NRPE daemon, not the host
# from which the check_nrpe client is being executed.
#############################################################################


# LOG FACILITY
# The syslog facility that should be used for logging purposes.

log_facility=daemon



# PID FILE
# The name of the file in which the NRPE daemon should write it's process ID
# number.  The file is only written if the NRPE daemon is started by the root
# user and is running in standalone mode.

pid_file=/var/run/nagios/nrpe.pid



# PORT NUMBER
# Port number we should wait for connections on.
# NOTE: This must be a non-priviledged port (i.e. > 1024).
# NOTE: This option is ignored if NRPE is running under either inetd or xinetd

server_port=5666



# SERVER ADDRESS
# Address that nrpe should bind to in case there are more than one interface
# and you do not want nrpe to bind on all interfaces.
# NOTE: This option is ignored if NRPE is running under either inetd or xinetd

#server_address=127.0.0.1



# NRPE USER
# This determines the effective user that the NRPE daemon should run as.
# You can either supply a username or a UID.
#
# NOTE: This option is ignored if NRPE is running under either inetd or xinetd

nrpe_user=nagios



# NRPE GROUP
# This determines the effective group that the NRPE daemon should run as.
# You can either supply a group name or a GID.
#
# NOTE: This option is ignored if NRPE is running under either inetd or xinetd

nrpe_group=nagios



# ALLOWED HOST ADDRESSES
# This is an optional comma-delimited list of IP address or hostnames
# that are allowed to talk to the NRPE daemon. Network addresses with a bit mask
# (i.e. 192.168.1.0/24) are also supported. Hostname wildcards are not currently
# supported.
#
# Note: The daemon only does rudimentary checking of the client's IP
# address.  I would highly recommend adding entries in your /etc/hosts.allow
# file to allow only the specified host to connect to the port
# you are running this daemon on.
#
# NOTE: This option is ignored if NRPE is running under either inetd or xinetd

allowed_hosts=127.0.0.1,x.x.x.x



# COMMAND ARGUMENT PROCESSING
# This option determines whether or not the NRPE daemon will allow clients
# to specify arguments to commands that are executed.  This option only works
# if the daemon was configured with the --enable-command-args configure script
# option.
#
# *** ENABLING THIS OPTION IS A SECURITY RISK! ***
# Read the SECURITY file for information on some of the security implications
# of enabling this variable.
#
# Values: 0=do not allow arguments, 1=allow command arguments

dont_blame_nrpe=0



# BASH COMMAND SUBTITUTION
# This option determines whether or not the NRPE daemon will allow clients
# to specify arguments that contain bash command substitutions of the form
# $(...).  This option only works if the daemon was configured with both
# the --enable-command-args and --enable-bash-command-substitution configure
# script options.
#
# *** ENABLING THIS OPTION IS A HIGH SECURITY RISK! ***
# Read the SECURITY file for information on some of the security implications
# of enabling this variable.
#
# Values: 0=do not allow bash command substitutions,
#         1=allow bash command substitutions

allow_bash_command_substitution=0



# COMMAND PREFIX
# This option allows you to prefix all commands with a user-defined string.
# A space is automatically added between the specified prefix string and the
# command line from the command definition.
#
# *** THIS EXAMPLE MAY POSE A POTENTIAL SECURITY RISK, SO USE WITH CAUTION! ***
# Usage scenario:
# Execute restricted commmands using sudo.  For this to work, you need to add
# the nagios user to your /etc/sudoers.  An example entry for alllowing
# execution of the plugins from might be:
#
# nagios          ALL=(ALL) NOPASSWD: /usr/lib/nagios/plugins/
#
# This lets the nagios user run all commands in that directory (and only them)
# without asking for a password.  If you do this, make sure you don't give
# random users write access to that directory or its contents!

# command_prefix=/usr/bin/sudo



# DEBUGGING OPTION
# This option determines whether or not debugging messages are logged to the
# syslog facility.
# Values: 0=debugging off, 1=debugging on

debug=0



# COMMAND TIMEOUT
# This specifies the maximum number of seconds that the NRPE daemon will
# allow plugins to finish executing before killing them off.

command_timeout=60



# CONNECTION TIMEOUT
# This specifies the maximum number of seconds that the NRPE daemon will
# wait for a connection to be established before exiting. This is sometimes
# seen where a network problem stops the SSL being established even though
# all network sessions are connected. This causes the nrpe daemons to
# accumulate, eating system resources. Do not set this too low.

connection_timeout=300



# WEEK RANDOM SEED OPTION
# This directive allows you to use SSL even if your system does not have
# a /dev/random or /dev/urandom (on purpose or because the necessary patches
# were not applied). The random number generator will be seeded from a file
# which is either a file pointed to by the environment valiable $RANDFILE
# or $HOME/.rnd. If neither exists, the pseudo random number generator will
# be initialized and a warning will be issued.
# Values: 0=only seed from /dev/[u]random, 1=also seed from weak randomness

#allow_weak_random_seed=1



# INCLUDE CONFIG FILE
# This directive allows you to include definitions from an external config file.

#include=<somefile.cfg>



# INCLUDE CONFIG DIRECTORY
# This directive allows you to include definitions from config files (with a
# .cfg extension) in one or more directories (with recursion).

#include_dir=<somedirectory>
#include_dir=<someotherdirectory>



# COMMAND DEFINITIONS
# Command definitions that this daemon will run.  Definitions
# are in the following format:
#
# command[<command_name>]=<command_line>
#
# When the daemon receives a request to return the results of <command_name>
# it will execute the command specified by the <command_line> argument.
#
# Unlike Nagios, the command line cannot contain macros - it must be
# typed exactly as it should be executed.
#
# Note: Any plugins that are used in the command lines must reside
# on the machine that this daemon is running on!  The examples below
# assume that you have plugins installed in a /usr/local/nagios/libexec
# directory.  Also note that you will have to modify the definitions below
# to match the argument format the plugins expect.  Remember, these are
# examples only!


# The following examples use hardcoded command arguments...

command[check_users]=/usr/lib/nagios/plugins/check_users -w 5 -c 10
command[check_load]=/usr/lib/nagios/plugins/check_load -w 15,10,5 -c 30,25,20
command[check_zombie_procs]=/usr/lib/nagios/plugins/check_procs -w 5 -c 10 -s Z
command[check_total_procs]=/usr/lib/nagios/plugins/check_procs -w 150 -c 200
command[check_disk]=/usr/lib/nagios/plugins/check_disk -w 10% -c 5% -W 10% -K 5% -A -I '/snap/*'
command[check_x]=/usr/local/bin/x.sh

# The following examples allow user-supplied arguments and can
# only be used if the NRPE daemon was compiled with support for
# command arguments *AND* the dont_blame_nrpe directive in this
# config file is set to '1'.  This poses a potential security risk, so
# make sure you read the SECURITY file before doing this.

#command[check_users]=/usr/lib/nagios/plugins/check_users -w $ARG1$ -c $ARG2$
#command[check_load]=/usr/lib/nagios/plugins/check_load -w $ARG1$ -c $ARG2$
#command[check_disk]=/usr/lib/nagios/plugins/check_disk -w $ARG1$ -c $ARG2$ -p $ARG3$
#command[check_procs]=/usr/lib/nagios/plugins/check_procs -w $ARG1$ -c $ARG2$ -s $ARG3$

#
# local configuration:
#	if you'd prefer, you can instead place directives here
include=/etc/nagios/nrpe_local.cfg

#
# you can place your config snipplets into nrpe.d/
# only snipplets ending in .cfg will get included
include_dir=/etc/nagios/nrpe.d/
```
---
title: Ansible - scripts_snmpd.conf
category: Automation
---

```
agentAddress  udp:0.0.0.0:161
view   systemonly  included   .1.3.6.1.2.1.1
view   systemonly  included   .1.3.6.1.2.1.25.1

rocommunity public  localhost
rocommunity public  x.x.x.x/32

rocommunity6 public  default   -V systemonly
rouser   authOnlyUser
sysLocation    Sitting on the Dock of the Bay
sysContact     Me <me@example.org>
sysServices    72
proc  mountd
proc  ntalkd    4
proc  sendmail 10 1
disk       /     10000
disk       /var  5%
includeAllDisks  10%
load   12 10 5
trapsink     localhost public
iquerySecName   internalUser
rouser          internalUser
defaultMonitors          yes
linkUpDownNotifications  yes
extend    test1   /bin/echo  Hello, world!
extend-sh test2   echo Hello, world! ; echo Hi there ; exit 35
master          agentx
```
---
title: Ansible - ubuntu_pb.yml
category: Automation
---

```yaml
- hosts: ubuntu
  tasks:
  - name: Collecting only facts returned by facter
    setup:
        gather_subset:
            - '!all'
            - '!any'
            - facter
  - name: Updating apt cache
    apt: update_cache=yes
    become: yes
    become_method: sudo
  - name: Upgrading packages via DIST
    apt: upgrade=dist
    become: yes
    become_method: sudo
  - name: Installing required packages
    apt:
        pkg:
            - haveged
            - postfix
            - figlet
            - mtr
            - cron-apt
            - snmpd
            - screen
            - iperf
            - iftop
            - iotop
            - htop
            - sysstat
            - vim
            - ntp
            - moreutils
            - bacula-fd
            - bsd-mailx
            - glances
            - unzip
            - unattended-upgrades
            - nagios-nrpe-server
        state: present
    become: yes
    become_method: sudo
  - name: Removing dependencies that are no longer required via AUTOREMOVE
    apt: autoremove=yes
    become: yes
    become_method: sudo
  - name: Cleaning up Banner MOTD in sshd_config to use motd.sh
    lineinfile:
        path: "{{ item.path }}"
        state: absent
        regexp:	"{{ item.regexp }}"
    with_items:
        - { path: '/etc/ssh/sshd_config', regexp: '.*Banner\ .*'}
        - { path: '/etc/vim/vimrc', regexp: '.*set\ background.*'}
        - { path: '/etc/vim/vimrc', regexp: '.*syntax\ .*'}
    become: yes
    become_method: sudo
  - name: Customizing up Banner MOTD in sshd_config to use motd.sh
    lineinfile:
        path: "{{ item.path }}"
        state: present
        line: "{{ item.line }}"
    with_items:
        - { path: '/etc/ssh/sshd_config', line: 'Banner /etc/motd.sh'}
        - { path: '/etc/vim/vimrc', line: 'set background=dark'}
        - { path: '/etc/vim/vimrc', line: 'syntax on'}
    become: yes
    become_method: sudo
  - name: Copying custom netdata health alarms
    copy: src={{item}} dest=/etc/netdata/health.d/ owner=root group=netdata mode=644
    with_fileglob:
        - /etc/ansible/scripts/health.d/*
    become: yes
    become_method: sudo
  - name: Copying motd.sh
    copy: src=/etc/ansible/scripts/motd.sh dest=/etc/motd.sh owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Copying Postfix Aliases
    copy: src=/etc/ansible/scripts/aliases dest=/etc/aliases owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Copying Postfix mailname
    copy: src=/etc/ansible/scripts/mailname dest=/etc/mailname owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Customizing Banner via figlet
    shell: /usr/bin/figlet -c -w 60 {{ inventory_hostname }} | cat - /etc/motd.sh > /tmp/motd.sh && mv /tmp/motd.sh /etc/motd.sh && sed -i s@123456789@{{inventory_hostname}}@g /etc/motd.sh
    become: yes
    become_method: sudo
  - name: Copying custom Root .bashrc
    copy: src=/etc/ansible/scripts/bashrc dest=/root/.bashrc owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Copying Updates 20auto-upgrades
    copy: src=/etc/ansible/scripts/20auto-upgrades dest=/etc/apt/apt.conf.d/20auto-upgrades owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Copying Cron-Apt
    copy: src=/etc/ansible/scripts/cron-apt dest=/etc/cron-apt/config owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Copying Unattended-Upgrades
    copy: src=/etc/ansible/scripts/50unattended-upgrades dest=/etc/apt/apt.conf.d/50unattended-upgrades owner=root group=root mode=0644
    become: yes
    become_method: sudo
  - name: Copying NRPE Config
    copy: src=/etc/ansible/scripts/nrpe.cfg dest=/etc/nagios/nrpe.cfg owner=root group=root mode=0644
    become: yes
    become_method: sudo
    when : ansible_hostname != "ns2"
  - service: name=nagios-nrpe-server state=restarted
    become: yes
    become_method: sudo
  - name: Copying SNMPD.conf
    copy: src=/etc/ansible/scripts/snmpd.conf dest=/etc/snmp/snmpd.conf owner=root group=root mode=0600
    become: yes
    become_method: sudo
  - service: name=snmpd state=restarted
    become: yes
    become_method: sudo
  - service: name=ssh state=restarted
    become: yes
    become_method: sudo
  - name: Refreshing Postfix Aliases
    command: newaliases
    become: yes
    become_method: sudo
  - service: name=postfix state=restarted
    become: yes
    become_method: sudo
  - name: Create x user
    user:
            name: x
            password: 'x'
            groups: sudo
            append: yes
            state: present
            shell: /bin/bash
            system: no
            createhome: yes
            home: /home/x
            remove: yes
            update_password: on_create
    become: yes
    become_method: sudo
  - name: Removing y user
    user:
            name: y
            password: 'x'
            groups:
            append: yes
            state: absent
            shell: /bin/bash
            system: no
            createhome: yes
            home: /home/y
            remove: yes
            update_password: on_create
    become: yes
    become_method: sudo
  - name: Set authorized key x
    authorized_key:
        user: x
        state: present
        key: "{{'ssh-rsa x'}}"
    become: yes
    become_method: sudo
  - name: Setting swappiness to 10
    sysctl:
            name: vm.swappiness
            value: 10
            state: present
            reload: yes
    become: yes
    become_method: sudo
  - lineinfile:
        path: /etc/sudoers
        state: present
        backrefs: yes
        regexp: '^%sudo'
        line: '%sudo   ALL=(ALL:ALL) NOPASSWD:ALL'
        validate: '/usr/sbin/visudo -cf %s'
    become: yes
    become_method: sudo
  - lineinfile:
        path: /etc/sudoers
        state: absent
        backrefs: yes
        regexp: '^x'
        validate: '/usr/sbin/visudo -cf %s'
    become: yes
    become_method: sudo
  roles:
  - role: ansible-netdata
  - role: jebovic.ohmyzsh
```
---
title: Ansible - Use cases
category: Automation
---

* Playbook to audit configuration and licensing.
* Apply ad-hoc patching.
* Enforce security and conformity.
* IaC Integrate with Terraform or Cloudformation.
* Integrate with Rundeck for self-servicing, scheduling, reports and GUI.
