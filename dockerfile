FROM eclipse-temurin:22-jre-alpine
WORKDIR /app
COPY target/Touristique-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]