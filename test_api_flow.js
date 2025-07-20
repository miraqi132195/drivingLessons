const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

// Test data
let adminInstructorToken = '';
let studentId = '';
let lessonId = '';

// Server startup function
async function startServer() {
    try {

        
        const PORT = process.env.PORT || 5000;
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/driving-lessons-diary';
        
        console.log('🔧 Starting server...');
        await mongoose.connect(MONGO_URI);
        console.log('🟢 Connected to MongoDB');
        
        // Import and start the server
        const app = require('./server');
        
        // Wait a bit for server to fully start
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log('');
        
    } catch (error) {
        console.error('❌ Server startup failed:', error.message);
        process.exit(1);
    }
}

async function testAPI() {
    console.log('🚀 Starting API Flow Test...\n');

    try {
        // Step 1: Login as Admin-Instructor
        console.log('1️⃣ Logging in as Admin-Instructor...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/signIn`, {
            phoneNumber: '+1234567891',
            password: 'admin123'
        });
        adminInstructorToken = loginResponse.data.token;
        console.log('✅ Login successful');
        console.log(`   Token: ${adminInstructorToken.substring(0, 20)}...\n`);

        // Step 2: Test getAllStudents
        console.log('2️⃣ Testing getAllStudents...');
        const getAllStudentsResponse = await axios.get(`${BASE_URL}/instructor/students`, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ getAllStudents successful');
        console.log(`   Students count: ${getAllStudentsResponse.data.data.length}`);
        if (getAllStudentsResponse.data.data.length > 0) {
            console.log(`   First student: ${getAllStudentsResponse.data.data[0].studentFullName}`);
        }
        console.log('');

        // Step 3: Test addNewStudent
        console.log('3️⃣ Testing addNewStudent...');
        const newStudentData = {
            studentFullName: 'Test Student API',
            phoneNumber: '+1234567899'
        };
        const addStudentResponse = await axios.post(`${BASE_URL}/instructor/students`, newStudentData, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        studentId = addStudentResponse.data.data._id;
        console.log('✅ addNewStudent successful');
        console.log(`   New student ID: ${studentId}`);
        console.log(`   Student name: ${addStudentResponse.data.data.studentFullName}`);
        console.log('');

        // Step 4: Test getStudentProfile
        console.log('4️⃣ Testing getStudentProfile...');
        const getProfileResponse = await axios.get(`${BASE_URL}/instructor/students/${studentId}`, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ getStudentProfile successful');
        console.log(`   Student: ${getProfileResponse.data.data.studentFullName}`);
        console.log(`   Phone: ${getProfileResponse.data.data.phoneNumber}`);
        console.log(`   Lessons: ${getProfileResponse.data.data.lessonsNumber}`);
        console.log('');

        // Step 5: Test updateStudentProfile
        console.log('5️⃣ Testing updateStudentProfile...');
        const updateData = {
            studentFullName: 'Test Student API Updated',
            phoneNumber: '+1234567899',
            studentStatus: 'active'
        };
        const updateProfileResponse = await axios.put(`${BASE_URL}/instructor/students/${studentId}`, updateData, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ updateStudentProfile successful');
        console.log(`   Updated name: ${updateProfileResponse.data.data.studentFullName}`);
        console.log(`   Status: ${updateProfileResponse.data.data.studentStatus}`);
        console.log('');

        // Step 6: Test saveNewLessonDetails
        console.log('6️⃣ Testing saveNewLessonDetails...');
        const lessonData = {
            studentId: studentId,
            startTime: '2024-01-25T10:00:00Z',
            endTime: '2024-01-25T11:00:00Z',
            noteForTheLesson: 'API test lesson - student showed good progress',
            route: ['Home', 'Main Street', 'Highway', 'Downtown'],
            city: 'Test City',
            status: 'completed'
        };
        const saveLessonResponse = await axios.post(`${BASE_URL}/instructor/lessons`, lessonData, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        lessonId = saveLessonResponse.data.data._id;
        console.log('✅ saveNewLessonDetails successful');
        console.log(`   Lesson ID: ${lessonId}`);
        console.log(`   Status: ${saveLessonResponse.data.data.status}`);
        console.log(`   Student: ${saveLessonResponse.data.data.studentId}`);
        console.log(`   Start Time: ${saveLessonResponse.data.data.startTime}`);
        console.log('');

        // Step 7: Test getAllLessons
        console.log('7️⃣ Testing getAllLessons...');
        const getAllLessonsResponse = await axios.get(`${BASE_URL}/instructor/lessons`, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ getAllLessons successful');
        console.log(`   Total lessons: ${getAllLessonsResponse.data.data.length}`);
        if (getAllLessonsResponse.data.data.length > 0) {
            const latestLesson = getAllLessonsResponse.data.data[0];
            console.log(`   Latest lesson: ${latestLesson._id}`);
            console.log(`   Latest lesson status: ${latestLesson.status}`);
            if (latestLesson.studentId) {
                console.log(`   Latest lesson student: ${latestLesson.studentId.studentFullName}`);
            }
        }
        console.log('');

        // Step 8: Test updateLesson
        console.log('8️⃣ Testing updateLesson...');
        const lessonUpdateData = {
            status: 'completed',
            noteForTheLesson: 'Updated lesson notes - API test completed successfully'
        };
        const updateLessonResponse = await axios.put(`${BASE_URL}/instructor/lessons/${lessonId}`, lessonUpdateData, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ updateLesson successful');
        console.log(`   Updated lesson ID: ${updateLessonResponse.data.data._id}`);
        console.log(`   Updated status: ${updateLessonResponse.data.data.status}`);
        console.log(`   Updated notes: ${updateLessonResponse.data.data.noteForTheLesson}`);
        console.log('');

        // Step 9: Test generateDiaryForStudent
        console.log('9️⃣ Testing generateDiaryForStudent...');
        const diaryResponse = await axios.get(`${BASE_URL}/instructor/reports/student-diary/${studentId}?startDate=2024-01-01&endDate=2024-12-31`, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ generateDiaryForStudent successful');
        console.log(`   Student: ${diaryResponse.data.data.student.fullName}`);
        console.log(`   Total lessons: ${diaryResponse.data.data.statistics.totalLessons}`);
        console.log(`   Completed lessons: ${diaryResponse.data.data.statistics.completedLessons}`);
        console.log(`   Completion rate: ${diaryResponse.data.data.statistics.completionRate}`);
        console.log('');

        // Step 10: Final verification
        console.log('🔟 Final Verification...');
        
        // Check updated student data
        const finalStudentResponse = await axios.get(`${BASE_URL}/instructor/students/${studentId}`, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ Final student verification');
        console.log(`   Student: ${finalStudentResponse.data.data.studentFullName}`);
        console.log(`   Total lessons: ${finalStudentResponse.data.data.lessonsNumber}`);
        console.log(`   Status: ${finalStudentResponse.data.data.studentStatus}`);
        console.log('');

        // Check all lessons count
        const finalLessonsResponse = await axios.get(`${BASE_URL}/instructor/lessons`, {
            headers: { Authorization: `Bearer ${adminInstructorToken}` }
        });
        console.log('✅ Final lessons verification');
        console.log(`   Total lessons in system: ${finalLessonsResponse.data.data.length}`);
        
        const completedLessons = finalLessonsResponse.data.data.filter(lesson => lesson.status === 'completed');
        const scheduledLessons = finalLessonsResponse.data.data.filter(lesson => lesson.status === 'scheduled');
        console.log(`   Completed lessons: ${completedLessons.length}`);
        console.log(`   Scheduled lessons: ${scheduledLessons.length}`);
        console.log('');

        console.log('🎉 All API tests completed successfully!');
        console.log('\n📋 Test Summary:');
        console.log('   ✅ getAllStudents - Retrieved all students');
        console.log('   ✅ addNewStudent - Created new student');
        console.log('   ✅ getStudentProfile - Retrieved student profile');
        console.log('   ✅ updateStudentProfile - Updated student information');
        console.log('   ✅ saveNewLessonDetails - Created new lesson');
        console.log('   ✅ getAllLessons - Retrieved all lessons');
        console.log('   ✅ updateLesson - Updated lesson details');
        console.log('   ✅ generateDiaryForStudent - Generated student diary report');
        console.log('\n📊 Final Statistics:');
        console.log(`   - Students: ${getAllStudentsResponse.data.data.length + 1} (including new one)`);
        console.log(`   - Lessons: ${finalLessonsResponse.data.data.length}`);
        console.log(`   - Completed lessons: ${completedLessons.length}`);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
        console.error('Stack trace:', error.stack);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
        process.exit(0);
    }
}

// Main execution
async function main() {
    try {
        await startServer();
        await testAPI();
    } catch (error) {
        console.error('❌ Main execution failed:', error);
        process.exit(1);
    }
}

// Run the main function
main(); 