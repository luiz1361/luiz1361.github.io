---
title: HYPERV
permalink: /docs/virtualization/hyperv/
---
---
title: Hyperv - Defrag CSV 
category: Virtualization
---

**The steps below were successfully executed as an experiment once. This needs more careful testing and this documentation needs to be updated:**
```
Get-ClusterSharedVolume
Get-ClusterSharedVolume "Vol_Test"
Suspend-ClusterResource "Vol_Test" -RedirectedAccess -VolumeName "C:\ClusterStorage\Volume5"
Repair-ClusterSharedVolume "Vol_Test" -Defrag -Parameters "/A /U /V"
Resume-ClusterResource "Vol_Test" -VolumeName "C:\ClusterStorage\Volume5"
```
---
title: Hyperv - Integration Services Check
category: Virtualization
---

**Command to check the status of the integration services on a Windows guest via Powershell:**  
```
Get-VM | ft Name, IntegrationServicesVersion
```

***
**Sources:**  
* https://blogs.msdn.microsoft.com/virtual_pc_guy/2012/03/06/using-powershell-to-check-integration-services-versions/
---
title: Hyperv - Metering
category: Virtualization
---

**Enable metering for all VMs on host node:**
```
Get-VM * | Enable-VMResourceMetering
```

**Enable metering for single VM guest on host:**
```
Get-VM -Name vmname | Enable-VMResourceMetering
```

**Show specific metering resources for all VMs:**
```
Get-VM * | Measure-VM | Select-Object VMname, AvgCPU, AvgRAM, AggregatedAverageNormalizedIOPS
```

**Show metering resources for all VMs:**
```
Get-VM * | Measure-VM | Select-Object *
```

**Reset metering counters for all VMs:**
```
Get-VM * | Reset-VMResourceMetering
```

**Disable metering for all VMs:**
```
Get-VM * | Disable-VMResourceMetering
```
---
title: Hyperv - Nested Virtualization
category: Virtualization
---

**The command below needs to be executed at host level to enable nested virtualization for a specific VM:**
```
Set-VMProcessor -VMName <VMName> -ExposeVirtualizationExtensions $true
```

***
**Pre-requisites:**
* Must be running Windows 10 Build 10565 or later.
* The host and nested VM must be running the same build of Win 10.
* Min 4GB RAM on the host.
* Dynamic RAM must be disabled on the nested VM.
* No Checkpoints can be made on the nested VM. (desired to checkpoint hosted VM in the nested VM must be running version 8 of the VM)
* MAC Address Spoofing has to be enable on the nest VM NIC or a NAT Virtual Switch has to be created.
---
title: Hyperv - P2V Manual
category: Virtualization
---

**First of all you need to perform a block level copy of disk to file similar to this:**  
```
dd if=/dev/sda of=/root/sda bs=1M
```
>Of course the source volume needs to be unmounted and you will need enough disk capacity to fit the size of the whole source disk at the destination.

**Download VirtualBox and look for The VboxManage.exe which can be found on the VirtualBox folder and run:**  
```
VBoxManage.exe convertfromraw myfile.dd myfile.vhd --format VHD
```
---
title: Hyperv - Snapshot Create
category: Virtualization
---

**Snapshot VM named test**
```
Checkpoint-VM -Name <VMName> -SnapshotName <SnapName>
```

**To run as scheduled task:**
1. Run program/script: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
1. Add the script to execute command as argument: "C:\Users\user\Desktop\snapshot.ps1"
---
title: Hyperv - VHD Compact Linux
category: Virtualization
---

**Fill in all free space on disk with zeros:**  
```
dd if=/dev/zero of=test.file
```
>...wait for the virtual disk to fill, then
```
rm test.file
```

**Now on Hyper-V Manager, go to Edit Disk and compact.**
---
title: Hyperv - VHD Creating
category: Virtualization
---

**This will create a 60GB dynamic disk(VHDX) file under C:\VHD\ called Mydrive.vhdx:**
```
New-VHD -Dynamic C:\VHD\MyDrive.vhdx -SizeBytes 60GB
```

