# apache_mod_shib2_attribute_map.xml

```
<Attributes xmlns="urn:mace:shibboleth:2.0:attribute-map" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <!--
    The mappings are a mix of SAML 1.1 and SAML 2.0 attribute names agreed to within the Shibboleth
    community. The non-OID URNs are SAML 1.1 names and most of the OIDs are SAML 2.0 names, with a
    few exceptions for newer attributes where the name is the same for both versions. You will
    usually want to uncomment or map the names for both SAML versions as a unit.
    -->

    <!-- First some useful eduPerson attributes that many sites might use. -->

    <Attribute name="urn:mace:dir:attribute-def:eduPersonPrincipalName" id="eppn">
        <AttributeDecoder xsi:type="ScopedAttributeDecoder"/>
    </Attribute>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.6" id="eppn">
        <AttributeDecoder xsi:type="ScopedAttributeDecoder"/>
    </Attribute>

    <Attribute name="urn:mace:dir:attribute-def:eduPersonScopedAffiliation" id="affiliation">
        <AttributeDecoder xsi:type="ScopedAttributeDecoder" caseSensitive="false"/>
    </Attribute>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.9" id="affiliation">
        <AttributeDecoder xsi:type="ScopedAttributeDecoder" caseSensitive="false"/>
    </Attribute>

    <Attribute name="urn:mace:dir:attribute-def:eduPersonAffiliation" id="unscoped-affiliation">
        <AttributeDecoder xsi:type="StringAttributeDecoder" caseSensitive="false"/>
    </Attribute>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.1" id="unscoped-affiliation">
        <AttributeDecoder xsi:type="StringAttributeDecoder" caseSensitive="false"/>
    </Attribute>

    <Attribute name="urn:mace:dir:attribute-def:eduPersonEntitlement" id="entitlement"/>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.7" id="entitlement"/>

    <!-- A persistent id attribute that supports personalized anonymous access. -->

    <!-- First, the deprecated/incorrect version, decoded as a scoped string: -->
    <Attribute name="urn:mace:dir:attribute-def:eduPersonTargetedID" id="targeted-id">
        <AttributeDecoder xsi:type="ScopedAttributeDecoder"/>
        <!-- <AttributeDecoder xsi:type="NameIDFromScopedAttributeDecoder" formatter="$NameQualifier!$SPNameQualifier!$Name" defaultQualifiers="true"/> -->
    </Attribute>

    <!-- Second, an alternate decoder that will decode the incorrect form into the newer form. -->
    <!--
    <Attribute name="urn:mace:dir:attribute-def:eduPersonTargetedID" id="persistent-id">
        <AttributeDecoder xsi:type="NameIDFromScopedAttributeDecoder" formatter="$NameQualifier!$SPNameQualifier!$Name" defaultQualifiers="true"/>
    </Attribute>
    -->

    <!-- Third, the new version (note the OID-style name): -->
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.10" id="persistent-id">
        <AttributeDecoder xsi:type="NameIDAttributeDecoder" formatter="$NameQualifier!$SPNameQualifier!$Name" defaultQualifiers="true"/>
    </Attribute>

    <!-- Fourth, the SAML 2.0 NameID Format: -->
    <Attribute name="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent" id="persistent-id">
        <AttributeDecoder xsi:type="NameIDAttributeDecoder" formatter="$NameQualifier!$SPNameQualifier!$Name" defaultQualifiers="true"/>
    </Attribute>

    <!-- Some more eduPerson attributes, uncomment these to use them... -->

    <Attribute name="urn:mace:dir:attribute-def:eduPersonPrimaryAffiliation" id="primary-affiliation">
        <AttributeDecoder xsi:type="StringAttributeDecoder" caseSensitive="false"/>
    </Attribute>
    <Attribute name="urn:mace:dir:attribute-def:eduPersonNickname" id="nickname"/>
    <Attribute name="urn:mace:dir:attribute-def:eduPersonPrimaryOrgUnitDN" id="primary-orgunit-dn"/>
    <Attribute name="urn:mace:dir:attribute-def:eduPersonOrgUnitDN" id="orgunit-dn"/>
    <Attribute name="urn:mace:dir:attribute-def:eduPersonOrgDN" id="org-dn"/>

    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.5" id="primary-affiliation">
        <AttributeDecoder xsi:type="StringAttributeDecoder" caseSensitive="false"/>
    </Attribute>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.2" id="nickname"/>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.8" id="primary-orgunit-dn"/>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.4" id="orgunit-dn"/>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.3" id="org-dn"/>

    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.1.1.11" id="assurance"/>

    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.5.1.1" id="member"/>

    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.6.1.1" id="eduCourseOffering"/>
    <Attribute name="urn:oid:1.3.6.1.4.1.5923.1.6.1.2" id="eduCourseMember"/>


    <!-- Examples of LDAP-based attributes, uncomment to use these... -->

    <Attribute name="urn:mace:dir:attribute-def:cn" id="cn"/>
    <Attribute name="urn:mace:dir:attribute-def:sn" id="sn"/>
    <Attribute name="urn:mace:dir:attribute-def:givenName" id="givenName"/>
    <Attribute name="urn:mace:dir:attribute-def:displayName" id="displayName"/>
    <Attribute name="urn:mace:dir:attribute-def:mail" id="mail"/>
    <Attribute name="urn:mace:dir:attribute-def:telephoneNumber" id="telephoneNumber"/>
    <Attribute name="urn:mace:dir:attribute-def:title" id="title"/>
    <Attribute name="urn:mace:dir:attribute-def:initials" id="initials"/>
    <Attribute name="urn:mace:dir:attribute-def:description" id="description"/>
    <Attribute name="urn:mace:dir:attribute-def:carLicense" id="carLicense"/>
    <Attribute name="urn:mace:dir:attribute-def:departmentNumber" id="departmentNumber"/>
    <Attribute name="urn:mace:dir:attribute-def:employeeNumber" id="employeeNumber"/>
    <Attribute name="urn:mace:dir:attribute-def:employeeType" id="employeeType"/>
    <Attribute name="urn:mace:dir:attribute-def:preferredLanguage" id="preferredLanguage"/>
    <Attribute name="urn:mace:dir:attribute-def:manager" id="manager"/>
    <Attribute name="urn:mace:dir:attribute-def:seeAlso" id="seeAlso"/>
    <Attribute name="urn:mace:dir:attribute-def:facsimileTelephoneNumber" id="facsimileTelephoneNumber"/>
    <Attribute name="urn:mace:dir:attribute-def:street" id="street"/>
    <Attribute name="urn:mace:dir:attribute-def:postOfficeBox" id="postOfficeBox"/>
    <Attribute name="urn:mace:dir:attribute-def:postalCode" id="postalCode"/>
    <Attribute name="urn:mace:dir:attribute-def:st" id="st"/>
    <Attribute name="urn:mace:dir:attribute-def:l" id="l"/>
    <Attribute name="urn:mace:dir:attribute-def:o" id="o"/>
    <Attribute name="urn:mace:dir:attribute-def:ou" id="ou"/>
    <Attribute name="urn:mace:dir:attribute-def:businessCategory" id="businessCategory"/>
    <Attribute name="urn:mace:dir:attribute-def:physicalDeliveryOfficeName" id="physicalDeliveryOfficeName"/>
    <Attribute name="urn:mace:dir:attribute-def:employeeID" id="employeeID"/>


    <Attribute name="urn:oid:1.2.840.113556.1.4.35" id="employeeID"/>
    <Attribute name="urn:oid:2.5.4.3" id="cn"/>
    <Attribute name="urn:oid:2.5.4.4" id="sn"/>
    <Attribute name="urn:oid:2.5.4.42" id="givenName"/>
    <Attribute name="urn:oid:2.16.840.1.113730.3.1.241" id="displayName"/>
    <Attribute name="urn:oid:0.9.2342.19200300.100.1.3" id="mail"/>
    <Attribute name="urn:oid:2.5.4.20" id="telephoneNumber"/>
    <Attribute name="urn:oid:2.5.4.12" id="title"/>
    <Attribute name="urn:oid:2.5.4.43" id="initials"/>
    <Attribute name="urn:oid:2.5.4.13" id="description"/>
    <Attribute name="urn:oid:2.16.840.1.113730.3.1.1" id="carLicense"/>
    <Attribute name="urn:oid:2.16.840.1.113730.3.1.2" id="departmentNumber"/>
    <Attribute name="urn:oid:2.16.840.1.113730.3.1.3" id="employeeNumber"/>
    <Attribute name="urn:oid:2.16.840.1.113730.3.1.4" id="employeeType"/>
    <Attribute name="urn:oid:2.16.840.1.113730.3.1.39" id="preferredLanguage"/>
    <Attribute name="urn:oid:0.9.2342.19200300.100.1.10" id="manager"/>
    <Attribute name="urn:oid:2.5.4.34" id="seeAlso"/>
    <Attribute name="urn:oid:2.5.4.23" id="facsimileTelephoneNumber"/>
    <Attribute name="urn:oid:2.5.4.9" id="street"/>
    <Attribute name="urn:oid:2.5.4.18" id="postOfficeBox"/>
    <Attribute name="urn:oid:2.5.4.17" id="postalCode"/>
    <Attribute name="urn:oid:2.5.4.8" id="st"/>
    <Attribute name="urn:oid:2.5.4.7" id="l"/>
    <Attribute name="urn:oid:2.5.4.10" id="o"/>
    <Attribute name="urn:oid:2.5.4.11" id="ou"/>
    <Attribute name="urn:oid:2.5.4.15" id="businessCategory"/>
    <Attribute name="urn:oid:2.5.4.19" id="physicalDeliveryOfficeName"/>


</Attributes>
```
# apache_mod_shib2_shibboleth2.xml

