# Deployer API Outage Postmortem

## Date

2016-09-05

## Authors

* [mlafeldt](https://github.com/mlafeldt)

## Status

Complete, action items in progress

## Summary

Wonderland's Deployer API was unavailable for 31 minutes after we accidentally deleted the `deployer-api` ECS service.

## Impact

Users were unable to manage the lifecycle of their services (e.g. deploy them or watch state changes) while the Deployer API was unavailable between 09:29 and 10:00 UTC.

## Root Causes

We tried to debug a broken deployment of the Deployer in our AWS staging account. In an attempt to fix the problem, we deleted the `deployer-api` service in the ECS console. However, instead of doing this in the staging account, we accidentally deleted the service in our production account, which caused the downtime. It then took us about 30 minutes to figure out how to redeploy the broken API service.

We identified the following root causes:

1. With `awsenv`, the tool we're using to log into AWS accounts, it's currently hard to figure out in which account one operates. This contributed to the deletion in the wrong account.
2. The Deployer doesn't notice that the underlying ECS service is gone and still tries to update the (non-existing) service. This and the fact that we had a hard time understanding the deployment steps (state changes) caused consecutive re-deployments to fail.

## Trigger

Manually deleting the `deployer-api` service in the ECS console in production.

## Resolution

We resolved the problem by manually deleting all remaining pieces of the Wonderland `deployer-api` service (the ECS service itself is only one component). We had to delete the corresponding service entry in DynamoDB (where we persist deployment state), the load balancer, the CNAME, and the health check before we could deploy the Deployer API again.

## Detection

We noticed the mistake shortly after deleting the service in the wrong account (even before our monitoring alerted us).

## Action Items

| Action Item | Type | Owner | Bug |
| ----------- | ---- | ----- | --- |
| Get `awsenv` to show relevant AWS environment information | prevent | mlafeldt | [Luzifer/awsenv#11](https://github.com/Luzifer/awsenv/issues/11) **TODO** |
| Fix Deployer to notice changes in underlying ECS services | prevent | mlafeldt | [Jimdo/wonderland-deployer#560](https://github.com/Jimdo/wonderland-deployer/issues/560) **TODO** |

## Lessons Learned

### What went well

* We noticed the problem immediately and worked together to fix it.

### What went wrong

* We've never tested what happens if data that the Deployer uses becomes inconsistent.
* In situations like this one, we weren't able to use `wl delete` and other commands since all operations run through the API.
* The buggy search feature of the ECS console slowed us down.

### Where we got lucky

-

## Timeline

2016-09-05 (*all times UTC*)

| Time  | Description |
| ----- | ----------- |
| 09:27 | **OUTAGE BEGINS** -- Mathias accidentally deletes the `deployer-api` ECS service in production |
| 09:28 | **INCIDENT BEGINS** -- Mathias notices the mistake and tries to redeploy `deployer-api`, which fails |
| 09:29 | Pingdom starts reporting downtime of Deployer API |
| 09:31 | Mathias and Dennis start pairing to resolve the issue. |
| 09:56 | Re-deployment of the API finally succeeds after deleting all remaining pieces of the old API service. |
| 10:00 | **INCIDENT/OUTAGE ENDS** -- Deployer API is up and running again according to Pingdom. We communicate the recovery in #werkzeugschmiede. |

## Supporting Information

AWS account information displayed when using `awsenv` (this is the same for both production and staging):

![](https://cloud.githubusercontent.com/assets/158074/18248375/f1bf1872-7377-11e6-99ed-007f4b1a8206.png)
