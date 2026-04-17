[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PzCCy7VV)

# Fictional Banking API

## Overview
This project is a backend fictional banking API built with NestJS and Prisma.  
The API supports authentication, user profile management, account management, and financial transactions such as deposit, withdrawal, and transfer.

## Features Implemented

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get access token

### Users
- `GET /users/profile` - Get current logged-in user profile
- `PATCH /users/profile` - Update current logged-in user profile

### Accounts
- `POST /accounts` - Create account for current user
- `GET /accounts` - Get all accounts (admin only)
- `GET /accounts/:id` - Get account detail
- `PATCH /accounts/:id` - Update account status (admin only)
- `DELETE /accounts/:id` - Delete account (admin only)

### Transactions
- `POST /transactions/deposit` - Deposit to account
- `POST /transactions/withdraw` - Withdraw from account
- `POST /transactions/transfer` - Transfer between accounts
- `GET /transactions` - Get transaction list
- `GET /transactions/:id` - Get transaction detail

### API Documentation
- Swagger UI available at:
  - `/api`

## Technologies Used
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Class Validator
- Swagger

## Project Structure
```bash
src
├── auth
├── users
├── accounts
├── transactions
├── password
├── types
├── app.module.ts
├── main.ts
└── prisma.service.ts

prisma
├── migrations
├── schema.prisma
└── seed.ts

