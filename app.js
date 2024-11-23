const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const dokterRoutes = require('./routes/dokter');
const pasienRoutes = require('./routes/pasien');
const { isAuthenticated } = require('./middlewares/middleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

// Routes
// Redirect ke login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Login page (tanpa authentication)
app.get('/login', (req, res) => {
    res.render('login', { 
        layout: 'layouts/auth-layout',
        error: null
    });
});

// Register page (tanpa authentication)
app.get('/signup', (req, res) => {
    res.render('signup', { 
        layout: 'layouts/auth-layout',
        error: null 
    });
});

// Dashboard (perlu authentication)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { 
        user: req.user,
        error: null
    });
});

// Routes yang membutuhkan authentication
app.use('/auth', authRoutes);
app.use('/dokter', isAuthenticated, dokterRoutes);
app.use('/pasien', isAuthenticated, pasienRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
        return res.redirect('/login');
    }
    res.status(err.status || 500);
    res.render('error', {
        layout: 'layouts/auth-layout',
        message: err.message || 'Internal Server Error',
        error: req.app.get('env') === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;