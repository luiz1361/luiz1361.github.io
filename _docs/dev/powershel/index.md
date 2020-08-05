```
﻿$OU = "OU=x,OU=x,OU=x,DC=x,DC=x"
# Hash table of user logon counts.
$Logons = @{ }

# Enumerate every Domain Controller in the domain.
$DCs = Get-ADDomainController -Filter *
ForEach ($DC In $DCs) {
    $Server = $DC.Name
    # Retrieve sAMAccountName and logonCount for all users on this DC.
    $Users = Get-ADUser -SearchBase $OU -filter * -Properties sAMAccountName, title, logonCount -Server $($Server)
    ForEach ($User In $Users) {
        $Name = $User.sAMAccountName
        $Count = $User.logonCount
        If ($Logons.ContainsKey("$Name")) {
            # Sum logon counts.
            $Logons["$Name"] = $Logons["$Name"] + $Count
        }
        Else {
            $Logons.Add("$Name", $Count)
        }
    }
}

$Logons.GetEnumerator() | sort Value
```
---
title: Powershell - ad_users_to_csv_export.ps1
category: Dev
---

```
###########################################################
# AUTHOR  : Victor Ashiedu
# WEBSITE : iTechguides.com
# BLOG    : iTechguides.com/blog-2/
# CREATED : 08-08-2014
# UPDATED : 19-09-2014
# COMMENT : This script exports Active Directory users
#           to a a csv file. v2.1 adds the condition to
#           ignore all users with the info (Notes) field
#           found on the Telephones tab containing the
#           word 'Migrated'.
###########################################################


#Define location of my script variable
#the -parent switch returns one directory lower from directory defined.
#below will return up to ImportADUsers folder
#and since my files are located here it will find it.
#It failes withpout appending "*.*" at the end

$path = Split-Path -parent "C:\x\*.*"

#Create a variable for the date stamp in the log file

$LogDate = get-date -f yyyyMMddhhmm

#Define CSV and log file location variables
#they have to be on the same location as the script

$csvfile = $path + "\ALLADStaffUsers_$logDate.csv"

#import the ActiveDirectory Module

Import-Module ActiveDirectory


#Sets the OU to do the base search for all user accounts, change as required.
#Simon discovered that some users were missing
#I decided to run the report from the root of the domain

$SearchBase = "DC=x,DC=x"

#Get Admin accountb credential

$GetAdminact = Get-Credential

#Define variable for a server with AD web services installed

$ADServer = 'x'

#Find users that are not disabled
#To test, I moved the following users to the OU=ADMigration:
#Philip Steventon (kingston.gov.uk/RBK Users/ICT Staff/Philip Steventon) - Disabled account
#Joseph Martins (kingston.gov.uk/RBK Users/ICT Staff/Joseph Martins) - Disabled account
#may have to get accountb status with another AD object

#Define "Account Status"
#Added the Where-Object clause on 23/07/2014
#Requested by the project team. This 'flag field' needs
#updated in the import script when users fields are updated
#The word 'Migrated' is added in the Notes field, on the Telephone tab.
#The LDAB object name for Notes is 'info'.

$AllADUsers = Get-ADUser -server $ADServer `
    -Credential $GetAdminact -searchbase $SearchBase `
    -Filter * -Properties * | Where-Object { $_.info -NE 'Migrated' } #ensures that updated users are never exported.

$AllADUsers |
Select-Object @{Label = "First Name"; Expression = { $_.GivenName } },
@{Label = "Last Name"; Expression = { $_.Surname } },
@{Label = "Display Name"; Expression = { $_.DisplayName } },
@{Label = "Logon Name"; Expression = { $_.sAMAccountName } },
@{Label = "Full address"; Expression = { $_.StreetAddress } },
@{Label = "City"; Expression = { $_.City } },
@{Label = "State"; Expression = { $_.st } },
@{Label = "Post Code"; Expression = { $_.PostalCode } },
@{Label = "Country/Region"; Expression = { if (($_.Country -eq 'GB')  ) { 'United Kingdom' } Else { '' } } },
@{Label = "Job Title"; Expression = { $_.Title } },
@{Label = "UserPrincipalName"; Expression = { $_.UserPrincipalName } },
@{Label = "Company"; Expression = { $_.Company } },
@{Label = "Directorate"; Expression = { $_.Description } },
@{Label = "Department"; Expression = { $_.Department } },
@{Label = "Office"; Expression = { $_.OfficeName } },
@{Label = "Phone"; Expression = { $_.telephoneNumber } },
@{Label = "Email"; Expression = { $_.Mail } },
@{Label = "Manager"; Expression = { % { (Get-AdUser $_.Manager -server $ADServer -Properties DisplayName).DisplayName } } },
@{Label = "Account Status"; Expression = { if (($_.Enabled -eq 'TRUE')  ) { 'Enabled' } Else { 'Disabled' } } }, # the 'if statement# replaces $_.Enabled
@{Label = "ProxyAddresses"; Expression = { $_.ProxyAddresses } },
@{Label = "Last LogOn Date"; Expression = { $_.lastlogondate } } |

#Export CSV report

Export-Csv -Path $csvfile -NoTypeInformation
```
---
title: Powershell - attributes_copy.ps1
category: Dev
---

