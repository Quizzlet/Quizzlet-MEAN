const express = require('express');

const router = express.Router();

const Question = require('../models/question');
const checkAuth = require('../middleware/check-auth');

//----------------------------------------------------------
router.post('/create', checkAuth, function (req, res, next) {
    if(!req.body) {
        return res.static(400).json({
            message: "No body provided"
        });
    }

    let newQuestion = {
        strIdCreator: req.userData.strMatricula,
        strQuestionDesc: req.body.strQuestionDesc,
        strQuestionImg: req.body.strQuestionImg,
        strOptions: req.body.strOptions,
        strCorrect: req.body.strCorrect,
    };

    Question.create(newQuestion).then((result) => {
        return res.status(200).json({
            message: "Your question has been created"
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
    Question.find({strIdCreator:  req.userData.strMatricula}).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            message: 500
        });
    });
});

//----------------------------------------------------------
router.put('/:id', checkAuth, (req, res, next) => {
    if(!req.params.id) {
        return res.status(400).json({
            message: "no id provided"
        });
    }

    if(!req.body) {
        return res.status(400).json({
            message: "no body was provided"
        });
    }

    let updatedQuestion = {
        strQuestionDesc: req.body.strQuestionDesc,
        strQuestionImg: req.body.strQuestionImg,
        strOptions: req.body.strOptions,
        strCorrect: req.body.strCorrect,
    }

    Question.findByIdAndUpdate({id: req.params.id}, updatedQuestion).then((result) => {
        return res.status(200).json({
            message: "question was updated"
        });
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

//----------------------------------------------------------
router.delete('/delete', checkAuth, function (req, res, next) {
    if(!req.body.id) {
        return res.status(400).json({
            message: "no id was provided"
        });
    }

    Question.findByIdAndRemove({_id: req.body.id}).then((result) => {
        if(!result) {
            return res.status(404).json({
                message: "no questiong was found"
            });
        }

        return res.status(200).json({
            message: "question deleted successfully"
        });
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    })
});

module.exports = router;
