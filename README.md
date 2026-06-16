I’ll put it in a single copy-paste block below.

AI Developer Survey

A full-stack survey application built to collect structured feedback from developers using modern AI-assisted coding tools. The platform is designed with a focus on security, simplicity, reliability, and cost efficiency while running entirely on free-tier infrastructure.

⸻

Overview

The application allows users to:

* Authenticate using Google Sign-In
* Submit a single survey response
* Prevent duplicate submissions
* Store responses securely in PostgreSQL
* Maintain an audit trail of submissions
* Access the application through a responsive web interface

The system follows a frontend → backend → database architecture with authentication and validation enforced server-side.

⸻

Architecture

Frontend (Netlify)
        │
        ▼
Backend API (Render)
        │
        ▼
Database (Neon PostgreSQL)

⸻

Tech Stack

Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Google Identity Services

Responsibilities:

* User authentication
* Form rendering
* Client-side validation
* API communication
* Responsive design

Backend

* Node.js
* Express.js

Responsibilities:

* Google token verification
* JWT generation
* JWT validation
* Request authorization
* Response persistence
* Audit logging
* Duplicate submission prevention

Database

* Neon PostgreSQL

Responsibilities:

* User storage
* Survey response storage
* Audit log storage

⸻

Authentication Flow

Step 1

User clicks Sign in with Google

Step 2

Google returns an ID Token.

Step 3

Frontend sends the token to:

POST /api/start

Step 4

Backend verifies:

* Signature validity
* Google issuer
* Client ID audience
* Email verification status

using Google’s official authentication library.

Step 5

Backend generates a JWT:

{
  "google_sub": "...",
  "email": "...",
  "name": "..."
}

Step 6

JWT is returned to the frontend and stored locally.

⸻

Authorization Flow

Every protected endpoint requires:

Authorization: Bearer <JWT>

The backend validates:

* JWT signature
* Token expiration
* User payload

before processing any request.

⸻

API Structure

Authentication

Start Authentication

POST /api/start

Verifies Google token and issues application JWT.

⸻

Survey Initialization

Start Survey

POST /api/start-survey

Protected endpoint.

Verifies:

* JWT validity
* User access

Returns survey initialization response.

⸻

Survey Submission

Submit Survey

POST /api/survey

Protected endpoint.

Responsibilities:

* Validate payload
* Create user if needed
* Prevent duplicate submissions
* Save survey response
* Create audit log

⸻

Database Design

Users Table

Stores authenticated users.

id
google_sub
email
name
created_at
last_login

Responses Table

Stores survey submissions.

id
user_id
submitted_at
response_data

Constraint:

One User = One Response

Duplicate submissions are blocked at both the application and database layers.

Audit Logs Table

Tracks important actions.

id
user_id
action
ip_address
created_at

Example action:

SURVEY_SUBMITTED

⸻

Validation Strategy

Frontend Validation

Ensures required fields are completed before submission and prevents unnecessary API requests.

Backend Validation

Backend independently validates:

* Required fields
* Authentication
* Authorization
* Submission eligibility

The backend never trusts client-side validation.

⸻

Security Features

Google Identity Verification

User identity is verified directly through Google.

Benefits:

* No passwords
* No password storage
* Reduced attack surface

JWT Authentication

Protected endpoints require signed JWT tokens.

Benefits:

* Stateless authentication
* Fast verification
* No server-side session storage

Helmet

Security headers are applied through Helmet.

Provides protection against:

* Clickjacking
* MIME sniffing
* Common browser attacks

Rate Limiting

Implemented using Express Rate Limit.

Protects against:

* Request flooding
* Automated abuse
* Brute-force attempts

CORS Protection

Requests are restricted to approved origins.

Example:

http://localhost:3000
Production Frontend URL

Prevents unauthorized browser access.

Database Constraints

Unique constraints enforce:

One Google Account = One Survey Response

Even if application validation fails, the database still prevents duplicates.

SQL Injection Protection

All queries use parameterized statements.

Example:

WHERE google_sub = $1

No raw SQL concatenation is used.

⸻

Transaction Management

Survey submissions use PostgreSQL transactions.

Process:

BEGIN
↓
User Lookup
↓
Response Insert
↓
Audit Log Insert
↓
COMMIT

If any step fails:

ROLLBACK

This guarantees data consistency.

⸻

Deployment

Frontend

Hosted on Netlify.

Responsibilities:

* Static hosting
* CDN delivery
* HTTPS

Backend

Hosted on Render.

Responsibilities:

* API hosting
* Authentication
* Business logic

Database

Hosted on Neon PostgreSQL.

Responsibilities:

* Persistent storage
* Managed PostgreSQL

⸻

Environment Variables

Backend uses environment variables for secrets.

Example:

GOOGLE_CLIENT_ID=
JWT_SECRET=
DATABASE_URL=
PORT=

Sensitive values are never committed to source control.

⸻

Reliability Features

* Server-side authentication
* Database transactions
* Audit logging
* Duplicate prevention
* Structured validation
* HTTPS across all services
* Managed PostgreSQL infrastructure

⸻

Scalability Notes

Current architecture is optimized for:

* MVP validation
* User research
* Startup surveys
* Community feedback collection

Because the application:

* Stores only structured text data
* Has minimal database writes
* Uses no file uploads
* Uses no AI inference

it can support a significant number of responses while remaining on free-tier infrastructure.

⸻

Future Improvements

Potential enhancements include:

* Analytics dashboard
* Admin portal
* CSV export
* Survey versioning
* Multi-survey support
* Email notifications
* Response visualization
* User insights dashboard

⸻

License

This project was developed as an MVP research platform for collecting developer feedback on AI-assisted software engineering workflows.