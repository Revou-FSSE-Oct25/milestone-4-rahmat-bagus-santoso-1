[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PzCCy7VV)

# Fictional Banking API

## Overview
Fictional Banking API is a backend application built with NestJS, Prisma, and PostgreSQL. It provides basic banking features such as user authentication, profile management, bank account management, and financial transactions.

This project was developed to practice building a modular REST API with relational database design, JWT-based authentication, and Prisma integration.


# Demo
** Railway :** [Demo Link](https://superb-radiance-production-4003.up.railway.app)

## Features Implemented
### Authentication
- User registration
- User login with JWT access token
- User logout

### User Profile
- Get current user profile
- Update current user profile

### Accounts
- Create a bank account
- Get account list
- Get account details
- Update account status
- Delete an account with validation rules

### Transactions
- Deposit to an account
- Withdraw from an account
- Transfer between accounts
- Get transaction history
- Get transaction details

### API Documentation
- Swagger UI available at:
  - `/api/docs`

## API Endpoints

All endpoints use the `/api/v1` prefix.

Public endpooints:
### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Protected endpoints:
### Users
- `GET /api/v1/users/profile`
- `PATCH /api/v1/users/profile`

### Accounts
- `POST /api/v1/accounts`
- `GET /api/v1/accounts`
- `GET /api/v1/accounts/:id`
- `PATCH /api/v1/accounts/:id`
- `DELETE /api/v1/accounts/:id`

### Transactions
- `POST /api/v1/transactions/deposit`
- `POST /api/v1/transactions/withdraw`
- `POST /api/v1/transactions/transfer`
- `GET /api/v1/transactions`
- `GET /api/v1/transactions/:id`

## Tech Stack
- Backend Framework: NestJS
- ORM: Prisma ORM
- Database: PostgreSQL
- Authentication: JWT Authentication
- API Documentation: Swagger
- Deployment: Railway

## How to Run Locally
### Clone the repository
```
git clone <your-repository-url>
```

### Project setup
```
npm install
```
### Environment Variables
Create a `.env` file based on `.env.example` and configure the following variables:
```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1h"
BCRYPT_SALT_ROUND=10
```
### Prisma
```
# Run Prisma migration
npx prisma migrate

# Generate Prisma Client
npx prisma generate

# Run database seed
npx prisma db seed
```
### Compile and run the project
```
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

The application will run at:
- http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Run Test
```
# unit test
npm run test

# test coverage
npm run test:cov
```

## Api endpoints guide
Detailed Api endpoints guide available in
```
api-endpoints-guide.md
```

## Project Structure

```bash
.
├── prisma
│   ├── migrations
│   │   └── 20260422092440_init
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── accounts
│   │   ├── dto
│   │   │   ├── create-account.dto.ts
│   │   │   └── update-account.dto.ts
│   │   ├── entities
│   │   │   └── account.entity.ts
│   │   ├── tests
│   │   │   ├── mocks
│   │   │   │   └── accounts.mock.ts
│   │   │   └── accounts.service.spec.ts
│   │   ├── accounts.controller.ts
│   │   ├── accounts.module.ts
│   │   ├── accounts.repository.ts
│   │   └── accounts.service.ts
│   ├── auth
│   │   ├── decorators
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── dto
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── tests
│   │   │   ├── mocks
│   │   │   │   └── auth.mock.ts
│   │   │   └── auth.service.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── password
│   │   ├── password.module.ts
│   │   └── password.service.ts
│   ├── transactions
│   │   ├── dto
│   │   │   ├── deposit.dto.ts
│   │   │   ├── transfer.dto.ts
│   │   │   └── withdraw.dto.ts
│   │   ├── entities
│   │   │   └── transaction.entity.ts
│   │   ├── tests
│   │   │   ├── mocks
│   │   │   │   └── transactions.mock.ts
│   │   │   └── transactions.service.spec.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.module.ts
│   │   ├── transactions.repository.ts
│   │   └── transactions.service.ts
│   ├── users
│   │   ├── dto
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-profile.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.repository.ts
│   │   └── users.service.ts
│   ├── types
│   │   └── authenticated.request.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── prisma.service.ts
│
├── .env.example
├── api-endpoints-guide.md
├── README.md
└── prisma.config.ts

```
