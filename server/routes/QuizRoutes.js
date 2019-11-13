const express = require('express');

const router = express.Router();

const Quiz = require('../models/quiz');
const Question = require('../models/question');
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

/* Add question to a quiz */
//----------------------------------------------------------
router.post('/addQuestion', checkAuth, function (req, res, next) {
    if(!req.body.strIdQuiz || !req.body.strIdQuestion) {
        return res.status(404).json({
            message: "missing a field"
        });
    }

    let fetchQuestion, fetchQuiz;
    //search for the question
    Question.findOne({
        _id: req.body.strIdQuestion,
        strIdCreator: req.userData.strMatricula
    }).then((result) => {
        fetchQuestion = result;
        //search for the quiz
        Quiz.findOne({
            _id: req.body.strIdQuiz,
            strIdCreator: req.userData.strMatricula
        }).then((result) => {
            fetchQuiz = result;

            if(
                //if the question is part of the group
                fetchQuiz.arrQuestions.includes(fetchQuestion._id)
            ) {
                return res.status(400).json({
                    message: "the question is already part of the quiz"
                });
            } else {
                //update the quiz
                fetchQuiz.arrQuestions.push(fetchQuestion._id);
                Quiz.findByIdAndUpdate(
                    {_id: fetchQuiz._id},
                    fetchQuiz
                ).then((result) => {
                    return res.status(200).json({
                        message: "question added to the quiz"
                    });
                }).catch((error) => {
                   return res.status(500).json({
                       message: error
                   });
                });
            }
        }).catch((error) => {
            return res.status(404).json({
                message: "no quiz was found"
            });
        });

    }).catch((error) => {
        return res.status(404).json({
            message: "no question was found"
        });
    });
});

module.exports = router;
