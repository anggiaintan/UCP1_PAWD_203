const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { isAuthenticated } = require('../middlewares/middleware');

// Pastikan pengguna terautentikasi sebelum mengakses rute ini
router.use(isAuthenticated);

// Endpoint untuk mendapatkan semua data dokter
router.get('/', (req, res) => {
    db.query('SELECT * FROM dokter', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('dokter', { dokter: results || [], user: req.user });
    });
});

// Endpoint untuk menambahkan data dokter baru
router.post('/', (req, res) => {
    const { nama, spesialisasi, no_telp } = req.body;

    // Validasi input
    if (!nama || !spesialisasi || !no_telp) {
        return res.status(400).json({ error: 'Field nama, spesialisasi, dan no_telp wajib diisi' });
    }

    // Query untuk menyimpan data
    db.query(
        'INSERT INTO dokter (nama, spesialisasi, no_telp) VALUES (?, ?, ?)',
        [nama, spesialisasi, no_telp],
        (err, results) => {
            if (err) {
                console.error('Error inserting into database:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ id: results.insertId, nama, spesialisasi, no_telp });
        }
    );
});

// Endpoint untuk update data dokter
router.put('/update', (req, res) => {
    const { id, nama, spesialisasi, no_telp } = req.body;

    // Validasi data yang diperlukan
    if (!id || !nama || !spesialisasi || !no_telp) {
        return res.status(400).json({ error: 'Field id, nama, spesialisasi, dan no_telp wajib diisi' });
    }

    // Query untuk mengupdate data dokter
    db.query(
        'UPDATE dokter SET nama = ?, spesialisasi = ?, no_telp = ? WHERE id = ?',
        [nama, spesialisasi, no_telp, id],
        (err, results) => {
            if (err) {
                console.error('Error updating database:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Dokter tidak ditemukan' });
            }

            // Return updated data
            res.status(200).json({ id, nama, spesialisasi, no_telp });
        }
    );
});

// Endpoint untuk menghapus data dokter
router.post('/delete', (req, res) => {
    const { id } = req.body;

    db.query('DELETE FROM dokter WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data dokter tidak ditemukan');
        res.redirect('/dokter');
    });
});

module.exports = router;
