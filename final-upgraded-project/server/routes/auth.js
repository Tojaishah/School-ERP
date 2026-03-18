
const express = require('express');
const router = express.Router();

router.post('/login', (req,res)=>{
  res.json({ message: 'Login system coming soon' });
});

module.exports = router;
