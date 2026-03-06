# -------- Build Stage --------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy backend project
COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/src src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# -------- Run Stage --------
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]