const Student = require('../models/students');
const Instructor = require('../models/instructors');
const errorMessages = require('../types/errors').errorMessages
const successMessages = require('../types/errors').successMessages

const DrivingSchool = require('../models/DrivingSchool');
const User = require('../models/users');

exports.addNewDrivingSchool = async (req, res) => {
    const { schoolName, schoolAddress, adminFirstName, adminLastName, adminPhoneNumber, adminPassword, drivingLicense } = req.body;

    try {
        // Check if the school already exists
        const existingSchool = await DrivingSchool.findOne({ schoolName });
        if (existingSchool) {
            return res.status(400).json({ message: 'Driving school already exists' });
        }

        // Create the admin user
        const adminUser = new User({
            firstName: adminFirstName,
            lastName: adminLastName,
            phoneNumber: adminPhoneNumber,
            role: 'admin-instructor',  // Admin for this school
            password: adminPassword
        });

        // Hash the admin password before saving
        await adminUser.save();

        // Create the driving school and link to the admin user
        const newSchool = new DrivingSchool({
            schoolName,
            schoolAddress,
            userId: adminUser._id  // Admin user for this school
        });

        // Save the driving school
        await newSchool.save();

        // Create the instructor linked to the new school
        const newInstructor = new Instructor({
            userId: adminUser._id,  // Linking the user as instructor
            schoolId: newSchool._id,
            drivingLicense
        });

        // Save the instructor
        await newInstructor.save();

        // Update the driving school to reflect the number of instructors
        newSchool.instructorNumber += 1;
        await newSchool.save();

        // Return success response
        res.status(201).json({
            message: 'Driving school and admin-instructor created successfully',
            drivingSchool: newSchool,
            adminInstructor: newInstructor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateDrivingSchoolInfo = async (req, res) => {
};

exports.addNewAdminInstructor = async (req, res) => {
    const { schoolId, adminFirstName, adminLastName, adminPhoneNumber, adminPassword, drivingLicense } = req.body;

    try {
        // Check if the school exists
        const existingSchool = await DrivingSchool.findById(schoolId);
        if (!existingSchool) {
            return res.status(400).json({ message: 'Driving school not found' });
        }

        // Check if the admin already exists for the school
        const existingAdmin = await User.findOne({ phoneNumber: adminPhoneNumber });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this phone number already exists' });
        }

        // Create the admin user
        const adminUser = new User({
            firstName: adminFirstName,
            lastName: adminLastName,
            phoneNumber: adminPhoneNumber,
            role: ['admin-instructor'],  // Admin for this school
            password: adminPassword
        });

        // Hash the admin password before saving
        await adminUser.save();

        // Create the instructor linked to the existing school
        const newInstructor = new Instructor({
            userId: adminUser._id,  // Linking the user as instructor
            schoolId: existingSchool._id,
            drivingLicense
        });

        // Save the instructor
        await newInstructor.save();

        // Update the driving school to reflect the number of instructors
        existingSchool.instructorNumber += 1;
        await existingSchool.save();

        // Return success response
        res.status(201).json({
            message: 'New admin-instructor added to the driving school successfully',
            drivingSchool: existingSchool,
            adminInstructor: newInstructor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAdminInstructor = async (req, res) => {

};
exports.getDrivingSchoolInfo  = async (req, res) => {
    const { schoolId } = req.params;

    try {
        // Find the driving school by schoolId
        const school = await DrivingSchool.findById(schoolId)
            .populate('userId', 'firstName lastName phoneNumber role')  // Populate admin info (user)
            .populate({
                path: 'instructors',
                select: 'userId drivingLicense',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName phoneNumber role'  // Populate instructor's user info
                }
            });

        // If the school doesn't exist, return an error
        if (!school) {
            return res.status(404).json({ message: 'Driving school not found' });
        }

        // Return the school, admin, and instructors information
        res.status(200).json({
            schoolInfo: school,
            adminInfo: school.userId,
            instructors: school.instructors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
