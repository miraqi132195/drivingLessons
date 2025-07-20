# API Documentation - Driving Lessons Diary

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Routes

### POST `/auth/signUp`
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "role": "instructor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { ... }
}
```

### POST `/auth/signIn`
Login user.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "userId": "user_id",
  "role": "instructor"
}
```

---

## 👨‍🏫 Instructor Routes (admin-instructor, instructor)

### GET `/instructor/students`
Get all students assigned to the instructor.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "student_id",
      "studentFullName": "John Doe",
      "phoneNumber": "+1234567890",
      "lessonsNumber": 5,
      "studentStatus": "active",
      "schoolId": {
        "_id": "school_id",
        "schoolName": "ABC Driving School"
      },
      "instructorId": {
        "_id": "instructor_id",
        "userId": {
          "firstName": "John",
          "lastName": "Instructor",
          "phoneNumber": "+1234567890"
        }
      }
    }
  ]
}
```

### POST `/instructor/students`
Add a new student (automatically assigned to the instructor).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentFullName": "Jane Smith",
  "phoneNumber": "+1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "_id": "student_id",
    "studentFullName": "Jane Smith",
    "phoneNumber": "+1234567891",
    "lessonsNumber": 0,
    "studentStatus": "active",
    "schoolId": "school_id",
    "instructorId": "instructor_id"
  }
}
```

### GET `/instructor/students/:studentId`
Get a specific student's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Student profile retrieved successfully",
  "data": {
    "_id": "student_id",
    "studentFullName": "John Doe",
    "phoneNumber": "+1234567890",
    "lessonsNumber": 5,
    "studentStatus": "active",
    "schoolId": "school_id"
  }
}
```

### PUT `/instructor/students/:studentId`
Update a student's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentFullName": "John Updated",
  "phoneNumber": "+1234567890",
  "studentStatus": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "student_id",
    "studentFullName": "John Updated",
    "phoneNumber": "+1234567890",
    "lessonsNumber": 5,
    "studentStatus": "active",
    "schoolId": "school_id"
  }
}
```

---

## 👨‍💼 Admin-Instructor Routes (admin-instructor only)

### GET `/admin-instructor/students`
Get all students from the school (admin-instructor can see all students).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "student_id",
      "studentFullName": "John Doe",
      "phoneNumber": "+1234567890",
      "lessonsNumber": 5,
      "studentStatus": "active",
      "schoolId": {
        "_id": "school_id",
        "schoolName": "ABC Driving School"
      },
      "instructorId": {
        "_id": "instructor_id",
        "userId": {
          "firstName": "John",
          "lastName": "Instructor",
          "phoneNumber": "+1234567890"
        }
      }
    }
  ]
}
```

### POST `/admin-instructor/students`
Add a new student and assign to a specific instructor.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentFullName": "Jane Smith",
  "phoneNumber": "+1234567891",
  "instructorId": "instructor_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "_id": "student_id",
    "studentFullName": "Jane Smith",
    "phoneNumber": "+1234567891",
    "lessonsNumber": 0,
    "studentStatus": "active",
    "schoolId": "school_id",
    "instructorId": "instructor_id"
  }
}
```

### PUT `/admin-instructor/students/:studentId`
Update a student's profile (can reassign to different instructor).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentFullName": "John Updated",
  "phoneNumber": "+1234567890",
  "studentStatus": "active",
  "instructorId": "new_instructor_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "student_id",
    "studentFullName": "John Updated",
    "phoneNumber": "+1234567890",
    "lessonsNumber": 5,
    "studentStatus": "active",
    "schoolId": "school_id",
    "instructorId": "new_instructor_id"
  }
}
```

### GET `/admin-instructor/instructors`
Get all instructors in the school.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Instructors retrieved successfully",
  "data": [
    {
      "_id": "instructor_id",
      "userId": {
        "firstName": "John",
        "lastName": "Instructor",
        "phoneNumber": "+1234567890",
        "email": "john@example.com"
      },
      "schoolId": {
        "_id": "school_id",
        "schoolName": "ABC Driving School"
      }
    }
  ]
}
```

---

## 📚 Lesson Management Routes