```
<SPConfig xmlns="urn:mace:shibboleth:2.0:native:sp:config"
    xmlns:conf="urn:mace:shibboleth:2.0:native:sp:config"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
    clockSkew="180">

    <!--
    By default, in-memory StorageService, ReplayCache, ArtifactMap, and SessionCache
    are used. See example-shibboleth2.xml for samples of explicitly configuring them.
    -->

    <!--
    To customize behavior for specific resources on Apache, and to link vhosts or
    resources to ApplicationOverride settings below, use web server options/commands.
    See https://wiki.shibboleth.net/confluence/display/SHIB2/NativeSPConfigurationElements for help.

    For examples with the RequestMap XML syntax instead, see the example-shibboleth2.xml
    file, and the https://wiki.shibboleth.net/confluence/display/SHIB2/NativeSPRequestMapHowTo topic.
    -->


    <!-- The ApplicationDefaults element is where most of Shibboleth's SAML bits are defined. -->
    <ApplicationDefaults entityID="https://xxx.xxx.xxx/shibboleth"
                         REMOTE_USER="eppn">

        <!--
        Controls session lifetimes, address checks, cookie handling, and the protocol handlers.
        You MUST supply an effectively unique handlerURL value for each of your applications.
        The value defaults to /Shibboleth.sso, and should be a relative path, with the SP computing
        a relative value based on the virtual host. Using handlerSSL="true", the default, will force
        the protocol to be https. You should also set cookieProps to "https" for SSL-only sites.
        Note that while we default checkAddress to "false", this has a negative impact on the
        security of your site. Stealing sessions via cookie theft is much easier with this disabled.
        -->
        <Sessions lifetime="28800" timeout="3600" relayState="ss:mem"
                  checkAddress="false" handlerSSL="false" cookieProps="http">

            <!--
            Configures SSO for a default IdP. To allow for >1 IdP, remove
            entityID property and adjust discoveryURL to point to discovery service.
            (Set discoveryProtocol to "WAYF" for legacy Shibboleth WAYF support.)
            You can also override entityID on /Login query string, or in RequestMap/htaccess.
            -->
            <SSO entityID="https://idp.xxx.xxx/idp/shibboleth">
              SAML2 SAML1
            </SSO>

            <!-- SAML and local-only logout. -->
            <Logout>SAML2 Local</Logout>

            <!-- Extension service that generates "approximate" metadata based on SP configuration. -->
            <Handler type="MetadataGenerator" Location="/Metadata" signing="false"/>

            <!-- Status reporting service. -->
            <Handler type="Status" Location="/Status" acl="127.0.0.1 ::1"/>

            <!-- Session diagnostic service. -->
            <Handler type="Session" Location="/Session" showAttributeValues="false"/>

            <!-- JSON feed of discovery information. -->
            <Handler type="DiscoveryFeed" Location="/DiscoFeed"/>
        </Sessions>

        <!--
        Allows overriding of error template information/filenames. You can
        also add attributes with values that can be plugged into the templates.
        -->
        <Errors supportContact="root@localhost"
            helpLocation="/about.html"
            styleSheet="/shibboleth-sp/main.css"/>

        <!-- Example of remotely supplied batch of signed metadata. -->
        <!--
        <MetadataProvider type="XML" uri="http://federation.org/federation-metadata.xml"
              backingFilePath="federation-metadata.xml" reloadInterval="7200">
            <MetadataFilter type="RequireValidUntil" maxValidityInterval="2419200"/>
            <MetadataFilter type="Signature" certificate="fedsigner.pem"/>
        </MetadataProvider>
        -->

        <!-- Example of locally maintained metadata. -->
        <!--
        <MetadataProvider type="XML" file="partner-metadata.xml"/>
        -->
        <!-- Loads and trusts a metadata file that describes only the Testshib IdP and how to communicate with it. -->
        <MetadataProvider type="XML" uri="https://idp.xxx.xxx/idp/shibboleth"
             backingFilePath="xxx-idp-metadata.xml" reloadInterval="180000" />


        <!-- Map to extract attributes from SAML assertions. -->
        <AttributeExtractor type="XML" validate="true" reloadChanges="false" path="attribute-map.xml"/>

        <!-- Use a SAML query if no attributes are supplied during SSO. -->
        <AttributeResolver type="Query" subjectMatch="true"/>

        <!-- Default filtering policy for recognized attributes, lets other data pass. -->
        <AttributeFilter type="XML" validate="true" path="attribute-policy.xml"/>

        <!-- Simple file-based resolver for using a single keypair. -->
        <CredentialResolver type="File" key="sp-key.pem" certificate="sp-cert.pem"/>

        <!--
        The default settings can be overridden by creating ApplicationOverride elements (see
        the https://wiki.shibboleth.net/confluence/display/SHIB2/NativeSPApplicationOverride topic).
        Resource requests are mapped by web server commands, or the RequestMapper, to an
        applicationId setting.

        Example of a second application (for a second vhost) that has a different entityID.
        Resources on the vhost would map to an applicationId of "admin":
        -->
        <!--
        <ApplicationOverride id="admin" entityID="https://admin.example.org/shibboleth"/>
        -->
    </ApplicationDefaults>

    <!-- Policies that determine how to process and authenticate runtime messages. -->
    <SecurityPolicyProvider type="XML" validate="true" path="security-policy.xml"/>

    <!-- Low-level configuration about protocols and bindings available for use. -->
    <ProtocolProvider type="XML" validate="true" reloadChanges="false" path="protocols.xml"/>

</SPConfig>
```
# apache_mod_shib2_apache2.xml

