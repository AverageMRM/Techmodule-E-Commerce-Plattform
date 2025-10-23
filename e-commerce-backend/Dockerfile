# Backend Dockerfile - Spring Boot (Java 21)

# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Leverage Docker cache for dependencies
COPY pom.xml ./
RUN mvn -B -q -e -DskipTests dependency:go-offline

# Copy sources and build
COPY src ./src
RUN mvn -B -q -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy built jar
COPY --from=build /app/target/*.jar ./app.jar

# Expose port
EXPOSE 8080

# Health and JVM opts optional
ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
