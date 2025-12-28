

<div align="center">

  <h1>💰 Anjo Payroll System</h1>
  
  <p>
    A robust <strong>Full-Stack MERN Application</strong> for comprehensive employee management,<br> 
    automated salary processing, and visual financial analytics.
  </p>



<p>
  <img src="https://img.shields.io/badge/REACT-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/NODE.JS-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/EXPRESS-5.1-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MONGODB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TAILWIND-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p>
  <a href="#-key-features">✨ Features</a> •
  <a href="#-tech-stack">🛠 Tech Stack</a> •
  <a href="#-installation">⚙️ Installation</a> •
  <a href="#-api-documentation">📡 API</a> •
  <a href="#-folder-structure">📂 Structure</a>
</p>

</div>


## 📖 Overview

**Anjo Payroll** is a modern solution designed to streamline HR processes. It separates concerns between a high-performance **React/Vite Frontend** and a scalable **Node/Express Backend**. The system handles everything from employee onboarding to complex salary computations (Earnings vs. Deductions) and PDF payslip generation.

## ✨ Key Features

### 🎨 Frontend Experience
* **🔐 Secure Authentication:** Admin-only access protected by JWT stored in localStorage.
* **📊 Interactive Dashboard:** Visual bar charts (Salary trends) and net spending summaries using `recharts`/`chart.js`.
* **👥 Employee Management:** Centralized hub to Add, View, and Edit employee profiles.
* **💸 Salary Calculator:** Automated gross/net calculation engine with database persistence.
* **📄 Smart Reporting:** Filter payrolls by month and download professional **PDF Payslips**.
* **⚡ Modern UI:** Built with **TailwindCSS** for a responsive, clean aesthetic.

### ⚙️ Backend Power
* **🛡 Middleware Security:** Custom `authMiddleware.js` to verify transactions.
* **💾 MongoDB Atlas:** Cloud-native database for scalable data storage.
* **🖨 PDF Generation:** Server-side PDF creation using `pdfkit`.
* **RESTful API:** Structured endpoints for seamless data flow.


## 🛠 Tech Stack

### **Client (Frontend)**
| Technology | Description |
| :--- | :--- |
| **Vite + React** | Fast build tool and UI library. |
| **TypeScript** | Strict typing for scalable code. |
| **Tailwind CSS** | Utility-first styling. |
| **Axios** | API request handling. |
| **Recharts / Chart.js** | Data visualization. |
| **React Router Dom** | Client-side routing. |

### **Server (Backend)**
| Technology | Description |
| :--- | :--- |
| **Node.js** | Runtime environment. |
| **Express.js** | Web framework. |
| **Mongoose** | MongoDB object modeling. |
| **JSON Web Token** | Stateless authentication. |
| **PDFKit** | Payslip generation. |


## 🚀 Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Connection URI

### 1️⃣ Backend Setup

# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the Development Server (Nodemon)
npm run dev
# Server runs on Port: 4848



### 2️⃣ Frontend Setup


# Navigate to client directory
cd client

# Install dependencies
npm install

# Run the development server
npm run dev

# App usually runs on http://localhost:5173



## 🔐 Environment Variables

> **⚠️ Security Note:** Never commit your actual `.env` file to GitHub.

Create a `.env` file in your **Server** root. Below are the configurations based on your setup:

PORT
MONGO_URI
JWT_SECRET


### 👤 Default Admin Credentials

*Use these to log in immediately after seeding the database.*

* **Email:** `hrithiksham@gmail.com`
* **Password:** `123456`


## 📡 API Documentation

### **Authentication**

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Validates admin credentials & returns JWT. |

### **Employees**

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/employees` | List all registered employees. |
| `POST` | `/employees` | Add a new employee profile. |

### **Salary & Payroll**

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/salary/calculate` | Saves earnings, deductions, and net pay. |
| `GET` | `/salary/:month` | Fetches salary records for reports. |

---

## 📂 Folder Structure

A high-level view of the application structure.


Anjo-Payroll/
├── 📂 client/ (Frontend)
│   ├── 📂 src/
│   │   ├── 📂 components/   # Reusable UI (Sidebar, Header, Cards)
│   │   ├── 📂 pages/        # Dashboard, Login, Employees, Reports
│   │   ├── 📂 services/     # Axios API calls (authService, employeeService)
│   │   ├── 📂 context/      # AuthContext (Global State)
│   │   ├── 📂 hooks/        # Custom Hooks
│   │   ├── App.tsx          # Main Routing
│   │   └── main.tsx         # Entry Point
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── 📂 server/ (Backend)
│   ├── 📂 models/           # Mongoose Schemas (User, Employee, Salary)
│   ├── 📂 routes/           # Express Routes
│   ├── 📂 middleware/       # Auth Middleware
│   ├── server.js            # Entry Point
│   └── package.json
└── README.md



## 🔮 Future Improvements

* [ ] Add Email Notifications for Payslips using Nodemailer.
* [ ] User Role Management (Admin vs Employee View).
* [ ] Drag-and-drop CSV Import for bulk employee uploads.


<div align="center">

<sub>Built with ❤️ by Hrithik sham </sub>

</div>