**The command below searches for x@x.x, get two attributes Title and sAMAccountName and inserts the content of sAMAccountName on the Title attribute. The "First 1" limits the results in case of LDAPFilter *:**
```
Get-ADUser -LDAPFilter '(sAMAccountName=x)' -Properties Title, sAMAccountName | Select-Object * -First 1 | ForEach-Object { Set-ADObject -Identity $_.DistinguishedName ` -Replace @{Title = $($_.sAMAccountName) } }
```

**Same as above but replacing every single user, title = sAMAccountName:**
```
Get-ADUser -LDAPFilter '(sAMAccountName=*)' -Properties Title, sAMAccountName | ForEach-Object { Set-ADObject -Identity $_.DistinguishedName ` -Replace @{Title = $($_.sAMAccountName) } }
```

***
**Sources:**
* https://blogs.technet.microsoft.com/ashleymcglone/2012/07/23/how-to-copy-ad-user-attributes-to-another-field-with-powershell/
---
title: Powershell - bulk_mail_sending.ps1
category: Dev
---

Maillist.csv requires two columns Name and Email

```
Clear-Host
$FilePath = "C:\x\maillist.csv"
$Getaddress = Import-csv $FilePath
$userid = 'x@x.x'
$creds = Get-Credential $userid

Foreach ($Address in $Getaddress) {
    $MailMessage = "<html>
<head>
<meta http-equiv=Content-Type content='text/html; charset=windows-1252'>
<meta name=Generator content='Microsoft Word 15 (filtered)'>
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:'Cambria Math';
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:Calibri;
	panose-1:2 15 5 2 2 2 4 3 2 4;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0cm;
	margin-bottom:.0001pt;
	font-size:11.0pt;
	font-family:'Calibri',sans-serif;}
a:link, span.MsoHyperlink
	{color:blue;
	text-decoration:underline;}
a:visited, span.MsoHyperlinkFollowed
	{color:#954F72;
	text-decoration:underline;}
.MsoChpDefault
	{font-family:'Calibri',sans-serif;}
.MsoPapDefault
	{margin-bottom:8.0pt;
	line-height:107%;}
@page WordSection1
	{size:595.3pt 841.9pt;
	margin:72.0pt 72.0pt 72.0pt 72.0pt;}
div.WordSection1
	{page:WordSection1;}
-->
</style>

</head>

<body lang=EN-IE link=blue vlink='#954F72'>

<div class=WordSection1>

<p class=MsoNormal>&nbsp;</p>

<p class=MsoNormal>Hi $($Address.Name),</p>

<p class=MsoNormal>&nbsp;</p>

...
...
...
...
...
...
...
...

<p class=MsoNormal>&nbsp;</p>

</div>

</body>

</html>"


    Send-mailmessage -To $Address.Email -from x@x.x -Credential $creds -subject "x security review - critical info about your x account" -BodyAsHtml -Body $MailMessage -Port 587 -UseSsl -SmtpServer smtp.office365.com
}
```
---
title: Powershell - mailboxes_size_list.ps1
category: Dev
---

```
################################################################################################################################################################
# Script accepts 3 parameters from the command line
#
# Office365Username - Mandatory - Administrator login ID for the tenant we are querying
# Office365Password - Mandatory - Administrator login password for the tenant we are querying
# UserIDFile - Optional - Path and File name of file full of UserPrincipalNames we want the Mailbox Size for.  Seperated by New Line, no header.
#
#
# To run the script
#
# .\Get-AllMailboxSizes.ps1 -Office365Username admin@xxxxxx.onmicrosoft.com -Office365Password Password123 -InputFile c:\Files\InputFile.txt
#
# NOTE: If you do not pass an input file to the script, it will return the sizes of ALL mailboxes in the tenant.  Not advisable for tenants with large
# user count (< 3,000)
#
# Author: 				Alan Byrne
# Version: 				1.0
# Last Modified Date: 	19/08/2012
# Last Modified By: 	Alan Byrne
################################################################################################################################################################

#Accept input parameters
Param(
    [Parameter(Position = 0, Mandatory = $true, ValueFromPipeline = $true)]
    [string] $Office365Username,
    [Parameter(Position = 1, Mandatory = $true, ValueFromPipeline = $true)]
    [string] $Office365Password,
    [Parameter(Position = 2, Mandatory = $false, ValueFromPipeline = $true)]
    [string] $UserIDFile
)

#Constant Variables
$OutputFile = "MailboxSizes.csv"   #The CSV Output file that is created, change for your purposes


#Main
Function Main {

    #Remove all existing Powershell sessions
    Get-PSSession | Remove-PSSession

    #Call ConnectTo-ExchangeOnline function with correct credentials
    ConnectTo-ExchangeOnline -Office365AdminUsername $Office365Username -Office365AdminPassword $Office365Password			

    #Prepare Output file with headers
    Out-File -FilePath $OutputFile -InputObject "UserPrincipalName,NumberOfItems,MailboxSize" -Encoding UTF8

    #Check if we have been passed an input file path
    if ($userIDFile -ne "") {
        #We have an input file, read it into memory
        $objUsers = import-csv -Header "UserPrincipalName" $UserIDFile
    }
    else {
        #No input file found, gather all mailboxes from Office 365
        $objUsers = get-mailbox -ResultSize Unlimited | select UserPrincipalName
    }

    #Iterate through all users
    Foreach ($objUser in $objUsers) {
        #Connect to the users mailbox
        $objUserMailbox = get-mailboxstatistics -Identity $($objUser.UserPrincipalName) | Select ItemCount, TotalItemSize

        #Prepare UserPrincipalName variable
        $strUserPrincipalName = $objUser.UserPrincipalName

        #Get the size and item count
        $ItemSizeString = $objUserMailbox.TotalItemSize.ToString()

        $strMailboxSize = "{0:F2}" -f ($ItemSizeString.SubString(($ItemSizeString.IndexOf("(") + 1), ($itemSizeString.IndexOf(" bytes") - ($ItemSizeString.IndexOf("(") + 1))).Replace(",", "") / 1024 / 1024)

        $strItemCount = $objUserMailbox.ItemCount


        #Output result to screen for debuging (Uncomment to use)
        #write-host "$strUserPrincipalName : $strLastLogonTime"

        #Prepare the user details in CSV format for writing to file
        $strUserDetails = "$strUserPrincipalName,$strItemCount,$strMailboxSize"

        #Append the data to file
        Out-File -FilePath $OutputFile -InputObject $strUserDetails -Encoding UTF8 -append
    }

    #Clean up session
    Get-PSSession | Remove-PSSession
}

###############################################################################
#
# Function ConnectTo-ExchangeOnline
#
# PURPOSE
#    Connects to Exchange Online Remote PowerShell using the tenant credentials
#
# INPUT
#    Tenant Admin username and password.
#
# RETURN
#    None.
#
###############################################################################
function ConnectTo-ExchangeOnline {   
    Param(
        [Parameter(
            Mandatory = $true,
            Position = 0)]
        [String]$Office365AdminUsername,
        [Parameter(
            Mandatory = $true,
            Position = 1)]
        [String]$Office365AdminPassword

    )

    #Encrypt password for transmission to Office365
    $SecureOffice365Password = ConvertTo-SecureString -AsPlainText $Office365AdminPassword -Force    

    #Build credentials object
    $Office365Credentials = New-Object System.Management.Automation.PSCredential $Office365AdminUsername, $SecureOffice365Password

    #Create remote Powershell session-
    $Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://ps.outlook.com/powershell -Credential $Office365credentials -Authentication Basic -AllowRedirection
    #Import the session
    Import-PSSession $Session -AllowClobber | Out-Null
}


# Start script
. Main
```
---
title: Powershell - ms_flow_filewatcher.ps1
category: Dev
---

```
$watcheron = New-Object System.IO.FileSystemWatcher
$watcheron.Path = "C:\Lock\"
$watcheron.Filter = "on.txt"
$watcheron.IncludeSubdirectories = $true
$watcheron.EnableRaisingEvents = $true  

$watcheroff = New-Object System.IO.FileSystemWatcher
$watcheroff.Path = "C:\Lock\"
$watcheroff.Filter = "off.txt"
$watcheroff.IncludeSubdirectories = $true
$watcheroff.EnableRaisingEvents = $true

$actionon = {
    Write-Host "on"
    ./plink.exe -i "C:\putty_priv.ppk" x@x.x.x.x sudo /root/mainton.sh
}    

$actionoff = {
    Write-Host "off"
    ./plink.exe -i "C:\putty_priv.ppk" x@x.x.x.x sudo /root/maintoff.sh
}    

Register-ObjectEvent $watcheron "Created" -Action $actionon
Register-ObjectEvent $watcheroff "Created" -Action $actionoff

while ($true) {
    $On = "C:\Lock\on.txt"
    if (Test-Path $On) {
        Remove-Item $On
    }

    $Off = "C:\Lock\off.txt"
    if (Test-Path $Off) {
        Remove-Item $Off
    }
    sleep 5
}
```
---
title: Powershel - ms_random_scripts.ps1
category: Dev
---

```
Try {
    Import-Module MsOnline -ErrorAction Stop
}
Catch {
    Write-Host "[ERROR]`t Some Module(s) couldn't be loaded. Script will stop!"
    Exit 1
}

