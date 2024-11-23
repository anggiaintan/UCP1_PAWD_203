
// routes/pasien.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { tempData } = require('../middlewares/middleware');

// Get all patients (combining array and database)
router.get('/', (req, res) => {
  const query = 'SELECT * FROM pasien';
  db.query(query, (err, dbPatients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Combine database and array data
    const allPatients = [...dbPatients, ...tempData.patients];
    res.render('pasien', { patients: allPatients });
  });
});

// Add patient
router.post('/add', (req, res) => {
  const { nama, usia, diagnosis } = req.body;
  
  // Add to database
  const query = 'INSERT INTO pasien (nama, usia, diagnosis) VALUES (?, ?, ?)';
  db.query(query, [nama, usia, diagnosis], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Also add to array
    tempData.patients.push({
      id: result.insertId,
      nama,
      usia,
      diagnosis
    });
    
    res.redirect('/pasien');
  });
});

// Update patient
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nama, usia, diagnosis } = req.body;
  
  // Update in database
  const query = 'UPDATE pasien SET nama = ?, usia = ?, diagnosis = ? WHERE id = ?';
  db.query(query, [nama, usia, diagnosis, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Update in array
    const patientIndex = tempData.patients.findIndex(pat => pat.id === parseInt(id));
    if (patientIndex !== -1) {
      tempData.patients[patientIndex] = { id: parseInt(id), nama, usia, diagnosis };
    }
    
    res.redirect('/pasien');
  });
});

// Delete patient
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  
  // Delete from database
  const query = 'DELETE FROM pasien WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Delete from array
    tempData.patients = tempData.patients.filter(pat => pat.id !== parseInt(id));
    
    res.redirect('/pasien');
  });
});

module.exports = router;