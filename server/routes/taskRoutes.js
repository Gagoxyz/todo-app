// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Crear tarea
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status = 'todo' } = req.body;

    if (!title) {
      return res.status(400).json({ msg: 'El título es obligatorio' });
    }
    if (title.length > 100) {
      return res.status(400).json({ msg: 'El título no puede superar los 100 caracteres' });
    }
    if (description && description.length > 1000) {
      return res.status(400).json({ msg: 'La descripción no puede superar los 1000 caracteres' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      user: req.user.id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear tarea' });
  }
});

// ✅ Obtener tareas del usuario
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener tareas' });
  }
});

// ✅ Actualizar tarea
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Tarea no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar tarea' });
  }
});

// ✅ Eliminar tarea
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ msg: 'Tarea no encontrada' });
    res.json({ msg: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar tarea' });
  }
});

module.exports = router;
