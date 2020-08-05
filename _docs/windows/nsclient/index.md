# check_dhcp_scope.vbs

# ----------------------------------------------------------------------
# File:         check_failover_dhcp.ps1
# Description:  NRPE Nagios Check for Windows Server 2012 DHCP Failover Servers
#
#   Checks:     Failover State
#               Failover Mode
#               Scope State of Each Scope
#               Scope Statistics (PercentInUse) of Each Scope
#
#   Required:   Windows Server 2012 with the following Cmdlets
#                  Get-DhcpServerv4Failover
#                  Get-DhcpServerv4Scope
#                  Get-DhcpServerv4ScopeStatistics
#
#   Notes:      - Reports only the highest value exit code to Nagios
#               - Does not support exit code 3 (Unknown)
#                   - Unknown IS critical for DHCP services (In my case anyway)
#               - This script can easily be broken out into separate checks
#                   - If this is done, support for exit code 3 can easily be added
#
#   Variables:  - Set $DesiredFailoverMode according to your Failover implementation
#               - Set $ScopePercentInUse_LowWarning and $ScopePercentInUse_LowCritical
#                 to "-1" to disable alerting on low use.
#                   - Disabled by default.
#               - Set $ScopePercentInUse_HighWarning and $ScopePercentInUse_HighCritical
#                 to "101" to disable alerting on high use.
#
# ----------------------------------------------------------------------
# Author:       Alex Atkinson
# Date:         June 9, 2014
# Modified:     June 11, 2014
# Version:      1.1
# ----------------------------------------------------------------------

# ----------------------------------------------------------------------
# Sanity Checks
# ----------------------------------------------------------------------

$exitcode = 0

# Enssure Script Runs Only On Windows Server 2012 Hosts
if (!($((Get-WmiObject -class Win32_OperatingSystem).Caption) -like "*Windows Server 2012*")){
    Write-Host "Error: Host not running Windows Server 2012"
}

# Ensure Required Cmdlets Are Available
$RequiredCmdlets = @(
    "Get-DhcpServerv4Failover",
    "Get-DhcpServerv4Scope",
    "Get-DhcpServerv4ScopeStatistics"
)
$ExitCodeInc = 1
ForEach ( $Cmdlet in $RequiredCmdlets ) {
    $CmdletExitCodeVar = "CmdletExitCode" + $ExitCodeInc
    Get-Command $Cmdlet 2>&1 | Out-Null
    if ( $? -ne "True" ) {
        Write-Host "ERROR: Missing Cmdlet -"$Cmdlet
        $CmdletExitCode = 2
    }
    if (( $CmdletExitCode -eq 0 ) -and ( $exitcode -eq 0 )) { $exitcode = 0 }
    if (( $CmdletExitCode -eq 1 ) -and ( $exitcode -le 1 )) { $exitcode = 1 }
    if (( $CmdletExitCode -eq 2 ) -and ( $exitcode -le 2 )) { $exitcode = 2 }
    $ExitCodeInc++
}

# Exit If Sanity Failed
if ( $exitcode -ne 0 ) { exit $exitcode }

# ----------------------------------------------------------------------
# Variables
# ----------------------------------------------------------------------

$DesiredFailoverMode = "LoadBalance"
$DesiredFailoverState = "Normal"
$DesiredScopeState = "Active"
$ScopePercentInUse_LowWarning = "-1"
$ScopePercentInUse_LowCritical = "-1"
$ScopePercentInUse_HighWarning = "90"
$ScopePercentInUse_HighCritical = "95"

$FailoverOutput = Get-DhcpServerv4Failover | Select-Object Mode, State, ServerType, PartnerServer
$ScopeOutput = Get-DhcpServerv4Scope | Select-Object Name, State
$ScopeStatsOutput = Get-DhcpServerv4ScopeStatistics | Select-Object ScopeID, Free, InUse, Pending, PercentageInUse

# ----------------------------------------------------------------------
# Main Operations
# ----------------------------------------------------------------------

# Check Failover State
if ( $FailoverOutput.State -eq $DesiredFailoverState ) {
    Write-Host "OK: Failover state is" $FailoverOutput.State
    $FailoverStateExitCode = 0
}
elseif ( $Output.State -ne $DesiredFailoverState ) {
    if ( $FailoverOutput.State -eq $Null ) {
        Write-Host "CRITICAL: Failover state NOT returned!"
        $FailoverStateExitCode = 2
    }
    else {
        Write-Host "CRITICAL: Failover state is" $FailoverOutput.State
        $FailoverStateExitCode = 2
    }
}
if (( $FailoverStateExitCode -eq 0 ) -and ( $exitcode -eq 0 )) { $exitcode = 0 }
if (( $FailoverStateExitCode -eq 1 ) -and ( $exitcode -le 1 )) { $exitcode = 1 }
if (( $FailoverStateExitCode -eq 2 ) -and ( $exitcode -le 2 )) { $exitcode = 2 }

