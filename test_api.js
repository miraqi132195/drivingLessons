const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
let superAdminToken = '';
let adminInstructorToken = '';
let instructorToken = '';
let createdSchoolId = '';
let createdStudentId = '';
let createdLessonId = '';

// Test results storage
const testResults = [];

// Helper function to log test results
function logTestResult(testName, status, response = null, error = null) {
    const result = {
        test: testName,
        status: status,
        timestamp: new Date().toISOString(),
        response: response,
        error: error
    };
    testResults.push(result);
    console.log(`[${status.toUpperCase()}] ${testName}`);
    if (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Helper function to make API calls
async function makeRequest(method, endpoint, data = null, token = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (data) {
            config.data = data;
        }

        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message, 
            status: error.response?.status || 500 
        };
    }
}

// Test 1: Create Super Admin
async function testCreateSuperAdmin() {
    const testData = {
        firstName: "Super",
        lastName: "Admin",
        phoneNumber: "+1234567890",
        password: "superadmin123",
        role: "superAdmin"
    };

    const result = await makeRequest('POST', '/auth/signUp', testData);
    
    if (result.success) {
        logTestResult('Create Super Admin', 'PASS', result.data);
        return result.data.user;
    } else {
        logTestResult('Create Super Admin', 'FAIL', null, result.error);
        return null;
    }
}

// Test 2: Super Admin Login
async function testSuperAdminLogin() {
    const testData = {
        phoneNumber: "+1234567890",
        password: "superadmin123"
    };

    const result = await makeRequest('POST', '/auth/signIn', testData);
    
    if (result.success) {
        superAdminToken = result.data.token;
        logTestResult('Super Admin Login', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Super Admin Login', 'FAIL', null, result.error);
        return null;
    }
}

// Test 3: Create Driving School with Admin-Instructor
async function testCreateDrivingSchool() {
    const testData = {
        schoolName: "ABC Driving School",
        schoolAddress: "123 Main St, New York",
        adminFirstName: "John",
        adminLastName: "Admin",
        adminPhoneNumber: "+1234567891",
        adminPassword: "admin123",
        drivingLicense: "DL123456"
    };

    const result = await makeRequest('POST', '/admin/newDrivingSchool', testData, superAdminToken);
    
    if (result.success) {
        createdSchoolId = result.data.drivingSchool._id;
        logTestResult('Create Driving School', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Create Driving School', 'FAIL', null, result.error);
        return null;
    }
}

// Test 4: Admin-Instructor Login
async function testAdminInstructorLogin() {
    const testData = {
        phoneNumber: "+1234567891",
        password: "admin123"
    };

    const result = await makeRequest('POST', '/auth/signIn', testData);
    
    if (result.success) {
        adminInstructorToken = result.data.token;
        logTestResult('Admin-Instructor Login', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Admin-Instructor Login', 'FAIL', null, result.error);
        return null;
    }
}

// Test 5: Create Regular Instructor
async function testCreateInstructor() {
    const testData = {
        firstName: "Jane",
        lastName: "Instructor",
        phoneNumber: "+1234567892",
        password: "instructor123",
        role: "instructor"
    };

    const result = await makeRequest('POST', '/auth/signUp', testData);
    
    if (result.success) {
        logTestResult('Create Regular Instructor', 'PASS', result.data);
        return result.data.user;
    } else {
        logTestResult('Create Regular Instructor', 'FAIL', null, result.error);
        return null;
    }
}

// Test 6: Regular Instructor Login
async function testInstructorLogin() {
    const testData = {
        phoneNumber: "+1234567892",
        password: "instructor123"
    };

    const result = await makeRequest('POST', '/auth/signIn', testData);
    
    if (result.success) {
        instructorToken = result.data.token;
        logTestResult('Regular Instructor Login', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Regular Instructor Login', 'FAIL', null, result.error);
        return null;
    }
}

// Test 7: Add New Student (Admin-Instructor)
async function testAddStudent() {
    const testData = {
        studentFullName: "Alice Johnson",
        phoneNumber: "+1234567893"
    };

    const result = await makeRequest('POST', '/instructor/students', testData, adminInstructorToken);
    
    if (result.success) {
        createdStudentId = result.data._id;
        logTestResult('Add New Student', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Add New Student', 'FAIL', null, result.error);
        return null;
    }
}

// Test 8: Get All Students
async function testGetAllStudents() {
    const result = await makeRequest('GET', '/instructor/students', null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Get All Students', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Get All Students', 'FAIL', null, result.error);
        return null;
    }
}

// Test 9: Get Student Profile
async function testGetStudentProfile() {
    const result = await makeRequest('GET', `/instructor/students/${createdStudentId}`, null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Get Student Profile', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Get Student Profile', 'FAIL', null, result.error);
        return null;
    }
}

// Test 10: Update Student Profile
async function testUpdateStudentProfile() {
    const testData = {
        studentFullName: "Alice Johnson Updated",
        phoneNumber: "+1234567893",
        studentStatus: "active"
    };

    const result = await makeRequest('PUT', `/instructor/students/${createdStudentId}`, testData, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Update Student Profile', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Update Student Profile', 'FAIL', null, result.error);
        return null;
    }
}

// Test 11: Save New Lesson
async function testSaveNewLesson() {
    const testData = {
        studentId: createdStudentId,
        startTime: "2024-01-15T10:00:00Z",
        endTime: "2024-01-15T11:00:00Z",
        noteForTheLesson: "First driving lesson - student showed good progress",
        route: ["Home", "Main Street", "Highway"],
        city: "New York",
        status: "completed"
    };

    const result = await makeRequest('POST', '/instructor/lessons', testData, adminInstructorToken);
    
    if (result.success) {
        createdLessonId = result.data._id;
        logTestResult('Save New Lesson', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Save New Lesson', 'FAIL', null, result.error);
        return null;
    }
}

// Test 12: Get All Lessons
async function testGetAllLessons() {
    const result = await makeRequest('GET', '/instructor/lessons', null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Get All Lessons', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Get All Lessons', 'FAIL', null, result.error);
        return null;
    }
}

// Test 13: Update Lesson
async function testUpdateLesson() {
    const testData = {
        status: "completed",
        noteForTheLesson: "Updated lesson notes - student completed all exercises successfully"
    };

    const result = await makeRequest('PUT', `/instructor/lessons/${createdLessonId}`, testData, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Update Lesson', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Update Lesson', 'FAIL', null, result.error);
        return null;
    }
}

// Test 14: Generate Instructor Diary Report
async function testGenerateInstructorDiary() {
    const result = await makeRequest('GET', '/instructor/reports/instructor-diary?startDate=2024-01-01&endDate=2024-12-31', null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Generate Instructor Diary Report', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Generate Instructor Diary Report', 'FAIL', null, result.error);
        return null;
    }
}

