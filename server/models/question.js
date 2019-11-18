const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    strIdCreator: { type: String, required: true },
    strQuestionDesc: {type: String, required: true },
    strQuestionImg: { type: String },
    strOptions: { type: Array, required: true},
    strCorrect: { type: Number, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
