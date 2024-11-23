const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { isAuthenticated } = require('../middlewares/middleware');

// Pastikan pengguna terautentikasi sebelum mengakses rute ini
router.use(isAuthenticated);

// Endpoint untuk mendapatkan semua data pasien
router.get('/', (req, res) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('pasien', { pasien: results || [], user: req.user });
    });
});

// Endpoint untuk menambahkan data pasien baru
router.post('/', (req, res) => {
    const { nama, usia, diagnosis } = req.body;

    // Validasi: Hapus referensi ke "keluhan"
    if (!nama || !usia || !diagnosis) {
        return res.status(400).json({ error: 'Field nama, usia, dan diagnosis wajib diisi' }); // Sesuai field yang benar
    }

    // Query untuk menyimpan data
    db.query(
        'INSERT INTO pasien (nama, usia, diagnosis) VALUES (?, ?, ?)',
        [nama, usia, diagnosis],
        (err, results) => {
            if (err) {
                console.error('Error inserting into database:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ id: results.insertId, nama, usia, diagnosis });
        }
    );
});

// Endpoint untuk update data pasien
router.put('/update', (req, res) => {
    const { id, nama, usia, diagnosis } = req.body;

    // Validasi data yang diperlukan
    if (!id || !nama || !usia || !diagnosis) {
        return res.status(400).json({ error: 'Field id, nama, usia, dan diagnosis wajib diisi' });
    }

    // Query untuk mengupdate data pasien
    db.query(
        'UPDATE pasien SET nama = ?, usia = ?, diagnosis = ? WHERE id = ?',
        [nama, usia, diagnosis, id],
        (err, results) => {
            if (err) {
                console.error('Error updating database:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Pasien tidak ditemukan' });
            }

            // Return updated data
            res.status(200).json({ id, nama, usia, diagnosis });
        }
    );
});



// Endpoint untuk menghapus data pasien
router.post('/delete', (req, res) => {
    const { id } = req.body;

    db.query('DELETE FROM pasien WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data pasien tidak ditemukan');
        res.redirect('/pasien');
    });
});

module.exports = router;