$Uname = "x.x@x.x"
#read-host -assecurestring | convertfrom-securestring | out-file C:\x\securestring.txt  
$SecPass = Get-Content 'C:\x\securestring.txt' | ConvertTo-SecureString
$Credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $Uname, $SecPass
$Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://ps.outlook.com/powershell/ -Credential $Credentials -Authentication Basic -AllowRedirection
Import-PSSession $Session -AllowClobber
Connect-MsolService -Credential $Credentials

#Export all users mailbox size
#get-mailbox | get-mailboxstatistics | ft displayname, totalitemsize | Out-File "C:\x\output.txt" -Append

#list all users
#Get-Recipient -ResultSize Unlimited | select DisplayName,RecipientType,EmailAddresses | Export-Csv c:\email-recipients.csv

#Get summary MailboxUsageReport
#Get-MailboxUsageReport

#Get Mailbox details
#Get-Mailbox -Identity x.x@x.x | fl

#In order to check which user have auditing enabled or disabled
#get-mailbox | select UserPrincipalName,auditenabled,AuditDelegate,AuditAdmin

#Blank ImmutableId
Set-MsolUser -UserPrincipalName x@x.x -ImmutableId "$null"

#Get ImmutableId
#Get-MsolUser -UserPrincipalName x@x.x


