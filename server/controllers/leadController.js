const Lead = require('../models/Lead');
const { sendAdminNotification } = require('../utils/emailService');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const { name, phone, city, budget, timeline } = req.body;

    // Check for duplicate phone number
    const existing = await Lead.findOne({ phone });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An enquiry with this phone number already exists. Our team will contact you soon.',
      });
    }

    const lead = await Lead.create({ name, phone, city, budget, timeline });

    // Send admin email notification (non-blocking)
    try {
      await sendAdminNotification(lead);
    } catch (emailErr) {
      console.warn('⚠️  Email notification failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will contact you within 24 hours.',
      data: {
        id: lead._id,
        name: lead.name,
        city: lead.city,
        createdAt: lead.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error('createLead error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// @desc    Get all leads (admin)
// @route   GET /api/leads
// @access  Private (add auth middleware in production)
const getAllLeads = async (req, res) => {
  try {
    const { status, city, budget, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, 'i');
    if (budget) filter.budget = budget;

    const skip = (page - 1) * limit;
    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: leads,
    });
  } catch (error) {
    console.error('getAllLeads error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private
const updateLeadStatus = async (req, res) => {
  try {
    const { status, notes, assignedBrands } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, notes, assignedBrands },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, message: 'Lead updated.', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/leads/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const byStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byBudget = await Lead.aggregate([
      { $group: { _id: '$budget', count: { $sum: 1 } } },
    ]);
    const byCity = await Lead.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Lead.countDocuments({ createdAt: { $gte: today } });

    res.json({
      success: true,
      data: { total, todayCount, byStatus, byBudget, byCity },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createLead, getAllLeads, getLeadById, updateLeadStatus, deleteLead, getStats };
