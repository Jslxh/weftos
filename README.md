# WeftOS - Workflow Operating System

WeftOS is a professional SaaS platform for designing, executing, and monitoring complex business workflows. Built with a modern MERN stack, it features a dynamic workflow engine, role-based access control, and real-time analytics.

## 🚀 Features

- **Visual Workflow Engine**: Define steps and transitions dynamically.
- **Role-Based Access Control (RBAC)**: secure execution flow with Admin, Manager, and Employee roles.
- **Dashboard Analytics**: Real-time insights into workflow performance and completion rates.
- **Instance Management**: Track every execution step with audit logs.
- **Claymorphism UI**: Modern, clean, and accessible interface.

## 🛠 Tech Stack

### Backend

- **Node.js & Express**: RESTful API architecture.
- **MongoDB & Mongoose**: Flexible schema design for dynamic workflows.
- **JWT & Bcrypt**: Secure authentication.

### Frontend

- **React (Vite)**: Fast, modern UI development.
- **Tailwind CSS**: Utility-first styling with custom Claymorphism design system.
- **Shadcn/UI**: Accessible and customizable component primitives.
- **Axios**: Interceptor-based API communication.
- **Recharts / Lucide**: Visualization and iconography.

## 📦 Deployment

### Backend (Render/Heroku/Railway)

1.  Set environment variables:
    - `PORT=5000`
    - `MONGO_URI=...`
    - `JWT_SECRET=...`
    - `FRONTEND_URL=https://your-frontend-domain.com`
2.  Build command: `npm install`
3.  Start command: `node server.js`

### Frontend (Vercel/Netlify)

1.  Set environment variables:
    - `VITE_API_URL=https://your-backend-domain.com/api/v1`
2.  Build command: `npm run build`
3.  Output directory: `dist`

## 🏗 Architecture

WeftOS follows a layered architecture:

- **Presentation Layer**: React components separated into Pages and Reusable UI elements.
- **Service Layer**: Centralized API logic to separate data fetching from UI components.
- **Business Logic Layer**: Express controllers handling validation, authorization, and workflow rules.
- **Data Access Layer**: Mongoose models defining the schema and relationships.

## 🤝 Contribution

1.  Fork the repo.
2.  Create a feature branch.
3.  Submit a Pull Request.

---

_Built as a showcase of production-grade SaaS architecture._
