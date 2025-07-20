# Postman Collection Setup Guide

## 📥 How to Import the Collection

1. **Download the Collection File**
   - The collection file is saved as `postman_collection.json` in your project root
   - This file contains all the API endpoints for your Driving Lessons Diary application

2. **Import into Postman**
   - Open Postman
   - Click "Import" button (top left)
   - Choose "File" tab
   - Select the `postman_collection.json` file
   - Click "Import"

3. **Set Up Environment Variables**
   - After importing, you'll see the collection "Driving Lessons Diary API"
   - Click on the collection name to open it
   - Go to the "Variables" tab
   - Set up the following variables:

## 🔧 Environment Variables Setup

### Required Variables:
- `baseUrl`: `http://localhost:5000/api`
- `superAdminToken`: (leave empty initially)
- `adminInstructorToken`: (leave empty initially)
- `instructorToken`: (leave empty initially)
- `schoolId`: (leave empty initially)
- `studentId`: (leave empty initially)
- `lessonId`: (leave empty initially)

## 🚀 Testing Workflow

### Step 1: Authentication
1. **Sign Up** (optional - you can use existing seeded data)
   - Use the "Sign Up" request to create a new user
   - Copy the response token to the appropriate variable

2. **Sign In**
   - Use the seeded super admin: `+1234567890` / `superadmin123`
   - Use the seeded admin-instructor: `+1234567891` / `admin123`
   - Copy the returned token to the appropriate variable

### Step 2: Test Student Management
1. **Get All Students** - Should return existing students
2. **Add New Student** - Create a new student
3. **Get Student Profile** - Get specific student details
4. **Update Student Profile** - Update student information

### Step 3: Test Lesson Management
1. **Save New Lesson** - Create a new lesson for a student
2. **Get All Lessons** - Retrieve all lessons
3. **Update Lesson** - Update lesson status or notes

### Step 4: Test Reporting
1. **Generate Instructor Diary Report** - Get instructor statistics
2. **Generate Student Diary Report** - Get student-specific reports
3. **Export Student Data** - Export in JSON or CSV format

### Step 5: Test Admin Functions
1. **Create Driving School** (Super Admin only)
2. **Add Admin-Instructor** (Super Admin only)
3. **Add New Instructor** (Admin-Instructor only)

## 📋 Pre-seeded Data

Your database already contains:
- **Super Admin**: `+1234567890` / `superadmin123`
- **Admin-Instructor**: `+1234567891` / `admin123`
- **Sample School**: "Sample Driving School"
- **Sample Student**: "Alice Johnson" (`+1234567892`)
- **Sample Lesson**: Already created for the sample student

## 🔐 Authentication Flow

1. **Start with Sign In** using the seeded admin-instructor:
   ```json
   {
     "phoneNumber": "+1234567891",
     "password": "admin123"
   }
   ```

2. **Copy the token** from the response to `adminInstructorToken` variable

3. **All subsequent requests** will automatically use this token

## 🧪 Test Cases Included

The collection includes test cases for:
- ✅ **Unauthorized Access** - Tests 401 responses
- ✅ **Invalid Student ID** - Tests 404 responses
- ✅ **Invalid Lesson Data** - Tests 400 validation errors

## 📊 Expected Responses

### Successful Response Format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🎯 Quick Start Checklist

- [ ] Import `postman_collection.json` into Postman
- [ ] Set `baseUrl` variable to `http://localhost:5000/api`
- [ ] Start your server (`npm run dev`)
- [ ] Sign in with admin-instructor credentials
- [ ] Copy token to `adminInstructorToken` variable
- [ ] Test "Get All Students" to verify connection
- [ ] Run through the workflow steps above

## 🔍 Troubleshooting

### Common Issues:
1. **Connection Refused**: Make sure your server is running on port 5000
2. **401 Unauthorized**: Check that you've copied the token correctly
3. **404 Not Found**: Verify the `baseUrl` is set correctly
4. **500 Server Error**: Check server logs for detailed error messages

### Server Status Check:
- Visit `http://localhost:5000/api/auth/signIn` in your browser
- Should return a JSON response (even if it's an error)

## 📈 Collection Features

- **Organized by Function**: Authentication, Student Management, Lessons, Reports, etc.
- **Pre-configured Headers**: All requests have proper Content-Type and Authorization headers
- **Variable Support**: Uses Postman variables for dynamic data
- **Example Data**: Each request includes sample request bodies
- **Error Testing**: Includes test cases for validation and error handling

Happy Testing! 🚗📚 