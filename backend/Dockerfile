# Use OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Expose Render port
EXPOSE 8080

# Run the jar file
CMD ["sh", "-c", "java -jar target/*.jar --server.port=$PORT"]