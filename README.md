# Fetadify 🚀

Welcome to **Fetadify**, a cutting-edge platform designed to showcase and manage
AI-driven projects, services, and community engagement. This project features a
high-fidelity frontend and a robust admin dashboard for complete control over
the platform's content.

## ✨ Key Features

### 🌐 Public Facing Platform

- **Service Listings**: Explore a curated collection of AI services.
- **Project Showcase**: A portfolio of innovative AI projects.
- **Booking System**: Streamlined service booking flow for clients.
- **Responsive Design**: Premium, editorial-style UI that works seamlessly
  across all devices.

### 🛠 Admin Dashboard

- **Dashboard Overview**: At-a-glance metrics and platform status.
- **Service Management**: Create, update, and manage the services offered.
- **Project Portfolio**: Manage the list of showcased AI innovations.
- **Booking & Message Center**: Monitor client inquiries, bookings, and platform
  messages.
- **User Management**: Simple oversight of platform users and roles.
- **AI-Powered Tools**: Integrated AI reply management and automation features.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) +
  [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) +
  [Framer Motion](https://www.framer.com/motion/) (for animations)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **State Management**:
  [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) +
  [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-innovation-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:** Create a `.env` file in the root directory
   and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Shadcn + Custom)
├── hooks/          # Custom React hooks (auth, etc.)
├── lib/            # Utility libraries and Supabase client
├── pages/          # Main application pages
│   ├── admin/      # Admin dashboard screens
│   └── ...         # Public pages (Booking, Services, etc.)
├── test/           # Unit and integration tests
├── App.tsx         # Main application component & routes
└── main.tsx        # Application entry point
```

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run test`: Executes Vitest for testing.
- `npm run preview`: Locally previews the production build.

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit pull
requests to improve the platform.

## 📄 License

This project is licensed under the MIT License.
