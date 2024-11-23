// dokter.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Render dokter page
router.get('/', (req, res) => {
    const query = 'SELECT * FROM dokter';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).render('error', { 
                layout: 'layouts/auth-layout',
                message: err.message 
            });
            return;
        }
        res.render('dokter', { 
            doctors: results,
            user: req.user // Assuming `req.user` exists for the logged-in user
        });
    });
});

// Get all doctors
router.get('/list', (req, res) => {
    const query = 'SELECT * FROM dokter';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results); // Returning doctors in JSON format
    });
});

// Add doctor
router.post('/', (req, res) => {
    const { nama, spesialisasi, no_telp } = req.body;
    const query = 'INSERT INTO dokter (nama, spesialisasi, no_telp) VALUES (?, ?, ?)';
    
    db.query(query, [nama, spesialisasi, no_telp], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: results.insertId,
            message: 'Doctor added successfully'
        });
    });
});

// Update doctor
router.put('/:id', (req, res) => {
    const { nama, spesialisasi, no_telp } = req.body;
    const query = 'UPDATE dokter SET nama = ?, spesialisasi = ?, no_telp = ? WHERE id = ?';
    
    db.query(query, [nama, spesialisasi, no_telp, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json({ message: 'Doctor updated successfully' });
    });
});

// Delete doctor
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM dokter WHERE id = ?';
    
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        res.json({ message: 'Doctor deleted successfully' });
    });
});


module.exports = router;
