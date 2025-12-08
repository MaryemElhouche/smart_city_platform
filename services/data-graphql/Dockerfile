# Stage 1: Build
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/data-graphql-*.jar app.jar

# Expose GraphQL service port
EXPOSE 8084

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8084/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