#Get Mailbox usage
#Get-Mailbox -Identity x@x.x | get-mailboxstatistics | ft displayname, totalitemsize

#Set new UPN
#Set-MsolUserPrincipalName -UserPrincipalName x@x.x -NewUserPrincipalName x@x.x

#Remove from recycle bin
#Remove-MsolUser -UserPrincipalName x@x.x -RemoveFromRecycleBin

#Remove everyone from recycle bin
#$AllDeletedUsers = Get-MsolUser -ReturnDeletedUsers
#ForEach ($DELLUser in $AllDeletedUsers){
#    Remove-MsolUser -UserPrincipalName $DELLUser.UserPrincipalName -RemoveFromRecycleBin Force
#}

#Get User details
#get-user -Identity "x@x.x" | select identity, whenCreated, whenChanged

#Update Proxy Addresses based on csv single column 'upn'
#$UTF8CSV1 = "C:\x\proxyadd.csv"
#Import-CSV $UTF8CSV1 | ForEach-Object {
#$upn = $_.upn
#$proxyadd = "SMTP:"+$upn
#$userP = ""
#$userP = Get-ADUser -Server "x.x.x.x" -Properties ProxyAddresses -Filter "UserPrincipalName -eq '$upn'"
#$userP.ProxyAddresses = $proxyadd
#Set-ADUser -instance $userP
#}

#Add user to group
#Add-ADGroupMember -Server "x.x.x.x" "Groupx" x

#Remove user from group
#Remove-ADGroupMember -Server "x.x.x.x" "Groupx" x


#Get OU Path of list of samaccountname
#$UTF8CSV1 = "C:\x\proxyadd.csv"
#Import-CSV $UTF8CSV1 | ForEach-Object {
#    $upn = $_.upn
#    $userP = ""
##    Remove-MsolUser -UserPrincipalName "$upn" -Force
#    $userP = Get-ADUser -Server "x.x.x.x" -Properties CanonicalName -Filter "samAccountName -eq '$upn'"
#    Write-Output "$userP"
#}