**General steps to install a Shibboleth SP for Apache2:**
```
sudo apt-get install apache2 ntp libapache2-mod-shib2
sudo a2enmod ssl
sudo a2enmod shib2
sudo a2ensite default-ssl
sudo shib-keygen -h testsp.site.com
```

**On Apache2 SSL(:443) VHOST protect resource requiring Shibboleth authentication:**
```
<Location /my-service/>
    AuthType shibboleth
    ShibRequestSetting requireSession 1
    Require valid-user
</Location>
```

**The /etc/shibboleth/shibboleth2.xml file needs to be adjusted with the IdP configuration**

**The /etc/shibboleth/attribute-map.xml file needs to be adjusted to allow mapping to certain LDAP attributes**

>There are many other steps not covered above involving both SP and IdP

***
**Sources:**
* https://help.it.ox.ac.uk/shibboleth/shibsp-apache-howto

# Jetty SSL Cert Renewal

**SSL Cert Renewal:**
* Download up to date cert from ie. https://ie.godaddy.com/
* Download the cert as Apache format in zip
* Move the zip to the server
* On the server extract and place on a separate folder as x/cert.crt and x/ca_bundle.crt
* Look for x.key on the server. That is the private key used to sign the cert in the first place.
* Look for the P12 key(keyStorePassword) in /opt/shibboleth-idp/jetty-base/start.d/ssl.ini
* This will take cert.crt, x.key, ca_bundle.crt and will generate a x.p12: openssl pkcs12 -export -in cert.crt -inkey x.key -out x.p12 -name x -passout pass:PASSWORDX -CAfile ca_bundle.crt -caname sub1 -caname root -chain
* Copy the production keystore from /opt/shibboleth-idp/jetty-base/etc/x.keystore to your ...x/
* Run this command keytool -importkeystore -deststorepass PASSWORDX -destkeypass PASSWORDX -destkeystore x.keystore -srckeystore x.p12 -srcstoretype PKCS12 -srcstorepass PASSWORDX -alias x
* Overwrite the cert which is there
* Backup the original files(.keystore and .p12) from production /opt/shibboleth-idp/jetty-base/etc/ after taking a fresh snapshot
* Overwrite the files you have generated with production
* Restart Shibboleth which will also restart Jetty with systemctl restart shibboleth-idp

