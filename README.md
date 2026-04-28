# 🛡️ NextGen Sahara Assistant

> A voice-enabled legal aid and women's safety app for rural communities — empathetic, multilingual, and built for those who need it most.

---

## 📖 Overview

**NextGen Sahara Assistant** is a full-stack web application designed to bridge the legal literacy gap for rural users and empower women's safety in India. It provides AI-driven legal aid through a conversational assistant, offering rights explanations, complaint generation, emergency SOS, and access to verified lawyers — all in the user's preferred language.

Built with accessibility at its core, the app supports **6 languages including Kannada**, enabling rural communities to interact with the legal system in a familiar and comfortable way.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎤 **Voice-Enabled Legal Aid** | Speak your query and receive spoken legal guidance — no typing needed |
| ⚖️ **Rights Explanation** | Understand your legal rights in simple, plain language |
| 📄 **Complaint Generation** | Auto-generate legal complaints as downloadable PDFs |
| 🆘 **Emergency SOS** | One-tap emergency alert system for women's safety |
| 🤖 **AI Legal Assistant** | Empathetic, context-aware AI chat for legal queries |
| 👨‍⚖️ **Lawyer Selection** | Browse and connect with verified legal professionals |
| 🌐 **6 Language Support** | Hindi, Kannada, Tamil, Telugu, Malayalam, and English |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI framework
- **TypeScript** — Type-safe development
- **Vite** — Lightning-fast build tool
- **Tailwind CSS v4** — Utility-first styling
- **Radix UI** — Accessible component primitives
- **Framer Motion** — Smooth animations
- **TanStack Query v5** — Server state management
- **Wouter** — Lightweight client-side routing
- **React Hook Form + Zod** — Form management and validation

### Backend
- **Express.js** — Node.js HTTP server
- **tRPC v11** — End-to-end type-safe API layer
- **Drizzle ORM** — TypeScript-first SQL ORM
- **MySQL** — Relational database
- **jose** — JWT-based authentication
- **AWS S3** — File and document storage

### Utilities
- **jsPDF** — PDF generation for legal complaints
- **pnpm** — Fast, efficient package manager
- **Vitest** — Unit testing

---

## 📁 Project Structure

```
NextGen_SaharaAssistant/
├── client/          # React frontend application
├── server/          # Express + tRPC backend
├── shared/          # Shared types and schemas (Zod)
├── drizzle/         # Database migrations
├── patches/         # Dependency patches
├── drizzle.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **pnpm** v10+
- **MySQL** database

### Installation

```bash
# Clone the repository
git clone https://github.com/nayana7767/NextGen_SaharaAssistant.git
cd NextGen_SaharaAssistant

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/sahara_db

# Authentication
JWT_SECRET=your_jwt_secret_here

# AWS S3 (for document storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your_bucket_name
```

### Database Setup

```bash
# Generate and run migrations
pnpm db:push
```

### Development

```bash
# Start the development server
pnpm dev
```

The app will be available at `http://localhost:5000`.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🧪 Testing

```bash
pnpm test
```

---

## 🌍 Language Support

The application is designed to serve users in the following languages:

- 🇮🇳 **Kannada** (ಕನ್ನಡ)
- 🇮🇳 **Hindi** (हिन्दी)
- 🇮🇳 **Tamil** (தமிழ்)
- 🇮🇳 **Telugu** (తెలుగు)
- 🇮🇳 **Malayalam** (മലയാളം)
- 🌐 **English**

---

## 🎯 Target Users

- **Rural women** who face barriers to accessing legal help
- **Victims of domestic violence, harassment, or discrimination**
- **First-time legal aid seekers** unfamiliar with complex legal systems
- **NGOs and legal aid workers** assisting vulnerable communities

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

Built with ❤️ using [Manus](https://manus.im) — an AI-native development platform.

> *"Sahara" (सहारा) means "support" in Hindi — because everyone deserves access to justice.*
