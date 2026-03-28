# Virtual Event Manager

A Node.js + Express + MongoDB backend for managing virtual events with JWT-based authentication.

## Features

- User registration and login
- JWT token generation and validation
- Protected event APIs
- Create, read, update, and delete events
- Join an event as an authenticated user

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token (`jsonwebtoken`)
- `bcrypt` for password hashing

## Project Structure

```text
app.js
controllers/
	event-manager-controller.js
	users-controller.js
middlewares/
	logger.js
	validateJWT.js
models/
	eventModels.js
	userModels.js
routes/
	event-manager-routes.js
	user-routes.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
```

3. Start the server:

```bash
npm run start
```

For development with auto-reload:

```bash
npm run dev
```

## Scripts

- `npm test` - run user and event tests with Node test runner
- `npm run start` - start server (`node app.js`)
- `npm run dev` - start with nodemon

## Authentication

Login returns a JWT token. Send it in protected routes using:

```http
Authorization: Bearer <token>
```

## API Endpoints

Base URL: `http://localhost:3000`

### User Routes

- `POST /users/register`
- `POST /users/login`

#### Register Request

```json
{
	"name": "John Doe",
	"username": "johndoe",
	"password": "Passw0rd"
}
```

#### Login Request

```json
{
	"username": "johndoe",
	"password": "Passw0rd"
}
```

#### Login Success Response

```json
{
	"message": "User logged in successfully",
	"token": "<jwt-token>"
}
```

### Event Routes (JWT Protected)

- `GET /events/` - list all events
- `GET /events/:eventId` - get event by custom `eventId`
- `POST /events/create` - create event
- `PUT /events/update/:eventId` - update event (cannot mutate `eventId`)
- `DELETE /events/delete/:eventId` - delete event
- `PATCH /events/participate/:eventId` - join event as logged-in user

#### Create Event Request

```json
{
	"eventId": "EVT-1001",
	"eventName": "Frontend Workshop",
	"eventDate": "2026-04-15",
	"eventTime": "18:00",
	"eventDescription": "Hands-on session",
	"participants": []
}
```

## Data Models

### User

- `name` (required)
- `username` (required, unique)
- `password` (required, min 6 chars, must include uppercase, lowercase, and number)

### Event

- `eventId` (required, unique)
- `eventName` (required)
- `eventDate` (required, Date)
- `eventTime` (required)
- `eventDescription` (optional)
- `participants` (array of user IDs as strings)

## Current Behavior Notes

- `/events/*` routes require valid JWT.
- Registration response returns only a message (not full user object).
- Participation endpoint prevents duplicate joins by the same user.
