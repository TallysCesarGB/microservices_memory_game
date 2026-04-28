FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /workspace
COPY pom.xml .
COPY src ./src

# download dependencies and build
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /workspace/target/auth-service-0.0.1-SNAPSHOT.jar ./auth-service.jar
EXPOSE 9090
VOLUME ["/data"]
CMD ["java", "-jar", "auth-service.jar"]