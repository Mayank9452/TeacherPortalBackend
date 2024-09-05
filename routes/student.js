const express = require('express');
const Student = require('../models/Student');
const passport = require('passport');
const router = express.Router();

// Get all students for the logged-in teacher
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const students = await Student.find({ teacher: req.user.id });
    res.json(students);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add or update student
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { name, subject, marks } = req.body;
  try {
    let student = await Student.findOne({ name, subject, teacher: req.user.id });
    if (student) {
      student.marks += marks;
      await student.save();
    } else {
      student = new Student({ name, subject, marks, teacher: req.user.id });
      await student.save();
    }
    res.json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update student details
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { name, subject, marks } = req.body;
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    student.name = name;
    student.subject = subject;
    student.marks = marks;
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete student
// Debugging middleware
// server/routes/studentRoutes.js
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Find and delete the student by ID
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});



module.exports = router;
