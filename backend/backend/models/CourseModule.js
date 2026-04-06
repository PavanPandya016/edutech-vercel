const mongoose = require('mongoose');

const courseModuleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  order: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true } });

courseModuleSchema.virtual('materials', {
  ref: 'CourseMaterial',
  localField: '_id',
  foreignField: 'module'
});

courseModuleSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('CourseModule', courseModuleSchema);