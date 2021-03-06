version: '3'

volumes:
  prom_data: {}
  graf_data: {}

services:
    prom:
      image: prom/prometheus:v2.0.0
      ports:
        - 9090:9090
      volumes:
        - prom_data:/prometheus
        - ./etc/prometheus:/etc/prometheus
      network_mode: bridge
      command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention=5d'

    graf:
      image: grafana/grafana
      ports:
        - 3000:3000
      volumes:
        - graf_data:/var/lib/grafana
      network_mode: bridge
      environment:
        - GF_SECURITY_COOKIE_SAMESITE=none
        - GF_SERVER_ROOT_URL=http://x.x.x.x:3000
        - GF_USERS_ALLOW_SIGN_UP=false
        - GF_DASHBOARDS_JSON_ENABLED=true
        - GF_SMTP_ENABLED=true
        - GF_SMTP_HOST=x.x.x:25
        - GF_SMTP_FROM_ADDRESS=grafana@x.x
        - GF_SMTP_SKIP_VERIFY=true

    node_exporter:
      image: prom/node-exporter
      ports:
        - 9100:9100
      network_mode: bridge

    snmp_exporter:
      image: prom/snmp-exporter
      ports:
        - 9116:9116
      volumes:
        - ./config:/etc/snmp_exporter/
      network_mode: bridge
---
title: Prometheus - Prometheus.yml
category: Observability
---

# my global config
global:
  scrape_interval:     30s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  scrape_timeout:      15s
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'
    metrics_path: '/metrics'
    scheme: 'http'
    static_configs:
      - targets: ['x.x.x.x:9100']
  - job_name: 'netdata'
    metrics_path: '/api/v1/allmetrics?format=prometheus'
    scheme: 'http'
    static_configs:
      - targets: ['x.x.x.x:19999','x.x.x.x:19999']
  - job_name: 'wmi'
    metrics_path: '/metrics'
    scheme: 'http'
    static_configs:
      - targets: ['x.x.x.x:9182','x.x.x.x:9182']
  - job_name: 'snmp'
    static_configs:
      - targets: ['x.x.x.x','x.x.x.x']
    metrics_path: /snmp
    params:
      module: [if_mib]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: x.x.x.x:9116  # Docker IP with SNMP exporter.
  - job_name: 'fortigate'
    static_configs:
      - targets: ['x.x.x.x','x.x.x.x']
    metrics_path: /snmp
    params:
      module: [fortigate_snmp]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: x.x.x.x:9116  # Docker IP with SNMP exporter.
---
title: Prometheus - snmp.yml
category: Observability
---

