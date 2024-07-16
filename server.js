const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const files = ['A.txt', 'B.txt', 'C.txt', 'D.txt'];

// Initialize files
files.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '');
  }
});

app.post('/input', (req, res) => {
  const { number } = req.body;
  
  if (number < 1 || number > 25) {
    return res.status(400).send('Number must be between 1 and 25');
  }
  
  const result = number * 7;

  if (result > 140) {
    fs.appendFileSync('A.txt', `${result}\n`);
  } else if (result > 100) {
    fs.appendFileSync('B.txt', `${result}\n`);
  } else if (result > 60) {
    fs.appendFileSync('C.txt', `${result}\n`);
  } else {
    fs.appendFileSync('D.txt', `${result}\n`);
  }

  // Check if all files have numbers
  const allFilesHaveNumbers = files.every(file => fs.readFileSync(file, 'utf-8').trim().length > 0);
  
  if (allFilesHaveNumbers) {
    res.send('Process completed, all files have numbers.');
  } else {
    res.send('Number processed.');
  }
});

app.get('/numbers', (req, res) => {
  const data = files.map(file => {
    return { file, numbers: fs.readFileSync(file, 'utf-8').split('\n').filter(Boolean) };
  });
  res.json(data);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});