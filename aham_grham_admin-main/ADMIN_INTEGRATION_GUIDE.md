# 🛠️ Admin Integration Guide: Connecting to the Backend

Sanjay, the Backend Engine is now LIVE and connected to MongoDB Atlas. This guide tells you exactly what you need to do to make this Admin Panel functional.

---

## 1. Current Backend Status
- **Base URL:** `http://localhost:5000`
- **Uploads URL:** `http://localhost:5000/uploads/`
- **Backend Folder:** Located in `/aham_grham_backend`

---

## 2. Your Admin Integration Tasks

### ✅ Task 1: Connect "Add Product" (`src/pages/eCommerce/AddProduct.tsx`)
Currently, the form only simulates a save. You need to:
1. Install Axios: `npm install axios`
2. Update `handleSubmit` to use `FormData` (important for images).
3. Send a POST request to `http://localhost:5000/api/products`.
4. Ensure the `image` field in your form sends the actual file object.

### ✅ Task 2: Connect "Product List" (`src/pages/eCommerce/ProductList.tsx`)
1. Add a `useEffect` hook to fetch products from `http://localhost:5000/api/products`.
2. Replace the static table rows with data from the backend.
3. Update the `delete` button to call `DELETE /api/products/:id`.

### ✅ Task 3: Event Management (`src/pages/events/EventsPage.tsx`)
1. Connect the event forms to `http://localhost:5000/api/events`.
2. Ensure you can add title, date, and location through the UI.

### ✅ Task 4: NEW - Create "Booking Dashboard"
You need to create a new page to view the **Bookings** coming from the website.
- **Endpoint:** `GET http://localhost:5000/api/bookings`
- **Goal:** Allow Siva to see who signed up for which event.

---

## 3. Important Technical Notes
- **Image Uploading:** When sending images, the header must be `'Content-Type': 'multipart/form-data'`.
- **Displaying Images:** Use the full URL: `http://localhost:5000/uploads/[filename_from_db]`.
- **CORS:** The backend is already configured to allow requests from your Vite server.

---
*Created by Siva & AI Assistant for Project Handover.*
