const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let teacher = await Teacher.findOne({ username });
    if (teacher) return res.status(400).json({ msg: 'Teacher already exists' });

    teacher = new Teacher({ username, password: await bcrypt.hash(password, 10) });
    await teacher.save();
    res.status(201).json({ msg: 'Teacher registered' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let teacher = await Teacher.findOne({ username });
    if (!teacher) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: teacher.id };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