**This will create a 5GB fixed size disk(VHDX) file under C:\VHD\ called FixedDisk.vhdx:**
```
New-VHD -Fixed C:\VHD\FixedDisk.vhdx -SizeBytes 5GB
```

***
**Sources:**  
* http://blogs.technet.com/b/heyscriptingguy/archive/2013/06/07/powertip-create-a-new-vhd-with-windows-powershell.aspx
---
title: Hyperv - VHD Expanding Linux
category: Virtualization
---

***
**Sources:**  
* http://hubpages.com/technology/Expanding-the-Disk-Volume-on-a-Hyper-V-Linux-Guest
---
title: Hyperv - Vswitch Creating VLAN
category: Virtualization
---

**First of all create a virtual switch on Hyper-V Manager named "Hypervsw"**  

**Now add the network interfaces as below, you can use any name for it. Remember to tag VLANs accordingly on the switchport connected to the machine:**  
```
Add-VMNetworkAdapter -ManagementOS -Name VLAN123_PROD_TAG -SwitchName "Hypervsw"
Add-VMNetworkAdapter -ManagementOS -Name VLAN124_DEV_TAG -SwitchName "Hypervsw"
```

**Associate each network interface created above to their respective VLAN:**  
```
Set-VMNetworkAdapterVlan -ManagementOS -Trunk -AllowedVlanIdList "1" -VMNetworkAdapterName "VLAN123_PROD_TAG" -NativeVlanId 123
Set-VMNetworkAdapterVlan -ManagementOS -Trunk -AllowedVlanIdList "1" -VMNetworkAdapterName "VLAN124_DEV_TAG" -NativeVlanId 124
```

**Use the commands below for troubleshooting:**  
```
Get-VMNetworkAdapterVlan
Get-VMNetworkAdapter -ManagementOS
Get-VMNetworkAdapter -All
```
---
title: Hyperv - Vswitch Nat
category: Virtualization
---

>The VM will require a static IP as Hyper-V won't act as a DHCP server:

```
New-VMSwitch -SwitchName “NATSwitch” -SwitchType Internal
New-NetIPAddress -IPAddress 192.168.0.1 -PrefixLength 24 -InterfaceAlias “NATSwitch”
New-NetNAT -Name “NATNetwork” -InternalIPInterfaceAddressPrefix 192.168.0.0/24
Get-NetNat
```
---
title: Hyperv - vswitch Rename vnics
category: Virtualization
---

**Retrieve list of network adapters for VM test:**
```
Get-VMNetworkAdapter -VMName test
```

**Store each adapter in an array:**
```
$VMNetAdap = Get-VMNetworkAdapter -VMName test
```

**Rename guest network adapters based on array position:**
```
rename-VMNetworkAdapter -VMNetworkAdapter $VMNetAdap[0] -newname P_STAFF
rename-VMNetworkAdapter -VMNetworkAdapter $VMNetAdap[1] -newname P_MISC
```

**Configure trunk details for each guest network adapter:**
```
Set-VMNetworkAdapterVlan -Trunk -AllowedVlanIdList "1" -VMName "test" -VMNetworkAdapterName "P_STAFF" -NativeVlanId 0
SSet-VMNetworkAdapterVlan -Trunk -AllowedVlanIdList "10,11,12,13,14" -VMName "test" -VMNetworkAdapterName "P_MISC" -NativeVlanId 0
```
---
title: Hyperv - Vswitch Trunk
category: Virtualization
---

**Set guest NIC "Network Adapter" to be trunk allowing VLAN tags 1-4094 and set the native untagged VLAN to be 10:**  
```
Set-VMNetworkAdapterVlan -Trunk -AllowedVlanIdList "1-4094" -VMName "test" -VMNetworkAdapterName "Network Adapter" -NativeVlanId 10
```

**Verify configuration:**
```
Get-VMNetworkAdapterVlan
```
