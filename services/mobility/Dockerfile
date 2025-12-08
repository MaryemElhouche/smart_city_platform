FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Installer Maven
RUN apk add --no-cache maven

# Préparer le cache des dépendances
COPY pom.xml .
RUN mvn -q -e -DskipTests -DremoteRepositories=all dependency:go-offline --no-transfer-progress

# Copier les sources et builder
COPY src ./src
RUN mvn -q clean package -DskipTests --no-transfer-progress

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]