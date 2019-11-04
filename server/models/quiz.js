const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    strName: {type: String, required: true},
    strIdCreator: {type: String, required: true},
    arrQuestions: {type: Array}
});

module.exports = mongoose.model('Quiz', quizSchema);
