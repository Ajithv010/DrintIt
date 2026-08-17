FROM eclipse-temurin:26-jdk

WORKDIR /app

RUN useradd -m -u 1000 appuser

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

USER appuser

CMD ["sh", "-c", "java -jar target/*.jar"]