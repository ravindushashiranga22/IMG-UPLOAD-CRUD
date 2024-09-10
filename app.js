require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to the database!"))
    .catch(error => console.error("Database connection error:", error));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(session({
    secret: process.env.SESSION_SECRET || "my_secret_key",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Set the template engine
app.set("view engine", "ejs");

// Routes
app.use("/", userRoutes);

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
