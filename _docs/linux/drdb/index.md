---
title: DRDB
permalink: /docs/linux/drdb/
---
---
title: DRBD - Check Status
category: Linux
---

**Run ```sudo cat /proc/drbd``` to retrieve the DRBD service status**

**How unhealthy looks like:**
```
version: 8.4.5 (api:1/proto:86-101)
srcversion: 611D9EEFB9C11D2BC709D07
 0: cs:WFConnection ro:Primary/Unknown ds:UpToDate/DUnknown C r-----
    ns:0 nr:1408 dw:1816 dr:57681 al:4 bm:0 lo:0 pe:0 ua:0 ap:0 ep:1 wo:f oos:404
```

**How synching looks like:**
```
root@azkaban:/# sudo cat /proc/drbd
version: 8.4.5 (api:1/proto:86-101)
srcversion: 611D9EEFB9C11D2BC709D07
 0: cs:SyncSource ro:Primary/Secondary ds:UpToDate/Inconsistent C r-----
    ns:28 nr:1408 dw:2040 dr:57717 al:6 bm:0 lo:0 pe:1 ua:0 ap:0 ep:1 wo:f oos:572
        [===================>] sync'ed:100.0% (572/592)K
        finish: 0:00:01 speed: 20 (20) K/sec
```

**How healthy looks like:**
```
root@azkaban:/# sudo cat /proc/drbd
version: 8.4.5 (api:1/proto:86-101)
srcversion: 611D9EEFB9C11D2BC709D07
 0: cs:Connected ro:Primary/Secondary ds:UpToDate/UpToDate C r-----
    ns:592 nr:1408 dw:2040 dr:58281 al:6 bm:0 lo:3 pe:0 ua:0 ap:0 ep:1 wo:f oos:0
 ```
---
title: DRBD - Pacemaker HA Cluster Install
category: Linux
---

**Assumptions are we are running nodes ServerB and ServerA on Ubuntu 16**

**UPDATE!** if running on Ubuntu 18 there is apparently an issue involving the Kernel 5.0 > 5.3 so this is a workaround which can be used in the meantime:
```
https://launchpad.net/~rafaeldtinoco/+archive/ubuntu/lp1866458
sudo add-apt-repository ppa:rafaeldtinoco/lp1866458
sudo apt-get update
sudo apt-get dist-upgrade
```
**Update the /etc/hosts file accordingly:**
```
10.253.253.1 ServerA
10.253.253.1 ServerB
```

**Run on both:** 
```
apt-get update && apt-get install -y drbd8-utils ntp crmsh
```

**Run on ServerB:** 
```
dd if=/dev/zero of=/dev/mapper/root-cluster
```

**Edit on both:** 
```
/etc/drbd.conf

resource r0 {
    on ServerB{
        device /dev/drbd0;
        disk /dev/mapper/root-cluster;
        address 10.253.253.1:7788;
        meta-disk internal;
    }
    on ServerA {
        device /dev/drbd0;
        disk /dev/mapper/root-cluster;
        address 10.253.253.2:7788;
        meta-disk internal;
        }
}
```
**Run on both:**
```
modprobe drbd
```

**Run on both:**
```
drbdadm create-md r0
```

**Run on both:**
```
drbdadm up r0
```

**Run on both:**
```
drbd-overview
```

**Run on both:**
```
cat /proc/drbd
```

**Run on ServerB:** 
```
drbdadm -- --overwrite-data-of-peer primary r0/0
```
>will set ServerB as primary and replicate to ServerA

**Run on both:**
```
watch cat /proc/drbd
```
>check progress of replication

**Run on ServerB:**
```
mkfs.ext4 /dev/drbd0
```

**Run on ServerB:**
```
mkdir -p /mnt/drbd0/
```

**Run on ServerB:**
```
mount /dev/drbd0 /mnt/drbd0/
```

>Up to this point it would be necessary to mount /mnt/drbd0 on primary node and it would replicate to /dev/drbd0 on the other node. But in case of disaster it would be necessary to manually mount /dev/drbd0 on the other node to activate the folder.  
>From now on we will use Pacemaker and Corosync to do it automatically.

**Run on both:**
```
systemctl disable drbd
```
>disable on boot as the pacemaker will control that service

**Run on both:**
```
umount /mnt/drbd0/ && #drbdadm down r0
```

**Run on both:**
```
apt-get install -y pacemaker
```
>this includes corosync which synchronizes metadata between nodes

**Edit on both:**
```
/etc/corosync/corosync.conf

totem {
    version: 2
    cluster_name: debian
    secauth: off
    transport:udpu
        interface {
            ringnumber: 0
            bindnetaddr: 10.253.253.0
            broadcast: yes
            mcastport: 5405
        }
}
nodelist {
    node {
        ring0_addr: 10.253.253.1
        name: ServerB
        nodeid: 1
    }
    node {
        ring0_addr: 10.253.253.2
        name: ServerA
        nodeid: 2
    }
}
quorum {
    provider: corosync_votequorum
    two_node: 1
    wait_for_all: 1
    last_man_standing: 1
    auto_tie_breaker: 0
}
```

