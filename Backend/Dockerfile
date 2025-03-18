FROM maven:latest AS build

WORKDIR /app

COPY pom.xml .

ENV DATASOURCE_URL=${DATASOURCE_URL}
ENV DATASOURCE_USERNAME=${DATASOURCE_USERNAME}
ENV DATASOURCE_PASSWORD=${DATASOURCE_PASSWORD}
ENV FRONTEND_URL=${FRONTEND_URL}

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:latest

WORKDIR /app

COPY --from=build /app/target/studyDeckBackend-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/studyDeckBackend-0.0.1-SNAPSHOT.jar"]
