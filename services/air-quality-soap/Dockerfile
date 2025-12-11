# Image finale - utilise le JAR pré-compilé
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copier le JAR déjà compilé localement
COPY target/air-quality-soap-0.0.1-SNAPSHOT.jar app.jar

# Exposer le port
EXPOSE 8083

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8083/actuator/health || exit 1

# Démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]