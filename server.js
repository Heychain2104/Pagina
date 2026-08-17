const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('SecuroNova OAuth backend online.');
});

app.get('/auth/discord/callback', (req, res) => {

    const code = req.query.code;

    if (!code) {
        return res.status(400).send(
            '❌ No se recibió ningún código de Discord.'
        );
    }

    console.log('🔐 Código OAuth recibido correctamente.');

    res.send(
        '✅ Autorización de Discord recibida. Puedes cerrar esta ventana.'
    );
});

module.exports = app;
