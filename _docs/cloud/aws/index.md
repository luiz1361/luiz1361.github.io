---
title: AWS
permalink: /docs/cloud/aws/
---
---
title: AWS - KMS
category: Cloud
---

**Encrypt:**

```
aws kms encrypt --region="eu-west-1" --key-id xxx --plaintext file://secrets.json --output text --query CiphertextBlob | base64 --decode > secrets.encrypted.json
```

**Decrypt:**
```
aws kms decrypt --region="eu-west-1" --ciphertext-blob fileb://secrets.encrypted --output text --query Plaintext | base64 --decode > secrets.decrypted
```
---
title: AWS - S3
category: Cloud
---

**S3**
```
aws s3 cp s3://xxx/secrets.tar.gz .
tar zxvf secrets.tar.gz
```
