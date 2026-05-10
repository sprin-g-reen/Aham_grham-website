# Implementation Plan: Email Verification System (OTP)

This document outlines the technical requirements and implementation steps for adding a 6-digit OTP (One-Time Password) email verification system to the Aham Grham platform. This will prevent users from registering with dummy accounts and ensure email authenticity.

## 1. System Architecture

### **Process Overview**
1. **Registration**: User submits the registration form (Name, Email, Password, etc.).
2. **OTP Generation**: The server generates a random 6-digit OTP.
3. **Save OTP**: The server saves the OTP and its expiration time in the database (associated with the user) and sets a `isVerified` flag to `false`.
4. **Send Email**: The server sends an email to the user's registered email address containing the OTP using **Nodemailer**.
5. **OTP Verification Screen**: The frontend redirects the user to an OTP verification page.
6. **Submit OTP**: The user enters the OTP and submits it.
7. **Verify OTP**: The server checks if the OTP matches the one saved in the database and if it hasn't expired.
8. **Update Status**: If valid, the server sets `isVerified: true` for the user.
9. **Access Granted**: The user can now log in or access protected routes (like Booking Sessions).

---

## 2. Technical Requirements

### **Backend (Node.js/Express)**
- **Dependencies**: `nodemailer` (for sending emails).
- **User Model Updates**:
  - `isVerified`: Boolean (default: `false`).
  - `otp`: String (6-digit code).
  - `otpExpires`: Date (timestamp for expiration, e.g., 10 mins).
- **New API Endpoints**:
  - `POST /api/users/verify-otp`: Validates the code.
  - `POST /api/users/resend-otp`: Generates a new code if the first one expires.

### **Frontend (HTML/Vanilla JS)**
- **OTP Screen**: A dedicated UI to capture the 6-digit code.
- **Redirection Logic**: Post-registration, redirect to `/verify-otp.html` instead of the dashboard.
- **Auth Guard**: Update `auth-helper.js` to prevent access to `book-session.html` if `isVerified` is false.

---

## 3. Implementation Steps

### **Step 1: Database Model Update**
Modify `aham_grham_backend/src/models/User.js` schema:
```javascript
isVerified: { type: Boolean, default: false },
otp: { type: String },
otpExpires: { type: Date }
```

### **Step 2: Email Service Setup**
Create an `emailService.js` utility in the backend to handle mail delivery. You will need SMTP credentials (e.g., Gmail App Password).

### **Step 3: Registration Logic Update**
Update the `registerUser` controller to:
1. Create the user with `isVerified: false`.
2. Generate the 6-digit OTP.
3. Save it to the user record.
4. Trigger the email send.

### **Step 4: Verification UI**
Create a new `verify-otp.html` page that allows the user to enter the code. This page should be shown immediately after sign-up.

---

## 4. Security Considerations
- **Expiry**: OTPs should expire within 10 minutes for security.
- **Rate Limiting**: Limit the number of OTP attempts per user to prevent brute-force.
- **Resend Cooling**: Limit how often a user can request a new OTP (e.g., once every 60 seconds).

---

## 5. Deployment Note
To make this work in production, the backend will need environment variables for:
- `EMAIL_USER`: Your email address.
- `EMAIL_PASS`: Your email app password or SMTP key.
