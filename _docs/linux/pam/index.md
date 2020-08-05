**Install the Google authenticator PAM module (as root user):**
```
apt-get install libpam-google-authenticator
```
**Enable the PAM module (as root user):**
```
echo "auth required pam_google_authenticator.so nullok" >> /etc/pam.d/common-auth
```

**Generate a key file and initialize the thing for your user account with:**
```
google-authenticator
```

**Setup a new account on the Google authenticator app on the phone with the supplied QR code / secret key from the above command.**

>And that should be it. Requiring the PAM module at /etp/pam.d/common-authensures TFA is applied across all authentication channels (ssh, console, and desktop at the least) while the nullok parameter ensures you don’t end up locking yourself out if you haven’t setup your account for it.

>I dislike how the instructions don’t necessarily elaborate on “where” exactly the auth line goes. It goes in /etc/pam.d/sshd if you’re looking to secure SSH only, right below where common-auth is included. Cheers!

***
**Sources:**
* https://blog.teststation.org/ubuntu/2016/05/20/enable-two-factor-authentication-on-ubuntu-16.04/
