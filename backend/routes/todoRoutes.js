const express = require('express');
const router = express.Router();
const { summarizeTodos, sendToSlack } = require('../services/openai');

let todos = [];
let id = 1;

router.get('/', (req, res) => res.json(todos));

router.post('/', (req, res) => {
  const { task } = req.body;
  todos.push({ id: id++, task });
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== todoId);
  res.json({ success: true });
});

router.post('/summarize', async (req, res) => {
  try {
    const summary = await summarizeTodos(todos);
    await sendToSlack(summary);
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
