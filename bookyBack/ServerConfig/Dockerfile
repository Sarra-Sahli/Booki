FROM openjdk:17
EXPOSE 8888
ADD target/ServerConfig-0.0.1-SNAPSHOT.jar server-config.jar
ENTRYPOINT ["java","-jar","server-config.jar"]
