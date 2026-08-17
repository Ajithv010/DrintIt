# DrinkIt 🥤

DrinkIt is a full-stack **beverage e-commerce platform** built using React, Java, Spring Boot, Spring Security, JWT, Hibernate/JPA, and MySQL.

The application provides a complete online shopping experience where customers can browse products, manage their cart, place orders, and manage their profiles. Administrators can manage products, categories, stock, and customer orders.

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

## Features

### Customer

- Registration and login
- JWT authentication
- Browse beverage categories
- Search and filter products
- View product details
- Add and manage cart items
- Manage delivery addresses
- Checkout and place orders
- View order history and order details
- Cancel orders where supported
- Profile management

### Admin

- Admin dashboard
- Category management
- Category image upload
- Product management
- Product image upload
- Stock management
- Activate/deactivate products and categories
- View and manage customer orders
- Update order status

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- React Icons

**Backend**
- Java 26
- Spring Boot
- Spring Security
- JWT
- Hibernate / JPA
- Spring Data JPA
  

**Database**
- MySQL

**Tools**
- Git
- GitHub
- VS Code

## Project Structure

```text
DrintIt/
├── src/                    # Spring Boot backend
├── DrinkIt-frontend/      # React frontend
├── pom.xml                # Maven configuration
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md

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

## Authentication

DrinkIt uses **Spring Security and JWT** for secure authentication and role-based authorization.

- Customer and admin access are separated
- Protected APIs require authentication
- JWT is used for authenticated requests

## Getting Started

### Prerequisites

Make sure you have installed:

- Java 26
- Node.js
- npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ajithv010/DrintIt.git
cd DrintIt

## Getting Started

### Prerequisites

Make sure you have installed:

- Java 26
- Node.js
- npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ajithv010/DrintIt.git
cd DrintIt