#Get rid of x.x.x.x secondary e-mail address for all distribution lists based on csv export from frontend
#$UTF8CSV1 = "C:\x\test.csv"
#Import-CSV $UTF8CSV1 | ForEach-Object {
#    $disp = Get-DistributionGroup -Identity $_.alias | Select-Object -ExpandProperty PrimarySMTPAddress
#    Write-Output $disp
#    Set-DistributionGroup -Identity $_.email -EmailAddresses $disp
#}

#List count of login attempts per DC
#get-aduser -filter * -Properties logoncount -server sahara | select name,logonCount | sort logoncount

Remove-PSSession $Session
```
---
title: Powershell - o365_distributiongroupmember_export.ps1
category: Dev
---

```
Try {
    Import-Module MsOnline -ErrorAction Stop
}
Catch {
    Write-Host "[ERROR]`t Some Module(s) couldn't be loaded. Script will stop!"
    Exit 1
}

$Uname = "x@x.x"
#read-host -assecurestring | convertfrom-securestring | out-file C:\x\securestring.txt  
$SecPass = cat C:\x\securestring.txt | convertto-securestring
$Credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $Uname, $SecPass
$Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://ps.outlook.com/powershell/ -Credential $Credentials -Authentication Basic -AllowRedirection
Import-PSSession $Session -AllowClobber
Connect-MsolService -Credential $Credentials


<#

.Requires -version 2 - Runs in Exchange Management Shell

.SYNOPSIS
.\DistributionGroupMemberReport.ps1 - It Can Display all the Distribution Group and its members on a List

Or It can Export to a CSV file


Example 1

[PS] C:\DG>.\DistributionGroupMemberReport.ps1


Distribution Group Member Report
----------------------------

1.Display in Shell

2.Export to CSV File

Choose The Task: 1

DisplayName                   Alias                         Primary SMTP address          Distriubtion Group
-----------                   -----                         --------------------          ------------------
Atlast1                       Atlast1                       Atlast1@targetexchange.in     Test1
Atlast2                       Atlast2                       Atlast2@careexchange.in       Test1
Blink                         Blink                         Blink@targetexchange.in       Test1
blink1                        blink1                        blink1@targetexchange.in      Test1
User2                         User2                         User2@careexchange.in         Test11
User3                         User3                         User3@careexchange.in         Test11
User4                         User4                         User4@careexchange.in         Test11
WithClient                    WithClient                    WithClient@careexchange.in    Test11
Blink                         Blink                         Blink@targetexchange.in       Test11
blink1                        blink1                        blink1@targetexchange.in      Test11

Example 2

[PS] C:\DG>.\DistributionGroupMemberReport.ps1


Distribution Group Member Report
----------------------------

1.Display in Shell

2.Export to CSV File

Choose The Task: 2
Enter the Path of CSV file (Eg. C:\DG.csv): C:\DGmembers.csv

.Author
Written By: Satheshwaran Manoharan

Change Log
V1.0, 11/10/2012 - Initial version

Change Log
V1.1, 02/07/2014 - Added "Enter the Distribution Group name with Wild Card"

Change Log
V1.2, 19/07/2014 - Added "Recipient OU,Distribution Group Primary SMTP address,Distribution Group Managers,Distribution Group OU"
V1.2.1, 19/07/2014 - Added "Option- Enter the Distribution Group name with Wild Card (Display)"
V1.2.2, 19/07/2014 - Added "Fixed "Hashtable-to-Object conversion is not supported in restricted language mode or a Data section"
V1.3,05/08/2014 - Hashtable-to-Object conversion is not supported - Fixed
V1.4,30/08/2015 -
Removed For loops - As its not listing distribution groups which has one member.
Added Value for Empty groups. It will list empty groups now as well.
V1.5,09/09/2015 - Progress Bars while exporting to CSV
#>

Write-host "

Distribution Group Member Report
----------------------------

1.Display in Exchange Management Shell

2.Export to CSV File

3.Enter the Distribution Group name with Wild Card (Export)

4.Enter the Distribution Group name with Wild Card (Display)

Dynamic Distribution Group Member Report
----------------------------

5.Display in Exchange Management Shell

6.Export to CSV File

7.Enter the Dynamic Distribution Group name with Wild Card (Export)

8.Enter the Dynamic Group name with Wild Card (Display)"-ForeGround "Cyan"

#----------------
# Script
#----------------

Write-Host "               "

