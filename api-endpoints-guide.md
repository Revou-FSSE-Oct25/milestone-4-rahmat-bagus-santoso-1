# Postman Testing Guide

## Base URL

### Local
```text
http://localhost:3000/api/v1
```

### Deployment
```text
https://superb-radiance-production-4003.up.railway.app/api/v1
```

## Authentication

For protected endpoints, add this header:

```http
Authorization: Bearer <access_token>
```

Public endpoints:
- `POST /auth/register`
- `POST /auth/login`

Protected endpoints:
- `POST /auth/logout`
- `/users/profile`
- `/accounts`
- `/transactions`

## Auth Endpoints

### Register
**POST** `/auth/register`

#### Payload
```json
{
  "fullName": "User Example",
  "email": "user@example.com",
  "password": "secret123"
}
```

### Login
**POST** `/auth/login`

#### Payload
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

#### Example Response
```json
{
  "message": "Login successful",
  "accessToken": "your_jwt_token"
}
```

### Logout
**POST** `/auth/logout`

#### Header
```http
Authorization: Bearer <access_token>
```

## User Endpoints

### Get Current User Profile
**GET** `/users/profile`

#### Header
```http
Authorization: Bearer <access_token>
```

### Update Current User Profile
**PATCH** `/users/profile`

#### Header
```http
Authorization: Bearer <access_token>
```

#### Payload
```json
{
  "fullName": "User Example Updated",
  "email": "user.updated@example.com",
  "password": "newsecret123"
}
```

You can also send only the fields you want to update.

Example:
```json
{
  "fullName": "User Example Updated"
}
```

## Account Endpoints

### Create Account
**POST** `/accounts`

#### Header
```http
Authorization: Bearer <access_token>
```

#### Payload
```json
{
  "type": "SAVINGS"
}
```

Alternative:
```json
{
  "type": "CHECKING"
}
```

### Get Account List
**GET** `/accounts`

#### Header
```http
Authorization: Bearer <access_token>
```

### Get Account Detail
**GET** `/accounts/:id`

#### Example
```text
GET /accounts/1
```

#### Header
```http
Authorization: Bearer <access_token>
```

### Update Account
**PATCH** `/accounts/:id`

#### Example
```text
PATCH /accounts/1
```

#### Header
```http
Authorization: Bearer <access_token>
```

#### Payload
```json
{
  "status": "BLOCKED"
}
```

Allowed status values:
- `ACTIVE`
- `BLOCKED`
- `DELETED`

### Delete Account
**DELETE** `/accounts/:id`

#### Example
```text
DELETE /accounts/1
```

#### Header
```http
Authorization: Bearer <access_token>
```

## Transaction Endpoints

### Deposit
**POST** `/transactions/deposit`

#### Header
```http
Authorization: Bearer <access_token>
```

#### Payload
```json
{
  "accountId": 1,
  "amount": 50000
}
```

### Withdraw
**POST** `/transactions/withdraw`

#### Header
```http
Authorization: Bearer <access_token>
```

#### Payload
```json
{
  "accountId": 1,
  "amount": 50000
}
```

### Transfer
**POST** `/transactions/transfer`

#### Header
```http
Authorization: Bearer <access_token>
```

#### Payload
```json
{
  "sourceAccountId": 1,
  "destinationAccountId": 2,
  "amount": 10000
}
```

### Get Transaction List
**GET** `/transactions`

#### Header
```http
Authorization: Bearer <access_token>
```

### Get Transaction Detail
**GET** `/transactions/:id`

#### Example
```text
GET /transactions/1
```

#### Header
```http
Authorization: Bearer <access_token>
```

## Suggested Testing Flow

1. Register a new user
2. Login with the registered user
3. Copy the `accessToken`
4. Set the token as Bearer Token
5. Create an account
6. Get account list
7. Deposit to the account
8. Withdraw from the account
9. Transfer to another account
10. Get transaction list
11. Get transaction detail

## Notes

- All endpoints use the `/api/v1` prefix.
- `register` and `login` do not require a token.
- All other endpoints require JWT Bearer Token.
- Minimum transaction amount:
  - deposit: `50000`
  - withdraw: `50000`
  - transfer: `10000`
- Regular users can only access their own accounts and transactions.
