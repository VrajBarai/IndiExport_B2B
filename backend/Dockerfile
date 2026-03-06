# Use Java 17
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ .

# Give permission to mvnw
RUN chmod +x mvnw

# Build project
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run application
CMD ["java", "-jar", "target/*.jar"]