# E-Commerce Website Backend

This is the backend server for the E-Commerce Website project, which supports user authentication, product management, order processing, reviews, and wishlists as described in the task requirements.  
**Tech Stack:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary

---

## Features

- User registration & login (buyer/seller roles)
- Password hashing (bcrypt)
- JWT-based authentication and RBAC for protected routes
- Product management (CRUD for sellers)
- Product catalog, filtering, and details for buyers
- Cart & order creation (buyers) and order history
- Product reviews (buyers)
- Wishlist management (buyers)
- Cloudinary-based product image upload support
- Secure CORS setup for frontend integration

---

## Getting Started

### Installation

1. **Clone the repository**  
git clone <YOUR-BACKEND-REPO-URL>
cd backend

2. **Install dependencies**  
npm install

3. **Create a `.env` file** in the root of `backend/` and add:
NODE_ENV=development
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLIENT_URL=https://your-frontend-domain.netlify.app

### Running Locally
npm run dev

Server runs on [http://localhost:5000](http://localhost:5000) by default.

---

## Deployment

- Push code to your GitHub repository.
- Deploy using [Render](https://render.com/):
  - Create a new Web Service, connect your repo, set the build/run commands.
  - Add all environment variables in the Render dashboard.
- After deployment, set your **frontend**'s API URL env as  
REACT_APP_API_URL=https://your-backend-service.onrender.com/api


---

## API Structure

All API endpoints are prefixed with `/api`:

- `/api/users` − Registration, login, profile
- `/api/products` − Product CRUD, listing, details
- `/api/orders` − Place/view orders
- `/api/reviews` − Submit reviews
- `/api/wishlist` − Manage wishlist

---

## License

This project is open-source for demonstration and learning purposes only.

---

> **Note:** Do not mention or use the company name in the codebase, as per the provided terms and conditions.
