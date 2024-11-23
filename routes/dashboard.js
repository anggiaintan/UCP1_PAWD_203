const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { isAuthenticated } = require('../middlewares/middleware');

router.get('/', isAuthenticated, (req, res) => {
    const doctorQuery = 'SELECT COUNT(*) as count FROM dokter';
    const patientQuery = 'SELECT COUNT(*) as count FROM pasien';

    db.query(doctorQuery, (err, doctorResults) => {
        if (err) throw err;
        db.query(patientQuery, (err, patientResults) => {
            if (err) throw err;
            
            res.render('dashboard', {
                layout: 'layouts/main-layout',
                doctorCount: doctorResults[0].count,
                patientCount: patientResults[0].count,
                username: req.session.username
            });
        });
    });
});

module.exports = router;