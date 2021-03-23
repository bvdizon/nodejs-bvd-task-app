const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  console.log('Home');
  res.send('Home!');
});

router.get('/hello', (req, res) => {
  res.send('Hello there!');
});

module.exports = router;
