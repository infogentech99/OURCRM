const express = require('express');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const router = express.Router();

// POST /api/leads - Create a new lead
router.post(
  '/',
  [
    body('apolloId').notEmpty().withMessage('Apollo ID is required'),
    body('fullName').notEmpty().withMessage('Full Name is required'),
    body('email').optional().isEmail().withMessage('Provide a valid email'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newLead = new Lead(req.body);
      await newLead.save();
      res.status(201).json(newLead);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
