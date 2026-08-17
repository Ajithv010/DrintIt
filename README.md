# DrinkIt

DrinkIt is a full-stack, non-alcoholic beverage e-commerce platform built with React, Vite, Java, Spring Boot, Spring Security, JWT, Hibernate/JPA and MySQL.

## Overview

DrinkIt provides an end-to-end beverage ordering experience with separate customer and administrator workflows.

### Customer Features

- Registration and login
- Browse beverage categories
- Browse, search and filter products
- Product details
- Shopping cart
- Quantity updates
- Remove and clear cart
- Delivery address management
- Checkout
- Order placement
- Order history
- Order details
- Order cancellation where supported
- Profile management
- Logout

### Admin Features

- Admin dashboard
- Category management
- Category image upload
- Product management
- Product image upload
- Stock management
- Product/category activation
- Order management
- Order detail view
- Order status updates

## Beverage Categories

DrinkIt is designed specifically for non-alcoholic beverages.

Examples include:

- Juices
- Soft Drinks
- Energy Drinks
- Water
- Milkshakes
- Cold Coffee
- Lemonades & Coolers
- Sports Drinks

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Routing | React Router |
| HTTP Client | Axios |
| UI Icons | React Icons |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| ORM | Hibernate / Spring Data JPA |
| Database | MySQL |
| Build Tool | Maven |
| Version Control | Git / GitHub |

## Architecture

```text
React + Vite
     |
     | Axios / REST API
     v
Spring Boot
     |
     +-- Controllers
     +-- Services
     +-- DTOs / Mappers
     +-- Repositories
     +-- Security
     |
     v
MySQL