**Run on both:**
```
systemctl restart corosync
```
>to apply config above
**Run on both:**
```
systemctl start pacemaker
```
>already enabled by default
**Run on both:**
```
crm status
```
**Run on ServerB:**
```
crm configure edit
```

```
node 1: ServerB
node 2: ServerA
primitive drbd_res ocf:linbit:drbd params drbd_resource=r0 op monitor interval=29s role=Master op monitor interval=31s role=Slave
primitive fortivm VirtualDomain params hypervisor="qemu:///system" config="/mnt/drbd0/fortivm.xml" op stop timeout=120s interval=0 op start timeout=120s interval=0 op monitor interval=30s timeout=30s utilization cpu=1 hv_memory=2048
primitive fs_res Filesystem params device="/dev/drbd0" directory="/mnt/drbd0/" fstype=ext4
ms drbd_master_slave drbd_res meta master-max=1 master-node-max=1 clone-max=2 clone-node-max=1 notify=true
order fs_after_drbd Mandatory: drbd_master_slave:promote fs_res:start fortivm:start
colocation fs_drbd_colo inf: fs_res fortivm drbd_master_slave:Master
property cib-bootstrap-options: have-watchdog=false dc-version=1.1.14-70404b0 cluster-infrastructure=corosync cluster-name=debian stonith-enabled=false no-quorum-policy=ignore
```

>Brief description of above:  
>drbd_res: monitor r0 role master and slave  
>fortivm: monitor kvm vm  
>fs_res: mount drbd0 device  
>drbd_master_slave: only allow one master  
>fs_drbd_colo: only run resources on drbd master  
>fs_after_drbd: promote drbd master first, mount dev and start vm  

**Run on both:**
```
crm status
```

**Add GUI for cluster management(https://github.com/ClusterLabs/pcs):**
```
apt-get install pcs
/etc/init.d/pcsd start
passwd hacluster
pcs cluster auth ServerA ServerB -u hacluster
pcs cluster auth
```

***
**Sources:**
* https://www.theurbanpenguin.com/drbd-pacemaker-ha-cluster-ubuntu-16-04/
---
title: DRBD - Pacemaker KVM Setup
category: Linux
---

**Set up /dev/drdb0 device mounting on /mnt/drdb0, define master and slave and start KVM VM 'fortivm':**
```
crm configure edit
node 1: azkaban
node 2: peppapig
primitive drbd_res ocf:linbit:drbd \
        params drbd_resource=r0 \
        op monitor interval=29s role=Master \
        op monitor interval=31s role=Slave
primitive fortivm VirtualDomain \
        params hypervisor="qemu:///system" config="/mnt/drbd0/fortivm.xml" \
        op stop timeout=120s interval=0 \
        op start timeout=120s interval=0 \
        op monitor interval=30s timeout=30s \
        utilization cpu=1 hv_memory=1024
primitive fs_res Filesystem \
        params device="/dev/drbd0" directory="/mnt/drbd0/" fstype=ext4
ms drbd_master_slave drbd_res \
        meta master-max=1 master-node-max=1 clone-max=2 clone-node-max=1 notify=true
order fs_after_drbd Mandatory: drbd_master_slave:promote fs_res:start fortivm:start
colocation fs_drbd_colo inf: fs_res fortivm drbd_master_slave:Master
property cib-bootstrap-options: \
        have-watchdog=false \
        dc-version=1.1.14-70404b0 \
        cluster-infrastructure=corosync \
        cluster-name=debian \
        stonith-enabled=false \
        no-quorum-policy=ignore
```
---
title: DRBD - Pacemaker Test Failover
category: Linux
---

**The steps described bellow will put a node in standby to force the switchover of resources to another one:**
```
pcs status
pcs cluster standby peppapig
pcs status
pcs cluster unstandby peppapig
```

***
**Sources:**
* http://clusterlabs.org/pacemaker/doc/en-US/Pacemaker/1.1/html/Clusters_from_Scratch/_test_cluster_failover.html
---
title: DRBD - Split Brain Standalone
category: Linux
---

**In case of ```Split Brain cs:StandAlone``` which can happen at any time:**

**Run this on secondary node:**
```
drbdadm disconnect r0
drbdadm secondary r0 #This set the current node as secondary for r0
drbdadm connect --discard-my-data r0
```

**Run this on primary node:**
```
drbdadm disconnect r0
drbdadm primary r0 #This set the current node as primary for r0
drbdadm connect r0
```

***
**Sources:**
* https://serverfault.com/questions/870213/how-to-get-drbd-nodes-out-of-connection-state-standalone-and-wfconnection
---
title: DRBD - Stop DRBD Sync for backups
category: Linux
---

**Steps to run on a secondary node for a cold backup. It will stop the cluster services, bring DRBD up, mount the partition, perform a cold backup and revert the process to bring the cluster services back up:**
```
/etc/init.d/pacemaker stop
/etc/init.d/drbd start
drbdadm disconnect r0
drbdadm primary r0
mount /dev/drbd0 /mnt/drbd0
cp /mnt/drbd0/* ...
umount /mnt/drbd0/
drbdadm secondary r0
drbdadm connect --discard-my-data r0
drbd-overview
/etc/init.d/drbd stop
/etc/init.d/pacemaker start
sudo crm status
```
