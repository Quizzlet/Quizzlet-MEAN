const express = require('express');

const router = express.Router();

const Grade = require('../models/grade');
const Group = require('../models/group');
const Subject = require('../models/subject');
const Quiz = require('../models/quiz');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

//add a user score
//----------------------------------------------------------
router.post('/addGrade', checkAuth, function (req, res, next) {
    if(
        !req.body.strIdGroup ||
        !req.body.strIdSubject ||
        !req.body.strIdQuiz ||
        !req.body.intGrade
    ) {
        return res.status(404).json({
            message: 'missing a field'
        });
    }

    //Find the group
    Group.findOne({
        _id: req.body.strIdGroup
    }).then((resultGroup) => {

        if(
            //check if the subject is part of the group
            !resultGroup.strSubjects.includes(req.body.strIdSubject)
        ) {
            return res.status(400).json({
                message: 'the subject is not part of the group'
            });
        }

        //Find the subject
        Subject.findOne({
            _id: req.body.strIdSubject
        }).then((resultSubject) => {

            if(
                //check if the quiz is part of the group
                !resultSubject.arrQuizzes.includes(req.body.strIdQuiz)
            ) {
                return res.status(400).json({
                    message: 'the quiz is not part of the subject'
                });
            }

            //Find the quiz
            Quiz.findOne({
                _id: req.body.strIdQuiz
            }).then((resultQuiz) => {

                //create the new grade
                let newGrade = {
                    strIdGroup: req.body.strIdGroup,
                    strIdSubject: req.body.strIdSubject,
                    strIdQuiz: req.body.strIdQuiz,
                    strIdUser: req.userData.strMatricula,
                    intGrade: req.body.intGrade
                };

                //find the grade, if if we find one, we update,
                //      if not, we create a new one
                let  oldGrade;
                Grade.findOne({
                    strIdGroup: newGrade.strIdGroup,
                    strIdSubject: newGrade.strIdSubject,
                    strIdQuiz: newGrade.strIdQuiz,
                    strIdUser: newGrade.strIdUser
                }).then((resultGrade) => {
                    oldGrade = resultGrade;
                    if(Number(newGrade.intGrade) >= Number(oldGrade.intGrade)) {
                        Grade.findByIdAndUpdate(
                            {_id: oldGrade._id},
                            newGrade
                        ).then((result) => {
                            console.log('update');
                            TopFive(newGrade, res);
                        });
                    } else {
                        console.log('no update');
                        TopFive(newGrade, res);
                    }
                }).catch((error) => {
                    console.log('insertion')
                    Grade.create(newGrade).then((result) => {
                       TopFive(newGrade, res);
                    });
                });
            }).catch((error) => {
                return res.status(400).json({
                    message: 'no quiz was found'
                });
            });
        }).catch((error) => {
           return res.status(404).json({
               message: 'no subject was found'
           });
        });
    }).catch((error) => {
        return res.status(404).json({
            message: 'no group was found'
        });
    })
});

//Get the top five
//----------------------------------------------------------
function TopFive(
    newGrade,
    res
) {
    let TopFiveResult = [];
    let fetchFiveResult = [];
    //Get the table of the highest tree
    Grade.find({
        strIdGroup: newGrade.strIdGroup,
        strIdSubject: newGrade.strIdSubject,
        strIdQuiz: newGrade.strIdQuiz
    }).sort({intGrade: 'asc'}).limit(5)
        .then((resultFind) => {
            fetchFiveResult = resultFind;
            fetchFiveResult.forEach((doc) => {
                User.findOne({
                    strMatricula: doc.strIdUser
                }).select('strName').then((result) => {
                   TopFiveResult.push({
                       strName: result.strName,
                       intGrade: doc.intGrade
                   });
                   if(TopFiveResult.length  === fetchFiveResult.length) {
                       return res.status(200).json(TopFiveResult);
                   }
                });
            });
        });
}

module.exports = router;
