
const errorMessages  = {
    studentDoesntExists: "תלמיד לא קיים!",
    getAllStudentsError: "הזמנה חדשה",
    errorUpdatingStudent: 'שגיאה בזמן עדכון',
    Unauthorized: 'משתמש לא מורשה',
}
const successMessages  = {
    studentAdded: "תלמיד נוסף בהצלחה!",
    studentAddedUpdated: "הזמנה חדשה",
    Done: 'בוצעה',
    Disable: 'מבוטלת',
}

module.exports = {
    errorMessages: {...errorMessages},
    successMessages: {...successMessages},
};
