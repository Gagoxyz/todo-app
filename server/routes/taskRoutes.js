// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Crear tarea
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = new Task({
      title,
      description,
      status: status || 'todo',
      user: req.user.id,
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
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
