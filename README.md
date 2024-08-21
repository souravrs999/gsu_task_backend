# Task Manager Backend

This is the backend service for the Interactive Task Manager application. It provides RESTful API endpoints for managing tasks, user authentication, and more. The backend is built using Node.js, Express, TypeScript, and MongoDB.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Task Management](#task-management)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Task Management**: Users can create, read, update, and delete tasks. Tasks are associated with individual users.
- **Validation**: Input data is validated using Zod for robustness and security.
- **MongoDB Integration**: Data persistence is handled using MongoDB, with MongoDB Atlas as the cloud database solution.
- **Testing**: Comprehensive testing setup using Jest, Supertest, and MongoMemoryServer.

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (MongoDB Atlas)
- **Validation**: Zod
- **Testing**: Jest, Supertest, MongoMemoryServer
- **Deployment**: (Specify where you plan to deploy, e.g., Heroku, Vercel, etc.)

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 7.x)
- MongoDB Atlas account (for the cloud database)

### Installation

Clone the repository:

```
git clone https://github.com/souravrs999/gsu_task_backend.git
cd gsu_task_backend
```

Install the dependencies:

```
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

To start the server:

```
npm run dev
```

The backend will be running at `http://localhost:3000`.

## API Documentation

### Authentication

#### **Register a new user**

```http
POST /api/register
```

- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  - `201 Created`: User registered successfully
  - `409 Conflict`: User already exists

#### **Login**

```http
POST /api/login
```

- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  - `200 OK`: Returns JWT token

### Task Management

#### **List all tasks**

```http
GET /api/tasks
```

- **Query Parameters**: 
  - `search`: (Optional) Search term for task titles and descriptions
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Returns list of tasks

#### **Create a new task**

```http
POST /api/tasks
```

- **Body**:
  ```json
  {
    "title": "New Task",
    "description": "Task details",
    "completed": false
  }
  ```
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `201 Created`: Task created successfully

#### **Update a task**

```http
PUT /api/tasks/:id
```

- **Params**:
  - `id`: Task ID
- **Body**:
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated Task Description",
    "completed": true
  }
  ```
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Task updated successfully

#### **Delete a task**

```http
DELETE /api/tasks/:id
```

- **Params**:
  - `id`: Task ID
- **Headers**: 
  - `Authorization`: Bearer token
- **Response**:
  - `200 OK`: Task deleted successfully

## Testing

Run the tests using:

```
npm test
```

The tests cover the main functionality, including user authentication, and task management. Tests are run using `ts-jest`, `Supertest`, and `MongoMemoryServer` for an isolated and consistent environment.

## Error Handling

The application uses consistent error handling with meaningful HTTP status codes:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Generic server error