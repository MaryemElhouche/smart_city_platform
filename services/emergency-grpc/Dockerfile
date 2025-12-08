# Étape 1 : Build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Installer Maven et protoc (protobuf compiler)
RUN apk add --no-cache maven protobuf

# Préparer le cache des dépendances
COPY pom.xml .
RUN mvn -q -e -DskipTests -DremoteRepositories=all dependency:go-offline --no-transfer-progress

# Copier les sources et builder
COPY src ./src
# Inclure les sources générées protobuf/grpc si présentes
COPY target/generated-sources/protobuf/java ./src/main/java
COPY target/generated-sources/protobuf/grpc-java ./src/main/java
RUN mvn -q clean package -DskipTests -DskipProtobuf=true --no-transfer-progress

# Étape 2 : Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copier le jar depuis l'étape build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port sur lequel Spring Boot écoute
EXPOSE 8082

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
