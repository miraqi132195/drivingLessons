const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/users');
const Student = require('./models/students');
const Instructor = require('./models/instructors');
const DrivingSchool = require('./models/drivingSchool');
const Lesson = require('./models/lessonDiary');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: './tempUploads/'
}));
app.use(cors({ credentials: true, origin: true, maxAge: 86400 }));

// Routes
app.use('/api/instructor', require('./routes/instructorRoute'));
app.use('/api/schoolAdmin', require('./routes/admin-InstructorRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/admin', require('./routes/adminRoute'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Seed super admin function
// const seedSuperAdmin = async () => {
//   try {
//     console.log('🌱 Starting to seed super admin user...');
//
//     // Check if super admin already exists
//     const existingSuperAdmin = await User.findOne({ role: 'superAdmin' });
//     // if (existingSuperAdmin) {
//     //   console.log('✅ Super admin already exists');
//     //   return existingSuperAdmin;
//     // }
//
//     // Create super admin user with plain password (let pre-save hook hash it)
//     const superAdmin = await User.create({
//       firstName: 'Super',
//       lastName: 'Admin',
//       phoneNumber: '050000112',
//       password: 'superadmin123', // Plain password - will be hashed by pre-save hook
//       role: 'superAdmin',
//       dateOfBirth: '1995-02-13',
//       paymentId: 'SUPER_ADMIN_2024'
//     });
//
//     console.log('✅ Super admin user created successfully');
//     console.log('Super Admin Details:');
//     console.log(`Name: ${superAdmin.firstName} ${superAdmin.lastName}`);
//     console.log(`Phone: ${superAdmin.phoneNumber}`);
//     console.log(`Role: ${superAdmin.role}`);
//     console.log(`ID: ${superAdmin._id}`);
//
//     return superAdmin;
//
//   } catch (error) {
//     console.error('❌ Error seeding super admin user:', error);
//     throw error;
//   }
// };

// Seed sample data function
const seedSampleData = async () => {
  try {
    console.log('🌱 Starting to seed sample data...');

    // Create a sample driving school
    console.log('Creating sample driving school...');
    const sampleSchool = await DrivingSchool.create({
      schoolName: 'Sample Driving School',
      schoolAddress: '123 Sample Street, Sample City',
      instructorNumber: 0,
      studentsNumber: 0,
      carsNumber: 0,
      userId: null, // Will be set when admin-instructor is created
      active: true
    });
    console.log(`✅ Created sample school: ${sampleSchool.schoolName} (${sampleSchool._id})`);

    // Create a sample admin-instructor
    console.log('Creating sample admin-instructor...');
    const adminInstructor = await User.create({
      firstName: 'John',
      lastName: 'Admin',
      phoneNumber: '+1234567891',
      password: 'admin123',
      role: 'admin-instructor',
      dateOfBirth: '1985-01-01',
      paymentId: 'ADMIN_2024'
    });

    const instructorProfile = await Instructor.create({
      userId: adminInstructor._id,
      schoolId: sampleSchool._id,
      drivingLicense: 'DL123456',
      active: true,
      isTester: true,
      salary: '5000',
      seniority: '5 years'
    });

    // Update school with admin-instructor
    sampleSchool.userId = adminInstructor._id;
    sampleSchool.instructorNumber = 1;
    await sampleSchool.save();

    console.log(`✅ Created sample admin-instructor: ${adminInstructor.firstName} ${adminInstructor.lastName}`);

    // Create a sample student
    console.log('Creating sample student...');
    const sampleStudent = await Student.create({
      studentFullName: 'Alice Johnson',
      phoneNumber: '+1234567892',
      lessonsNumber: 0,
      studentStatus: 'active',
      schoolId: sampleSchool._id
    });
    console.log(`✅ Created sample student: ${sampleStudent.studentFullName}`);

    // Create a sample lesson
    console.log('Creating sample lesson...');
    const sampleLesson = await Lesson.create({
      startTime: new Date('2024-01-15T10:00:00Z'),
      endTime: new Date('2024-01-15T11:00:00Z'),
      status: 'completed',
      noteForTheLesson: 'Sample lesson - student showed good progress',
      studentId: sampleStudent._id,
      instructorId: instructorProfile._id,
      schoolId: sampleSchool._id,
      route: ['Home', 'Main Street', 'Highway'],
      city: 'Sample City'
    });

    // Update student lesson count
    sampleStudent.lessonsNumber = 1;
    await sampleStudent.save();

    console.log(`✅ Created sample lesson for ${sampleStudent.studentFullName}`);

    console.log('\n🌱 Sample data seeded successfully!\n');
    
    console.log('Sample Data Summary:');
    console.log(`- School: ${sampleSchool.schoolName} (${sampleSchool._id})`);
    console.log(`- Admin-Instructor: ${adminInstructor.firstName} ${adminInstructor.lastName} (${adminInstructor._id})`);
    console.log(`- Student: ${sampleStudent.studentFullName} (${sampleStudent._id})`);
    console.log(`- Lesson: ${sampleLesson._id}`);

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/driving-lessons-diary';

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🟢 Connected to MongoDB');

        // Seed super admin (uncomment to seed)
        // await seedSuperAdmin();

        // Seed sample data (uncomment to seed)
        // await seedSampleData();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('❌ Server startup failed:', err.message);
        process.exit(1);
    }
};

module.exports = app; // Export for testing
startServer();