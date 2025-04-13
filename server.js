const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cors = require('cors')

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use(cors({credentials: true, origin: true , maxAge: 86400 }))
// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/instructor',require('./routes/instructorRoute') );
app.use('/api/schoolAdmin', require('./routes/admin-InstructorRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/admin', require('./routes/adminRoute'));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
