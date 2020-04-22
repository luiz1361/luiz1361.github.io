---
title: KUBERNETES
permalink: /docs/automation/kubernetes/
---
---
title: Kubernetes - Dashboard
category: Automation
---

**Just some random notes getting the Kubernetes dashboard up as an experiment for development reasonss:**
```
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/alternative/kubernetes-dashboard.yaml
kubectl proxy
http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy
https://github.com/kubernetes/dashboard/wiki/Installation
```
