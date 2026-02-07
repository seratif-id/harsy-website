# Harsy Handmade - Backend Documentation

This document outlines the backend architecture, database schema, and API requirements for the Harsy Handmade e-commerce platform. The backend will be built using **NestJS** and **Prisma ORM**.

## 1. Database Schema Design (Prisma)

The database should support users, roles, products, categories, orders, and reviews. Below is the proposed relationship and schema structure.

### Models & Logic

*   **Role**: Manages permissions (Admin vs Customer).
*   **User**: Stores account info. Linked to a Role.
*   **Category**: Product categories.
*   **Product**: Items for sale. Linked to Category.
*   **Order**: Transaction records. Linked to User.
*   **OrderItem**: Individual items in an order. Linked to Order and Product.
*   **Review**: User feedback. Linked to User, Product, and Order (verified purchase).

### Schema Overview

| Model | Columns | Relationships |
| :--- | :--- | :--- |
| **Role** | `id` (PK), `name` (String), `permissions` (JSON/String[]) | One-to-Many with User |
| **User** | `id` (uuid, PK), `email`, `password` (hashed), `name`, `avatar`, `roleId` (FK), `address`, `phone` | Many-to-One Role, One-to-Many Orders/Reviews |
| **Category** | `id` (uuid, PK), `name`, `slug` (unique), `image`, `description` | One-to-Many Products |
| **Product** | `id` (uuid, PK), `name`, `slug` (unique), `price`, `description`, `stock`, `categoryId` (FK), `images` (String[]), `partitions` (JSON - for variants) | Many-to-One Category, One-to-Many OrderItems/Reviews |
| **Order** | `id` (uuid, PK), `userId` (FK), `total` (Float), `status` (ENUM: PENDING, PAID, SHIPPED, etc.), `shippingAddress` (JSON), `createdAt` | Many-to-One User, One-to-Many OrderItems |
| **OrderItem** | `id` (uuid, PK), `orderId` (FK), `productId` (FK), `quantity` (Int), `price` (Float), `selectedVariants` (JSON) | Many-to-One Order, Many-to-One Product |
| **Review** | `id` (uuid, PK), `userId` (FK), `productId` (FK), `orderId` (FK), `rating` (Int), `comment` (String) | Many-to-One User/Product/Order |

---

## 2. API Endpoints & Logic

The backend should expose RESTful APIs. All responses should follow a standard format (e.g., `{ "data": ..., "meta": ... }`).

### Authentication (`/auth`)
*   **POST** `/auth/register`: Create a new user. Default role: 'Customer'.
*   **POST** `/auth/login`: Validate credentials, return JWT access token.
#### Example: Register
**Request:**
```json
POST /auth/register
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "address": "Jl. Kemerdekaan No. 45",
  "city": "Jakarta",
  "phone": "081234567890"
}
```
**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "new-user-uuid",
      "email": "newuser@example.com",
      "role": "Customer",
      "address": "Jl. Kemerdekaan No. 45",
      "city": "Jakarta",
      "phone": "081234567890"
    }
  }
}
```

#### Example: Get Me
**Request:** `GET /auth/me` (Header: `Authorization: Bearer <token>`)

**Response:**
```json
{
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Customer Name",
      "email": "customer@example.com",
      "role": "Customer",
      "avatar": "/avatars/user-1.jpg",
      "address": "Jl. Kemerdekaan No. 45",
      "city": "Jakarta",
      "phone": "081234567890"
    }
  }
}
```

#### Example: Login
**Request:**
```json
POST /auth/login
{
  "email": "customer@example.com",
  "password": "securePassword123"
}
```
**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "customer@example.com",
      "role": "Customer"
    }
  }
}
```

### Products (`/products`)
*   **GET** `/products`: List products. Support query params: `page`, `limit`, `category`, `search`.
*   **GET** `/products/:slug`: Get single product details.
*   **POST** `/products`: Create product (Admin only).
*   **PATCH** `/products/:id`: Update product (Admin only).
*   **DELETE** `/products/:id`: Delete product (Admin only).

#### Example: Get Single Product
**Request:** `GET /products/tas-rajut-bunga`

**Response:**
```json
{
  "data": {
    "id": "prod-uuid-1",
    "name": "Tas Rajut Bunga",
    "description": "Tas rajut cantik...",
    "price": 150000,
    "slug": "tas-rajut-bunga",
    "stock": 10,
    "estimatedTime": "3-5 hari",
    "images": ["url1.jpg", "url2.jpg"],
    "category": { "name": "Tas" }
  }
}
```

#### Example: Create Product (Admin)
**Request:**
```json
POST /products
{
  "name": "Dompet Rajut",
  "price": 50000,
  "description": "Dompet kecil lucu",
  "stock": 20,
  "estimatedTime": "3-5 hari",
  "categoryId": "cat-uuid-1",
  "image": ["urlA.jpg", "urlB.jpg"],
  "partitions": [
    { "name": "Main Body", "colors": ["Red", "Blue"] },
    { "name": "Strap", "colors": ["Black", "White"] }
  ]
}
```
**Response:**
```json
{
  "data": {
    "id": "prod-uuid-2",
    "name": "Dompet Rajut",
    "slug": "dompet-rajut"
  }
}
```

