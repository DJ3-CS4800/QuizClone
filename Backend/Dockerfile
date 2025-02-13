FROM maven:latest AS build

WORKDIR /app

COPY pom.xml .
COPY .env /app/.env 

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:latest

WORKDIR /app

COPY --from=build /app/target/studyDeckBackend-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/studyDeckBackend-0.0.1-SNAPSHOT.jar"]
