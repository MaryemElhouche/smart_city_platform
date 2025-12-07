FROM openjdk:17-jdk
WORKDIR /app
COPY target/data-graphql.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","app.jar"]
