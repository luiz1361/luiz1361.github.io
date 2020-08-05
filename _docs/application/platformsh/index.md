# Disk Cleanup

**Search for files older than 200 days:**
```
find . -type f -mtime +200 -exec du -ks {} \; | cut -f1 | awk '{total=total+$1}END{print total/1024}'
```

**Delete files older than 200 days:**
```
find . -type f -mtime +200 -exec  rm {} \;
```

***
**Sources:**
* https://www.howtogeek.com/howto/ubuntu/delete-files-older-than-x-days-on-linux/

# Migration cloud to onprem

**Make sure this is set in /etc/php5/apache2/php.ini:**
```
upload_max_filesize = 64M
post_max_size = 64M
allow_url_fopen = On
```

**Change local settings on Drupal to remove old references ie. 'dev.x.x':**
```
/var/www/x/public/sites/default/*settings.php
```

**Changes to DB to increase the AUTO_INCREMENT in case we have loss of transactions for a while during migration or snapshot:**
```
select sid from webform_submissions order by sid desc; (Get latest)
ALTER TABLE webform_submissions AUTO_INCREMENT=XXXX; (Add much higher than retrieved above)
select nid from node order by nid desc; (Get latest)
ALTER TABLE node AUTO_INCREMENT = XXXXXX; (Add much higher than retrieved above)
```

**Make sure this is set in https://x.x.x/admin/config/media/file-system:**
```
Private file system path: ../private
```

**Ensure permissions is as follows:**
```
find /var/www/x -type f -exec chmod 664 {} \;
find /var/www/x -type d -exec chmod 775 {} \;
chown -R x-git-cd.www-data .*
```
