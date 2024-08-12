const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/satrepuestosweb.db');

// Crear tabla si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS repuestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referencia TEXT,
        descripcion TEXT,
        maquina TEXT,
        grupo TEXT,
        comentario TEXT,
        cant INTEGER
    )`);
});

// Obtener todos los repuestos
router.get('/repuestos', (req, res) => {
    db.all('SELECT * FROM repuestos', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: rows
        });
    });
});

// Buscar repuestos
router.get('/repuestos/:query', (req, res) => {
    const query = req.params.query;
    db.all(`SELECT * FROM repuestos WHERE referencia LIKE ? OR descripcion LIKE ? OR maquina LIKE ? OR grupo LIKE ? OR comentario LIKE ?`, 
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: rows
        });
    });
});

// Añadir un nuevo repuesto
router.post('/repuestos', (req, res) => {
    const { referencia, descripcion, maquina, grupo, comentario, cant } = req.body;
    db.run(`INSERT INTO repuestos (referencia, descripcion, maquina, grupo, comentario, cant) VALUES (?, ?, ?, ?, ?, ?)`,
        [referencia, descripcion, maquina, grupo, comentario, cant], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: { id: this.lastID }
        });
    });
});

// Editar un repuesto
router.put('/repuestos/:id', (req, res) => {
    const { referencia, descripcion, maquina, grupo, comentario, cant } = req.body;
    const id = req.params.id;
    db.run(`UPDATE repuestos SET referencia = ?, descripcion = ?, maquina = ?, grupo = ?, comentario = ?, cant = ? WHERE id = ?`,
        [referencia, descripcion, maquina, grupo, comentario, cant, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: { changes: this.changes }
        });
    });
});

// Borrar un repuesto
router.delete('/repuestos/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM repuestos WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: { changes: this.changes }
        });
    });
});

module.exports = router;
