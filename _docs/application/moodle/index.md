# disable_mailing_for_non_prod

**Edit config.php on Moodle's root directory:**
```
$CFG->noemailever = true;
```

***
**Sources:**
* https://peejseej.nl/2012/10/disable-emails-in-moodle/


# Reset Admin Password

**Changing password via DB directly:**
```
select * from mdl_user where username= 'x';
update mdl_user set password = 'x' where username = 'x';
```
> That will require the password to be a hash so to generate a hash: http://www.md5hashgenerator.com/

**Changing password via CLI using PHP admin scripts:**
```
sudo -u apache /usr/bin/php admin/cli/reset_password.php
```
