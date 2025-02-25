Nexea Event Management System

A full-stack event management system built with React, TypeScript, and Express.js.

Prerequisites
- Node.js v20.x
- MySQL database
- Yarn package manager

Setup Instructions

1. Clone the repository:
git clone <repository-url>

2. Install dependencies:
yarn install

3. Configure environment variables:
Create a .env file in the root directory with the following content:
DATABASE_URL=mysql://root:@localhost:3306/networking-system
VITE_HOST_API=http://localhost:3000

4. Set up the database:
npx prisma db push

5. Start the development server:
yarn dev

The application will be available at:
Frontend: http://localhost:3039
Backend API: http://localhost:3000

# API Documentation

## Authentication

### Sign Up

- POST /api/auth/signup
- Creates a new user account
- Body:
{
"fullName": "string",
"email": "string",
"password": "string",
"phoneNumber": "string",
"role1": "STARTUP|INVESTOR|MENTOR|OTHER",
"role2": "USER|ADMIN"
}


Sign In
- POST /api/auth/signin
- Authenticates a user
- Body:
{
"email": "string",
"password": "string"
}

Events
Get All Events
- GET /api/events
- Returns list of all events with participant counts

Create Event
- POST /api/events
- Creates a new event
- Requires admin authentication
- Body:
{
"name": "string",
"date": "ISO date string",
"location": "string",
"description": "string",
"capacity": "number"
}

Update Event
- PUT /api/events/:id
- Updates an existing event
- Requires admin authentication
- Body: Same as Create Event

Delete Event
- DELETE /api/events/:id
- Deletes an event and its participants
- Requires admin authentication

Participants
Join Event
- POST /api/participants
- Registers a participant for an event
- Body:
{
"name": "string",
"email": "string",
"role": "STARTUP|INVESTOR|MENTOR|OTHER",
"eventId": "number"
}

Get Event Participants
- GET /api/events/:id/participants
- Returns list of participants for a specific event

Users (Admin Only)
Get All Users
- GET /api/users
- Returns list of all users
- Requires admin authentication

Update User
- PUT /api/users/:id
- Updates user details
- Requires admin authentication
- Body:
{
"fullName": "string",
"email": "string",
"role1": "string",
"role2": "string",
"phoneNumber": "string"
}

Delete User
- DELETE /api/users/:id
- Deletes a user account
- Requires admin authentication

# Authentication Headers
For protected routes, include:
user-id: <user id>
For admin-only routes, the user must have role2: "ADMIN" in their account.

Error Responses
All endpoints return standard HTTP status codes:
200: Success
201: Created
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
500: Internal Server Error
Error responses include a message:
{
"message": "Error description"
}
