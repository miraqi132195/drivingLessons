const errorMessages = {
    studentDoesntExists: "Student not found!",
    getAllStudentsError: "Error retrieving students",
    errorUpdatingStudent: 'Error updating student',
    Unauthorized: 'User not authorized',
    lessonNotFound: 'Lesson not found',
    lessonSaveError: 'Error saving lesson',
    lessonUpdateError: 'Error updating lesson',
    reportGenerationError: 'Error generating report',
    exportError: 'Error exporting data',
    instructorNotFound: 'Instructor not found',
    studentAlreadyExists: 'Student with this phone number already exists',
    missingRequiredFields: 'Missing required fields'
};

const successMessages = {
    studentAdded: "Student added successfully!",
    studentAddedUpdated: "Student updated successfully",
    lessonSaved: 'Lesson saved successfully',
    lessonUpdated: 'Lesson updated successfully',
    reportGenerated: 'Report generated successfully',
    dataExported: 'Data exported successfully',
    studentsRetrieved: 'Students retrieved successfully',
    studentProfileRetrieved: 'Student profile retrieved successfully'
};

module.exports = {
    errorMessages: {...errorMessages},
    successMessages: {...successMessages},
};
