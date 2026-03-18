const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City name too long'],
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
      enum: {
        values: ['5-10L', '10-20L', '20L+'],
        message: 'Budget must be one of: 5-10L, 10-20L, 20L+',
      },
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
      enum: {
        values: ['Immediate', '1-3 months', 'Exploring'],
        message: 'Timeline must be one of: Immediate, 1-3 months, Exploring',
      },
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
    },
    source: {
      type: String,
      default: 'website',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    assignedBrands: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
leadSchema.index({ city: 1, status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);