# Check Failover Mode
if ( $FailoverOutput.Mode -eq $DesiredFailoverMode ) {
    Write-Host "OK: Failover mode is" $FailoverOutput.Mode
    $FailoverModeExitCode = 0
}
elseif ( $FailoverOutput.Mode -ne $DesiredFailoverMode ) {
    if ( $FailoverOutput.Mode -eq $Null ) {
        Write-Host "CRITICAL: Failover mode NOT returned!"
        $FailoverModeExitCode = 2
    }
    else {
        Write-Host "CRITICAL: Failover mode is" $FailoverOutput.Mode
        $FailoverModeExitCode = 2
    }
}
if (( $FailoverModeExitCode -eq 0 ) -and ( $exitcode -eq 0 )) { $exitcode = 0 }
if (( $FailoverModeExitCode -eq 1 ) -and ( $exitcode -le 1 )) { $exitcode = 1 }
if (( $FailoverModeExitCode -eq 2 ) -and ( $exitcode -le 2 )) { $exitcode = 2 }

# Check Scope States
$ExitCodeInc = 1
ForEach ( $Scope in $ScopeOutput ) {
    $ScopeName = $Scope.Name
    $ScopeState = $Scope.State
    $StateExitCodeVar = "StateExitCode" + $ExitCodeInc
    if ( $ScopeState -eq $DesiredScopeState ) {
        Write-Host "OK:"$ScopeName "is" $DesiredScopeState
        $StateExitCode = 0
    }
    elseif ( $ScopeState -ne $DesiredScopeState ) {
        if ( $ScopeState -eq $Null ) {
            Write-Host "CRITICAL: Scope state NOT returned!"
            $StateExitCode = 2
        }
        else {
        Write-Host "CRITICAL: Scope is" $ScopeState
        $StateExitCode = 2
        }
    }
    if (( $StateExitCode -eq 0 ) -and ( $exitcode -eq 0 )) { $exitcode = 0 }
    if (( $StateExitCode -eq 1 ) -and ( $exitcode -le 1 )) { $exitcode = 1 }
    if (( $StateExitCode -eq 2 ) -and ( $exitcode -le 2 )) { $exitcode = 2 }
    $ExitCodeInc++
}

# Check Scope Statistics
$ExitCodeInc = 1
ForEach ( $Stat in $ScopeStatsOutput ) {
    $StatScopeID = $Stat.ScopeID
    $StatFree = $Stat.Free
    $StatInUse = $Stat.InUse
    $StatPending = $Stat.Pending
    $StatPercentInUse = $Stat.PercentageInUse
    $StatExitCodeVar = "StatExitCode" + $ExitCodeInc
    if (( $StatPercentInUse -lt $ScopePercentInUse_HighWarning ) -and ( $StatPercentInUse -gt $ScopePercentInUse_LowWarning )) {
        Write-Host "OK: Scope" $StatScopeID "use is" $StatPercentInUse"%"
        $StatExitCode = 0
    }
    elseif (( $StatPercentInUse -ge $ScopePercentInUse_HighWarning ) -and ( $StatPercentInUse -lt $ScopePercentInUse_HighCritical )) {
        Write-Host "WARNING: Scope" $StatScopeID "use is" $StatPercentInUse"%"
        $StatExitCode = 1
    }
    elseif ( $StatPercentInUse -ge $ScopePercentInUse_HighCritical ) {
        Write-Host "CRITICAL: Scope " $StatScopeID "use is" $StatPercentInUse"%"
        $StatExitCode = 2
    }
    elseif (( $StatPercentInUse -le $ScopePercentInUse_LowWarning ) -and ( $StatPercentInUse -gt $ScopePercentInUse_LowCritical )) {
        Write-Host "WARNING: Scope" $StatScopeID "use is" $StatPercentInUse"%"
        $StatExitCode = 1
    }
    elseif ( $StatPercentInUse -le $ScopePercentInUse_LowCritical ) {
        Write-Host "CRITICAL: Scope " $StatScopeID "use is" $StatPercentInUse"%"
        $StatExitCode = 2
    }
    elseif ( $StatPercentInUse -eq $Null ) {
        Write-Host "CRITICAL: Scope usage NOT returned!"
        $StatExitCode = 2
    }
    if (( $StatExitCode -eq 0 ) -and ( $exitcode -eq 0 )) { $exitcode = 0 }
    if (( $StatExitCode -eq 1 ) -and ( $exitcode -le 1 )) { $exitcode = 1 }
    if (( $StatExitCode -eq 2 ) -and ( $exitcode -le 2 )) { $exitcode = 2 }
    $ExitCodeInc++
}