**SSL Cert Generating:**
**Prepare (password-less) private key:**
```
openssl genrsa -des3 -passout pass:1 -out domain.pass.key 2048
openssl rsa -passin pass:1 -in domain.pass.key -out domain.key
rm domain.pass.key
```

**Prepare certificate signing request (CSR). We'll generate this using our key. Enter relevant information when asked. Note the use of -sha256, without it, modern browsers will generate a warning.**
```
openssl req -key domain.key -sha256 -new -out domain.csr
```

**Prepare certificate. Pick a or b:**

* a) Sign it yourself
```
openssl x509 -req -days 3650 -in domain.csr -signkey domain.key -out domain.crt
```

* b) Send it to an authority

>Your SSL provider will supply you with your certificate and their intermediate certificates in PEM format.

* Pick a or b, add to trust chain and package it in PKCS12 format. First command sets a keystore password for convenience (else you'll need to enter password a dozen times). Set a different password for safety.
```
export PASS=x
```

* a) Self-signed certificate (no need for intermediate certificates)
```
openssl pkcs12 -export -in domain.crt -inkey domain.key -out domain.p12 -name domain -passout pass:$PASS
keytool -importkeystore -deststorepass $PASS -destkeypass $PASS -destkeystore domain.keystore -srckeystore domain.p12 -srcstoretype PKCS12 -srcstorepass $PASS -alias domain
```

