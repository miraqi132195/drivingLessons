
const roles = {
    user : '1',
    company : '2'
}
ADMIN = 'admin@Test.com'
const valid =['שבת','שישי','חמישי','רביעי','שלישי','שני','ראשון']

const OrderStatuses = {
    Approved: "בהכנה",
    New: "הזמנה חדשה",
    Done: 'בוצעה',
    Disable: 'מבוטלת',
}
module.exports = {
    validDays: valid,
    ADMIN,
    OrderStatuses: {...OrderStatuses},
};
