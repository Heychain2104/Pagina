// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const db = new sqlite3.Database('./db.sqlite');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    avatar TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    avatar TEXT,
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Rutas de registro
app.post('/register', (req, res) => {
  const { username, password, avatar } = req.body;
  if (!username || !password || !avatar) return res.json({ success: false, msg: 'Completa todos los campos' });

  // Verificar si usuario existe
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (row) return res.json({ success: false, msg: 'Usuario ya existe' });

    const hash = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)', [username, hash, avatar], function(err) {
      if (err) return res.json({ success: false, msg: 'Error al registrar' });
      res.json({ success: true });
    });
  });
});

// Rutas de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) return res.json({ success: false, msg: 'Usuario no encontrado' });

    if (bcrypt.compareSync(password, user.password)) {
      res.json({ success: true, user: { username: user.username, avatar: user.avatar } });
    } else {
      res.json({ success: false, msg: 'Contraseña incorrecta' });
    }
  });
});

// Socket.io para mensajes
io.on('connection', socket => {
  // Enviar mensajes previos al nuevo usuario
  db.all('SELECT * FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
    socket.emit('load messages', rows);
  });

  socket.on('send message', data => {
    const { username, avatar, text } = data;
    db.run('INSERT INTO messages (username, avatar, text) VALUES (?, ?, ?)', [username, avatar, text], function() {
      io.emit('new message', { username, avatar, text });
    });
  });
});

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
