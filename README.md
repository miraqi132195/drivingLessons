# Driving Lessons Diary Server

A comprehensive Node.js/Express.js backend application for managing driving schools, instructors, students, and lessons. This system provides a complete solution for driving school administration with role-based access control.

## 🚗 Overview

This server manages a driving school ecosystem with three main user roles:
- **Super Admin**: System-wide administration
- **Admin-Instructor**: School-level administration and instruction
- **Instructor**: Individual driving instructors

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: express-fileupload
- **CORS**: Enabled for cross-origin requests

### Project Structure
```
driving-lessons-diary/
├── config/                 # Configuration files
├── controllers/           # Business logic handlers
├── libs/                  # Utility libraries (S3 functions)
├── middleware/            # Authentication & authorization
├── models/               # MongoDB schemas
├── routes/               # API route definitions
├── types/                # Constants and error messages
└── server.js             # Main application entry point
```

## 🔐 Authentication & Authorization

### User Roles
- **superAdmin**: Full system access
- **admin-instructor**: School management + instruction capabilities
- **instructor**: Basic instruction capabilities

### Security Features
- JWT-based authentication with 7-day expiration
- Role-based access control (RBAC)
- Password hashing with bcryptjs
- Protected routes with middleware

## 📊 Data Models

### Core Entities

#### Users (`models/users.js`)
- Personal information (firstName, lastName, phoneNumber)
- Role-based access (superAdmin, admin-instructor, instructor)
- Password authentication
- Payment tracking

#### Driving Schools (`models/drivingSchool.js`)
- School information (name, address)
- Statistics (instructor count, student count, car count)
- Admin-instructor association
- Active status tracking

#### Instructors (`models/instructors.js`)
- User association
- School assignment
- Car assignment
- Professional details (license, salary, seniority)
- Testing capabilities flag

#### Students (`models/students.js`)
- Personal information (studentFullName, phoneNumber)
- Lesson tracking (lessonsNumber)
- School association (schoolId)
- Instructor assignment (instructorId)
- Status management (studentStatus)

#### Lessons (`models/lessonDiary.js`)
- Scheduling (start/end times)
- Status tracking (scheduled, completed, canceled)
- Student and instructor associations
- Route and city information
- Lesson notes

#### Cars (`models/cars.js`)
- Vehicle identification
- Type classification (auto/manual)
- Size categories (5ton, 10ton)
- Active status

#### Tests (`models/tests.js`)
- Test scheduling
- Results tracking (pass/fail)
- Test types (insideTest, mainTest)
- Route and location data

#### Payments (`models/payments.js`)
- Payment plans (3Months, 6Months, 12Months)
- Payment status tracking
- Credit information
- Feature access control

## 🚀 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signUp` - User registration
- `POST /signIn` - User login
- `GET /forgetPassword` - Password recovery (planned)
- `PUT /resetPassword` - Password reset (planned)

### Instructor Routes (`/api/instructor`)
**Access**: admin-instructor, instructor
- `GET /students` - Get all students
- `POST /students` - Add new student
- `GET /students/:studentId` - Get student profile
- `PUT /students/:studentId` - Update student profile

### Admin-Instructor Routes (`/api/admin-instructor`)
**Access**: admin-instructor only
- `POST /instructors` - Add new instructor
- `GET /instructors` - Get all instructors in school
- `GET /students` - Get all students in school
- `POST /students` - Add new student with instructor assignment
- `PUT /students/:studentId` - Update student profile (can reassign instructor)

### Super Admin Routes (`/api/admin`)
**Access**: superAdmin only
- `POST /newDrivingSchool` - Create new driving school
- `POST /newAdminInstructor` - Add admin-instructor to school
- `GET /:instructorId` - Update admin-instructor (planned)
- `POST /:schoolId` - Update driving school info (planned)

## ✅ Implemented Features

### ✅ Authentication System
- User registration with role assignment
- Secure login with JWT tokens
- Password hashing and validation
- Role-based middleware protection

### ✅ User Management
- User creation with role-based access
- Phone number uniqueness validation
- User status tracking (active/inactive)

### ✅ Driving School Management
- Complete school creation workflow
- Admin-instructor assignment
- School statistics tracking
- School information updates

### ✅ Student Management
- Student registration and profile management
- Phone number validation
- Lesson count tracking
- Student status management
- Instructor assignment and reassignment
- School-based student organization

### ✅ Instructor Management
- Instructor profile creation
- School and car assignments
- Professional details tracking
- Testing capabilities management

### ✅ Data Models
- Complete MongoDB schemas for all entities
- Proper relationships and references
- Timestamp tracking
- Status management

### ✅ Security
- JWT authentication middleware
- Role-based authorization
- Protected route implementation
- Input validation

## 🚧 Planned/Incomplete Features

### 🔄 Lesson Management
- Lesson scheduling and booking
- Lesson status updates
- Lesson diary generation
- Route tracking

### 🔄 Test Management
- Test scheduling
- Test result recording
- Test history tracking

### 🔄 Payment System
- Payment plan management
- Payment processing
- Billing and invoicing

### 🔄 Reporting
- Instructor diary generation
- Student progress reports
- School analytics
- Financial reports

### 🔄 File Management
- S3 integration for file uploads
- Document management
- Image handling

### 🔄 Password Recovery
- Forget password functionality
- Password reset workflow
- Email notifications

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Environment Variables
Create a `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Code Structure
- **Controllers**: Handle business logic and API responses
- **Models**: Define data schemas and relationships
- **Routes**: Define API endpoints and middleware
- **Middleware**: Authentication and authorization logic
- **Types**: Constants and error message definitions

## 📝 API Documentation

### Authentication Headers
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {},
  "error": "Error details (if applicable)"
}
```

## 🔒 Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- Role-based access control on all routes
- Input validation and sanitization
- CORS configuration for cross-origin requests

## 🚀 Deployment

The application is ready for deployment with:
- Environment-based configuration
- Production-ready error handling
- MongoDB connection with retry logic
- CORS configuration for frontend integration

## 📞 Support

For questions or issues, please refer to the codebase structure and API documentation above. The system is designed to be scalable and maintainable for driving school management needs. 