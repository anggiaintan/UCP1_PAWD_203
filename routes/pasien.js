
// pasien.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Render pasien page
router.get('/', (req, res) => {
    const query = 'SELECT * FROM pasien';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).render('error', { 
                layout: 'layouts/auth-layout',
                message: err.message 
            });
            return;
        }
        res.render('pasien', { 
            patients: results,
            user: req.user 
        });
    });
});

// Get all patients
router.get('/list', (req, res) => {
    const query = 'SELECT * FROM pasien';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add patient
router.post('/', (req, res) => {
    const { nama, usia, diagnosis } = req.body;
    const query = 'INSERT INTO pasien (nama, usia, diagnosis) VALUES (?, ?, ?)';
    
    db.query(query, [nama, usia, diagnosis], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: results.insertId,
            message: 'Patient added successfully'
        });
    });
});

// Update patient
router.put('/:id', (req, res) => {
    const { nama, usia, diagnosis } = req.body;
    const query = 'UPDATE pasien SET nama = ?, usia = ?, diagnosis = ? WHERE id = ?';
    
    db.query(query, [nama, usia, diagnosis, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }
        res.json({ message: 'Patient updated successfully' });
    });
});

// Delete patient
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM pasien WHERE id = ?';
    
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }
        res.json({ message: 'Patient deleted successfully' });
    });
});

module.exports = router;