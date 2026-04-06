const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  registeredAt: { type: Date, default: Date.now },
  attended: { type: Boolean, default: false }
}, { timestamps: true });

eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);