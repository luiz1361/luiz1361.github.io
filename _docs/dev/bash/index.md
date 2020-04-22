---
title: BASH
permalink: /docs/dev/bash/
---
---
title: Bash - find_mac_address.sh
category: Dev
---

```
#!/bin/bash

declare -a uplinks

# Iterate through each file in folder extra
for file in $(ls -1 ../extra); do

        # Declare an array uplinks
        declare -a uplinks

        filepath="../extra/$file"

        # For current device $filepath list ports with more than 1 occurence of MAC and store on array uplinks
        for uplink in $(cat $filepath | awk '{ print $3 }' | grep 'gi\|te\|Po' | sort -h | uniq -c | sed s/^[[:blank:]]*//g | grep -v ^1" " | awk '{ print $2 }'); do

                # Append to array
                uplinks+=($uplink)

        done

        echo Switch export file: ../extra/$file

        # Separate each item from array by \| and remove \| from beginning of line.
        # This '\|gi26\|gi27\|gi28' becomes this 'gi26\|gi27\|gi28'
        filter=$(printf '\|%s' "${uplinks[@]}" | sed s/^\\\\\|//g)

        echo Uplink ports filtered out from switch: \'$filter\'

        # The grep -v takes $w a list of uplink ports for OR rule
        eval cat $filepath | grep -v $filter

        #Clear array for next iteration
        uplinks=()

        # Search Switch and store, search Uplink and store, search for $1(MAC) and found print them all
done | awk '/^Switch/ {switch_=$0} /^Uplink/ {uplink_=$0} /'"$1"'/ {print switch_ "\n" uplink_ "\n" $0}'
```
---
title: Bash - iterate_file_modify_output.sh
category: Dev
---

```
#!/bin/bash

# Iterate on file data.csv. Replace accordingly assuming it has two fields $1 and $2,

IFS=','

while read p; do
        echo "
        define host{
                use                     wap
                host_name               $(echo $p | awk '{ print $1}')
                alias                   $(echo $p | awk '{ print $1}')
                address                 $(echo $p | awk '{ print $2}')
        }"
done <data.csv
```
---
title: Bash - macfinder.sh
category: Dev
---

```
#!/bin/bash

declare -a uplinks

# Iterate through each file in folder extra
for file in $(ls -1 ../extra); do

	# Declare an array uplinks
	declare -a uplinks

	filepath="../extra/$file"

	# For current device $filepath list ports with more than 1 occurence of MAC and store on array uplinks
	for uplink in $(cat $filepath | awk '{ print $3 }' | grep 'gi\|te\|Po' | sort -h | uniq -c | sed s/^[[:blank:]]*//g | grep -v ^1" " | awk '{ print $2 }'); do

		# Append to array
		uplinks+=($uplink)

	done

	echo Switch export file: ../extra/$file

	# Separate each item from array by \| and remove \| from beginning of line. This '\|gi26\|gi27\|gi28' becomes this 'gi26\|gi27\|gi28'
	filter=$(printf '\|%s' "${uplinks[@]}" | sed s/^\\\\\|//g)

	echo Uplink ports filtered out from switch: \'$filter\'

	# The grep -v takes $w a list of uplink ports for OR rule
	eval cat $filepath | grep -v $filter

	#Clear array for next iteration
	uplinks=()

	# Search Switch and store, search Uplink and store, search for $1(MAC) and found print them all
done | awk '/^Switch/ {switch_=$0} /^Uplink/ {uplink_=$0} /'"$1"'/ {print switch_ "\n" uplink_ "\n" $0}'
```
---
title: Bash - open_fake_ports.sh
category: Dev
---

```
#!/bin/bash

# This would open 500 ports from 4500 to 4999:

counter=4500

while [ $counter -lt 5000 ]; do
    nc -l -p $counter &
    let counter=$counter+1
done
```
---
title: Bash - pg_query.sh
category: Dev
---

```
#!/bin/bash

# Run query command as user postgres and append current date
su -c "psql -U postgres -d x -c \"select x from x where x = 'x';\"" postgres >>output.dmp && date >>output.dmp
```
---
title: Bash - rogue_ra_detector.sh
category: Dev
---

```
#!/bin/sh

DEVICE=eth0
TCPDUMP=/usr/sbin/tcpdump
PROGNAME="rogue_ra_detector.sh"
SLEEPTIME=3600
ALLOWED_RA_SERVERS="fe80::20e:cff:feb1:33a8"
EMAIL="root"

# load up a config
if [ -e "$1" ]; then
        source $1
else
        echo "Config file '$1' not found"
        exit
fi

MESSAGE1="$PROGNAME running on $(hostname) ($DEVICE) has detected what looks like \nrogue router advertisements:"
MESSAGE2="Sorry to be the bearer of bad news.  I'll sleep now for $SLEEPTIME seconds and start detecting again\n\n-- \n$PROGNAME\n"
TCPDUMP_COMMAND="$TCPDUMP -venxx -c 1 -i $DEVICE icmp6 and ip6[40] == 134 and src host not $ALLOWED_RA_SERVERS"
echo $TCPDUMP_COMMAND

# check tcpdump
[ ! -x "$TCPDUMP" ] && echo "$TCPDUMP not found or not executable" && exit 1

while (true); do
        COMMAND_OUTPUT=$($TCPDUMP_COMMAND)
        printf "$MESSAGE1\n\n$COMMAND_OUTPUT\n\n$MESSAGE2\n" | mail -s "Rogue IPv6 Router Adverts Detected on $DEVICE" $EMAIL
        sleep $SLEEPTIME
done
```
