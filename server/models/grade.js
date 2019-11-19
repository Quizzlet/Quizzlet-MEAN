const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema({
    strIdGroup: {type: String, required: true},
    strIdSubject: {type: String, required: true},
    strIdQuiz: {type: String, required: true},
    strIdUser: {type: String, required: true},
    intGrade: {type: String, required: true}
});

module.exports = mongoose.model('Grade', gradeSchema);
