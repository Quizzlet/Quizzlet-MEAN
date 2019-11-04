const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    strIdCreator: { type: String, required: true},
    strName: { type: String, required: true },
    arrQuizzes: { type: Array },
});

module.exports = mongoose.model('Subject', subjectSchema);
