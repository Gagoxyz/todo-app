// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Ruta: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Validaciones básicas
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }
    if (username.length < 5) {
      return res.status(400).json({ msg: 'El usuario debe tener al menos 5 caracteres' });
    }
    if (password.length < 4) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 4 caracteres' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ msg: 'El nombre de usuario ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Ruta: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Generar token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ msg: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});


module.exports = router;
