# Étape 1 : Build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copier pom et sources
COPY pom.xml .
COPY src ./src

# Installer Maven et builder le projet
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

# Étape 2 : Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copier le jar depuis l'étape build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port sur lequel Spring Boot écoute
EXPOSE 8082

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