$number = Read-Host "Choose The Task"
$output = @()
switch ($number) {

    1 {

        $AllDG = Get-DistributionGroup -resultsize unlimited
        Foreach ($dg in $allDg) {
            $Members = Get-DistributionGroupMember $Dg.name -resultsize unlimited


            if ($members.count -eq 0) {
                $userObj = New-Object PSObject
                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                Write-Output $Userobj
            }
            else {
                Foreach ($Member in $members) {
                    $userObj = New-Object PSObject
                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $member.Alias
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    Write-Output $Userobj
                }

            }

        }

        ; Break
    }

    2 {

        $i = 0

        $CSVfile = Read-Host "Enter the Path of CSV file (Eg. C:\DG.csv)"

        $AllDG = Get-DistributionGroup -resultsize unlimited

        Foreach ($dg in $allDg) {
            $Members = Get-DistributionGroupMember $Dg.name -resultsize unlimited

            if ($members.count -eq 0) {
                $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                $userObj = New-Object PSObject

                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "RecipientType" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.GroupType
                $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                $output += $UserObj  

            }
            else {
                Foreach ($Member in $members) {

                    $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                    $userObj = New-Object PSObject

                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $Member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $Member.Alias
                    $userObj | Add-Member NoteProperty -Name "RecipientType" -Value $Member.RecipientType
                    $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value $Member.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $Member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                    $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.GroupType
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                    $output += $UserObj  

                }
            }
            # update counters and write progress
            $i++
            Write-Progress -activity "Scanning Groups . . ." -status "Scanned: $i of $($allDg.Count)" -percentComplete (($i / $allDg.Count) * 100)
            $output | Export-csv -Path $CSVfile -NoTypeInformation

        }

        ; Break
    }

    3 {

        $i = 0

        $CSVfile = Read-Host "Enter the Path of CSV file (Eg. C:\DG.csv)"

        $Dgname = Read-Host "Enter the DG name or Range (Eg. DGname , DG*,*DG)"

        $AllDG = Get-DistributionGroup $Dgname -resultsize unlimited

        Foreach ($dg in $allDg)
        {

            $Members = Get-DistributionGroupMember $Dg.name -resultsize unlimited

            if ($members.count -eq 0) {
                $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                $userObj = New-Object PSObject

                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "RecipientType" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.GroupType
                $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                $output += $UserObj  

            }
            else {
                Foreach ($Member in $members) {

                    $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                    $userObj = New-Object PSObject

                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $Member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $Member.Alias
                    $userObj | Add-Member NoteProperty -Name "RecipientType" -Value $Member.RecipientType
                    $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value $Member.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $Member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                    $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.GroupType
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                    $output += $UserObj  

                }
            }
            # update counters and write progress
            $i++
            Write-Progress -activity "Scanning Groups . . ." -status "Scanned: $i of $($allDg.Count)" -percentComplete (($i / $allDg.Count) * 100)
            $output | Export-csv -Path $CSVfile -NoTypeInformation

        }

        ; Break
    }

    4 {

        $Dgname = Read-Host "Enter the DG name or Range (Eg. DGname , DG*,*DG)"

        $AllDG = Get-DistributionGroup $Dgname -resultsize unlimited

        Foreach ($dg in $allDg)
        {

            $Members = Get-DistributionGroupMember $Dg.name -resultsize unlimited

            if ($members.count -eq 0) {
                $userObj = New-Object PSObject
                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                Write-Output $Userobj
            }
            else {
                Foreach ($Member in $members) {
                    $userObj = New-Object PSObject
                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $member.Alias
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    Write-Output $Userobj
                }

            }

        }

        ; Break
    }

    5 {

        $AllDG = Get-DynamicDistributionGroup -resultsize unlimited

        Foreach ($dg in $allDg)
        {

            $Members = Get-Recipient -RecipientPreviewFilter $dg.RecipientFilter -resultsize unlimited

            if ($members.count -eq 0) {
                $userObj = New-Object PSObject
                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                Write-Output $Userobj
            }
            else {
                Foreach ($Member in $members) {
                    $userObj = New-Object PSObject
                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $member.Alias
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    Write-Output $Userobj
                }

            }

        }

        ; Break
    }

    6 {
        $i = 0

        $CSVfile = Read-Host "Enter the Path of CSV file (Eg. C:\DYDG.csv)"

        $AllDG = Get-DynamicDistributionGroup -resultsize unlimited

        Foreach ($dg in $allDg)
        {

            $Members = Get-Recipient -RecipientPreviewFilter $dg.RecipientFilter -resultsize unlimited

            if ($members.count -eq 0) {
                $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                $userObj = New-Object PSObject

                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "RecipientType" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.RecipientType
                $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                $output += $UserObj  

            }
            else {
                Foreach ($Member in $members) {

                    $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                    $userObj = New-Object PSObject

                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $Member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $Member.Alias
                    $userObj | Add-Member NoteProperty -Name "RecipientType" -Value $Member.RecipientType
                    $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value $Member.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $Member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                    $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.RecipientType
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                    $output += $UserObj  

                }
            }
            # update counters and write progress
            $i++
            Write-Progress -activity "Scanning Groups . . ." -status "Scanned: $i of $($allDg.Count)" -percentComplete (($i / $allDg.Count) * 100)
            $output | Export-csv -Path $CSVfile -NoTypeInformation

        }

        ; Break
    }

    7 {
        $i = 0

        $CSVfile = Read-Host "Enter the Path of CSV file (Eg. C:\DYDG.csv)"

        $Dgname = Read-Host "Enter the DG name or Range (Eg. DynmicDGname , Dy*,*Dy)"

        $AllDG = Get-DynamicDistributionGroup $Dgname -resultsize unlimited

        Foreach ($dg in $allDg)
        {

            $Members = Get-Recipient -RecipientPreviewFilter $dg.RecipientFilter -resultsize unlimited

            if ($members.count -eq 0) {
                $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                $userObj = New-Object PSObject

                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "RecipientType" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmptyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.RecipientType
                $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                $output += $UserObj  

            }
            else {
                Foreach ($Member in $members) {

                    $managers = $Dg | Select @{Name = 'DistributionGroupManagers'; Expression = { [string]::join(";", ($_.Managedby)) } }

                    $userObj = New-Object PSObject

                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $Member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $Member.Alias
                    $userObj | Add-Member NoteProperty -Name "RecipientType" -Value $Member.RecipientType
                    $userObj | Add-Member NoteProperty -Name "Recipient OU" -Value $Member.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $Member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Primary SMTP address" -Value $DG.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Managers" -Value $managers.DistributionGroupManagers
                    $userObj | Add-Member NoteProperty -Name "Distribution Group OU" -Value $DG.OrganizationalUnit
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Type" -Value $DG.RecipientType
                    $userObj | Add-Member NoteProperty -Name "Distribution Group Recipient Type" -Value $DG.RecipientType

                    $output += $UserObj  

                }
            }
            # update counters and write progress
            $i++
            Write-Progress -activity "Scanning Groups . . ." -status "Scanned: $i of $($allDg.Count)" -percentComplete (($i / $allDg.Count) * 100)
            $output | Export-csv -Path $CSVfile -NoTypeInformation

        }

        ; Break
    }

    8 {

        $Dgname = Read-Host "Enter the Dynamic DG name or Range (Eg. DynamicDGname , DG*,*DG)"

        $AllDG = Get-DynamicDistributionGroup $Dgname -resultsize unlimited

        Foreach ($dg in $allDg)
        {

            $Members = Get-Recipient -RecipientPreviewFilter $dg.RecipientFilter -resultsize unlimited

            if ($members.count -eq 0) {
                $userObj = New-Object PSObject
                $userObj | Add-Member NoteProperty -Name "DisplayName" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Alias" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value EmtpyGroup
                $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                Write-Output $Userobj
            }
            else {
                Foreach ($Member in $members) {
                    $userObj = New-Object PSObject
                    $userObj | Add-Member NoteProperty -Name "DisplayName" -Value $member.Name
                    $userObj | Add-Member NoteProperty -Name "Alias" -Value $member.Alias
                    $userObj | Add-Member NoteProperty -Name "Primary SMTP address" -Value $member.PrimarySmtpAddress
                    $userObj | Add-Member NoteProperty -Name "Distribution Group" -Value $DG.Name
                    Write-Output $Userobj
                }

            }

        }

        ; Break
    }

    Default { Write-Host "No matches found , Enter Options 1 or 2" -ForeGround "red" }

}

