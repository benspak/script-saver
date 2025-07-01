const express = require('express');
const Script = require('./script.model');
const router = express.Router();

// Get all scripts (summary)
router.get('/scripts', async (req, res) => {
  try {
    const scripts = await Script.find({}, 'title tags description');
    res.json(scripts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get script details
router.get('/scripts/:id', async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);
    if (!script) return res.status(404).json({ error: 'Not found' });
    res.json(script);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create script
router.post('/scripts', async (req, res) => {
  try {
    const script = new Script(req.body);
    await script.save();
    res.status(201).json(script);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update script
router.put('/scripts/:id', async (req, res) => {
  try {
    const script = await Script.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!script) return res.status(404).json({ error: 'Not found' });
    res.json(script);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete script
router.delete('/scripts/:id', async (req, res) => {
  try {
    const script = await Script.findByIdAndDelete(req.params.id);
    if (!script) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
