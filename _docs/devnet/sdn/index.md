**Concepts:**
* Enforce state and avoid snowflake infrastructure.
* Underlay: Traffic forwarding decisions performed at next hop basis with traditional L2/L3.
* Overlay: Software sits over the physical network and abstracts forward decisions based on application needs.
* Southbound: From DNA center to managed device(routers, devices, wireless). Talks to network components. CLI, NETCONF, REST API.
* Northbound: REST API exposed by DNA Center.
* East-West: DNA Center talks with ServiceNow.

**Famous SDN Products:**
* Open daylight: Open source SDN project.
* Cisco ACI: For Datacenters, Cisco APIC(Application Policy Infrastructure Controller) unified point of automation. Based on Nexus 9500 and 9300 high-throughput non-blocking.
* NSO: From TAIL-F company, uses NETCONF, Like Ansible, can work together with ansible(nso module) single API call, quick discovery, companies of any side, network and service configuration management. Thousand of devices. Free evaluation.
* DNA: For Enterprise Networks, Campus, SD-Wan, Access, SDN, Wireless, Wired, etc.
* DNA Center: Newer Platform/API and controls DNA. Network controller function. It is a physical appliance which discovers the network, wireless. Build policies. Assurance(make sure things are good/health/state, health score). Management plane, no forwarding or traffic passing throught it.
* APIC-EM: Will become DNA Center with additional features. CCNA will still talk about this.
