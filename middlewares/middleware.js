const jwt = require('jsonwebtoken');

// Temporary storage for data (can be replaced by database in the future)
const tempData = {
  users: [], // Temporary array to store users
  doctors: [], // Temporary array to store doctors
  patients: [] // Temporary array to store patients
};

// Middleware to verify if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookies
  console.log('Received Token:', token);

  if (!token) {
    console.log('Token not found. Redirecting to login.');
    return res.redirect('/login'); // Redirect to login if token is missing
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret key
    req.user = decoded; // Attach user information from token to request object
    console.log('Token verified successfully:', decoded);
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);

    // Clear the invalid token cookie
    res.clearCookie('token', { httpOnly: true, secure: true });
    console.log('Invalid token cleared. Redirecting to login.');
    return res.redirect('/login'); // Redirect to login on invalid token
  }
};

module.exports = {
  tempData,
  isAuthenticated
};