* b) Need to include intermediate certificates

Download intermediate certificates and concat them into one file. The order should be sub to root.

```
cat sub.class1.server.ca.pem ca.pem > ca_chain.pem
```

Use a -caname parameter for each intermediate certificate in chain file, respective to the order they were put into the chain file.

```
openssl pkcs12 -export -in domain.crt -inkey domain.key -out domain.p12 -name domain -passout pass:$PASS -CAfile ca_chain.pem -caname sub1 -caname root -chain
keytool -importkeystore -deststorepass $PASS -destkeypass $PASS -destkeystore domain.keystore -srckeystore domain.p12 -srcstoretype PKCS12 -srcstorepass $PASS -alias domain
```
>Important note: Although keytool -list will only list one entry and not any intermediate certificates, it will work perfectly.

**Configure jetty**

**Pick a or b, move domain.keystore file to JETTY_HOME/etc/**

* a) You're using new start.ini style configuration (Jetty 8+):
```
jetty.keystore=etc/domain.keystore
jetty.truststore=etc/domain.keystore
jetty.keystore.password=x
jetty.keymanager.password=x
jetty.truststore.password=x
```

* b) You're using old style configuration with .xml files (you should upgrade to new style!):
```
Edit JETTY_HOME/etc/jetty-ssl.xml file and change the part below. Replace password parts to match your password. We don't define KeyManagerPassword because our key has no password.
<Configure id="Server" class="org.eclipse.jetty.server.Server">
  <New id="sslContextFactory" class="org.eclipse.jetty.http.ssl.SslContextFactory">
    <Set name="KeyStore"><Property name="jetty.home" default="." />/etc/keystore</Set>
    <Set name="KeyStorePassword">x</Set>
    <Set name="TrustStore"><Property name="jetty.home" default="." />/etc/keystore</Set>
    <Set name="TrustStorePassword">x</Set>
  </New>
  <Call name="addConnector">...</Call>
</Configure>
```

**Edit start.ini file to include jetty-ssl.xml file.**
**(Re)start jetty.**
>Note that this keystore file can also be used with other containers like Tomcat.

***
**Source:**
* http://stackoverflow.com/questions/4008837/configure-ssl-on-jetty

# Random

## Configuration

**All configuration files which are located in /opt/shibboleth-idp or /opt/jetty. The only exception is Java which was installed in /usr/java/jre1.8.0_121 and PostgreSQL in /var/lib/pgsql/data/**

**/opt/shibboleth-idp/conf**
* services.xml - This file was edited to allow Edugate to manage our Attribute Filter release. The item "shibboleth.AttributeFilterResources" consumes the Bean "FileBackedEduGateAttributeFilter" and downloads the filter list provided by Edugate instead of requiring Shibboleth to be manually updated for every single IdP.
* saml-nameid.xml - This file was edited to allow the IdP to automatically generate Persistent-IDs for SAML 2.0 and store them in the PostgreSQL DB.
* saml-nameid.properties - This file was edited to provide global settings for the Persistent-IDs generation.
* metadata-providers.xml - This file was edited to declare the metadata sources which the IdP will consume. At time of writing there are three metadata files Edugate, Moodle and EZProxy.
* attribute-filter.xml - This files was edited to declare which attributes are allowed to be released by the IdP. The IdP is also consuming the AttributeFilter files from Edugate which contains a list of all IdP/SP members. This file can be used to for local SPs which are not part of Edugate yet ie Moodle. Ideally we should manage all attribute-filter rules from the Edugate portal only.
* idp.properties - This file was edited to change the 'scope' variable to x.x, it also contains information about the IdP encryption certificates used by SAML and should not be modified.
* ldap.properties - This file was edited to allow Shibboleth to authenticate users against the student domain using LDAPS. All details about authenticators, credentials and certificates are detailed there.
attribute-resolver.xml - This file was edited to include all the attributes the IdP need to resolve. This includes attributes originated from LDAP, static, PostgreSQL and from other attributes(aliases).

