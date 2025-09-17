# Yumigo 🍽️

> Yumigo — a modern, elegant food-ordering web app built with React (Vite), Tailwind, Node/Express and MongoDB.  
> Designed for a smooth, premium experience with a polished dark/light theme, quick cart interactions, and an intuitive admin area.

---

## Why I built Yumigo

I built Yumigo to experiment with modern frontend patterns and to create a delightful ordering flow that feels fast and intentional. My goals were simple: make browsing food enjoyable, make ordering frictionless, and keep the UI polished — especially in dark mode (I love an elegant black + gold vibe).

---

## Live demo

- Demo: [_(Yumigo Deploy Web App)_](https://yumigo-frontend.onrender.com/)

---

## Highlights / Key features

- Elegant dark & light themes with a premium look and feel (black, gold, and warm accent tones).
- Menu with category filtering, sorting, and price range controls.
- Quick View modal for food items with animated entry (Framer Motion).
- Persistent cart saved to MongoDB in the User model (cart survives refresh).
- Add-to-cart button shows loader to prevent double clicks and improve UX.
- User authentication and role-based access (regular users & admin).
- Admin panel for managing food items, users, and orders.
- Responsive layout with a Metronic-style sidebar/drawer behavior and accessible navbar.
- Global loader state for consistent loading indicators across API calls.

---

## Tech stack

**Frontend**
- React (Vite)
- Tailwind CSS (custom theme + Poppins)
- Framer Motion (animations)
- React Router
- Lucide icons

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication

**Dev / Tools**
- Axios (API client)
- ESLint / Prettier (optional)
- Git/GitHub

---

## Screenshots

### Home Page
![Yumigo Home Page](./public/YumigoHomePage.png)

### Dark Mode
![Yumigo Dark Mode](./public/YumigoDarkMode.png)


---

## Getting started (local)

> These instructions assume you have Node.js (>=16) and MongoDB installed (or access to a MongoDB Atlas URI).

1. **Clone the repo**
```bash
git clone https://github.com/ankityadav456/mern-food-ordering
cd yumigo
