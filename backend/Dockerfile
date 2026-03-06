# Use Java 17
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "target/*.jar"]