Remove-PSSession $Session
```
---
title: Powershell - o365_lastlogin_export_change.ps1
category: Dev
---

```
################################################################################################################################################################
# Script accepts 3 parameters from the command line
#
# Office365Username - Mandatory - Administrator login ID for the tenant we are querying
# Office365Password - Mandatory - Administrator login password for the tenant we are querying
# UserIDFile - Optional - Path and File name of file full of UserPrincipalNames we want the Last Logon Dates for.  Seperated by New Line, no header.
#
#
# To run the script
#
# .\Get-LastLogonStats.ps1 -Office365Username admin@xxxxxx.onmicrosoft.com -Office365Password Password123 -InputFile c:\Files\InputFile.txt
#
# NOTE: If you do not pass an input file to the script, it will return the last logon time of ALL mailboxes in the tenant.  Not advisable for tenants with large
# user count (< 3,000)
#
# Author: 				Alan Byrne
# Version: 				1.0
# Last Modified Date: 	16/08/2012
# Last Modified By: 	Alan Byrne
################################################################################################################################################################

#Accept input parameters
Param(
    [Parameter(Position = 0, Mandatory = $true, ValueFromPipeline = $true)]
    [string] $Office365Username,
    [Parameter(Position = 1, Mandatory = $true, ValueFromPipeline = $true)]
    [string] $Office365Password,
    [Parameter(Position = 2, Mandatory = $false, ValueFromPipeline = $true)]
    [string] $UserIDFile
)

