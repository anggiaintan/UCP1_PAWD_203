// routes/dokter.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { tempData, isAuthenticated } = require('../middlewares/middleware');

// Pastikan pengguna terautentikasi sebelum mengakses rute ini
router.use(isAuthenticated);

// Get all doctors (menampilkan semua dokter)
router.get('/', (req, res) => {
  const query = 'SELECT * FROM dokter';
  db.query(query, (err, dbDoctors) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const allDoctors = [...dbDoctors, ...tempData.dokters];
    res.render('dokter', { 
      doctors: allDoctors,
      user: req.user 
    });
  });
});

// Add doctor (menambahkan dokter baru)
router.post('/add', (req, res) => {
  const { nama, spesialisasi, no_telp } = req.body;
  
  const query = 'INSERT INTO dokter (nama, spesialisasi, no_telp) VALUES (?, ?, ?)';
  db.query(query, [nama, spesialisasi, no_telp], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    tempData.dokters.push({
      id: result.insertId,
      nama,
      spesialisasi,
      no_telp
    });
    
    res.redirect('/dokter');
  });
});

// Update doctor (mengubah data dokter berdasarkan ID)
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nama, spesialisasi, no_telp } = req.body;
  
  const query = 'UPDATE dokter SET nama = ?, spesialisasi = ?, no_telp = ? WHERE id = ?';
  db.query(query, [nama, spesialisasi, no_telp, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const doctorIndex = tempData.dokters.findIndex(doc => doc.id === parseInt(id));
    if (doctorIndex !== -1) {
      tempData.dokters[doctorIndex] = { id: parseInt(id), nama, spesialisasi, no_telp };
    }
    
    res.redirect('/dokter');
  });
});

// Delete doctor (menghapus dokter berdasarkan ID)
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM dokter WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    tempData.dokters = tempData.dokters.filter(doc => doc.id !== parseInt(id));
    res.redirect('/dokter');
  });
});

module.exports = router;
