# E-Commerce Website Frontend

This is the React + TailwindCSS frontend for the E-Commerce Website project.  
Deployed on Netlify and connected to the Render-hosted backend via RESTful APIs.

---

## Features

- Modern interface built with React.js and TailwindCSS v4
- Authentication (login/register for buyers & sellers)
- Product catalog with details, search, filters
- Cart management and checkout flow
- Wishlist, reviews, buyer/seller dashboards
- Seller product management (CRUD)
- Order placement and order history (for buyers and sellers)
- Role-based navigation and protected routes

---

## Getting Started

### Installation

1. **Clone the repository**
git clone <YOUR-FRONTEND-REPO-URL>
cd frontend

2. **Install dependencies**
npm install

3. **Create a `.env` file** in the root directory with:
VITE_API_URL=https://your-backend.onrender.com/api
Replace with your actual backend deployment URL.

### Running Locally
npm run dev

Runs at [http://localhost:5173](http://localhost:5173) or as specified by Vite.

---

## Build & Deployment

1. **Build production version**
npm run build

2. **Deploy to Netlify**
- Drag-and-drop the `dist/` folder, or use the Netlify CLI:
  ```
  npm install -g netlify-cli
  netlify deploy --prod
  ```

- Make sure your backend's CORS config allows your Netlify frontend domain.

---

## Folder Structure

src/
assets/ # Images, logos
components/ # Navbar, ProductCard, CartItem, Loader, etc.
context/ # AuthContext, CartContext
hooks/ # useApi, useProducts, useOrders, etc.
pages/ # All main pages (Home, Login, Products, Cart, Checkout, Dashboard, etc.)
utils/ # Utility functions (formatPrice, capitalize, etc.)
App.jsx # Main routing and layout
main.jsx # Providers and entrypoint
index.css # TailwindCSS imports

---

## Connecting to Backend

- All API requests point to the `VITE_API_URL` set in `.env`.
- Requires a working (deployed) backend for full functionality.

---

## License

This project is open-sourced for assessment and learning, not for commercial use.

---

> **Note:** As per terms, do not mention any company name in code or documentation.