exit $exitcode

# check_vm_repl.ps1

try{
    $vms = Get-VM | Select-Object -Property VMName,VMId,Generation,Path,State,Status,ReplicationMode,ReplicationHealth
    $replications =  @($vms | Where {$_.ReplicationMode -in @("Primary","Replica")} )
    $healthy = @($vms | Where {$_.ReplicationHealth -eq "Normal"} )
    $warning = @($vms | Where {$_.ReplicationHealth -eq "Warning"} )
    $critical  = @($vms | Where {$_.ReplicationHealth -eq "Critical"} )
}
catch{
    Write-Host $_.Exception.Message
    exit 3
}
finally{
    If(@($critical).count -gt 0){
    	Write-Host "$($critical.count) VMs in critical state: $(($critical | select -ExpandProperty VMName) -join `",`")"
    	exit 2
    }
    ElseIf(@($warning).count -gt 0){
    	Write-Host "$($warning.count) VMs in warning state: $(($warning | select -ExpandProperty VMName) -join `",`")"
    	exit 1
    }
    ElseIf(@($healthy).count -eq @($replications).count){
        Write-Host "$($healthy.count) VMs in healthy state. $($replications.count) VMs replicating. $($vms.count) VMs total."
        exit 0
    }
    Else{
        Write-Host "Unknown error"
        exit 3
    }
}

# nsclient.conf

# If you want to fill this file with all avalible options run the following command:
#   nscp settings --generate --add-defaults --load-all
# If you want to activate a module and bring in all its options use:
#   nscp settings --activate-module <MODULE NAME> --add-defaults
# For details run: nscp settings --help


; Undocumented section
[/settings/default]

; Undocumented key
password = frAQBc8Wsa1xVPfv

; ALLOWED HOSTS - A comaseparated list of allowed hosts. You can use netmasks (/ syntax) or * to create ranges.
allowed hosts = 127.0.0.1,::1, 192.168.0.1


; Undocumented section
[/settings/NRPE/server]

; VERIFY MODE - Comma separated list of verification flags to set on the SSL socket.  default-workarounds        Various workarounds for what I understand to be broken ssl implementations no-sslv2        Do not use the SSLv2 protocol. no-sslv3        Do not use the SSLv3 protocol. no-tlsv1        Do not use the TLSv1 protocol. single-dh-use        Always create a new key when using temporary/ephemeral DH parameters. This option must be used to prevent small subgroup attacks, when the DH parameters were not generated using "strong" primes (e.g. when using DSA-parameters).  
ssl options =

; VERIFY MODE - Comma separated list of verification flags to set on the SSL socket.  none        The server will not send a client certificate request to the client, so the client will not send a certificate. peer        The server sends a client certificate request to the client and the certificate returned (if any) is checked. fail-if-no-cert        if the client did not return a certificate, the TLS/SSL handshake is immediately terminated. This flag must be used together with peer. peer-cert        Alias for peer and fail-if-no-cert. workarounds        Various bug workarounds. single        Always create a new key when using tmp_dh parameters. client-once        Only request a client certificate on the initial TLS/SSL handshake. This flag must be used together with verify-peer  
verify mode = none

; ALLOW INSECURE CHIPHERS and ENCRYPTION - Only enable this if you are using legacy check_nrpe client.
insecure = true


; Undocumented section
[/modules]
NSClientServer=enabled
CheckSystem=enabled
CheckDisk=enabled

; NRPEServer - A server that listens for incoming NRPE connection and processes incoming requests.
NRPEServer = 1

; CheckSystem - Various system related checks, such as CPU load, process state, service state memory usage and PDH counters.
CheckSystem = 1

; CheckExternalScripts - Execute external scripts
CheckExternalScripts = 1

; CheckHelpers - Various helper function to extend other checks.
CheckHelpers = 1

; CheckEventLog - Check for errors and warnings in the event log.
CheckEventLog = 1

; CheckNSCP - Use this module to check the healt and status of NSClient++ it self
CheckNSCP = 1

; CheckDisk - CheckDisk can check various file and disk related things.
CheckDisk = 1


; A list of templates for wrapped scripts.
%SCRIPT% will be replaced by the actual script an %ARGS% will be replaced by any given arguments.
[/settings/external scripts/wrappings]

; POWERSHELL WRAPPING -
ps1 = cmd /c echo scripts\\%SCRIPT% %ARGS%; exit($lastexitcode) | powershell.exe -command -

; BATCH FILE WRAPPING -
bat = scripts\\%SCRIPT% %ARGS%

; VISUAL BASIC WRAPPING -
vbs = cscript.exe //T:30 //NoLogo scripts\\lib\\wrapper.vbs %SCRIPT% %ARGS%

