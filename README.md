# DrinkIt 🥤

DrinkIt is a full-stack **beverage e-commerce platform** built using React, Java, Spring Boot, Spring Security, JWT, Hibernate/JPA, and MySQL.

The application provides a complete online shopping experience where customers can browse products, manage their cart, place orders, and manage their profiles. Administrators can manage products, categories, stock, and customer orders.

---

## Features

### Customer

- User registration and login
- JWT-based authentication
- Browse beverage categories
- Search and filter products
- View product details
- Add products to cart
- Update cart quantities
- Remove cart items
- Clear cart
- Manage delivery addresses
- Checkout
- Place orders
- View order history
- View order details
- Cancel orders where supported
- Manage profile
- Logout

### Admin

- Admin dashboard
- Category management
- Category image upload
- Product management
- Product image upload
- Stock management
- Activate/deactivate products
- Activate/deactivate categories
- View customer orders
- View order details
- Update order status

---

## Beverage Categories

DrinkIt supports different beverage categories such as:

- Juices
- Soft Drinks
- Energy Drinks
- Water
- Milkshakes
- Cold Coffee
- Lemonades & Coolers
- Sports Drinks

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- React Icons

### Backend

- Java 26
- Spring Boot
- Spring Security
- JWT
- Hibernate / JPA
- Spring Data JPA

### Database

- MySQL

### Build & Tools

- Maven
- Git
- GitHub
- VS Code

---

## Project Structure

    DrintIt/
    ├── src/                    # Spring Boot backend
    ├── DrinkIt-frontend/       # React frontend
    ├── pom.xml                 # Maven configuration
    ├── mvnw                    # Maven wrapper for Linux/macOS
    ├── mvnw.cmd                # Maven wrapper for Windows
    ├── .gitignore
    └── README.md

---

## Application Flow

    Customer
       ↓
    React Frontend
       ↓
    Axios / REST API
       ↓
    Spring Boot Backend
       ↓
    Spring Data JPA / Hibernate
       ↓
    MySQL

---

## Authentication

DrinkIt uses **Spring Security and JWT** for secure authentication and role-based authorization.

- Customer and admin access are separated
- Protected APIs require authentication
- JWT is used for authenticated requests

### Authentication Flow

    User Login
        ↓
    Spring Security
        ↓
    Validate Credentials
        ↓
    Generate JWT
        ↓
    Frontend Receives Token
        ↓
    Authenticated API Requests
        ↓
    Backend Validates JWT
        ↓
    Access Protected Resources

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Java 26
- Node.js
- npm
- MySQL
- Git

### 1. Clone the Repository

    git clone https://github.com/Ajithv010/DrintIt.git
    cd DrintIt

### 2. Configure MySQL

Create a MySQL database:

    CREATE DATABASE drinkit;

Configure your database credentials and JWT settings in:

    src/main/resources/application.properties

> **Note:** Do not commit passwords, JWT secrets, or other sensitive information to GitHub.

### 3. Run the Backend

From the project root directory.

#### Windows

    mvnw.cmd spring-boot:run

#### Linux / macOS

    ./mvnw spring-boot:run

### 4. Run the Frontend

Open another terminal:

    cd DrinkIt-frontend

Install dependencies:

    npm install

Start the development server:

    npm run dev

Open the URL provided by Vite in your browser.

---

## Future Improvements

- Online payment integration
- Product reviews and ratings
- Wishlist
- Coupons and discounts
- Order tracking
- Email notifications
- Dockerization
- Cloud deployment
- Automated testing

---

## Screenshots

Screenshots of the customer and admin interfaces can be added here.

---

## Author

**Ajith**

Computer Science Engineering Graduate

**Tech:** Java | Spring Boot | React | JavaScript | SQL

---

## License

This project is developed for educational and portfolio purposes.
