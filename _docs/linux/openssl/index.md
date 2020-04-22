---
title: OPENSSL
permalink: /docs/linux/openssl/
---
---
title: Openssl - PEM to PFX
category: Linux
---

**Take .pem private key and .cert public key and export as combined .pfx:**
```
openssl pkcs12 -inkey bob_key.pem -in bob_cert.cert -export -out bob_pfx.pfx
```

***
**Sources:**
* https://stackoverflow.com/questions/808669/convert-a-cert-pem-certificate-to-a-pfx-certificate
---
title: Openssl - Self Sign Cert
category: Linux
---

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout mysitename.key -out mysitename.crt
```

***
**Sources:**
* https://www.sslshopper.com/article-how-to-create-and-install-an-apache-self-signed-certificate.html
