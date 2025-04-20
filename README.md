# Capstone Project – English Exam Practice Platform (Admin Frontend)

[![Live Demo](https://img.shields.io/badge/Demo-Online-green?style=for-the-badge&logo=vercel)](https://capstone24.sit.kmutt.ac.th/nw1/admin/)

A web application for managing English exam content, users, and permissions, designed for administrators and content creators as part of the Capstone Project at King Mongkut's University of Technology Thonburi.

---

## ✨ Features

- Admin authentication and secure access
- Manage (read, create, edit, disable) exam questions for various English skills (e.g., Grammar, Vocabulary)
- User management: view, create, edit, enable/disable users
- Role and permission management (Admin, Creator, Tester)
- Filter and paginate user and question lists
- Assign roles and permissions to users

---

## 🛠 Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Git](https://img.shields.io/badge/git-F05032.svg?style=for-the-badge&logo=git&logoColor=white)

---

## 🌐 Try It Out

👉 [Live Demo](https://capstone24.sit.kmutt.ac.th/nw1/admin/)

**Demo Accounts:**  
- **Admin:**  
  - Email: `admin@mailinator.com`  
  - Password: `1234`
- **Creator:**  
  - Email: `creator1@mailinator.com`  
  - Password: `1234`
- **Tester:**  
  - Email: `tester1@mailinator.com`  
  - Password: `1234`

---

## 📦 Getting Started (for development)

> If you want to run this project locally or contribute, follow these steps:

1. Clone this repository  
2. `npm install`
3. `npm run dev`
4. (Set up `.env.local` as needed)

>[!NOTE]
>You will need the [Admin Backend](https://github.com/CP24NW1/web-admin-back) running locally as well.

---

## 📸 Screenshots

### Login Page
<p align="center">
  <img src="screenshots/admin-login-page.png" alt="Admin login page for secure access." width="600"/>
</p>
<p align="center"><i>Login page for admin, creator, and tester roles to securely access the system.</i></p>

---

### User Management (Admin Only)

#### User List
<p align="center">
  <img src="screenshots/admin-user-page.png" alt="Admin view: list and manage all user accounts." width="600"/>
</p>
<p align="center"><i>Admin view: list, filter, and manage all user accounts in the system.</i></p>

#### View User
<p align="center">
  <img src="screenshots/view-user-page.png" alt="Admin view: view detailed user information." width="600"/>
</p>
<p align="center"><i>Admin view: view detailed information of a specific user and change user available status (active/inactive).</i></p>

#### Create User
<p align="center">
  <img src="screenshots/create-user-page.png" alt="Admin view: create a new user account." width="600"/>
</p>
<p align="center"><i>Admin view: create a new user account with assigned roles.</i></p>

#### Edit User
<p align="center">
  <img src="screenshots/edit-user-page.png" alt="Admin view: edit user account details." width="600"/>
</p>
<p align="center"><i>Admin view: edit user account details and roles.</i></p>

---

### Question Management

#### Question List (Admin & Creator)
<p align="center">
  <img src="screenshots/admin-question-page.png" alt="Admin/Creator view: list and manage exam questions." width="600"/>
</p>
<p align="center"><i>
Admin view: list, filter, and manage all exam questions by question text, update date range, skill, or creator.<br>
Creator view: list, filter, and manage only the questions they have created (can read, update, or delete only their own questions).
</i></p>

#### View Question (Admin & Creator)
<p align="center">
  <img src="screenshots/view-question-page.png" alt="Admin/Creator view: view question details." width="600"/>
</p>
<p align="center"><i>
Admin/Creator view: view detailed information of an exam question and change its available status (available/not available).
</i></p>

#### Create Question (Admin & Creator)
<p align="center">
  <img src="screenshots/create-question-page.png" alt="Admin/Creator view: create a new exam question." width="600"/>
</p>
<p align="center"><i>
Admin/Creator view: create a new exam question with full details.
</i></p>

#### Edit Question (Admin & Creator)
<p align="center">
  <img src="screenshots/edit-question-page.png" alt="Admin/Creator view: edit an existing exam question." width="600"/>
</p>
<p align="center"><i>
Admin/Creator view: edit details of an existing exam question (creator can edit only their own questions).
</i></p>

---

### Profile Page

#### Admin Profile
<p align="center">
  <img src="screenshots/admin-profile-page.png" alt="Admin profile page." width="600"/>
</p>
<p align="center"><i>Admin profile page: view and manage personal information for admin users.</i></p>

#### Creator Profile
<p align="center">
  <img src="screenshots/creator-profile-page.png" alt="Creator profile page." width="600"/>
</p>
<p align="center"><i>Creator profile page: view and manage personal information for creator users.</i></p>

#### Tester Profile
<p align="center">
  <img src="screenshots/tester-profile-page.png" alt="Tester profile page." width="600"/>
</p>
<p align="center"><i>Tester profile page: view and manage personal information for tester users.</i></p>

---

## 🗂️ Related Repositories

### User Side
- [Capstone Project – English Exam Practice Platform (User Frontend)](https://github.com/CP24NW1/web-user-front)
- [Capstone Project – English Exam Practice Platform (User Backend)](https://github.com/CP24NW1/web-user-back)

### Admin Side
- [Capstone Project – English Exam Practice Platform (Admin Backend)](https://github.com/CP24NW1/web-admin-back)

---

## 👤 Contributors

- [Surachet Pichaiwattanaporn](https://github.com/lemonz1415) (Frontend)
- [Supakorn Chat-anothai](https://github.com/64130500111) (Frontend, Backend)
- [Wachirawit Jitphitthayakul](https://github.com/wachipor2546) (DevOps)

