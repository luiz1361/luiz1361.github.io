````
echo "Test" | mail -a "From: Someone <someone@example.com>" \
                   -a "Subject: This as a test" \
                   -a "X-Custom-Header: yes" other@example.com
```

***
**Sources:**
* http://stackoverflow.com/questions/6537297/how-to-change-sender-name-not-email-address-when-using-the-linux-mail-command
