# 🧠 StackLite - A StackOverflow Clone (MNRN Stack)

StackLite is a full-stack web application inspired by StackOverflow, built using the modern **MNRN** stack:

> **MongoDB + Next.js + React + Node.js**

---

## 📦 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| 💽 Database | MongoDB, Mongoose |
| 🎨 Frontend | React (Next.js App Router), Tailwind CSS |
| ⚙️ Backend  | Next.js API Routes |
| 🔐 Auth     | NextAuth.js       |
| 🌐 Hosting  | Vercel-ready       |

---

## ✨ Features

- 🔐 User Authentication (Sign Up, Login, Forgot Password)
- 👤 User Profile Page
- 📄 Create, Read, Update Questions/Posts
- ✅ Role-based Access (Admin, Editor, User)
- 🔍 Tagging & Search (Planned)
- ⚡ Built with App Router and Server Components

---

## 📁 Folder Structure (App Router)

src/
├── app/
│ ├── login/
│ ├── signup/
│ ├── profile/
│ ├── api/
│ │ └── auth/
│ │ └── [...nextauth]/route.js
├── components/
├── models/
├── lib/
│ ├── mongodb.js
├── styles/



---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stacklite.git
   cd stacklite
2. Install Dependencies
   npm install
3. Setup Environment Variables
   Create a .env.local file:

   MONGODB_URI=mongodb://root:root@localhost:27017/stacklite?authSource=admin
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000

4. Start the App
   npm run dev

