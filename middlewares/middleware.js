const jwt = require('jsonwebtoken');

const tempData = {
  users: [], // Tambah array users untuk menyimpan data user sementara
  doctors: [],
  patients: []
};
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.redirect('/login');
    }
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = decoded;
      next();
    } catch (err) {
      res.clearCookie('token');
      return res.redirect('/login');
    }
  };
  

module.exports = {
  tempData,
  isAuthenticated
};