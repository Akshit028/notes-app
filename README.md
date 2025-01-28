<div align="center">
  <img src="https://raw.githubusercontent.com/Akshit028/notes-app/refs/heads/master/app/favicon.ico" alt="Notes Logo" width="200">
</div>
<p align="center">
  <a href="https://github.com/Akshit028/notes-app">
    <h2 align="center">Notes</h2>
  </a>
</p>

<p align="center">A Next.js Note taking app</p>
<p align="center">
  <a href="https://notes-v01.vercel.app">Live Link</a>
 </p>

## 💻 Tech Stack
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)


## 📦 Features

- 📝 Create, Read, Update, and Delete notes
- 🔖 Organize notes with categories
- 🔍 Full-text search functionality
- 📱 Responsive design
- 🔐 Secure authentication (Google oauth)
- 📂 Database schema migrations with Prisma
- 🚀 Server-side rendering (SSR) with Next.js

## 🚀 Quickstart

### 1. Clone the repository:

```bash
git clone https://github.com/Akshit028/notes-app.git
cd notes-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
DATABASE_URL=
```

### 4. Run database migrations:

```bash
npx prisma migrate dev
```

### 5. Generate Prisma client:

```bash
npx prisma generate
```

### 6. Start the development server:

```bash
npm run dev
```

This will start the app on [http://localhost:3000](http://localhost:3000).


