🛒 MERN Stack E-Commerce Website

📖 Overview
The MERN Stack E-Commerce Website is a full-featured online marketplace that provides a seamless shopping experience for buyers and efficient store management tools for sellers. The platform supports secure user authentication, product management, shopping cart functionality, order processing, payment integration, reviews, wishlists, and sales analytics.Built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS, the application offers a modern, responsive, and scalable solution for online commerce.

🚀 Live Demo
Frontend Deployment
🔗https://e-commerce-mern-tsk.netlify.app/
Backend Deployment
🔗https://e-commerce-new-n4qx.onrender.com/

🎯 Project Objectives
i.Build a secure e-commerce platform for buyers and sellers.
ii.Implement role-based authentication and authorization.
iii.Enable product browsing, searching, and filtering.
iv.Provide shopping cart and order management features.
v.Integrate a secure payment gateway.
vi.Allow sellers to manage products and orders.
vii.Deliver a responsive and user-friendly interface.

✨ Features

🔐 User Authentication
Buyers & Sellers
User Registration
Secure Login
JWT Authentication
Password Reset
Password Change
Role-Based Access Control

👤 Buyer Features
🛍️ Product Browsing
View all products
Product categories
Product search functionality
Advanced filtering options
Product detail pages
Product image gallery
Product Information
Product Name
Description
Price
Category
Stock Availability
Product Images
Seller Information

🛒 Shopping Cart
Add products to cart
Remove products from cart
Update product quantities
View cart summary
Calculate total price automatically

📦 Order Management
Checkout Process
Shipping Information
Delivery Address
Payment Method Selection
Order Review
Order Features
Place Orders
Order Confirmation
Order History
Order Status Tracking

⭐ Product Reviews
Submit Product Reviews
Rate Products
View Customer Reviews
Review History

❤️ Wishlist
Add Products to Wishlist
Remove Products from Wishlist
Manage Saved Products

👤 User Profile
View Profile
Edit Personal Information
Change Password
Manage Addresses
View Order History

🏪 Seller Features
📊 Seller Dashboard
The seller dashboard provides tools for managing products, orders, and sales performance.
Dashboard Features
Total Products
Total Orders
Total Revenue
Recent Orders
Sales Analytics

📦 Product Management
Add Products
Update Product Information
Delete Products
Upload Product Images
Manage Product Categories
Inventory Management

🚚 Order Processing
View Incoming Orders
Update Order Status
Shipping Management
Customer Notifications

🏬 Store Profile Management
Update Store Information
Store Description
Contact Details
Seller Profile Settings

💳 Payment Gateway Integration
Integrated with Razorpay for secure online payments.

Features
Secure Payment Processing
Multiple Payment Methods
Payment Verification
Transaction Records
Order Payment Status

🏗️ System Architecture
Client (React.js)
        │
        ▼
Express.js API Server
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
MongoDB Razorpay JWT Auth

🛠️ Technology Stack
Frontend
React.js
React Router DOM
Redux Toolkit / Context API
Tailwind CSS
Axios
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
JWT (JSON Web Tokens)
bcrypt.js
Payment Gateway
Razorpay
Deployment
Netlify (Frontend)
Render (Backend)

📂 Project Structure
ecommerce-website/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
├── uploads/
├── .env
├── package.json
└── README.md

## Demo Credentials

Use these accounts to test the application:

| Role       | Email                | Password      |
| :--------- | :------------------- | :------------ |
| **Buyer**  | `buyer@example.com`  | `password123` |
| **Seller** | `seller@example.com` | `password123` |

## Getting Started

1.  **Backend**: `cd backend && npm install && npm run dev`
2.  **Frontend**: `cd frontend && npm install && npm run dev`

## Features

- **Authentication**: Secure login/register with JWT.
- **Products**: Browse, search, and filter products.
- **Cart**: Add to cart and checkout.
- **Payments**: Secure Razorpay integration (Card, UPI, QR).
- **Dashboard**: Manage products (Seller) or view orders (Buyer).

🔒 Authentication & Authorization
Roles
Buyer
Browse Products
Manage Cart
Place Orders
Write Reviews
Manage Wishlist
Seller
Manage Products
Process Orders
View Sales Reports
Manage Store Profile

📊 Database Collections
Users
Buyer Accounts
Seller Accounts
Products
Product Details
Images
Categories
Orders
Customer Orders
Payment Information
Reviews
Product Reviews
Ratings
Wishlist
Saved Products

📱 Responsive Design
The application is fully responsive and optimized for:
Desktop
Laptop
Tablet
Mobile Devices

🔮 Future Enhancements
AI Product Recommendations
Live Order Tracking
Coupon & Discount System
Multi-Vendor Marketplace
Chat Support System
Product Comparison Feature
Admin Dashboard
Inventory Forecasting

📈 Key Learning Outcomes
MERN Stack Development
REST API Development
JWT Authentication
Role-Based Authorization
Payment Gateway Integration
MongoDB Database Management
Responsive UI Development
Full Stack Deployment

📄 License
This project is developed for educational and assessment purposes.

🌟 Conclusion
This MERN Stack E-Commerce Website demonstrates a complete online shopping ecosystem that supports both buyers and sellers. 
By integrating authentication, product management, shopping cart functionality, order processing, reviews, wishlists, and secure payment handling, 
the platform delivers a modern and scalable e-commerce solution suitable for real-world applications.