// Test 15: Generate Student Diary Report
async function testGenerateStudentDiary() {
    const result = await makeRequest('GET', `/instructor/reports/student-diary/${createdStudentId}?startDate=2024-01-01&endDate=2024-12-31`, null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Generate Student Diary Report', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Generate Student Diary Report', 'FAIL', null, result.error);
        return null;
    }
}

// Test 16: Export Student Lessons Data (JSON)
async function testExportStudentDataJSON() {
    const result = await makeRequest('GET', `/instructor/reports/export-student/${createdStudentId}?format=json`, null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Export Student Data (JSON)', 'PASS', result.data);
        return result.data;
    } else {
        logTestResult('Export Student Data (JSON)', 'FAIL', null, result.error);
        return null;
    }
}

// Test 17: Export Student Lessons Data (CSV)
async function testExportStudentDataCSV() {
    const result = await makeRequest('GET', `/instructor/reports/export-student/${createdStudentId}?format=csv`, null, adminInstructorToken);
    
    if (result.success) {
        logTestResult('Export Student Data (CSV)', 'PASS', { message: 'CSV data exported successfully' });
        return result.data;
    } else {
        logTestResult('Export Student Data (CSV)', 'FAIL', null, result.error);
        return null;
    }
}

// Test 18: Test Unauthorized Access
async function testUnauthorizedAccess() {
    const result = await makeRequest('GET', '/instructor/students');
    
    if (!result.success && result.status === 401) {
        logTestResult('Unauthorized Access Test', 'PASS', { message: 'Properly rejected unauthorized access' });
        return true;
    } else {
        logTestResult('Unauthorized Access Test', 'FAIL', null, { message: 'Should have rejected unauthorized access' });
        return false;
    }
}

// Test 19: Test Invalid Student ID
async function testInvalidStudentId() {
    const result = await makeRequest('GET', '/instructor/students/invalid-id', null, adminInstructorToken);
    
    if (!result.success && result.status === 404) {
        logTestResult('Invalid Student ID Test', 'PASS', { message: 'Properly handled invalid student ID' });
        return true;
    } else {
        logTestResult('Invalid Student ID Test', 'FAIL', null, { message: 'Should have returned 404 for invalid ID' });
        return false;
    }
}

// Test 20: Test Invalid Lesson Data
async function testInvalidLessonData() {
    const testData = {
        // Missing required fields
        noteForTheLesson: "Test lesson without required fields"
    };

    const result = await makeRequest('POST', '/instructor/lessons', testData, adminInstructorToken);
    
    if (!result.success && result.status === 400) {
        logTestResult('Invalid Lesson Data Test', 'PASS', { message: 'Properly validated required fields' });
        return true;
    } else {
        logTestResult('Invalid Lesson Data Test', 'FAIL', null, { message: 'Should have returned 400 for missing required fields' });
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting API Tests...\n');
    
    // Authentication Tests
    await testCreateSuperAdmin();
    await testSuperAdminLogin();
    
    // School and User Creation Tests
    await testCreateDrivingSchool();
    await testAdminInstructorLogin();
    await testCreateInstructor();
    await testInstructorLogin();
    
    // Student Management Tests
    await testAddStudent();
    await testGetAllStudents();
    await testGetStudentProfile();
    await testUpdateStudentProfile();
    
    // Lesson Management Tests
    await testSaveNewLesson();
    await testGetAllLessons();
    await testUpdateLesson();
    
    // Report Generation Tests
    await testGenerateInstructorDiary();
    await testGenerateStudentDiary();
    await testExportStudentDataJSON();
    await testExportStudentDataCSV();
    
    // Error Handling Tests
    await testUnauthorizedAccess();
    await testInvalidStudentId();
    await testInvalidLessonData();
    
    console.log('\n✅ All tests completed!');
    
    // Generate test results summary
    const passedTests = testResults.filter(r => r.status === 'PASS').length;
    const failedTests = testResults.filter(r => r.status === 'FAIL').length;
    const totalTests = testResults.length;
    
    console.log(`\n📊 Test Summary:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    
    return testResults;
}

// Export for use in other files
module.exports = { runAllTests, testResults };

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
} 