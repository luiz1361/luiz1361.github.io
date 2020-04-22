---
title: MOOSH
permalink: /docs/application/moosh/
---
---
title: MOOSH
permalink: /docs/application/moosh/
---

# Bulk Backup Restore Courses

**Given a file with content as below per line which can be created based on ```sudo -u www-data moosh course-list | awk -F "," '{ print $1 "," $3}'```:**
```
"1234","XX - XXXX/XXX/XX"
```

**This will perform a backup to /var/backups/moodle/(courseshortcode):**
```
while read i; do \
echo $i |\
sed 's/\"//g' |\
sed 's/\//_/g' |\
awk -F ',' '{ print "time sudo -u www-data moosh course-backup -f " "'\''/var/backups/moodle/"$2".mbz'\'' " $1}';\
done < migrated_ok_id
```

**Transfer backup files over:**
```
rsync -ah --progress x@x.x.x:/var/backups/moodle/* /var/backups/moodle/.
```

**Given a folder with backup files as below:**
```
# ls -1 /var/backups/moodle
XXXX-X-XXX_XXXX_XX.mbz
```

**Format filenames to course shortcodes including / removing .mbz:**
```
ls -1 /var/backups/moodle | sed s/\_/\\//g | sed s/\.mbz$//g > /home/x/restore
```

**Get a list of course IDs for the backup courses above based on course shortcodes:**
```
sudo -u www-data moosh course-list | grep -f /home/x/restore | awk -F ',' '{ print $1 "," $3 }' | sed s/\"//g | sed s/\\//_/g | sed s/$/.mbz/g > /home/x/restore_clean
```

**Based on the backup files above and corresponding course ids based on course shortcodes perform the restore:**
```
while read i; do \
echo $i |\
awk -F ',' '{ print "time sudo -u www-data moosh course-restore -o " "'\''/var/backups/moodle/"$2"'\'' " $1}';\
done < restore_clean
```

# Clean Backup Files

**Clean backup files from all courses with extension .mbz:**
```
/usr/local/share/moodle/dublin/moodle# sudo -u www-data moosh file-list "component='backup'" | grep mbz | sudo -u www-data moosh file-delete -s
```

# Exporting Categories

```
sudo -u www-data moosh category-list |\
tail -n +2 | sed 's/ \{3,\}/\"\,\"/g' |\
sed 's/^/\"/g' |\
sed 's/$/\"/g' |\
sed 's/\,\"\"$//g' |\
awk -F '\"\,\"' '{ print $1 "%" $NF "/" $2 }' |\
sed s/\"//g |\
awk -F "/" 'NF==3' |\
awk -F "/" '{ print $1 "/" $2 "/" $3 }' |\
sed 's/\/$//g' |\
awk -F "/" 'NF==3' |\
sort -u -t% -k2,2 |\
awk -F "%" '{ print $2 "%" $1}' |\
grep -v 'Top/Archive\|Training & Development - Cork\|Top/Miscellaneous\|Part-Time\|Full-Time' |\
sed 's/Business Faculty/Business/g' |\
sed 's/Computing Science Faculty/Computing/g' |\
sed 's/Engineering Faculty/Engineering/g' |\
sed 's/Graduate Business School/GBS/g' |\
sed 's/Griffith Language Institute/GLI/g' |\
sed 's/Law Faculty/Law/g' |\
sed 's/Media Faculty/Media/g' |\
sed 's/English for Academic Purposes/English/g' > /home/x/test
```

**Resulting file format:**
Top/Professional Accountancy/Cork Campus%1761

**Loop on the file above and create the Staff Info pages on all faculties ie Computing > Dublin > Computing-Staff Info-Campus**
```
while read p; do \
echo $p |\
sed 's/\//%/g' |\
sed 's/ Campus//g' |\
sed 's/ campus//g' |\
awk -F "%" '{ print "sudo -u www-data moosh course-create --category " $NF " --fullname=\"" $2 "-Staff Info-" $3 "\" " "\"" $2 "-Staff Info-" $3 "\" " }'; \
done < /home/x/test
```

**Loop on the file above and create the Student Info pages on all faculties ie Computing > Dublin > Computing-Student Info-Campus**
```
while read p; do \
echo $p |\
sed 's/\//%/g' |\
sed 's/ Campus//g' |\
sed 's/ campus//g' |\
awk -F "%" '{ print "sudo -u www-data moosh course-create --category " $NF " --fullname=\"" $2 "-Student Info-" $3 "\" " "\"" $2 "-Student Info-" $3 "\" " }'; \
done < /home/x/test
```

# Set Course ID

**Based on a list of course ids will set their idnumber field as Faculty$(IDOFPARENTFACULTY)_Campus**

```  
#!/bin/bash

while read p;
do
        a=$(echo $p)
        b=$(echo "Faculty")

        #Returns faculty id based on course id of info page
        c=$(su -c "psql -U postgres -d moodle2018-utf8 -t -c \"SELECT MC2.id FROM mdl_course LEFT JOIN mdl_course_categories MC1 ON MC1.id=mdl_course.category LEFT JOIN mdl_course_categories MC2 ON MC2.id=MC1.parent LEFT JOIN mdl_course_categories MC3 ON MC3.id=MC2.parent LEFT JOIN mdl_course_categories MC4 ON MC4.id=MC3.parent WHERE mdl_course.id='$p';\"" postgres)
        #Returns campus name based on course id of info page
        d=$(su -c "psql -U postgres -d moodle2018-utf8 -t -c \"SELECT MC1.name FROM mdl_course LEFT JOIN mdl_course_categories MC1 ON MC1.id=mdl_course.category LEFT JOIN mdl_course_categories MC2 ON MC2.id=MC1.parent LEFT JOIN mdl_course_categories MC3 ON MC3.id=MC2.parent LEFT JOIN mdl_course_categories MC4 ON MC4.id=MC3.parent WHERE mdl_course.id='$p';\"" postgres)

                echo $a,$b,$c,$d >> output.dmp
done<test2
```

```
cat output.dmp | sed s/"Dublin Campus"/D/g | sed s/"Cork Campus"/C/g | sed s/"Limerick Campus"/L/g | sed s/"Moscow Campus"/M/g | sed s/"Waterford Campus"/W/g | sed s/"Virtual Campus"/V/g | sed s/"Dublin Tara St"/1/g | sed s/"Sarajevo Campus"/$/g | sed s/" "//g> clean2
```

```
cat clean2 | awk -F "," '{ print "update mdl_course set idnumber = '\''" $2 $3 "_" $4 "'\'' where id = '\''" $1 "'\'';"}'
```
