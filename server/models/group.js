const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    strName: {type: String, required: true},
    strGrpKey: { type: String, required: true},
    strIdCreator: {type: String, required: true}, // the id of the creator
    strParticipants: {type: Array}, // this should be the array of id's
    strSubjects: {type: Array} //This should be an array with the id of the subjects
});

groupSchema.index({strGrpKey: 1}, { unique: true});

module.exports = mongoose.model('Group', groupSchema);
