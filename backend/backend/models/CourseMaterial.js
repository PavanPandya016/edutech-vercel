const mongoose = require('mongoose');

const courseMaterialSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModule', required: true },
  title: { type: String, required: true, trim: true },
  materialType: { type: String, enum: ['video', 'pdf', 'document', 'link'], required: true },
  file: String,
  externalLink: String,
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true },
  isFree: { type: Boolean, default: false }
}, { timestamps: true });

courseMaterialSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('CourseMaterial', courseMaterialSchema);