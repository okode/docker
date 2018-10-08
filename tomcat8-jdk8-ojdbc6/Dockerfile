FROM openjdk:8

RUN curl -o /opt/tomcat8.tar.gz https://archive.apache.org/dist/tomcat/tomcat-8/v8.5.9/bin/apache-tomcat-8.5.9.tar.gz
RUN mkdir /opt/tomcat8 
RUN tar -xzf /opt/tomcat8.tar.gz -C /opt/tomcat8 --strip-components=1
RUN rm -f /opt/tomcat8.tar.gz
ADD http://www.datanucleus.org/downloads/maven2/oracle/ojdbc6/11.2.0.3/ojdbc6-11.2.0.3.jar /opt/tomcat8/lib
COPY tomcat-users.xml /opt/tomcat8/conf/
COPY run.sh /opt/tomcat8/bin/
RUN sed -i.bak 's/HTTP\/1\.1"/HTTP\/1\.1" URIEncoding="UTF-8"/g' /opt/tomcat8/conf/server.xml

VOLUME /certs

EXPOSE 8080

CMD ["/opt/tomcat8/bin/run.sh"]
