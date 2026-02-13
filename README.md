# WeftOS - Workflow Operating System

WeftOS is a modern SaaS platform for designing, executing, and monitoring dynamic business workflows. It connects configurable workflow definitions with a centralized execution engine, enabling secure and scalable process automation.

The system is built using a full MERN stack and follows a clean layered architecture suitable for production-grade deployment.

## Live Demo

Frontend: https://weftos.vercel.app  
Backend API: https://weftos-backend.vercel.app

## Features

- **Dynamic Workflow Engine**: Define steps and transitions dynamically.
- **Role-Based Access Control (RBAC)**: Secure execution flow with Admin, Manager, and Employee roles.
- **Dashboard Analytics**: Real-time insights into workflow performance and completion rates.
- **Instance Management**: Track every execution step with audit logs.
- **Claymorphism UI**: Modern, clean, and accessible interface.

## Tech Stack

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

## Deployment

### Backend

#### 1. Set environment variables:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```
    
#### 2.  Build command:
```bash
npm install
```

#### 3.  Start command:
```bash
node server.js
```

### Frontend

#### 1.  Set environment variables:
```bash
VITE_API_URL=https://your-backend-domain.com/api/v1
 ```
    
#### 2.  Build command:
```bash
npm run build
```
    
#### 3.  Output directory:
```bash
dist
```

## Architecture

WeftOS follows a layered architecture:

- **Presentation Layer**: React components separated into Pages and Reusable UI elements.
- **Service Layer**: Centralized API logic to separate data fetching from UI components.
- **Business Logic Layer**: Express controllers handling validation, authorization, and workflow rules.
- **Data Access Layer**: Mongoose models defining the schema and relationships.

## Contribution

1.  Fork the repo.
2.  Create a feature branch.
3.  Submit a Pull Request.

---

_Built as a showcase of scalable SaaS architecture and workflow engine implementation._