#Constant Variables
$OutputFile = "LastLogonDate.csv"   #The CSV Output file that is created, change for your purposes


#Main
Function Main {

    #Remove all existing Powershell sessions
    Get-PSSession | Remove-PSSession

    #Call ConnectTo-ExchangeOnline function with correct credentials
    ConnectTo-ExchangeOnline -Office365AdminUsername $Office365Username -Office365AdminPassword $Office365Password			

    #Prepare Output file with headers
    Out-File -FilePath $OutputFile -InputObject "UserPrincipalName,LastLogonDate" -Encoding UTF8

    #Check if we have been passed an input file path
    if ($userIDFile -ne "") {
        #We have an input file, read it into memory
        $objUsers = import-csv -Header "UserPrincipalName" $UserIDFile
    }
    else {
        #No input file found, gather all mailboxes from Office 365
        $objUsers = get-mailbox -ResultSize Unlimited | select UserPrincipalName
    }

    #Iterate through all users
    Foreach ($objUser in $objUsers) {
        #Connect to the users mailbox
        $objUserMailbox = get-mailboxstatistics -Identity $($objUser.UserPrincipalName) | Select LastLogonTime

        #Prepare UserPrincipalName variable
        $strUserPrincipalName = $objUser.UserPrincipalName

        #Check if they have a last logon time. Users who have never logged in do not have this property
        if ($objUserMailbox.LastLogonTime -eq $null) {
            #Never logged in, update Last Logon Variable
            $strLastLogonTime = "Never Logged In"
        }
        else {
            #Update last logon variable with data from Office 365
            $strLastLogonTime = $objUserMailbox.LastLogonTime
        }

        #Output result to screen for debuging (Uncomment to use)
        #write-host "$strUserPrincipalName : $strLastLogonTime"

        #Prepare the user details in CSV format for writing to file
        $strUserDetails = "$strUserPrincipalName,$strLastLogonTime"

        #Append the data to file
        Out-File -FilePath $OutputFile -InputObject $strUserDetails -Encoding UTF8 -append
    }

    #Clean up session
    Get-PSSession | Remove-PSSession
}

###############################################################################
#
# Function ConnectTo-ExchangeOnline
#
# PURPOSE
#    Connects to Exchange Online Remote PowerShell using the tenant credentials
#
# INPUT
#    Tenant Admin username and password.
#
# RETURN
#    None.
#
###############################################################################
function ConnectTo-ExchangeOnline {   
    Param(
        [Parameter(
            Mandatory = $true,
            Position = 0)]
        [String]$Office365AdminUsername,
        [Parameter(
            Mandatory = $true,
            Position = 1)]
        [String]$Office365AdminPassword

    )

    #Encrypt password for transmission to Office365
    $SecureOffice365Password = ConvertTo-SecureString -AsPlainText $Office365AdminPassword -Force    

    #Build credentials object
    $Office365Credentials = New-Object System.Management.Automation.PSCredential $Office365AdminUsername, $SecureOffice365Password

    #Create remote Powershell session
    $Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://ps.outlook.com/powershell -Credential $Office365credentials -Authentication Basic �AllowRedirection    	

    #Import the session
    Import-PSSession $Session -AllowClobber | Out-Null
}


# Start script
. Main
```
---
title: Powershell - smtp_proxyaddresses_change.ps1
category: Dev
---

Example on replacing SMTP proxyAddresses with sAMAccountName + hardcoded domain:

```
Import-Module ActiveDirectory
$users = Get-ADUser -Filter *

foreach ($user in $users) {
    $email = $user.samaccountname + '@domainName.com'
    $newemail = "SMTP:" + $email
    Set-ADUser $user -Add @{proxyAddresses = ($newemail) }
}
```

***
**Sources:**
* https://community.spiceworks.com/topic/410677-office-365-w-ad-sync-primary-email-address-woes
