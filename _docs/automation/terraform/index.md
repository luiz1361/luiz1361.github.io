---
title: TERRAFORM
permalink: /docs/automation/terraform/
---
---
title: Terraform - Random
category: Automation
---

**Initialize Terraform on current folder**
terraform init
>It downloads any required modules by reading all .tf files on current folder.

**Dry-run**
terraform plan

**Execute non-interactively**
terraform apply --auto-approve

**Inspect infrastructure in a human-readable way:**
terraform show

**Display configured outputs:**
```
terraform output
```

**Destroy deployed infrastructure:**
```
terraform destroy
```
