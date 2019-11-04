const express = require('express');

const router = express.Router();

const Quiz = require('../models/quiz');
const checkAuth = require('../middleware/check-auth');

//----------------------------------------------------------
router.post('/create', checkAuth, function (req, res, next) {
    if(!req.body.strName) {
        return res.status(400).json({
            message: "No name provided"
        });
    }

    let newQuiz = {
        strName: req.body.strName,
        strIdCreator: req.userData.strMatricula
    };

    Quiz.create(newQuiz).then((result) => {
        return res.status(200).json({
            message: "Your quiz has been created"
        });
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

//get all user's created quizzes
//----------------------------------------------------------
router.get('', checkAuth, function (req, res, next) {
    Quiz.find({strIdCreator: req.userData.strMatricula}).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

//----------------------------------------------------------
router.delete('/delete', checkAuth, function(req, res, next) {
    if(!req.body.id) {
        return res.status(400).json({
            message: "no id was provided"
        });
    }

    Quiz.findByIdAndRemove({_id: req.body.id}).then((result) => {
       if(!result) {
           return res.status(404).json({
               message: "no quiz found"
           });
       }

       return res.status(200).json({
           message: "quiz deleted successfully"
       });
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

module.exports = router;
