const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    strName: { type: String, required: true },
    strMatricula:  { type: String, required: true },
    strEmail:  { type: String, required: true },
    strPassword: { type: String, required: true}
});

userSchema.index({ strMatricula: 1 }, { unique: true});

module.exports = mongoose.model('User', userSchema);