[/settings/external scripts/scripts]
check_dhcp_scope=cscript.exe //T:30 //NoLogo scripts\\check_dhcp_scope.vbs
check_vm_repl=powershell -file scripts/custom/check_vm_repl.ps1


; A list of aliases available.
An alias is an internal command that has been predefined to provide a single command without arguments. Be careful so you don't create loops (ie check_loop=check_a, check_a=check_loop)
[/settings/external scripts/alias]

; alias_volumes_loose - Alias for alias_volumes_loose. To configure this item add a section called: /settings/external scripts/alias/alias_volumes_loose
alias_volumes_loose = check_drivesize

; alias_volumes - Alias for alias_volumes. To configure this item add a section called: /settings/external scripts/alias/alias_volumes
alias_volumes = check_drivesize

; alias_sched_all - Alias for alias_sched_all. To configure this item add a section called: /settings/external scripts/alias/alias_sched_all
alias_sched_all = check_tasksched show-all "syntax=${title}: ${exit_code}" "crit=exit_code ne 0"

; alias_process_stopped - Alias for alias_process_stopped. To configure this item add a section called: /settings/external scripts/alias/alias_process_stopped
alias_process_stopped = check_process "process=$ARG1$" "crit=state != 'stopped'"

; alias_service - Alias for alias_service. To configure this item add a section called: /settings/external scripts/alias/alias_service
alias_service = check_service

; alias_process_hung - Alias for alias_process_hung. To configure this item add a section called: /settings/external scripts/alias/alias_process_hung
alias_process_hung = check_process "filter=is_hung" "crit=count>0"

; alias_process_count - Alias for alias_process_count. To configure this item add a section called: /settings/external scripts/alias/alias_process_count
alias_process_count = check_process "process=$ARG1$" "warn=count > $ARG2$" "crit=count > $ARG3$"

; alias_process - Alias for alias_process. To configure this item add a section called: /settings/external scripts/alias/alias_process
alias_process = check_process "process=$ARG1$" "crit=state != 'started'"

; alias_mem - Alias for alias_mem. To configure this item add a section called: /settings/external scripts/alias/alias_mem
alias_mem = check_memory

; alias_file_size - Alias for alias_file_size. To configure this item add a section called: /settings/external scripts/alias/alias_file_size
alias_file_size = check_files "path=$ARG1$" "crit=size > $ARG2$" "top-syntax=${list}" "detail-syntax=${filename] ${size}" max-dir-depth=10

; alias_disk - Alias for alias_disk. To configure this item add a section called: /settings/external scripts/alias/alias_disk
alias_disk = check_drivesize
check_c = check_drivesize "crit=free<5%" "warn=free<10%" drive=c:

; alias_cpu_ex - Alias for alias_cpu_ex. To configure this item add a section called: /settings/external scripts/alias/alias_cpu_ex
alias_cpu_ex = check_cpu "warn=load > $ARG1$" "crit=load > $ARG2$" time=5m time=1m time=30s

; alias_file_age - Alias for alias_file_age. To configure this item add a section called: /settings/external scripts/alias/alias_file_age
alias_file_age = check_files "path=$ARG1$" "crit=written > $ARG2$" "top-syntax=${list}" "detail-syntax=${filename] ${written}" max-dir-depth=10

; alias_cpu - Alias for alias_cpu. To configure this item add a section called: /settings/external scripts/alias/alias_cpu
alias_cpu = check_cpu

; alias_event_log - Alias for alias_event_log. To configure this item add a section called: /settings/external scripts/alias/alias_event_log
alias_event_log = check_eventlog

; alias_service_ex - Alias for alias_service_ex. To configure this item add a section called: /settings/external scripts/alias/alias_service_ex
alias_service_ex = check_service "exclude=Net Driver HPZ12" "exclude=Pml Driver HPZ12" exclude=stisvc

; alias_up - Alias for alias_up. To configure this item add a section called: /settings/external scripts/alias/alias_up
alias_up = check_uptime

; alias_disk_loose - Alias for alias_disk_loose. To configure this item add a section called: /settings/external scripts/alias/alias_disk_loose
alias_disk_loose = check_drivesize

; alias_sched_task - Alias for alias_sched_task. To configure this item add a section called: /settings/external scripts/alias/alias_sched_task
alias_sched_task = check_tasksched show-all "filter=title eq '$ARG1$'" "detail-syntax=${title} (${exit_code})" "crit=exit_code ne 0"

; alias_sched_long - Alias for alias_sched_long. To configure this item add a section called: /settings/external scripts/alias/alias_sched_long
alias_sched_long = check_tasksched "filter=status = 'running'" "detail-syntax=${title} (${most_recent_run_time})" "crit=most_recent_run_time < -$ARG1$"
