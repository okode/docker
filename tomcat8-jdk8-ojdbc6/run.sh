#!/bin/bash
if [[ ${MANAGER_USER} ]]; then
    echo "Manager username configuration detected, setting it to $MANAGER_USER"
    sed -i -e "s/username=\"admin\"/username=\"$MANAGER_USER\"/g" /opt/tomcat8/conf/tomcat-users.xml
fi
if [[ ${MANAGER_PASSWORD} ]]; then
    echo "Manager password configuration detected, setting it"
    sed -i -e "s/password=\"admin\"/password=\"$MANAGER_PASSWORD\"/g" /opt/tomcat8/conf/tomcat-users.xml
fi
if [[ ${SCRIPT_USER} ]]; then
    echo "Script username configuration detected, setting it to $SCRIPT_USER"
    sed -i -e "s/username=\"scriptuser\"/username=\"$SCRIPT_USER\"/g" /opt/tomcat8/conf/tomcat-users.xml
fi
if [[ ${SCRIPT_PASSWORD} ]]; then
    echo "Script user password configuration detected, setting it"
    sed -i -e "s/password=\"scriptpass\"/password=\"$SCRIPT_PASSWORD\"/g" /opt/tomcat8/conf/tomcat-users.xml
fi
if [[ ${CONTEXT_CONFIG} ]]; then
    echo "Context file configuration detected, setting it"
    sed -i -e "s#</Context>#$CONTEXT_CONFIG</Context>#g" /opt/tomcat8/conf/context.xml
fi

echo "Setting manager max limit from 50MB to 100MB just in case"

sed -i -e "s/52428800/104857600/g" /opt/tomcat8/webapps/manager/WEB-INF/web.xml

sed -i -e "s/<Valve className=\"org.apache.catalina.valves.RemoteAddrValve\"/<!--Valve className=\"org.apache.catalina.valves.RemoteAddrValve\"/g" /opt/tomcat8/webapps/manager/META-INF/context.xml
sed -i -e "allow=\"127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1\" -->/ allow=\"127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1\" /-->" /opt/tomcat8/webapps/manager/META-INF/context.xml

echo "Installing additional certs"

for filename in /certs/*.cer; do
    alias=$(echo $filename| cut -d'/' -f 3)
    keytool -import -trustcacerts -file "$filename" -alias "$alias" -keystore /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/cacerts -storepass changeit -noprompt
done

source /opt/tomcat8/bin/catalina.sh run
