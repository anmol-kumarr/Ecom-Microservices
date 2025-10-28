# 🛒 E-Commerce Microservices Platform

A modern, scalable e-commerce platform built with **NestJS microservices architecture**, featuring event-driven communication, authentication, notifications, and product management.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Microservices](#-microservices)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Communication Flow](#-communication-flow)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)

---

## 🏗 Architecture Overview

This project follows a **microservices architecture** with event-driven communication using **RabbitMQ**. Each service is independently deployable and manages its own database.

```
┌─────────────────┐
│   API Gateway   │ (Port 3000 - Auth Service HTTP)
└────────┬────────┘
         │
    ┌────┴────┐
    │ RabbitMQ │ (Message Broker)
    └────┬────┘
         │
    ┌────┴──────────────────────────────────┐
    │                                        │
┌───┴───────┐  ┌──────────────┐  ┌─────────┴──────┐  ┌──────────────┐
│   Auth    │  │ Notification │  │     User       │  │   Product    │
│  Service  │  │   Service    │  │   Service      │  │   Service    │
│  :3001    │  │  (Micro)     │  │    :3003       │  │    :3004     │
└───────────┘  └──────────────┘  └────────────────┘  └──────────────┘
     │                │                   │                   │
     │                │                   │                   │
┌────┴────┐      ┌────┴────┐        ┌────┴────┐        ┌────┴────┐
│  Redis  │      │  SMTP   │        │   DB    │        │   DB    │
│  Cache  │      │ (Gmail) │        │  User   │        │ Product │
└─────────┘      └─────────┘        └─────────┘        └─────────┘
```

---

## 🎯 Microservices

### 1. **Auth Service** (Port: 3000)
- **Type**: HTTP + RabbitMQ Producer
- **Responsibilities**:
  - User authentication via OTP
  - JWT token generation
  - Session management with Redis
  - User registration
  - Cookie-based authentication

**Key Features**:
- ✅ Send OTP via email
- ✅ Verify OTP and issue JWT tokens
- ✅ HTTP-only cookie authentication
- ✅ Redis-based OTP caching (2-minute TTL)
- ✅ Event emission to User & Notification services

### 2. **User Service** (Port: 3002)
- **Type**: HTTP + RabbitMQ Consumer
- **Responsibilities**:
  - User profile management
  - Address management
  - User data persistence
  - Listen for user creation events

**Key Features**:
- ✅ Receives user-created events from Auth Service
- ✅ Stores user data in PostgreSQL
- ✅ Manages user addresses with relations

### 3. **Notification Service** (Microservice Only)
- **Type**: RabbitMQ Consumer
- **Responsibilities**:
  - Email notifications
  - OTP delivery
  - Transactional emails
  - Event-driven notifications

**Key Features**:
- ✅ SMTP integration (Gmail)
- ✅ Email OTP delivery
- ✅ Extensible for SMS/Push notifications
- ✅ Handles multiple notification types

### 4. **Product Service** (Port: 3001)
- **Type**: HTTP
- **Responsibilities**:
  - Product catalog management
  - Product CRUD operations
  - Product search and filtering
  - Inventory management

**Key Features**:
- ✅ Product management with PostgreSQL
- ✅ Size variants (S, M, L, XL, XXL)
- ✅ Image gallery support
- ✅ FAQ management
- ✅ Category and keyword tagging

### 5. **Cart Service** (Port: TBD)
- **Type**: HTTP
- **Status**: 🚧 In Development
- **Responsibilities**:
  - Shopping cart management
  - Cart persistence
  - Cart item operations

---

## ✨ Features

### 🔐 Authentication & Authorization
- **OTP-based passwordless authentication**
- **JWT token generation with HttpOnly cookies**
- **Redis-backed OTP caching (2-minute expiry)**
- **Auto user registration on first login**

### 📧 Notification System
- **Email notifications via Gmail SMTP**
- **Event-driven architecture**
- **Support for multiple notification types**
- **Async processing via RabbitMQ**

### 👤 User Management
- **User profile creation**
- **Multiple address support**
- **User data sync across services**
- **Address CRUD operations**

### 📦 Product Management
- **Product CRUD operations**
- **Size variants**
- **Multiple image uploads**
- **Category and keyword management**
- **FAQ support**

### 🚀 Microservices Infrastructure
- **Event-driven communication**
- **Service independence**
- **Horizontal scalability**
- **Fault tolerance**

---

## 🛠 Tech Stack

### Backend Framework
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript

### Databases
- **PostgreSQL** - Relational database for persistent storage
- **Redis** - In-memory cache for OTP storage
- **Prisma ORM** - Type-safe database client

### Message Broker
- **RabbitMQ** - Asynchronous event-driven communication
- **AMQP** - Reliable message delivery

### Authentication
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Cookie Parser** - Cookie-based session management

### Email Service
- **Nodemailer** - Email sending
- **@nestjs-modules/mailer** - NestJS email integration
- **Gmail SMTP** - Email delivery

### Development Tools
- **pnpm** - Fast, disk-efficient package manager
- **Concurrently** - Run multiple services simultaneously
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
ecommerce/
├── auth-service/              # Authentication microservice
│   ├── prisma/
│   │   ├── schema.prisma      # User authentication schema
│   │   └── migrations/
│   ├── src/
│   │   ├── app.controller.ts  # Auth endpoints (send-otp, verify-otp)
│   │   ├── app.service.ts     # Auth business logic
│   │   ├── app.module.ts      # Module configuration
│   │   ├── prisma.service.ts  # Prisma client
│   │   ├── redis.service.ts   # Redis OTP caching
│   │   ├── constant.ts        # Service constants
│   │   └── config/
│   │       └── app.config.ts  # Configuration loader
│   └── package.json
│
├── user-service/              # User management microservice
│   ├── prisma/
│   │   ├── schema.prisma      # User & Address schema
│   │   └── migrations/
│   ├── src/
│   │   ├── app.controller.ts  # User event handlers
│   │   ├── app.service.ts     # User business logic
│   │   ├── app.module.ts      # Module configuration
│   │   ├── prisma.service.ts  # Prisma client
│   │   └── config/
│   └── package.json
│
├── notification-service/      # Notification microservice
│   ├── src/
│   │   ├── app.controller.ts  # Notification handlers
│   │   ├── app.service.ts     # Email sending logic
│   │   ├── app.module.ts      # Mailer configuration
│   │   └── config/
│   └── package.json
│
├── product-service/           # Product management microservice
│   ├── prisma/
│   │   ├── schema.prisma      # Product schema
│   │   └── migrations/
│   ├── src/
│   │   ├── app.controller.ts  # Product endpoints
│   │   ├── app.service.ts     # Product business logic
│   │   ├── app.module.ts      # Module configuration
│   │   └── prisma.service.ts
│   └── package.json
│
├── cart-service/              # Shopping cart microservice (🚧 WIP)
│   ├── src/
│   └── package.json
│
├── PRISMA_SETUP_GUIDE.md      # Prisma configuration guide
├── package.json               # Root package.json
└── readme.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **pnpm** (v8+)
- **PostgreSQL** (v14+)
- **Redis** (v7+)
- **RabbitMQ** (v3.12+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   pnpm install

   # Install service dependencies
   cd auth-service && pnpm install
   cd ../user-service && pnpm install
   cd ../notification-service && pnpm install
   cd ../product-service && pnpm install
   cd ../cart-service && pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in each service directory (see [Environment Variables](#-environment-variables))

4. **Set up databases**
   ```bash
   # Auth Service
   cd auth-service
   npx prisma migrate dev --name init
   npx prisma generate

   # User Service
   cd ../user-service
   npx prisma migrate dev --name init
   npx prisma generate

   # Product Service
   cd ../product-service
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start RabbitMQ**
   ```bash
   # Using Docker
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

   # Or install locally and start
   rabbitmq-server
   ```

6. **Start Redis**
   ```bash
   # Using Docker
   docker run -d --name redis -p 6379:6379 redis:latest

   # Or install locally and start
   redis-server
   ```

7. **Run all services**
   ```bash
   # From root directory
   pnpm run dev
   ```

   This starts:
   - Auth Service on port 3000
   - User Service on port 3002
   - Product Service on port 3001
   - Notification Service (microservice only)

---

## 🔐 Environment Variables

### **Auth Service** (`.env`)
```env
# Server
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key-here"

# RabbitMQ
RABBIT_MQ_URL="amqp://localhost:5672"
USER_QUEUE="user_queue"
NOTIFICATION_QUEUE="notification_queue"
```

### **User Service** (`.env`)
```env
# Server
PORT=3002

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/user_db?schema=public"

# RabbitMQ
RABBIT_MQ_URL="amqp://localhost:5672"
USER_QUEUE="user_queue"
```

### **Notification Service** (`.env`)
```env
# Email Configuration
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"

# RabbitMQ
RABBIT_MQ_URL="amqp://localhost:5672"
```

### **Product Service** (`.env`)
```env
# Server
PORT=3001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/product_db?schema=public"
```

---

## 📡 API Documentation

### Auth Service (`:3000`)

#### **POST** `/send-otp`
Send OTP to user's email

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": 1234567890
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

#### **POST** `/verify-otp`
Verify OTP and issue JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": 1234567890,
  "otp": "123456"
}
```

**Response:**
- Sets HttpOnly cookie with JWT token
- Creates user if doesn't exist
- Returns success message

---

### User Service (`:3002`)

#### **GET** `/`
Health check endpoint

**Response:**
```json
"hello world"
```

#### **Internal Event Handlers**

**Event:** `user-created`
- Triggered by Auth Service
- Creates user profile in User database
- Stores email and phone number

---

### Product Service (`:3001`)

> 🚧 API endpoints under development

**Planned Features:**
- GET `/products` - List all products
- GET `/products/:id` - Get product details
- POST `/products` - Create product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product

---

## 🔄 Communication Flow

### User Registration & Login Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthService
    participant Redis
    participant NotificationService
    participant UserService
    participant Database

    Client->>AuthService: POST /send-otp
    AuthService->>AuthService: Generate 6-digit OTP
    AuthService->>Redis: Store OTP (TTL: 2 min)
    AuthService->>NotificationService: Emit notification-otp event
    NotificationService->>Client: Send OTP email
    AuthService->>Client: OTP sent successfully

    Client->>AuthService: POST /verify-otp
    AuthService->>Redis: Get OTP
    AuthService->>AuthService: Verify OTP
    AuthService->>Database: Check if user exists
    
    alt User exists
        AuthService->>AuthService: Generate JWT
        AuthService->>Client: Set cookie & return token
    else New user
        AuthService->>Database: Create user in Auth DB
        AuthService->>UserService: Emit user-created event
        UserService->>Database: Create user in User DB
        AuthService->>AuthService: Generate JWT
        AuthService->>Client: Set cookie & return token
    end
```

### Event-Driven Architecture

```
Auth Service                 RabbitMQ                   Consumers
    │                           │                           │
    ├─── user-created ─────────►│───────────────────────►  User Service
    │                           │                           │
    ├─── notification-otp ──────►│───────────────────────►  Notification Service
    │                           │                           │
```

---

## 🗄 Database Schema

### Auth Service Database

```prisma
model user {
  id           Int     @id @default(autoincrement())
  mobileNumber Int?
  email        String?
}
```

### User Service Database

```prisma
model User {
  id          Int       @id
  email       String?
  phoneNumber Int?
  password    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  addresses   Address[]
}

model Address {
  id        Int      @id @default(autoincrement())
  userId    Int
  street    String
  city      String
  state     String
  zipCode   String
  country   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
}
```

### Product Service Database

```prisma
enum Size {
  S
  M
  L
  XL
  XXL
}

model Product {
  id                 Int      @id @default(autoincrement())
  title              String
  description        String?
  price              Float
  discountPercentage Float?
  size               Size
  relevantKeywords   String[]
  category           String
  imageUrl           String[]
  faq                Json[]
  dressType          String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

---

## 💻 Development

### Run Individual Services

```bash
# Auth Service
cd auth-service
pnpm run start:dev

# User Service
cd user-service
pnpm run start:dev

# Notification Service
cd notification-service
pnpm run start:dev

# Product Service
cd product-service
pnpm run start:dev
```

### Run All Services Concurrently

```bash
# From root directory
pnpm run dev
```

This command uses `concurrently` to run all services with color-coded logs:
- **Cyan**: Auth Service
- **Magenta**: Notification Service
- **Yellow**: User Service
- **Green**: Product Service

### Database Migrations

```bash
# Create a new migration
cd <service-name>
npx prisma migrate dev --name <migration-name>

# Generate Prisma Client
npx prisma generate

# Reset database (⚠️ Development only)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Prisma "Cannot find module" Error**

**Solution:** See [PRISMA_SETUP_GUIDE.md](./PRISMA_SETUP_GUIDE.md)

Quick fix:
```bash
# Ensure correct generator in schema.prisma
generator client {
  provider = "prisma-client-js"  # Must be "prisma-client-js"
  output   = "../generated/prisma"
}

# Regenerate client
npx prisma generate
```

#### 2. **RabbitMQ Connection Failed**

**Solution:**
- Ensure RabbitMQ is running: `rabbitmq-server`
- Check connection URL in `.env`
- Verify port 5672 is accessible

#### 3. **Redis Connection Error**

**Solution:**
- Start Redis: `redis-server`
- Check `REDIS_URL` in Auth Service `.env`
- Default: `redis://localhost:6379`

#### 4. **Email Not Sending**

**Solution:**
- Enable "Less secure app access" in Gmail (if using Gmail)
- Or generate App Password: Google Account → Security → App Passwords
- Update `MAIL_USER` and `MAIL_PASS` in Notification Service `.env`

#### 5. **Port Already in Use**

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### 6. **Database Connection Error**

**Solution:**
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` format:
  ```
  postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
  ```
- Create database if it doesn't exist:
  ```sql
  CREATE DATABASE auth_db;
  CREATE DATABASE user_db;
  CREATE DATABASE product_db;
  ```

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials/)
- [Redis Documentation](https://redis.io/docs/)
- [Prisma Setup Guide](./PRISMA_SETUP_GUIDE.md)

---

## 🗺 Roadmap

- [ ] Implement Cart Service functionality
- [ ] Add Order Service
- [ ] Implement Payment Gateway integration
- [ ] Add API Gateway with rate limiting
- [ ] Implement user authentication guards
- [ ] Add product search and filtering
- [ ] Implement inventory management
- [ ] Add Docker Compose for local development
- [ ] Kubernetes deployment configurations
- [ ] Implement monitoring and logging (ELK Stack)
- [ ] Add GraphQL API layer
- [ ] Implement caching strategies (Redis)
- [ ] Add comprehensive test coverage
- [ ] CI/CD pipeline setup

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Refer to [Troubleshooting](#-troubleshooting) section
- Check [PRISMA_SETUP_GUIDE.md](./PRISMA_SETUP_GUIDE.md) for Prisma-specific issues

---

**Built with ❤️ using NestJS and TypeScript**
