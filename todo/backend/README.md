# Todo Backend API

A RESTful API for managing todo tasks with MongoDB database.

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   └── taskController.js    # Task business logic
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── Task.js             # Task database schema
├── routes/
│   └── tasks.js            # Task API routes
├── server.js               # Main server file
└── package.json
```

## Features

- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Categories**: Organize tasks by category (Work, Personal, Shopping, etc.)
- **Priority Levels**: Set task priority (Low, Medium, High)
- **Due Dates**: Set and track task due dates
- **Task Statistics**: Get overview of task completion rates
- **Error Handling**: Comprehensive error handling and validation

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Additional Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/category/:category` | Get tasks by category |
| GET | `/api/tasks/status/:status` | Get tasks by status (completed/incomplete) |
| GET | `/api/tasks/stats/overview` | Get task statistics |

## Task Schema

```javascript
{
  text: String (required),
  completed: Boolean (default: false),
  dueDate: Date (optional),
  category: String (default: 'None'),
  priority: String (default: 'Medium'),
  description: String (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGO_URI=mongodb://localhost:27017/tododb
PORT=5000
```

## Installation & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

The server will run on `http://localhost:5000`

## Error Handling

The API includes comprehensive error handling for:
- Invalid MongoDB ObjectIds
- Duplicate entries
- Validation errors
- Server errors

All errors return a consistent JSON response format:

```json
{
  "success": false,
  "error": "Error message"
}
``` 