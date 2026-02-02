This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Specification

The backend currently serves mock data, but follows this contract:

### GET /api/products

Returns a list of products.

**Response Structure:**

```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "price": "number",
    "originalPrice": "number (optional, triggers discount badge)",
    "image": ["string"],
    "category": "boneka" | "tas" | "aksesoris",
    "rating": "number",
    "reviewCount": "number (optional)",
    "sold": "number",
    "estimatedTime": "string",
    "updatedAt": "string (ISO Date, used for New products)",
    "description": "string"
  }
]
```

## API Reference

### Authentication (`/api/auth/*`)
Handled by **NextAuth.js**.
- `POST /api/auth/signin`: Sign in.
- `POST /api/auth/signout`: Sign out.
- `GET /api/auth/session`: Get current session.

### Products (`/api/products`)

#### GET /api/products
Retrieve a list of all products.

**Response:**
```json
[
  {
    "id": "p1",
    "name": "Bag Charm BTS Jongkook",
    "price": 35000,
    "image": ["/uploads/Product 1.png"],
    ...
  }
]
```

#### GET /api/products/:slug
Retrieve a single product by slug.

**Response:**
```json
{
  "id": "p1",
  "name": "Bag Charm BTS Jongkook",
  "slug": "bag-charm-bts-jongkook",
  ...
}
```

### Orders (`/api/orders`)

#### POST /api/orders
Create a new order.

**Request:**
```json
{
  "items": [{ "productId": "p1", "quantity": 1, "customization": {...} }],
  "customer": { "name": "Bunda", "email": "..." }
}
```

#### Badge Logic (Frontend Calculated)

Badges are determined dynamically based on the full product dataset:
- **New**: Top 4 products sorted by `updatedAt` descending.
- **Top Deal**: `(originalPrice - price) / originalPrice` is the maximum among all products.
- **Hot**: `sold` >= 5 and matches the maximum `sold` count.
- **Recommended**: `reviewCount` > 5 and `rating` matches the maximum rating among qualified products.

This logic is centralized in `utils/badge.ts`.
