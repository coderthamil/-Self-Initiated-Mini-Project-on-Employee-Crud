# Employee Management System

A full-stack employee management application with a JWT-secured REST API and a React single-page frontend.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | .NET 9 / ASP.NET Core Web API, Entity Framework Core (In-Memory database), Swagger, JWT Bearer authentication, BCrypt password hashing |
| Frontend | React 19, Vite, React Router 7, Axios, Bootstrap 5 |
| Architecture | Clean/layered backend (API → Application → Domain ← Infrastructure) |

## Project Structure

```
.
├── Backend/                        # .NET solution (Employee.sln)
│   ├── Employee.API/               # ASP.NET Core Web API (controllers, Program.cs, Swagger)
│   │   ├── Controllers/            # AuthController, EmployeesController
│   │   └── Program.cs              # DI, JWT auth, CORS, Swagger, admin seeding
│   ├── Employee.Application/       # Services, DTOs and service interfaces
│   │   ├── Services/               # EmployeeService, UserService
│   │   ├── DTOs/                   # AuthDTOs, EmployeeDTO
│   │   └── Interfaces/             # IEmployeeService, IUserService
│   ├── Employee.Domain/            # Entities and repository interfaces
│   │   ├── Entities/               # Employee, User
│   │   └── Interfaces/             # IEmployeeRepository, IUserRepository
│   └── Employee.Infrastructure/    # EF Core DbContext and repository implementations
│       ├── Data/AppDbContext.cs    # Employees & Users (seeded sample data)
│       └── Repositories/           # EmployeeRepository, UserRepository
└── Frontend/
    └── employee-ui/                # React + Vite app
        ├── src/pages/              # Login, EmployeeDashboard
        ├── src/components/         # Navbar, ProtectedRoute
        ├── src/context/            # AuthContext (JWT session handling)
        └── vite.config.js
```

## Features

- **Authentication**: JWT-based login (public registration is disabled; an `admin` account is seeded on startup). Passwords are hashed with BCrypt.
- **Employee CRUD**: Create, read, update, and delete employees — all endpoints require a valid JWT.
- **Swagger UI**: Interactive API documentation available at `/swagger`.
- **Seeded data**: Three sample employees are loaded into the in-memory database on startup.
- **Frontend**: Login page, protected dashboard route, and an employee management table with add/edit/delete dialogs (Bootstrap-styled).

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18+) and npm

## Getting Started

### 1. Run the Backend API

```bash
cd Backend
dotnet run --project Employee.API
```

The API starts at `http://localhost:<port>` (see `Properties/launchSettings.json`). Swagger is available at:

```
http://localhost:<port>/swagger
```

### 2. Run the Frontend

```bash
cd Frontend/employee-ui
npm install
npm run dev
```

The app is served by Vite at `http://localhost:5173` (CORS for ports 5173/5174 is pre-configured on the API).

## Default Credentials

An admin user is seeded automatically on first run:

| Username | Password |
|----------|----------|
| `admin` | `admin@123` |

## API Endpoints

### Auth (`/api/Auth`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/Auth/login` | Anonymous | Logs in and returns a JWT token + user info |
| POST | `/api/Auth/register` | Anonymous | Disabled — returns `400` (use the seeded admin account) |

### Employees (`/api/Employees`) — all require `Authorization: Bearer <token>`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/Employees` | List all employees |
| GET | `/api/Employees/{id}` | Get a single employee |
| POST | `/api/Employees` | Create an employee |
| PUT | `/api/Employees/{id}` | Update an employee |
| DELETE | `/api/Employees/{id}` | Delete an employee |

Example employee payload:

```json
{
  "name": "John Doe",
  "department": "Engineering",
  "designation": "Developer",
  "salary": 60000,
  "phone": "+1-555-0100",
  "email": "john.d@example.com"
}
```

## Configuration

Backend settings live in `Backend/Employee.API/appsettings.json`:

```json
"JwtSettings": {
  "SecretKey": "...",
  "Issuer": "EmployeeAPI",
  "Audience": "EmployeeClient",
  "ExpiresMinutes": 60
}
```

> ⚠️ The database uses the EF Core **in-memory provider**, so all data resets when the API restarts. Replace it with a real provider (e.g., SQL Server) in `Employee.Infrastructure/DependencyInjection.cs` for persistence. For production, move the JWT secret to a secure configuration store.

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `Backend` | `dotnet build` / `dotnet run --project Employee.API` | Build / run the API |
| `Frontend/employee-ui` | `npm run dev` | Start dev server |
| `Frontend/employee-ui` | `npm run build` | Production build |
| `Frontend/employee-ui` | `npm run preview` | Preview production build |
| `Frontend/employee-ui` | `npm run lint` | Lint with oxlint |
