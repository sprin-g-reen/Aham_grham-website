# Aham Grham - Project Handover & Integration Guide

This document outlines the current state of the backend and the tasks required for full integration. **Sanjay is now responsible for both the Website and Admin Panel integration.**

## 1. System Overview
The project is now a Full-Stack application.
- **Backend:** Node.js, Express, Mongoose (Live on Port 5000).
- **Frontend (Admin):** React, Tailwind, Shadcn.
- **Frontend (Website):** Static HTML, CSS, Vanilla JS.
- **Database:** MongoDB Atlas (Cloud).

---

## 2. API Reference (Port: 5000)

| Feature | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Products** | `/api/products` | GET | Fetch products for Shop/Admin |
| **Products** | `/api/products` | POST | Save new product (use `FormData`) |
| **Events** | `/api/events` | GET/POST | Manage workshops/events |
| **Bookings** | `/api/bookings` | POST | Submit session request from Website |
| **Bookings** | `/api/bookings` | GET | View all signups in Admin |

---

## 3. Tasks Done (Siva's Side)
✅ **Node.js Server:** Initialized with ES Modules, CORS, and JSON parsing.
✅ **Database Models:** Designed and deployed `Product`, `Event`, and `Booking` schemas.
✅ **Image System:** Multer middleware configured to save images to `/uploads`.
✅ **Cloud Sync:** Connected to MongoDB Atlas with a verified connection string.
✅ **Error Handling:** Global middleware for clean JSON error responses.

---

## 4. Sanjay's Roadmap (Full Integration)

### 🌐 Section A: Website Tasks
1.  **Dynamic Rendering:** Replace hardcoded cards in `index.html` and `events.html` with `fetch()` calls.
2.  **Booking Form:** Update the "Book Session" modal to POST user data to `/api/bookings`.
3.  **Image Paths:** Point all dynamic images to `http://localhost:5000/uploads/[filename]`.

### 🛠️ Section B: Admin Panel Tasks
1.  **Connect `AddProduct.tsx`:** 
    - Replace the mock "Save" logic with a real `axios.post` or `fetch` call.
    - **Crucial:** Use `FormData` to handle image uploads correctly through the Multer middleware.
2.  **Connect `ProductList.tsx`:** 
    - Fetch the product list from the API to show real database items in the table.
3.  **Create `BookingList.tsx`:** 
    - Create a new admin view to display the live list of users who signed up via Sanjay's website.

---

**Current API Base URL:** `http://localhost:5000`
**Uploads Directory:** `http://localhost:5000/uploads/`
