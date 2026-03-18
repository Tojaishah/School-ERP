const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  getStats,
} = require('../controllers/leadController');

// Validation middleware
const validateLead = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').trim().notEmpty().withMessage('Phone is required').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('budget').isIn(['5-10L', '10-20L', '20L+']).withMessage('Select a valid budget range'),
  body('timeline').isIn(['Immediate', '1-3 months', 'Exploring']).withMessage('Select a valid timeline'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  },
];

// Public routes
router.post('/', validateLead, createLead);

// Admin routes (add auth middleware before going to production)
router.get('/stats', getStats);
router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.patch('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);

module.exports = router;
