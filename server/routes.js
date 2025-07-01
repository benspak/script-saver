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

// Search scripts by content, title, description, or tags
router.get('/scripts/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json([]);
  let regex;
  try {
    regex = new RegExp(q, 'i');
  } catch (err) {
    // If regex construction fails, return empty array
    return res.json([]);
  }
  try {
    const scripts = await Script.find({
      $or: [
        { title: regex },
        { description: regex },
        { content: regex },
        { tags: { $elemMatch: { $regex: regex } } },
      ],
    });
    res.json(scripts);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;