**Packages installed**
* Postgresql-9.2.18 - Data source used to store Persistent-IDs.
* Commons-pool2-2.4.2 - Apache Commons dependency in order to use the PostgreSQL connector.
* Commons-dbcp2-2.1.1 - Apache Commons dependency in order to use the PostgreSQL connector.
* Java JRE 1.8.0_121 - That was the latest available version at time of deployment.
* CentOS 7.2 - That was the latest available version at time of deployment.
* Jetty 9.3 - That was the latest available version at time of deployment.
* Shibboleth IdP 3.3 - That was the latest available version at time of deployment.
* Raptor ICA 1.2.3 - That was the latest available version at time of deployment.

## Troubleshooting LDAPS certificate

**Verify:**
```
vim /opt/shibboleth-idp/conf/ldap.properties
```

**Compare the certificate on the server:**
```
vim /opt/shibboleth-idp//credentials/ldap-server.crt
BEGIN CERTIFICATE-----
xxxxx
END CERTIFICATE-----
```
**With the output of the one retrieved:**
```
openssl s_client -connect x.x.x:636
```

## IdP Operation

**Restarting Shibboleth ~0.5minutes: Jetty and all services within them including all metadata files, LDAP, filters, etc.**
```
systemctl restart shibboleth-idp
```

**This URL allows you to check the individual status of each service provided by the Shibboleth IdP. This includes LDAP, Filters, resolvers, metadata, web service, etc.**
```
https://x.x.x/idp/status
```

