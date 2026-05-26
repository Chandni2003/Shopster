# 🛍️ Shopster — React E-Commerce App

> A modern, full-featured e-commerce web application built with **React 18** and powered by **DummyJSON API** — featuring 200+ products, 30+ categories, and a complete shopping experience.

🔗 **Live Demo:** [shopster-chandni.vercel.app](https://shopster-chandni.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Live Products** | 200+ real products fetched from DummyJSON API |
| 🗂️ **30+ Categories** | Electronics, Fashion, Beauty, Furniture & more |
| 🔍 **Live Search** | Real-time product search as you type |
| ↕️ **Sort & Filter** | Sort by price, rating, most reviewed |
| 🛒 **Cart System** | Add, remove, update quantity with live total |
| 🔐 **Login / Signup** | Form validation, Google/Facebook UI, success state |
| 📦 **Product Detail** | Click any card to see full product info + description |
| 💳 **Checkout Page** | Full form with delivery info + payment (Card/UPI/COD) |
| 🌙 **Dark Mode** | Toggle between light and dark theme |
| 🔔 **Notifications** | Bell with unread count, order tracking step-by-step |
| ❤️ **Wishlist** | Save favourite products |
| 💀 **Skeleton Loading** | Professional loading state while API fetches |
| ⚠️ **Error Handling** | Graceful error screen with retry button |
| 📱 **Responsive** | Works on mobile, tablet and desktop |

---

## 📁 Project Structure

```
shopster/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── Toast.jsx
│   │   ├── LoginModal.jsx
│   │   ├── ProductModal.jsx
│   │   ├── CheckoutPage.jsx
│   │   └── NotificationBell.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/chandni2003/Shopster.git

# Go into the project
cd Shopster/shopster

# Install dependencies
npm install

# Start development server
npm start
```

App runs at **http://localhost:3000**

---

## 🌐 Deployment (Vercel)

This project is deployed on **Vercel** for fast, automatic deployments.

```bash
# Push to GitHub
git add .
git commit -m "Update"
git push origin main

# Vercel auto-deploys on every push ✅
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **React 18** | Frontend UI framework |
| **DummyJSON API** | Live product data (200+ products) |
| **CSS-in-JS** | Inline styles + CSS animations |
| **Vercel** | Hosting & deployment |
| **GitHub** | Version control |

---

## 📡 API Used

**[DummyJSON](https://dummyjson.com)** — Free REST API for e-commerce prototypes.

| Endpoint | Usage |
|---|---|
| `GET /products?limit=200` | Fetch all products |
| `GET /products/categories` | Fetch all categories |

---

## 💡 Key Concepts Demonstrated

- ✅ React Hooks (`useState`, `useEffect`, `useRef`)
- ✅ API Integration with `fetch` and `Promise.all`
- ✅ Component-based architecture
- ✅ Props drilling & state lifting
- ✅ Conditional rendering
- ✅ Form validation
- ✅ Responsive design with CSS Grid
- ✅ Dark mode with dynamic theming
- ✅ Loading & error states
- ✅ Smooth CSS animations & transitions

---

## 👩‍💻 Author

**Chandni** — [GitHub](https://github.com/chandni2003)

---

⭐ **If you like this project, give it a star on GitHub!**
