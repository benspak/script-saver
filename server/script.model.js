const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: {
    type: [String],
    validate: [arr => arr.length <= 3, 'Max 3 tags allowed']
  },
  description: {
    type: String,
    maxlength: [150, 'Description cannot exceed 150 characters']
  },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Script', scriptSchema);