**This URL allows the download of the IdP's metadata*****Might need to run `export JAVA_HOME=/usr/java/jre1.8.0_121/` before***

```
https://x.x.x/idp/shibboleth
```

**Restarting individual components:**
```
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.AttributeResolverService
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.LoggingService
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.ReloadableAccessControlService
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.MetadataResolverService
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.RelyingPartyResolverService
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.NameIdentifierGenerationService
https://x.x.x/idp/profile/admin/reload-service?id=shibboleth.AttributeFilterService
```

## SP Operation

***Get SP metadata:**
```
https://x.x.x/Shibboleth.sso/Metadata
```

**Get SP session status and attributes released:**
```
https://x.x.x/Shibboleth.sso/Session
```

## Customizing Layout

**Rebuild WAR file:**
```
/opt/shibboleth-idp/bin# ./build.sh 
```
>Might need to run `export JAVA_HOME=/usr/java/jre1.8.0_121/` before


**Changing login and logout page doesn't required restart/reload:**
```
/opt/shibboleth-idp/views/logout.vm
/opt/shibboleth-idp/views/login.vm
```

**If editing CSS needs to be done on those three locations all together followed by a WAR file rebuild:**
```
/opt/shibboleth-idp/edit-webapp/css/main2.css
/opt/shibboleth-idp/webapp/css/main2.css
/opt/shibboleth-idp/views/css/main2.css
```

***
**Sources:**
* https://technical.edugain.org/entities - Check the status of any IdP member.
* https://technical.edugain.org/status - Check the status of any federation member.
* https://sp.testshib.org/ - Use the Testshib Service Provider to perform tests against any IdP member. We are consuming their metadata and our metadata was already uploaded to it, but it is periodically purged on their end so it needs to be uploaded again if you are going to perform a test. In order to do that access https://www.testshib.org/register.html and upload our metadata which can be obtained accessing https://x.x.x/idp/shibboleth
* https://edugate.heanet.ie/Whoami/ - This is a SP provided by HEAnet which works similarly to Testshib, it lists all federation members and allow them to authenticate against their IdPs. After the authentication process the SP will show all the attributes which were released by the institution. They can be manually configured at the local Shibboleth(attribute-filter.xml) level or via Edugate itself.
* https://edugate.heanet.ie/rr3/ - This is the Edugate Resource Registry page, it is used to manage all settings related to IdPs and SPs. Most of the metadata's XML is parsed on a web front end which allows institutions to modify it easily. You must be aware that this modification will affect the metadata which is consumed by the Edugate and Edugain members, but won't modify your metadata maintained in house on your IdP, available at https://x.x.x/idp/shibboleth. That local metadata should be manually updated. A few useful parameters can be altered on the Edugate RR, this includes Logo, Description, Location, Contacts, etc. some parameters can be modified, but are submitted for approval ie Scopes.
* https://spaces.internet2.edu/pages/viewpage.action?pageId=49841792 - This article provides a step-by-step guide describing how to deploy a Shibboleth 3.3 IdP on Red Hat(We used CentOS). and Jetty 9.3.
* http://www.testshib.org/ - This website allows the administrator to test an IdP and/or SP.
* https://www.switch.ch/aai/guides/idp/installation/ - This article provides steps to configure Shibboleth for the Switch federation, but the part we are insterested is how to configure PostgreSQL for Persistent-ID generation.
* https://wiki.shibboleth.net/confluence/display/IDP30/Home - This website was used as a reference guide most of the time as it doesn't provide clear configuration steps in order to put things together.
* http://shibboleth.1660669.n2.nabble.com/ - This is the main Shibboleth mailing list. Most of the topics are highly advanced and before you submit a question do your background research.
* https://www.unicon.net/about/blogs/ldap-tlsssl-config-shibboleth-idp-explained - This article was used to help configuring Shibboleth to use LDAPS.
* https://www.petri.com/enable-secure-ldap-windows-server-2008-2012-dc - This article was used to help enabling LDAPS on our domain as it is not enabled by default.