if_mib:
  walk:
  - 1.3.6.1.2.1.2.2.1.8
  - 1.3.6.1.2.1.2.2.1.1
  - 1.3.6.1.2.1.2.2.1.2
  - 1.3.6.1.2.1.2.2.1.10
  - 1.3.6.1.2.1.2.2.1.16
  - 1.3.6.1.2.1.31.1.1.1.1
  - 1.3.6.1.2.1.31.1.1.1.6
  - 1.3.6.1.2.1.31.1.1.1.10
  - 1.3.6.1.2.1.31.1.1.1.18
  version: 2
  metrics:
  - name: ifIndex
    oid: 1.3.6.1.2.1.2.2.1.1
    type: gauge
    help: A unique value, greater than zero, for each interface - 1.3.6.1.2.1.2.2.1.1
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifDescr
    oid: 1.3.6.1.2.1.2.2.1.2
    type: DisplayString
    help: A textual string containing information about the interface - 1.3.6.1.2.1.2.2.1.2
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifOperStatus
    oid: 1.3.6.1.2.1.2.2.1.8
    type: gauge
    help: The current operational state of the interface - 1.3.6.1.2.1.2.2.1.8
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
    enum_values:
      1: up
      2: down
      3: testing
      4: unknown
      5: dormant
      6: notPresent
      7: lowerLayerDown
  - name: ifInOctets
    oid: 1.3.6.1.2.1.2.2.1.10
    type: counter
    help: The total number of octets received on the interface, including framing
      characters - 1.3.6.1.2.1.2.2.1.10
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifOutOctets
    oid: 1.3.6.1.2.1.2.2.1.16
    type: counter
    help: The total number of octets transmitted out of the interface, including framing
      characters - 1.3.6.1.2.1.2.2.1.16
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifName
    oid: 1.3.6.1.2.1.31.1.1.1.1
    type: DisplayString
    help: The textual name of the interface - 1.3.6.1.2.1.31.1.1.1.1
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifHCInOctets
    oid: 1.3.6.1.2.1.31.1.1.1.6
    type: counter
    help: The total number of octets received on the interface, including framing
      characters - 1.3.6.1.2.1.31.1.1.1.6
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifHCOutOctets
    oid: 1.3.6.1.2.1.31.1.1.1.10
    type: counter
    help: The total number of octets transmitted out of the interface, including framing
      characters - 1.3.6.1.2.1.31.1.1.1.10
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifAlias
    oid: 1.3.6.1.2.1.31.1.1.1.18
    type: DisplayString
    help: This object is an 'alias' name for the interface as specified by a network
      manager, and provides a non-volatile 'handle' for the interface - 1.3.6.1.2.1.31.1.1.1.18
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
fortigate_snmp:
  walk:
  - 1.3.6.1.2.1.31.1.1
  - 1.3.6.1.4.1.12356.101.12
  - 1.3.6.1.4.1.12356.101.4
  - 1.3.6.1.4.1.12356.101.7
  version: 2
  metrics:
  - name: ifName
    oid: 1.3.6.1.2.1.31.1.1.1.1
    type: DisplayString
    help: The textual name of the interface - 1.3.6.1.2.1.31.1.1.1.1
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifInMulticastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.2
    type: counter
    help: The number of packets, delivered by this sub-layer to a higher (sub-)layer,
      which were addressed to a multicast address at this sub-layer - 1.3.6.1.2.1.31.1.1.1.2
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifInBroadcastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.3
    type: counter
    help: The number of packets, delivered by this sub-layer to a higher (sub-)layer,
      which were addressed to a broadcast address at this sub-layer - 1.3.6.1.2.1.31.1.1.1.3
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifOutMulticastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.4
    type: counter
    help: The total number of packets that higher-level protocols requested be transmitted,
      and which were addressed to a multicast address at this sub-layer, including
      those that were discarded or not sent - 1.3.6.1.2.1.31.1.1.1.4
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifOutBroadcastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.5
    type: counter
    help: The total number of packets that higher-level protocols requested be transmitted,
      and which were addressed to a broadcast address at this sub-layer, including
      those that were discarded or not sent - 1.3.6.1.2.1.31.1.1.1.5
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifHCInOctets
    oid: 1.3.6.1.2.1.31.1.1.1.6
    type: counter
    help: The total number of octets received on the interface, including framing
      characters - 1.3.6.1.2.1.31.1.1.1.6
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifHCInUcastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.7
    type: counter
    help: The number of packets, delivered by this sub-layer to a higher (sub-)layer,
      which were not addressed to a multicast or broadcast address at this sub-layer
      - 1.3.6.1.2.1.31.1.1.1.7
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifHCInMulticastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.8
    type: counter
    help: The number of packets, delivered by this sub-layer to a higher (sub-)layer,
      which were addressed to a multicast address at this sub-layer - 1.3.6.1.2.1.31.1.1.1.8
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifHCInBroadcastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.9
    type: counter
    help: The number of packets, delivered by this sub-layer to a higher (sub-)layer,
      which were addressed to a broadcast address at this sub-layer - 1.3.6.1.2.1.31.1.1.1.9
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifHCOutOctets
    oid: 1.3.6.1.2.1.31.1.1.1.10
    type: counter
    help: The total number of octets transmitted out of the interface, including framing
      characters - 1.3.6.1.2.1.31.1.1.1.10
    indexes:
    - labelname: ifIndex
      type: gauge
    lookups:
    - labels:
      - ifIndex
      labelname: ifAlias
      oid: 1.3.6.1.2.1.31.1.1.1.18
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifDescr
      oid: 1.3.6.1.2.1.2.2.1.2
      type: DisplayString
    - labels:
      - ifIndex
      labelname: ifName
      oid: 1.3.6.1.2.1.31.1.1.1.1
      type: DisplayString
  - name: ifHCOutUcastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.11
    type: counter
    help: The total number of packets that higher-level protocols requested be transmitted,
      and which were not addressed to a multicast or broadcast address at this sub-layer,
      including those that were discarded or not sent - 1.3.6.1.2.1.31.1.1.1.11
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifHCOutMulticastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.12
    type: counter
    help: The total number of packets that higher-level protocols requested be transmitted,
      and which were addressed to a multicast address at this sub-layer, including
      those that were discarded or not sent - 1.3.6.1.2.1.31.1.1.1.12
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifHCOutBroadcastPkts
    oid: 1.3.6.1.2.1.31.1.1.1.13
    type: counter
    help: The total number of packets that higher-level protocols requested be transmitted,
      and which were addressed to a broadcast address at this sub-layer, including
      those that were discarded or not sent - 1.3.6.1.2.1.31.1.1.1.13
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifLinkUpDownTrapEnable
    oid: 1.3.6.1.2.1.31.1.1.1.14
    type: gauge
    help: Indicates whether linkUp/linkDown traps should be generated for this interface
      - 1.3.6.1.2.1.31.1.1.1.14
    indexes:
    - labelname: ifIndex
      type: gauge
    enum_values:
      1: enabled
      2: disabled
  - name: ifHighSpeed
    oid: 1.3.6.1.2.1.31.1.1.1.15
    type: gauge
    help: An estimate of the interface's current bandwidth in units of 1,000,000 bits
      per second - 1.3.6.1.2.1.31.1.1.1.15
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifPromiscuousMode
    oid: 1.3.6.1.2.1.31.1.1.1.16
    type: gauge
    help: This object has a value of false(2) if this interface only accepts packets/frames
      that are addressed to this station - 1.3.6.1.2.1.31.1.1.1.16
    indexes:
    - labelname: ifIndex
      type: gauge
    enum_values:
      1: "true"
      2: "false"
  - name: ifConnectorPresent
    oid: 1.3.6.1.2.1.31.1.1.1.17
    type: gauge
    help: This object has the value 'true(1)' if the interface sublayer has a physical
      connector and the value 'false(2)' otherwise. - 1.3.6.1.2.1.31.1.1.1.17
    indexes:
    - labelname: ifIndex
      type: gauge
    enum_values:
      1: "true"
      2: "false"
  - name: ifAlias
    oid: 1.3.6.1.2.1.31.1.1.1.18
    type: DisplayString
    help: This object is an 'alias' name for the interface as specified by a network
      manager, and provides a non-volatile 'handle' for the interface - 1.3.6.1.2.1.31.1.1.1.18
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: ifCounterDiscontinuityTime
    oid: 1.3.6.1.2.1.31.1.1.1.19
    type: gauge
    help: The value of sysUpTime on the most recent occasion at which any one or more
      of this interface's counters suffered a discontinuity - 1.3.6.1.2.1.31.1.1.1.19
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIpSessIndex
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.1
    type: gauge
    help: An index value that uniquely identifies an IP session within the fgIpSessTable
      - 1.3.6.1.4.1.12356.101.11.2.1.1.1
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessProto
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.2
    type: gauge
    help: The protocol the session is using (IP, TCP, UDP, etc.) - 1.3.6.1.4.1.12356.101.11.2.1.1.2
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
    enum_values:
      0: ip
      1: icmp
      2: igmp
      4: ipip
      6: tcp
      8: egp
      12: pup
      17: udp
      22: idp
      41: ipv6
      46: rsvp
      47: gre
      50: esp
      51: ah
      89: ospf
      103: pim
      108: comp
      255: raw
  - name: fgIpSessFromAddr
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.3
    type: InetAddressIPv4
    help: Source IP address (IPv4 only) of the session - 1.3.6.1.4.1.12356.101.11.2.1.1.3
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessFromPort
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.4
    type: gauge
    help: Source port number (UDP and TCP only) of the session - 1.3.6.1.4.1.12356.101.11.2.1.1.4
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessToAddr
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.5
    type: InetAddressIPv4
    help: Destination IP address (IPv4 only) of the session - 1.3.6.1.4.1.12356.101.11.2.1.1.5
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessToPort
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.6
    type: gauge
    help: Destination Port number (UDP and TCP only) of the session - 1.3.6.1.4.1.12356.101.11.2.1.1.6
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessExp
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.7
    type: gauge
    help: Number of seconds remaining before the session expires (if idle) - 1.3.6.1.4.1.12356.101.11.2.1.1.7
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessVdom
    oid: 1.3.6.1.4.1.12356.101.11.2.1.1.8
    type: gauge
    help: Virtual domain the session is part of - 1.3.6.1.4.1.12356.101.11.2.1.1.8
    indexes:
    - labelname: fgIpSessIndex
      type: gauge
  - name: fgIpSessNumber
    oid: 1.3.6.1.4.1.12356.101.11.2.2.1.1
    type: gauge
    help: Current number of sessions on the virtual domain - 1.3.6.1.4.1.12356.101.11.2.2.1.1
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgIp6SessNumber
    oid: 1.3.6.1.4.1.12356.101.11.2.3.1.1
    type: gauge
    help: Current number of sessions on the virtual domain - 1.3.6.1.4.1.12356.101.11.2.3.1.1
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnTunnelUpCount
    oid: 1.3.6.1.4.1.12356.101.12.1.1
    type: gauge
    help: The number of IPsec VPN tunnels with at least one SA - 1.3.6.1.4.1.12356.101.12.1.1
  - name: fgVpnDialupIndex
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.1
    type: gauge
    help: An index value that uniquely identifies an VPN dial-up peer within the fgVpnDialupTable
      - 1.3.6.1.4.1.12356.101.12.2.1.1.1
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupGateway
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.2
    type: InetAddressIPv4
    help: Remote gateway IP address of the tunnel - 1.3.6.1.4.1.12356.101.12.2.1.1.2
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupLifetime
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.3
    type: gauge
    help: Tunnel life time (seconds) of the tunnel - 1.3.6.1.4.1.12356.101.12.2.1.1.3
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupTimeout
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.4
    type: gauge
    help: Time before the next key exchange (seconds) of the tunnel - 1.3.6.1.4.1.12356.101.12.2.1.1.4
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupSrcBegin
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.5
    type: InetAddressIPv4
    help: Remote subnet address of the tunnel - 1.3.6.1.4.1.12356.101.12.2.1.1.5
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupSrcEnd
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.6
    type: InetAddressIPv4
    help: Remote subnet mask of the tunnel - 1.3.6.1.4.1.12356.101.12.2.1.1.6
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupDstAddr
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.7
    type: InetAddressIPv4
    help: Local subnet address of the tunnel - 1.3.6.1.4.1.12356.101.12.2.1.1.7
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupVdom
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.8
    type: gauge
    help: Virtual domain tunnel is part of - 1.3.6.1.4.1.12356.101.12.2.1.1.8
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupInOctets
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.9
    type: counter
    help: Number of bytes received on tunnel since instantiation. - 1.3.6.1.4.1.12356.101.12.2.1.1.9
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnDialupOutOctets
    oid: 1.3.6.1.4.1.12356.101.12.2.1.1.10
    type: counter
    help: Number of bytes sent on tunnel since instantiation. - 1.3.6.1.4.1.12356.101.12.2.1.1.10
    indexes:
    - labelname: fgVpnDialupIndex
      type: gauge
  - name: fgVpnTunEntIndex
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.1
    type: gauge
    help: An index value that uniquely identifies a VPN tunnel within the fgVpnTunTable
      - 1.3.6.1.4.1.12356.101.12.2.2.1.1
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntPhase1Name
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.2
    type: DisplayString
    help: Descriptive name of phase1 configuration for the tunnel - 1.3.6.1.4.1.12356.101.12.2.2.1.2
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntPhase2Name
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.3
    type: DisplayString
    help: Descriptive name of phase2 configuration for the tunnel - 1.3.6.1.4.1.12356.101.12.2.2.1.3
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntRemGwyIp
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.4
    type: InetAddressIPv4
    help: IP of remote gateway used by the tunnel - 1.3.6.1.4.1.12356.101.12.2.2.1.4
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntRemGwyPort
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.5
    type: gauge
    help: port of remote gateway used by tunnel, if UDP - 1.3.6.1.4.1.12356.101.12.2.2.1.5
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntLocGwyIp
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.6
    type: InetAddressIPv4
    help: IP of local gateway used by the tunnel - 1.3.6.1.4.1.12356.101.12.2.2.1.6
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntLocGwyPort
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.7
    type: gauge
    help: port of local gateway used by tunnel, if UDP - 1.3.6.1.4.1.12356.101.12.2.2.1.7
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorSrcBeginIp
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.8
    type: InetAddressIPv4
    help: Beginning of address range of source selector - 1.3.6.1.4.1.12356.101.12.2.2.1.8
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorSrcEndIp
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.9
    type: InetAddressIPv4
    help: End of address range of source selector - 1.3.6.1.4.1.12356.101.12.2.2.1.9
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorSrcPort
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.10
    type: gauge
    help: Source selector port - 1.3.6.1.4.1.12356.101.12.2.2.1.10
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorDstBeginIp
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.11
    type: InetAddressIPv4
    help: Beginning of address range of destination selector - 1.3.6.1.4.1.12356.101.12.2.2.1.11
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorDstEndIp
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.12
    type: InetAddressIPv4
    help: End of address range of destination selector - 1.3.6.1.4.1.12356.101.12.2.2.1.12
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorDstPort
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.13
    type: gauge
    help: Destination selector port - 1.3.6.1.4.1.12356.101.12.2.2.1.13
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntSelectorProto
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.14
    type: gauge
    help: Protocol number for selector - 1.3.6.1.4.1.12356.101.12.2.2.1.14
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntLifeSecs
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.15
    type: gauge
    help: Lifetime of tunnel in seconds, if time based lifetime used - 1.3.6.1.4.1.12356.101.12.2.2.1.15
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntLifeBytes
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.16
    type: gauge
    help: Lifetime of tunnel in bytes, if byte transfer based lifetime used - 1.3.6.1.4.1.12356.101.12.2.2.1.16
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntTimeout
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.17
    type: gauge
    help: Timeout of tunnel in seconds - 1.3.6.1.4.1.12356.101.12.2.2.1.17
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntInOctets
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.18
    type: counter
    help: Number of bytes received on tunnel - 1.3.6.1.4.1.12356.101.12.2.2.1.18
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntOutOctets
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.19
    type: counter
    help: Number of bytes sent out on tunnel - 1.3.6.1.4.1.12356.101.12.2.2.1.19
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnTunEntStatus
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.20
    type: gauge
    help: Current status of tunnel (up or down) - 1.3.6.1.4.1.12356.101.12.2.2.1.20
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
    enum_values:
      1: down
      2: up
  - name: fgVpnTunEntVdom
    oid: 1.3.6.1.4.1.12356.101.12.2.2.1.21
    type: gauge
    help: Virtual domain the tunnel is part of - 1.3.6.1.4.1.12356.101.12.2.2.1.21
    indexes:
    - labelname: fgVpnTunEntIndex
      type: gauge
  - name: fgVpnSslState
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.1
    type: gauge
    help: Whether SSL-VPN is enabled on this virtual domain - 1.3.6.1.4.1.12356.101.12.2.3.1.1
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
    enum_values:
      1: disabled
      2: enabled
  - name: fgVpnSslStatsLoginUsers
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.2
    type: gauge
    help: The current number of users logged in through SSL-VPN tunnels in the virtual
      domain - 1.3.6.1.4.1.12356.101.12.2.3.1.2
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnSslStatsMaxUsers
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.3
    type: counter
    help: The maximum number of total users that can be logged in at any one time
      on the virtual domain - 1.3.6.1.4.1.12356.101.12.2.3.1.3
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnSslStatsActiveWebSessions
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.4
    type: gauge
    help: The current number of active SSL web sessions in the virtual domain - 1.3.6.1.4.1.12356.101.12.2.3.1.4
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnSslStatsMaxWebSessions
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.5
    type: counter
    help: The maximum number of active SSL web sessions at any one time within the
      virtual domain - 1.3.6.1.4.1.12356.101.12.2.3.1.5
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnSslStatsActiveTunnels
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.6
    type: gauge
    help: The current number of active SSL tunnels in the virtual domain - 1.3.6.1.4.1.12356.101.12.2.3.1.6
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnSslStatsMaxTunnels
    oid: 1.3.6.1.4.1.12356.101.12.2.3.1.7
    type: counter
    help: The maximum number of active SSL tunnels at any one time in the virtual
      domain - 1.3.6.1.4.1.12356.101.12.2.3.1.7
    indexes:
    - labelname: fgVdEntIndex
      type: gauge
  - name: fgVpnSslTunnelIndex
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.1
    type: gauge
    help: An index value that uniquely identifies an active SSL VPN tunnel within
      the fgVpnSslTunnelTable - 1.3.6.1.4.1.12356.101.12.2.4.1.1
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelVdom
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.2
    type: gauge
    help: The index of the virtual domain this tunnel belongs to - 1.3.6.1.4.1.12356.101.12.2.4.1.2
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelUserName
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.3
    type: DisplayString
    help: The user name used to authenticate the tunnel - 1.3.6.1.4.1.12356.101.12.2.4.1.3
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelSrcIp
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.4
    type: InetAddressIPv4
    help: The source IP address of this tunnel - 1.3.6.1.4.1.12356.101.12.2.4.1.4
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelIp
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.5
    type: InetAddressIPv4
    help: The connection IP address of this tunnel - 1.3.6.1.4.1.12356.101.12.2.4.1.5
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelUpTime
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.6
    type: counter
    help: The up-time of this tunnel in seconds - 1.3.6.1.4.1.12356.101.12.2.4.1.6
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelBytesIn
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.7
    type: counter
    help: The number of incoming bytes of L2 traffic through this tunnel since it
      was established - 1.3.6.1.4.1.12356.101.12.2.4.1.7
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgVpnSslTunnelBytesOut
    oid: 1.3.6.1.4.1.12356.101.12.2.4.1.8
    type: counter
    help: The number of outgoing bytes of L2 traffic through this tunnel since it
      was established - 1.3.6.1.4.1.12356.101.12.2.4.1.8
    indexes:
    - labelname: fgVpnSslTunnelIndex
      type: gauge
  - name: fgSysVersion
    oid: 1.3.6.1.4.1.12356.101.4.1.1
    type: DisplayString
    help: Firmware version of the device - 1.3.6.1.4.1.12356.101.4.1.1
  - name: fgSysMgmtVdom
    oid: 1.3.6.1.4.1.12356.101.4.1.2
    type: gauge
    help: Index that identifies the management virtual domain - 1.3.6.1.4.1.12356.101.4.1.2
  - name: fgSysCpuUsage
    oid: 1.3.6.1.4.1.12356.101.4.1.3
    type: gauge
    help: Current CPU usage (percentage) - 1.3.6.1.4.1.12356.101.4.1.3
  - name: fgSysMemUsage
    oid: 1.3.6.1.4.1.12356.101.4.1.4
    type: gauge
    help: Current memory utilization (percentage) - 1.3.6.1.4.1.12356.101.4.1.4
  - name: fgSysMemCapacity
    oid: 1.3.6.1.4.1.12356.101.4.1.5
    type: gauge
    help: Total physical memory (RAM) installed (KB) - 1.3.6.1.4.1.12356.101.4.1.5
  - name: fgSysDiskUsage
    oid: 1.3.6.1.4.1.12356.101.4.1.6
    type: gauge
    help: Current hard disk usage (MB), if disk is present - 1.3.6.1.4.1.12356.101.4.1.6
  - name: fgSysDiskCapacity
    oid: 1.3.6.1.4.1.12356.101.4.1.7
    type: gauge
    help: Total hard disk capacity (MB), if disk is present - 1.3.6.1.4.1.12356.101.4.1.7
  - name: fgSysSesCount
    oid: 1.3.6.1.4.1.12356.101.4.1.8
    type: gauge
    help: Number of active sessions on the device - 1.3.6.1.4.1.12356.101.4.1.8
  - name: fgSysLowMemUsage
    oid: 1.3.6.1.4.1.12356.101.4.1.9
    type: gauge
    help: Current lowmem utilization (percentage) - 1.3.6.1.4.1.12356.101.4.1.9
  - name: fgSysLowMemCapacity
    oid: 1.3.6.1.4.1.12356.101.4.1.10
    type: gauge
    help: Total lowmem capacity (KB) - 1.3.6.1.4.1.12356.101.4.1.10
  - name: fgSysSesRate1
    oid: 1.3.6.1.4.1.12356.101.4.1.11
    type: gauge
    help: The average session setup rate over the past minute. - 1.3.6.1.4.1.12356.101.4.1.11
  - name: fgSysSesRate10
    oid: 1.3.6.1.4.1.12356.101.4.1.12
    type: gauge
    help: The average session setup rate over the past 10 minutes. - 1.3.6.1.4.1.12356.101.4.1.12
  - name: fgSysSesRate30
    oid: 1.3.6.1.4.1.12356.101.4.1.13
    type: gauge
    help: The average session setup rate over the past 30 minutes. - 1.3.6.1.4.1.12356.101.4.1.13
  - name: fgSysSesRate60
    oid: 1.3.6.1.4.1.12356.101.4.1.14
    type: gauge
    help: The average session setup rate over the past 60 minutes. - 1.3.6.1.4.1.12356.101.4.1.14
  - name: fgSysSes6Count
    oid: 1.3.6.1.4.1.12356.101.4.1.15
    type: gauge
    help: Number of active ipv6 sessions on the device - 1.3.6.1.4.1.12356.101.4.1.15
  - name: fgSysSes6Rate1
    oid: 1.3.6.1.4.1.12356.101.4.1.16
    type: gauge
    help: The average ipv6 session setup rate over the past minute. - 1.3.6.1.4.1.12356.101.4.1.16
  - name: fgSysSes6Rate10
    oid: 1.3.6.1.4.1.12356.101.4.1.17
    type: gauge
    help: The average ipv6 session setup rate over the past 10 minutes. - 1.3.6.1.4.1.12356.101.4.1.17
  - name: fgSysSes6Rate30
    oid: 1.3.6.1.4.1.12356.101.4.1.18
    type: gauge
    help: The average ipv6 session setup rate over the past 30 minutes. - 1.3.6.1.4.1.12356.101.4.1.18
  - name: fgSysSes6Rate60
    oid: 1.3.6.1.4.1.12356.101.4.1.19
    type: gauge
    help: The average ipv6 session setup rate over the past 60 minutes. - 1.3.6.1.4.1.12356.101.4.1.19
  - name: fgSysUpTime
    oid: 1.3.6.1.4.1.12356.101.4.1.20
    type: counter
    help: The 64bit time (in hundredths of a second) since the network management
      portion of the system was last re-initialized. - 1.3.6.1.4.1.12356.101.4.1.20
  - name: fgSysVersionAv
    oid: 1.3.6.1.4.1.12356.101.4.2.1
    type: DisplayString
    help: Virus signature database version installed on the device - 1.3.6.1.4.1.12356.101.4.2.1
  - name: fgSysVersionIps
    oid: 1.3.6.1.4.1.12356.101.4.2.2
    type: DisplayString
    help: IPS signature database version installed on the device - 1.3.6.1.4.1.12356.101.4.2.2
  - name: fgSysVersionAvEt
    oid: 1.3.6.1.4.1.12356.101.4.2.3
    type: DisplayString
    help: Virus signature extended database version installed on the device - 1.3.6.1.4.1.12356.101.4.2.3
  - name: fgSysVersionIpsEt
    oid: 1.3.6.1.4.1.12356.101.4.2.4
    type: DisplayString
    help: IPS signature extended database version installed on the device - 1.3.6.1.4.1.12356.101.4.2.4
  - name: fgHwSensorCount
    oid: 1.3.6.1.4.1.12356.101.4.3.1
    type: gauge
    help: The number of entries in fgHwSensorTable - 1.3.6.1.4.1.12356.101.4.3.1
  - name: fgHwSensorEntIndex
    oid: 1.3.6.1.4.1.12356.101.4.3.2.1.1
    type: gauge
    help: A unique identifier within the fgHwSensorTable - 1.3.6.1.4.1.12356.101.4.3.2.1.1
    indexes:
    - labelname: fgHwSensorEntIndex
      type: gauge
  - name: fgHwSensorEntName
    oid: 1.3.6.1.4.1.12356.101.4.3.2.1.2
    type: DisplayString
    help: A string identifying the sensor by name - 1.3.6.1.4.1.12356.101.4.3.2.1.2
    indexes:
    - labelname: fgHwSensorEntIndex
      type: gauge
  - name: fgHwSensorEntValue
    oid: 1.3.6.1.4.1.12356.101.4.3.2.1.3
    type: DisplayString
    help: A string representation of the value of the sensor - 1.3.6.1.4.1.12356.101.4.3.2.1.3
    indexes:
    - labelname: fgHwSensorEntIndex
      type: gauge
  - name: fgHwSensorEntAlarmStatus
    oid: 1.3.6.1.4.1.12356.101.4.3.2.1.4
    type: gauge
    help: If the sensor has an alarm threshold and has exceeded it, this will indicate
      its status - 1.3.6.1.4.1.12356.101.4.3.2.1.4
    indexes:
    - labelname: fgHwSensorEntIndex
      type: gauge
    enum_values:
      0: "false"
      1: "true"
  - name: fgProcessorCount
    oid: 1.3.6.1.4.1.12356.101.4.4.1
    type: gauge
    help: The number of entries in fgProcessorTable - 1.3.6.1.4.1.12356.101.4.4.1
  - name: fgProcessorEntIndex
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.1
    type: gauge
    help: A unique identifier within the fgProcessorTable - 1.3.6.1.4.1.12356.101.4.4.2.1.1
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorUsage
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.2
    type: gauge
    help: The processor's CPU usage (percentage), which is an average calculated over
      the last minute - 1.3.6.1.4.1.12356.101.4.4.2.1.2
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorUsage5sec
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.3
    type: gauge
    help: The processor's CPU usage (percentage), which is an average calculated over
      the last 5 sec - 1.3.6.1.4.1.12356.101.4.4.2.1.3
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorContainedIn
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.5
    type: gauge
    help: The index to the processor module entry in the fgProcessorModuleTable that
      contains this processor. - 1.3.6.1.4.1.12356.101.4.4.2.1.5
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorPktRxCount
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.6
    type: counter
    help: The total number of packets received by this processor (only valid for processors
      types that support this statistic). - 1.3.6.1.4.1.12356.101.4.4.2.1.6
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorPktTxCount
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.7
    type: counter
    help: The total number of packets transmitted by this processor (only valid for
      processors types that support this statistic). - 1.3.6.1.4.1.12356.101.4.4.2.1.7
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorPktDroppedCount
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.8
    type: counter
    help: The total number of packets dropped by this processor (only valid for processors
      types that support this statistic). - 1.3.6.1.4.1.12356.101.4.4.2.1.8
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorUserUsage
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.9
    type: gauge
    help: The processor's CPU user space usage, which is an average calculated over
      the last minute - 1.3.6.1.4.1.12356.101.4.4.2.1.9
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorSysUsage
    oid: 1.3.6.1.4.1.12356.101.4.4.2.1.10
    type: gauge
    help: The processor's CPU system space usage, which is an average calculated over
      the last minute - 1.3.6.1.4.1.12356.101.4.4.2.1.10
    indexes:
    - labelname: fgProcessorEntIndex
      type: gauge
  - name: fgProcessorModuleCount
    oid: 1.3.6.1.4.1.12356.101.4.5.2
    type: gauge
    help: The number of entries in fgProcessorModuleTable - 1.3.6.1.4.1.12356.101.4.5.2
  - name: fgProcModIndex
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.1
    type: gauge
    help: A unique identifier within the fgProcessorModuleTable - 1.3.6.1.4.1.12356.101.4.5.3.1.1
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModName
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.3
    type: DisplayString
    help: A textual name of this processor module. - 1.3.6.1.4.1.12356.101.4.5.3.1.3
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModDescr
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.4
    type: DisplayString
    help: A textual description of this processor module. - 1.3.6.1.4.1.12356.101.4.5.3.1.4
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModProcessorCount
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.5
    type: gauge
    help: Total number of processors contained by this module. - 1.3.6.1.4.1.12356.101.4.5.3.1.5
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModMemCapacity
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.6
    type: gauge
    help: Total physical memory (RAM) installed (KB) on this processor module. - 1.3.6.1.4.1.12356.101.4.5.3.1.6
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModMemUsage
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.7
    type: gauge
    help: Current memory utilization (percentage) on this processor module. - 1.3.6.1.4.1.12356.101.4.5.3.1.7
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModSessionCount
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.8
    type: gauge
    help: Number of active sessions on this processor module (only valid for processors
      types that support this statistic). - 1.3.6.1.4.1.12356.101.4.5.3.1.8
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgProcModSACount
    oid: 1.3.6.1.4.1.12356.101.4.5.3.1.9
    type: gauge
    help: Number of IPsec Security Associations on this processor module (only valid
      for processors types that support this statistic). - 1.3.6.1.4.1.12356.101.4.5.3.1.9
    indexes:
    - labelname: fgProcModIndex
      type: gauge
  - name: fgSIAdvMemPageCache
    oid: 1.3.6.1.4.1.12356.101.4.6.1.1
    type: gauge
    help: The amount of physical RAM used as cache memory for files read from the
      disk (the page cache). - 1.3.6.1.4.1.12356.101.4.6.1.1
  - name: fgSIAdvMemCacheActive
    oid: 1.3.6.1.4.1.12356.101.4.6.1.2
    type: gauge
    help: The toal amount of buffer or page cache memory that are active - 1.3.6.1.4.1.12356.101.4.6.1.2
  - name: fgSIAdvMemCacheInactive
    oid: 1.3.6.1.4.1.12356.101.4.6.1.3
    type: gauge
    help: The total amount of buffer or page cache memory that are free and available
      - 1.3.6.1.4.1.12356.101.4.6.1.3
  - name: fgSIAdvMemBuffer
    oid: 1.3.6.1.4.1.12356.101.4.6.1.4
    type: gauge
    help: The amount of physical RAM used for filesystem buffers. - 1.3.6.1.4.1.12356.101.4.6.1.4
  - name: fgSIAdvMemEnterKerConsThrsh
    oid: 1.3.6.1.4.1.12356.101.4.6.1.5
    type: gauge
    help: Current memory threshold level to enter kernel conserve mode. - 1.3.6.1.4.1.12356.101.4.6.1.5
  - name: fgSIAdvMemLeaveKerConsThrsh
    oid: 1.3.6.1.4.1.12356.101.4.6.1.6
    type: gauge
    help: Current memory threshold level to leave kernel conserve mode. - 1.3.6.1.4.1.12356.101.4.6.1.6
  - name: fgSIAdvMemEnterProxyConsThrsh
    oid: 1.3.6.1.4.1.12356.101.4.6.1.7
    type: gauge
    help: Current memory threshold level to enter proxy conserve mode. - 1.3.6.1.4.1.12356.101.4.6.1.7
  - name: fgSIAdvMemLeaveProxyConsThrsh
    oid: 1.3.6.1.4.1.12356.101.4.6.1.8
    type: gauge
    help: Current memory threshold level to leave proxy conserve mode. - 1.3.6.1.4.1.12356.101.4.6.1.8
  - name: fgSIAdvSesEphemeralCount
    oid: 1.3.6.1.4.1.12356.101.4.6.2.1
    type: gauge
    help: The current number of ephemeral sessions on the device. - 1.3.6.1.4.1.12356.101.4.6.2.1
  - name: fgSIAdvSesEphemeralLimit
    oid: 1.3.6.1.4.1.12356.101.4.6.2.2
    type: gauge
    help: The limit number of allowed ephemeral sessions on the device. - 1.3.6.1.4.1.12356.101.4.6.2.2
  - name: fgSIAdvSesClashCount
    oid: 1.3.6.1.4.1.12356.101.4.6.2.3
    type: gauge
    help: The number of new sessions which have collision with existing sessions -
      1.3.6.1.4.1.12356.101.4.6.2.3
  - name: fgSIAdvSesExpCount
    oid: 1.3.6.1.4.1.12356.101.4.6.2.4
    type: gauge
    help: The number of current expectation sessions. - 1.3.6.1.4.1.12356.101.4.6.2.4
  - name: fgSIAdvSesSyncQFCount
    oid: 1.3.6.1.4.1.12356.101.4.6.2.5
    type: gauge
    help: The sync queue full counter, reflecting bursts on the sync queue. - 1.3.6.1.4.1.12356.101.4.6.2.5
  - name: fgSIAdvSesAcceptQFCount
    oid: 1.3.6.1.4.1.12356.101.4.6.2.6
    type: gauge
    help: The accept queue full counter, reflecting bursts on the accept queue. -
      1.3.6.1.4.1.12356.101.4.6.2.6
  - name: fgSIAdvSesNoListenerCount
    oid: 1.3.6.1.4.1.12356.101.4.6.2.7
    type: gauge
    help: The number of direct requests to Fortigate local stack from external, reflecting
      DOS attack towards the Fortigate. - 1.3.6.1.4.1.12356.101.4.6.2.7
  - name: fgUsbportCount
    oid: 1.3.6.1.4.1.12356.101.4.7.1
    type: gauge
    help: The number of entries in fgUsbportTable. - 1.3.6.1.4.1.12356.101.4.7.1
  - name: fgUsbportEntIndex
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.1
    type: gauge
    help: A unique identifier within the fgUsbportTable. - 1.3.6.1.4.1.12356.101.4.7.2.1.1
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportPlugged
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.2
    type: gauge
    help: The USB port's plugged status. - 1.3.6.1.4.1.12356.101.4.7.2.1.2
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
    enum_values:
      0: unplugged
      1: plugged
  - name: fgUsbportVersion
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.3
    type: DisplayString
    help: The USB port's version. - 1.3.6.1.4.1.12356.101.4.7.2.1.3
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportClass
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.4
    type: gauge
    help: The device class. - 1.3.6.1.4.1.12356.101.4.7.2.1.4
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
    enum_values:
      0: ifc
      1: audio
      2: comm
      3: hid
      5: physical
      6: image
      7: printer
      8: storage
      9: hub
      10: cdcData
      11: chipSmartCard
      13: contentSecurity
      254: appSpec
      255: vendorSpec
  - name: fgUsbportVendId
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.5
    type: OctetString
    help: The Vendor ID of the device. - 1.3.6.1.4.1.12356.101.4.7.2.1.5
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportProdId
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.6
    type: OctetString
    help: The Product ID of the device. - 1.3.6.1.4.1.12356.101.4.7.2.1.6
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportRevision
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.7
    type: DisplayString
    help: The release number of the device. - 1.3.6.1.4.1.12356.101.4.7.2.1.7
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportManufacturer
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.8
    type: DisplayString
    help: The manufacturer of the device. - 1.3.6.1.4.1.12356.101.4.7.2.1.8
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportProduct
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.9
    type: DisplayString
    help: The product of the device. - 1.3.6.1.4.1.12356.101.4.7.2.1.9
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgUsbportSerial
    oid: 1.3.6.1.4.1.12356.101.4.7.2.1.10
    type: DisplayString
    help: The serial number of the device. - 1.3.6.1.4.1.12356.101.4.7.2.1.10
    indexes:
    - labelname: fgUsbportEntIndex
      type: gauge
  - name: fgLinkMonitorNumber
    oid: 1.3.6.1.4.1.12356.101.4.8.1
    type: gauge
    help: The number of link monitor in fgLinkMonitorTable - 1.3.6.1.4.1.12356.101.4.8.1
  - name: fgLinkMonitorID
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.1
    type: gauge
    help: Link Monitor ID - 1.3.6.1.4.1.12356.101.4.8.2.1.1
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorName
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.2
    type: DisplayString
    help: Link Monitor name. - 1.3.6.1.4.1.12356.101.4.8.2.1.2
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorState
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.3
    type: gauge
    help: Link Monitor state. - 1.3.6.1.4.1.12356.101.4.8.2.1.3
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
    enum_values:
      0: alive
      1: dead
  - name: fgLinkMonitorLatency
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.4
    type: DisplayString
    help: The average latency of link monitor in float number within last 30 probes.
      - 1.3.6.1.4.1.12356.101.4.8.2.1.4
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorJitter
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.5
    type: DisplayString
    help: The average jitter of link monitor in float number within last 30 probes.
      - 1.3.6.1.4.1.12356.101.4.8.2.1.5
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorPacketSend
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.6
    type: counter
    help: The total number of packets sent by link monitor. - 1.3.6.1.4.1.12356.101.4.8.2.1.6
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorPacketRecv
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.7
    type: counter
    help: The total number of packets received by link monitor. - 1.3.6.1.4.1.12356.101.4.8.2.1.7
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorPacketLoss
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.8
    type: DisplayString
    help: The average packet loss percentage in float number within last 30 probes.
      - 1.3.6.1.4.1.12356.101.4.8.2.1.8
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorVdom
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.9
    type: DisplayString
    help: Virtual domain the link monitor entry exists in - 1.3.6.1.4.1.12356.101.4.8.2.1.9
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorBandwidthIn
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.10
    type: counter
    help: The available bandwidth in Mbps of incoming traffic detected by a link monitor
      on its interface. - 1.3.6.1.4.1.12356.101.4.8.2.1.10
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorBandwidthOut
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.11
    type: counter
    help: The available bandwidth in Mbps of outgoing traffic detected by a link monitor
      on its interface. - 1.3.6.1.4.1.12356.101.4.8.2.1.11
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorBandwidthBi
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.12
    type: counter
    help: The available bandwidth in Mbps of bi-direction traffic detected by a link
      monitor on its interface. - 1.3.6.1.4.1.12356.101.4.8.2.1.12
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgLinkMonitorOutofSeq
    oid: 1.3.6.1.4.1.12356.101.4.8.2.1.13
    type: counter
    help: The total number of out of sequence packets received. - 1.3.6.1.4.1.12356.101.4.8.2.1.13
    indexes:
    - labelname: fgLinkMonitorID
      type: gauge
  - name: fgVWLHealthCheckLinkNumber
    oid: 1.3.6.1.4.1.12356.101.4.9.1
    type: gauge
    help: The number of health check links in fgVWLHealthCheckLinkTable - 1.3.6.1.4.1.12356.101.4.9.1
  - name: fgVWLHealthCheckLinkID
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.1
    type: gauge
    help: Virtual-wan-link health-check link ID - 1.3.6.1.4.1.12356.101.4.9.2.1.1
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkName
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.2
    type: DisplayString
    help: Health check name. - 1.3.6.1.4.1.12356.101.4.9.2.1.2
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkSeq
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.3
    type: gauge
    help: Virtual-wan-link member link sequence. - 1.3.6.1.4.1.12356.101.4.9.2.1.3
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkState
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.4
    type: gauge
    help: Heatlth check state on a specific member link. - 1.3.6.1.4.1.12356.101.4.9.2.1.4
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
    enum_values:
      0: alive
      1: dead
  - name: fgVWLHealthCheckLinkLatency
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.5
    type: DisplayString
    help: The average latency of a health check on a specific member link in float
      number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.9.2.1.5
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkJitter
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.6
    type: DisplayString
    help: The average jitter of a health check on a specific member link in float
      number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.9.2.1.6
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkPacketSend
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.7
    type: counter
    help: The total number of packets sent by a health check on a specific member
      link. - 1.3.6.1.4.1.12356.101.4.9.2.1.7
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkPacketRecv
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.8
    type: counter
    help: The total number of packets received by a health check on a specific member
      link. - 1.3.6.1.4.1.12356.101.4.9.2.1.8
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkPacketLoss
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.9
    type: DisplayString
    help: The packet loss percentage of a health check on a specific member link in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.9.2.1.9
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkVdom
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.10
    type: DisplayString
    help: Virtual domain the link monitor entry exists in - 1.3.6.1.4.1.12356.101.4.9.2.1.10
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkBandwidthIn
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.11
    type: counter
    help: The available bandwidth in Mbps of incoming traffic detected by a health-check
      on a specific member link. - 1.3.6.1.4.1.12356.101.4.9.2.1.11
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkBandwidthOut
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.12
    type: counter
    help: The available bandwidth in Mbps of outgoing traffic detected by a health-check
      on a specific member link. - 1.3.6.1.4.1.12356.101.4.9.2.1.12
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgVWLHealthCheckLinkBandwidthBi
    oid: 1.3.6.1.4.1.12356.101.4.9.2.1.13
    type: counter
    help: The available bandwidth in Mbps of bi-direction traffic detected by a health-check
      on a specific member link. - 1.3.6.1.4.1.12356.101.4.9.2.1.13
    indexes:
    - labelname: fgVWLHealthCheckLinkID
      type: gauge
  - name: fgDiskCount
    oid: 1.3.6.1.4.1.12356.101.4.10.1
    type: gauge
    help: The number of entries in fgDiskTable. - 1.3.6.1.4.1.12356.101.4.10.1
  - name: fgDiskIndex
    oid: 1.3.6.1.4.1.12356.101.4.10.2.1.1
    type: gauge
    help: The storage index. - 1.3.6.1.4.1.12356.101.4.10.2.1.1
    indexes:
    - labelname: fgDiskIndex
      type: gauge
  - name: fgDiskName
    oid: 1.3.6.1.4.1.12356.101.4.10.2.1.2
    type: DisplayString
    help: The name of the storage. - 1.3.6.1.4.1.12356.101.4.10.2.1.2
    indexes:
    - labelname: fgDiskIndex
      type: gauge
  - name: fgSlaProbeClientNumber
    oid: 1.3.6.1.4.1.12356.101.4.11.1
    type: gauge
    help: The number of sla probe clients in fgSlaProbeClientTable - 1.3.6.1.4.1.12356.101.4.11.1
  - name: fgSlaProbeClientID
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.1
    type: gauge
    help: Server Probe client ID. - 1.3.6.1.4.1.12356.101.4.11.2.1.1
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientIP
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.2
    type: InetAddressIPv4
    help: IP address of server probe client. - 1.3.6.1.4.1.12356.101.4.11.2.1.2
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientState
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.3
    type: gauge
    help: Server Probe client state. - 1.3.6.1.4.1.12356.101.4.11.2.1.3
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
    enum_values:
      0: alive
      1: dead
  - name: fgSlaProbeClientAvgLatency
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.4
    type: DisplayString
    help: The average latency of server probe client in float number within last 30
      probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.4
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientAvgLatencySD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.5
    type: DisplayString
    help: The average latency from source to destination of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.5
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientAvgLatencyDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.6
    type: DisplayString
    help: The average latency from destination to source of server probe in float
      number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.6
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMinLatency
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.7
    type: DisplayString
    help: The minimal latency of server probe client in float number within last 30
      probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.7
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMinLatencySD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.8
    type: DisplayString
    help: The minimal latency from source to destination of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.8
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMinLatencyDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.9
    type: DisplayString
    help: The minimal latency from destination to source of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.9
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMaxLatency
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.10
    type: DisplayString
    help: The maximum latency of server probe client in float number within last 30
      probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.10
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMaxLatencySD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.11
    type: DisplayString
    help: The maximum latency from source to destination of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.11
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMaxLatencyDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.12
    type: DisplayString
    help: The maximum latency from destination to source of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.12
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientAvgJitter
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.13
    type: DisplayString
    help: The average jitter of server probe client in float number within last 30
      probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.13
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientAvgJitterSD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.14
    type: DisplayString
    help: The average jitter from source to destination of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.14
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientAvgJitterDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.15
    type: DisplayString
    help: The average jitter from destination to source of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.15
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMinJitter
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.16
    type: DisplayString
    help: The minimal jitter of server probe client in float number within last 30
      probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.16
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMinJitterSD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.17
    type: DisplayString
    help: The minimal jitter from source to destination of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.17
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMinJitterDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.18
    type: DisplayString
    help: The minimal jitter from destination to source of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.18
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMaxJitter
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.19
    type: DisplayString
    help: The maximum jitter of server probe client in float number within last 30
      probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.19
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMaxJitterSD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.20
    type: DisplayString
    help: The maximum jitter from source to destination of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.20
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientMaxJitterDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.21
    type: DisplayString
    help: The maximum jitter from destination to source of server probe client in
      float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.21
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientPktloss
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.22
    type: DisplayString
    help: The average packet loss percentage of server probe client in float number
      within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.22
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientPktlossSD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.23
    type: DisplayString
    help: The average packet loss percentage of server probe client from source to
      destination in float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.23
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientPktlossDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.24
    type: DisplayString
    help: The average packet loss percentage of server probe client from destionation
      to source in float number within last 30 probes. - 1.3.6.1.4.1.12356.101.4.11.2.1.24
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientOutofSeq
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.25
    type: counter
    help: The total number of packets out of sequence order received by server probe
      client. - 1.3.6.1.4.1.12356.101.4.11.2.1.25
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientOutofSeqSD
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.26
    type: counter
    help: The total number of packets out of sequence order received by server probe
      client from source to destination. - 1.3.6.1.4.1.12356.101.4.11.2.1.26
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgSlaProbeClientOutofSeqDS
    oid: 1.3.6.1.4.1.12356.101.4.11.2.1.27
    type: counter
    help: The total number of packets out of sequence order received by server probe
      client from destination to source. - 1.3.6.1.4.1.12356.101.4.11.2.1.27
    indexes:
    - labelname: fgSlaProbeClientID
      type: gauge
  - name: fgIntfEntVdom
    oid: 1.3.6.1.4.1.12356.101.7.2.1.1.1
    type: gauge
    help: The virtual domain the interface belongs to - 1.3.6.1.4.1.12356.101.7.2.1.1.1
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfEntEstUpBandwidth
    oid: 1.3.6.1.4.1.12356.101.7.2.1.1.2
    type: gauge
    help: Estimated maximum upstream bandwidth (Kbps) - 1.3.6.1.4.1.12356.101.7.2.1.1.2
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfEntEstDownBandwidth
    oid: 1.3.6.1.4.1.12356.101.7.2.1.1.3
    type: gauge
    help: Estimated maximum downstream bandwidth (Kbps) - 1.3.6.1.4.1.12356.101.7.2.1.1.3
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfVrrpCount
    oid: 1.3.6.1.4.1.12356.101.7.3.1
    type: gauge
    help: The number of entries in fgIntfVrrpTable - 1.3.6.1.4.1.12356.101.7.3.1
  - name: fgIntfVrrpEntIndex
    oid: 1.3.6.1.4.1.12356.101.7.3.2.1.1
    type: gauge
    help: A unique identifier within the fgIntfVrrpTable - 1.3.6.1.4.1.12356.101.7.3.2.1.1
    indexes:
    - labelname: fgIntfVrrpEntIndex
      type: gauge
  - name: fgIntfVrrpEntVrId
    oid: 1.3.6.1.4.1.12356.101.7.3.2.1.2
    type: gauge
    help: ID of a virtual router. - 1.3.6.1.4.1.12356.101.7.3.2.1.2
    indexes:
    - labelname: fgIntfVrrpEntIndex
      type: gauge
  - name: fgIntfVrrpEntGrpId
    oid: 1.3.6.1.4.1.12356.101.7.3.2.1.3
    type: gauge
    help: The group ID of a virtual router. - 1.3.6.1.4.1.12356.101.7.3.2.1.3
    indexes:
    - labelname: fgIntfVrrpEntIndex
      type: gauge
  - name: fgIntfVrrpEntIfName
    oid: 1.3.6.1.4.1.12356.101.7.3.2.1.4
    type: DisplayString
    help: The interface name of a virtual router. - 1.3.6.1.4.1.12356.101.7.3.2.1.4
    indexes:
    - labelname: fgIntfVrrpEntIndex
      type: gauge
  - name: fgIntfVrrpEntState
    oid: 1.3.6.1.4.1.12356.101.7.3.2.1.5
    type: gauge
    help: State of a virtual router. - 1.3.6.1.4.1.12356.101.7.3.2.1.5
    indexes:
    - labelname: fgIntfVrrpEntIndex
      type: gauge
    enum_values:
      1: backup
      2: master
  - name: fgIntfVrrpEntVrIp
    oid: 1.3.6.1.4.1.12356.101.7.3.2.1.6
    type: InetAddressIPv4
    help: IP address of a virtual router. - 1.3.6.1.4.1.12356.101.7.3.2.1.6
    indexes:
    - labelname: fgIntfVrrpEntIndex
      type: gauge
  - name: fgIntfVlanHbCount
    oid: 1.3.6.1.4.1.12356.101.7.4.1
    type: gauge
    help: The number of entries in fgIntfVlanHbTable - 1.3.6.1.4.1.12356.101.7.4.1
  - name: fgIntfVlanHbEntIndex
    oid: 1.3.6.1.4.1.12356.101.7.4.2.1.1
    type: gauge
    help: A unique identifier within the fgIntfVlanHbTable - 1.3.6.1.4.1.12356.101.7.4.2.1.1
    indexes:
    - labelname: fgIntfVlanHbEntIndex
      type: gauge
  - name: fgIntfVlanHbEntIfName
    oid: 1.3.6.1.4.1.12356.101.7.4.2.1.2
    type: DisplayString
    help: The vlan interface name. - 1.3.6.1.4.1.12356.101.7.4.2.1.2
    indexes:
    - labelname: fgIntfVlanHbEntIndex
      type: gauge
  - name: fgIntfVlanHbEntSerial
    oid: 1.3.6.1.4.1.12356.101.7.4.2.1.3
    type: DisplayString
    help: Serial number of a vlan HA peer. - 1.3.6.1.4.1.12356.101.7.4.2.1.3
    indexes:
    - labelname: fgIntfVlanHbEntIndex
      type: gauge
  - name: fgIntfVlanHbEntState
    oid: 1.3.6.1.4.1.12356.101.7.4.2.1.4
    type: gauge
    help: State of a vlan interface heartbeat. - 1.3.6.1.4.1.12356.101.7.4.2.1.4
    indexes:
    - labelname: fgIntfVlanHbEntIndex
      type: gauge
    enum_values:
      1: active
      2: inactive
  - name: fgIntfBcAllocatedBandwidth
    oid: 1.3.6.1.4.1.12356.101.7.5.2.1.1
    type: gauge
    help: Allocated Bandwidth of a given interface and class-level. - 1.3.6.1.4.1.12356.101.7.5.2.1.1
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfBcGuaranteedBandwidth
    oid: 1.3.6.1.4.1.12356.101.7.5.2.1.2
    type: gauge
    help: Guaranteed Bandwidth of a given interface and class-level. - 1.3.6.1.4.1.12356.101.7.5.2.1.2
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfBcMaxBandwidth
    oid: 1.3.6.1.4.1.12356.101.7.5.2.1.3
    type: gauge
    help: Max Bandwidth of a given interface and class-level. - 1.3.6.1.4.1.12356.101.7.5.2.1.3
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfBcCurrentBandwidth
    oid: 1.3.6.1.4.1.12356.101.7.5.2.1.4
    type: gauge
    help: Current Bandwidth of a given interface and class-level. - 1.3.6.1.4.1.12356.101.7.5.2.1.4
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfBcBytes
    oid: 1.3.6.1.4.1.12356.101.7.5.2.1.5
    type: counter
    help: Bytes of a given inteface and class-level. - 1.3.6.1.4.1.12356.101.7.5.2.1.5
    indexes:
    - labelname: ifIndex
      type: gauge
  - name: fgIntfBcDrops
    oid: 1.3.6.1.4.1.12356.101.7.5.2.1.6
    type: counter
    help: Packet drop counter of a given interface and class-level. - 1.3.6.1.4.1.12356.101.7.5.2.1.6
    indexes:
    - labelname: ifIndex
      type: gauge
