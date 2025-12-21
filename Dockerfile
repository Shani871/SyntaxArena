# Stage 1: Build the frontend (React/Vite)
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the backend (Spring Boot)
FROM maven:3.8.4-openjdk-17-slim AS backend-build
WORKDIR /backend
# Copy the pom.xml first to cache dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline
# Copy source and frontend dist
COPY backend/src ./src
COPY --from=frontend-build /app/dist ./src/main/resources/static
# Build the jar
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
