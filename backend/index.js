const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

const Lead = require('./models/Lead');
const User = require('./models/User');
const authenticateToken = require('./middleware/authenticateToken');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes

// 1. Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// 2. Login a user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// 3. Get all leads (Protected)
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Create a new lead with validation (Protected)
app.post(
  '/api/leads',
  authenticateToken,
  [
    body('fullName').notEmpty().withMessage('Full Name is required'),
    body('apolloId').notEmpty().withMessage('Apollo ID is required'),
    body('email').optional().isEmail().withMessage('Provide a valid email'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Creating new lead...');
    try {
      const newLead = new Lead(req.body);
      await newLead.save();
      console.log('Lead created successfully');
      res.status(201).json(newLead);
    } catch (error) {
      console.error('Error creating lead:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

app.use('/api/leads', leadRoutes);

// 5. Update a lead by ID (Protected)
app.put('/api/leads/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const updatedLead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


//5.1 Delete a lead
app.delete('/api/leads/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// 6. Bulk upload leads via CSV (Protected)
app.post('/api/leads/upload', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const leads = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      leads.push({
        fullName: row.FullName || 'N/A',
        email: row.Email || 'N/A',
        status: row.Status || 'New',
        companyName: row.CompanyName || 'N/A',
        jobTitle: row.JobTitle || 'N/A',
      });
    })
    .on('end', async () => {
      try {
        await Lead.insertMany(leads);
        fs.unlinkSync(req.file.path); // Remove uploaded file after processing
        res.status(201).json({ message: 'Leads uploaded successfully', leads });
      } catch (error) {
        res.status(500).json({ message: 'Error uploading leads', error });
      }
    });
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