#### Example: List Products
**Request:** `GET /products?page=1&limit=10&category=tas`

**Response:**
```json
{
  "data": [
    {
      "id": "prod-uuid-1",
      "name": "Tas Rajut Bunga",
      "price": 150000,
      "slug": "tas-rajut-bunga",
      "category": { "name": "Tas" }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "lastPage": 5
  }
}
```

### Categories (`/categories`)
*   **GET** `/categories`: List all categories.
*   **POST** `/categories`: Create category (Admin only).

#### Example: List Categories
**Request:** `GET /categories`

**Response:**
```json
{
  "data": [
    {
      "id": "cat-uuid-1",
      "name": "Tas",
      "slug": "tas",
      "image": "cat-img.jpg"
    }
  ]
}
```

#### Example: Create Category (Admin)
**Request:**
```json
POST /categories
{
  "name": "Topi",
  "image": "topi-img.jpg",
  "description": "Koleksi topi rajut"
}
```
**Response:**
```json
{
  "data": {
    "id": "cat-uuid-3",
    "name": "Topi",
    "slug": "topi"
  }
}
```

### Orders (`/orders`)
*   **POST** `/orders`: Create a new order.
    *   *Logic*: Validate stock (optional), calculate total from backend prices (security), create Order and OrderItems in a transaction.
*   **GET** `/orders`: List orders. 
    *   *Logic*: If Admin, list all. If Customer, list only their own.
*   **GET** `/orders/:id`: Get order details.
*   **PATCH** `/orders/:id/status`: Update order status (Admin only).

#### Example: List Orders
**Request:** `GET /orders`

**Response:**
```json
{
  "data": [
    {
      "id": "order-uuid-999",
      "total": 500000,
      "status": "PAID",
      "user": { "name": "Customer Name" },
      "items": [ ... ]
    }
  ]
}
```

#### Example: Get Order Details
**Request:** `GET /orders/order-uuid-999`

**Response:**
```json
{
  "data": {
    "id": "order-uuid-999",
    "total": 500000,
    "status": "PAID",
    "shippingAddress": { ... },
    "items": [
      {
        "product": { "name": "Tas Rajut" },
        "quantity": 1,
        "price": 500000
      }
    ]
  }
}
```

#### Example: Update Order Status (Admin)
**Request:**
```json
PATCH /orders/order-uuid-999/status
{
  "status": "SHIPPED"
}
```
**Response:**
```json
{
  "data": {
    "id": "order-uuid-999",
    "status": "SHIPPED"
  }
}
```

#### Example: Create Order
**Request:**
```json
POST /orders
{
  "items": [
    { "productId": "prod-uuid-1", "quantity": 2, "selectedVariants": { "color": "red" } },
    { "productId": "prod-uuid-2", "quantity": 1 }
  ],
  "shippingAddress": {
    "address": "Jl. Kemenangan No. 10",
    "city": "Bandung",
    "postalCode": "40123"
  }
}
```
**Response:**
```json
{
  "data": {
    "id": "order-uuid-999",
    "total": 500000,
    "status": "PENDING",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### Reviews (`/reviews`)
*   **POST** `/reviews`: Submit a review.
    *   *Logic*: Check if `orderId` exists for this user and product to ensure verified purchase.
*   **GET** `/reviews`: Get reviews for a product (public).

#### Example: Submit Review
**Request:**
```json
POST /reviews
{
  "productId": "prod-uuid-1",
  "rating": 5,
  "comment": "Sangat bagus! Anak saya suka sekali."
}
  "comment": "Sangat bagus! Anak saya suka sekali."
}
```a

#### Example: List Reviews
**Request:** `GET /reviews?productId=prod-uuid-1`

**Response:**
```json
{
  "data": [
    {
      "id": "rev-uuid-1",
      "rating": 5,
      "comment": "Bagus banget!",
      "user": { "name": "Customer 1", "avatar": "avatar.jpg" },
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ]
}
```


### Users (`/users`)
*   **GET** `/users`: List users (Admin only).
*   **PATCH** `/users/:id/role`: Change user role (Admin only).

#### Example: List Users (Admin)
**Request:** `GET /users`

**Response:**
```json
{
  "data": [
    {
      "id": "user-uuid-1",
      "name": "Budi",
      "email": "budi@example.com",
      "role": "Customer"
    }
  ]
}
```

#### Example: Update User Role (Admin)
**Request:**
```json
PATCH /users/user-uuid-1/role
{
  "roleId": "role-admin-uuid"
}
```
**Response:**
```json
{
  "data": {
    "id": "user-uuid-1",
    "role": "Admin"
  }
}
```

