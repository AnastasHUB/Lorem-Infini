const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const dict = JSON.parse(fs.readFileSync('./lorem-dict.json'));
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

function generateLorem(wordsCount = 50) {
  let output = [];
  for (let i = 0; i < wordsCount; i++) {
    const word = dict[Math.floor(Math.random() * dict.length)];
    output.push(word);
  }
  return output.join(' ') + '.';
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/lorem', (req, res) => {
  const count = parseInt(req.query.count) || 5;
  const paragraphs = Array.from({ length: count }, () => generateLorem(50));
  res.json({ paragraphs });
});

app.listen(PORT, () => console.log(`✅ Server started at http://localhost:${PORT}`));