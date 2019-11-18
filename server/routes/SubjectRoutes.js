const express = require('express');

const router = express.Router();

const Subject = require('../models/subject');
const Quiz = require('../models/quiz');
const Group = require('../models/group');
const checkAuth = require('../middleware/check-auth');

//----------------------------------------------------------
router.post('/create', checkAuth, function (req, res, next) {
    if(!req.body.strName) {
        return res.status(400).json({
            message: "no name provided"
        });
    }

    let newSubject = {
        strIdCreator: req.userData.strMatricula,
        strName: req.body.strName
    };

    Subject.create(newSubject).then((result) =>{
        return res.status(200).json({
            message: "your subject was created successfully"
        })
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

//get user's created subjects
//----------------------------------------------------------
router.get('', checkAuth, function (req, res, next) {
    Subject.find({strIdCreator: req.userData.strMatricula}).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

//get details of a certain subject
//----------------------------------------------------------
router.get('/:id', checkAuth, function (req, res, next) {
   if(!req.params.id) {
       return res.status(400).json({
           message: "no subject was provided"
       });
   }

   //to store the data that we are going to send back
   let resultSubject;
   Subject.findOne({
       _id: req.params.id,
   }).then((result) => {
       //to store the fetch subject
       let fetchSubject = result;
       //enter the info
       resultSubject = {
           _id: result._id,
           strName: result.strName,
           arrQuizzes: []
       };

       //iterate of the fetch subjects to see details of the quizzes
       fetchSubject.arrQuizzes.forEach((doc, index) => {
           Quiz.findOne({_id: doc}).select('strName').then((result) => {
               resultSubject.arrQuizzes.push(result);
               if(index + 1 === fetchSubject.arrQuizzes.length) {
                   return res.status(200).json(resultSubject);
               }
           });
       });
   }).catch((error) => {
       return res.status(404).json({
           message: "no subject was found"
       });
   })
});

//Add a quiz to a subject
//----------------------------------------------------------
router.post('/addQuiz', checkAuth, function(req, res, next) {
    if(!req.body.strIdSubject || !req.body.strIdQuiz) {
        return res.status(404).json({
            message: "missing a field"
        });
    }

    let fetchQuiz, fetchSubject;
    //Search for the quiz
    Quiz.findOne({
        _id: req.body.strIdQuiz,
        strIdCreator: req.userData.strMatricula
    }).then((result) => {
        fetchQuiz = result;
        //search for the Subject
        Subject.findOne({
            _id: req.body.strIdSubject,
            strIdCreator: req.userData.strMatricula
        }).then((result) => {
            fetchSubject = result;
            if(
                fetchSubject.arrQuizzes.includes(fetchQuiz._id)
            ) {
                return res.status(400).json({
                    message: "the quiz is already part of the subject"
                });
            } else {
                //update the subject
                fetchSubject.arrQuizzes.push(fetchQuiz._id);
                Subject.findByIdAndUpdate(
                    {_id: fetchSubject._id},
                    fetchSubject
                ).then((result) => {
                    return res.status(200).json({
                        message: "quiz was added to the subject"
                    });
                }).catch((error) => {
                    return res.status(500).json({
                        message: error
                    });
                })
            }
        }).catch((error) => {
            return res.status(404).json({
                message: "no subject found"
            });
        })
    }).catch((error) => {
        return res.status(404).json({
            message: "no quiz was found"
        });
    });
});

/* Remove a quiz from a subject */
//----------------------------------------------------------
router.post('/removeQuiz', checkAuth, (req, res, next) => {
    if(!req.body.strIdSubject || !req.body.strIdQuiz) {
        return res.status(404).json({
            message: "missing a field"
        });
    }

    let fetchQuiz, fetchSubject;
    //search for the quiz
    Quiz.findOneAndDelete({
        _id: req.body.strIdQuiz,
        strIdCreator: req.userData.strMatricula
    }).then((result) => {
        fetchQuiz = result;
        //search for the subject
        Subject.findOne({
            _id: req.body.strIdSubject,
            strIdCreator: req.userData.strMatricula
        }).then((result) => {
            fetchSubject = result;
            if(
                //if the quiz is not part of the question
                !fetchSubject.arrQuizzes.includes(fetchQuiz._id)
            ) {
                return res.status(400).json({
                    message: "the quiz is not part of the subject"
                });
            } else {
                //update the subject
                let index = fetchSubject.arrQuizzes.indexOf(fetchQuiz._id);
                fetchSubject.arrQuizzes.splice(index, 1);
                Subject.findByIdAndUpdate(
                    {_id: fetchQuiz._id},
                    fetchSubject
                ).then((result) => {
                    return res.status(200).json({
                        message: "quiz remove from subject"
                    });
                }).catch((eror) => {
                    return res.status(500).json({
                        message: error
                    });
                })
            }
        })
    }).catch((error) => {
        return res.status(404).json({
            message: "no quiz was found"
        });
    })
});

//----------------------------------------------------------
router.delete('/delete', checkAuth, function (req, res, next) {

    if(!req.body.id) {
        return res.status(400).json({
            message: "no id was provided"
        });
    }

    //Variables to save our fetch data
    let fetchSubject;
    let fetchGroups = [];
    //find the subject and delete it
    Subject.findByIdAndRemove({_id: req.body.id}).then((result) => {
        if(!result) {
            return res.status(404).json({
                message: "no subject found"
            });
        }

        fetchSubject = result;

        //fetch all the groups that include the subject
        Group.find({strSubjects: { $all: [fetchSubject._id]}}).then((result) => {
            fetchGroups = result;
            fetchSubject.forEach((doc) => {
                //delete the subject from the group and update it
                let index = doc.strSubjects.indexOf(fetchSubject._id);
                doc.strSubjects.splice(index, 1);
                Group.findByIdAndUpdate({_id: doc._id}, doc).then({
                }).catch((error) => {
                    return res.status(500).json({
                        message: error
                    });
                });
            });

            return res.status(200).json({
                message: "subject deleted successfully"
            });
        }).catch((error) => {
            return res.status(500).json({
                message: error
            });
        });
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });

});

module.exports = router;
