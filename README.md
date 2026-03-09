<div align="center">

# 🛍️ ShopSphere

### A Modern Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**ShopSphere** is a sleek, fully responsive e-commerce web application built with the **MERN stack**. It delivers a seamless shopping experience with secure payments, real-time inventory management, and a powerful admin dashboard.

[🌐 Live Demo](https://shopsphereafg.netlify.app/) · [🐛 Report Bug](https://github.com/hafiz1379/shopsphere/issues) · [✨ Request Feature](https://github.com/hafiz1379/shopsphere/issues)

---

<img src="https://image2url.com/r2/default/images/1773030093275-02ad3c89-e2d9-43d2-9979-b7e089bf38d8.png" alt="ShopSphere Preview" width="90%" />

</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

ShopSphere was born out of a desire to create an e-commerce platform that doesn't compromise between **developer experience** and **user experience**. Every pixel, every API call, and every interaction has been carefully crafted to deliver a production-grade shopping application.

Whether you're a customer browsing products, or an admin managing inventory — ShopSphere makes it effortless.

---

## 🚀 Key Features

### 🛒 Customer Experience
- **Smart Product Search** — Filter by category, price range, and keywords with real-time results
- **Wishlist** — Save favorite products and never lose track of items you love
- **Shopping Cart** — Intuitive cart with quantity management and price calculations
- **Secure Checkout** — PCI-compliant payments powered by Stripe
- **Order Tracking** — Real-time order status updates from processing to delivery
- **Responsive Design** — Pixel-perfect experience across desktop, tablet, and mobile

### 🔐 Authentication & Security
- **JWT Authentication** — Secure token-based auth with HTTP-only cookies
- **Password Encryption** — bcrypt hashing for all stored passwords
- **Protected Routes** — Role-based access control for admin and user routes
- **Input Validation** — Server-side validation on all API endpoints

### 📊 Admin Dashboard
- **Product Management** — Full CRUD operations with image uploads
- **User Management** — View, edit roles, activate/deactivate accounts
- **Order Management** — Update order statuses and track fulfillment
- **Analytics Overview** — Quick stats on revenue, orders, users, and products
- **Inventory Tracking** — Real-time stock monitoring with low-stock alerts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks and context API |
| **React Router v6** | Client-side routing and navigation |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **Axios** | HTTP client for API communication |
| **React Toastify** | User-friendly toast notifications |
| **React Icons** | Consistent icon library |
| **Stripe.js** | Secure payment processing on the client |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL document database |
| **Mongoose** | MongoDB object modeling (ODM) |
| **JWT** | Stateless authentication tokens |
| **bcryptjs** | Password hashing |
| **Stripe SDK** | Payment processing on the server |
| **Cloudinary** | Cloud-based image storage and optimization |
| **Multer** | Multipart form data / file upload handling |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Netlify** | Frontend hosting with CI/CD |
| **Render** | Backend hosting with auto-deploy |
| **MongoDB Atlas** | Cloud database hosting |
| **Git & GitHub** | Version control and collaboration |

---

## ⚡ Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x or **yarn** ≥ 1.22
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Stripe Account** — [Sign up](https://dashboard.stripe.com/register)

### Installation

**1. Clone the repository**

````bash
git clone https://github.com/hafiz1379/shopsphere
cd shopsphere
````

**2. Install backend dependencies**

````bash
cd backend
npm install
````

**3. Install frontend dependencies**

````bash
cd ../frontend
npm install
````
**4. Set up environment variables**

Create .env files in both backend/ and frontend/ directories. See Environment Variables below.

**5. Start the development servers**

````bash
# Terminal 1 — Backend (from /backend)
npm run dev

# Terminal 2 — Frontend (from /frontend)
npm start
````

**6. Open your browser**

Navigate to http://localhost:3000 and start exploring! 🎉

---

## 🔑 Environment Variables

### Backend (backend/.env)

````bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopsphere
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
````

### BFrontend (frontend/.env)

````bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
````

⚠️ Important: Never commit .env files. They are already included in .gitignore.

---

## 📡 API Endpoints

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Products:** `GET /api/products`, `POST /api/products` (Admin), `PUT /api/products/:id` (Admin)
- **Orders:** `POST /api/orders`, `GET /api/orders/mine`, `GET /api/orders` (Admin)
- **Users:** `GET /api/users` (Admin), `PUT /api/users/profile`

---

## 🌍 Deployment

- **Frontend (Netlify):** Set build command to `npm run build` and publish directory to `build`. Ensure `_redirects` file is in the `public` folder.
- **Backend (Render):** Set build command to `npm install` and start command to `node server.js`. Add all backend environment variables.

---

## 🗺️ Roadmap

- [x] Full MERN stack implementation
- [x] JWT Authentication & Role based access
- [x] Stripe Payment gateway
- [x] Admin Dashboard (Products, Users, Orders)
- [x] Wishlist & Cart functionality
- [x] Product reviews and ratings
- [ ] Email order notifications
- [ ] Multi-language support

---

## 📄 License

Distributed under the **MIT License**.

---

## 📬 Contact

**Hafiz Rasa** — hafizrasa1379@gmail.com

Project Link: [https://github.com/hafiz1379/shopsphere](https://github.com/hafiz1379/shopsphere)