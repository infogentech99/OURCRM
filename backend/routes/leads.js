const express = require('express');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const router = express.Router();

// POST /api/leads - Create a new lead (Single Lead)
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

// BULK INSERT: POST /api/leads/bulk (Import Multiple Leads)
router.post('/bulk', async (req, res) => {
  try {
    const { leads } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      console.error("❌ ERROR: Invalid leads data received:", JSON.stringify(req.body, null, 2));
      return res.status(400).json({ message: 'Invalid leads data' });
    }

    // Log each lead before inserting
    console.log("✅ Incoming Leads Data:", JSON.stringify(leads, null, 2));

    // Insert leads into MongoDB
    const insertedLeads = await Lead.insertMany(leads);
    
    console.log("✅ Leads inserted successfully:", insertedLeads);
    res.status(201).json({ message: 'Leads imported successfully', insertedLeads });
  } catch (error) {
    console.error("❌ ERROR IMPORTING LEADS:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
