const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const Script = require('./script.model');

const MONGO_URI = `${process.env.MONGO_URI}`;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    importCSV();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

function importCSV() {
  const results = [];
  fs.createReadStream(path.join(__dirname, '../customer-scripts.csv'))
    .pipe(csv())
    .on('data', (data) => {
      // Map columns: first column is title, second is content
      const title = data[Object.keys(data)[0]];
      const content = data[Object.keys(data)[1]];
      if (title && content) {
        results.push({
          title,
          content,
          tags: [],
          description: content.slice(0, 150)
        });
      }
    })
    .on('end', async () => {
      try {
        await Script.insertMany(results);
        console.log('Import complete:', results.length, 'scripts added.');
      } catch (err) {
        console.error('Error importing scripts:', err);
      } finally {
        mongoose.disconnect();
      }
    });
} 