### POST `/instructor/lessons`
Save a new lesson.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentId": "student_id",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "noteForTheLesson": "Student showed good progress",
  "route": ["Point A", "Point B", "Point C"],
  "city": "New York",
  "status": "scheduled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lesson saved successfully",
  "data": {
    "_id": "lesson_id",
    "studentId": "student_id",
    "instructorId": "instructor_id",
    "schoolId": "school_id",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "status": "scheduled",
    "noteForTheLesson": "Student showed good progress",
    "route": ["Point A", "Point B", "Point C"],
    "city": "New York"
  }
}
```

### GET `/instructor/lessons`
Get all lessons for the instructor.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Lessons retrieved successfully",
  "data": [
    {
      "_id": "lesson_id",
      "studentId": {
        "_id": "student_id",
        "studentFullName": "John Doe",
        "phoneNumber": "+1234567890"
      },
      "instructorId": "instructor_id",
      "schoolId": {
        "_id": "school_id",
        "schoolName": "ABC Driving School"
      },
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "status": "completed",
      "noteForTheLesson": "Great lesson",
      "route": ["Point A", "Point B"],
      "city": "New York"
    }
  ]
}
```

### PUT `/instructor/lessons/:lessonId`
Update a lesson.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "completed",
  "noteForTheLesson": "Updated lesson notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {
    "_id": "lesson_id",
    "studentId": {
      "_id": "student_id",
      "studentFullName": "John Doe",
      "phoneNumber": "+1234567890"
    },
    "status": "completed",
    "noteForTheLesson": "Updated lesson notes"
  }
}
```

---

## 📊 Report Generation Routes

### GET `/instructor/reports/instructor-diary`
Generate instructor diary report.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Start date filter (ISO format)
- `endDate` (optional): End date filter (ISO format)

**Example:** `/instructor/reports/instructor-diary?startDate=2024-01-01&endDate=2024-01-31`

**Response:**
```json
{
  "success": true,
  "message": "Instructor diary report generated successfully",
  "data": {
    "instructor": {
      "id": "instructor_id",
      "userId": "user_id",
      "name": "John Doe",
      "schoolId": "school_id"
    },
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "statistics": {
      "totalLessons": 25,
      "completedLessons": 20,
      "scheduledLessons": 3,
      "canceledLessons": 2,
      "completionRate": "80.00%"
    },
    "lessonsByStudent": {
      "John Smith": [...],
      "Jane Doe": [...]
    },
    "allLessons": [...]
  }
}
```

### GET `/instructor/reports/student-diary/:studentId`
Generate student diary report.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Start date filter (ISO format)
- `endDate` (optional): End date filter (ISO format)

**Response:**
```json
{
  "success": true,
  "message": "Student diary report generated successfully",
  "data": {
    "student": {
      "id": "student_id",
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "totalLessonsTaken": 15,
      "status": "active"
    },
    "instructor": {
      "id": "instructor_id",
      "name": "John Instructor"
    },
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "statistics": {
      "totalLessons": 10,
      "completedLessons": 8,
      "scheduledLessons": 1,
      "canceledLessons": 1,
      "completionRate": "80.00%",
      "averageLessonDuration": "60 minutes"
    },
    "lessons": [...],
    "recentLessons": [...],
    "upcomingLessons": [...]
  }
}
```

### GET `/instructor/reports/export-student/:studentId`
Export student lessons data.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `format` (optional): Export format - "json" (default) or "csv"

**Response (JSON):**
```json
{
  "success": true,
  "message": "Student lessons data exported successfully",
  "data": {
    "studentInfo": {
      "id": "student_id",
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "totalLessons": 15,
      "status": "active"
    },
    "instructorInfo": {
      "id": "instructor_id",
      "name": "John Instructor"
    },
    "lessons": [
      {
        "id": "lesson_id",
        "startTime": "2024-01-15T10:00:00Z",
        "endTime": "2024-01-15T11:00:00Z",
        "status": "completed",
        "city": "New York",
        "route": ["Point A", "Point B"],
        "notes": "Great lesson",
        "school": "ABC Driving School"
      }
    ],
    "summary": {
      "totalLessons": 15,
      "completedLessons": 12,
      "scheduledLessons": 2,
      "canceledLessons": 1,
      "exportDate": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

**Response (CSV):**
Returns a downloadable CSV file with lesson data.

---

## 🏫 Admin Routes (superAdmin only)

### POST `/admin/newDrivingSchool`
Create a new driving school.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "schoolName": "ABC Driving School",
  "schoolAddress": "123 Main St, New York",
  "adminFirstName": "John",
  "adminLastName": "Admin",
  "adminPhoneNumber": "+1234567890",
  "adminPassword": "password123",
  "drivingLicense": "DL123456"
}
```

### POST `/admin/newAdminInstructor`
Add a new admin-instructor to an existing school.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "schoolId": "school_id",
  "adminFirstName": "Jane",
  "adminLastName": "Admin",
  "adminPhoneNumber": "+1234567891",
  "adminPassword": "password123",
  "drivingLicense": "DL789012"
}
```

---

## 📝 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Security Notes

1. All protected routes require valid JWT tokens
2. Users can only access data from their own school
3. Role-based access control is enforced
4. Input validation is performed on all endpoints
5. Phone numbers must be unique across the system 