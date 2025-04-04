FROM openjdk:17
EXPOSE 8089
ADD target/Booki-0.0.1-SNAPSHOT.jar Booki.jar
ENTRYPOINT ["java", "-jar", "Booki.jar"]
