const express = require('express');

const router = express.Router();

const Group = require('../models/group');
const Subject = require('../models/subject');
const Grade = require('../models/grade');
const checkAuth = require('../middleware/check-auth');

//get user's created groups
//----------------------------------------------------------
router.get('', checkAuth, function (req, res, next) {

    Group.find({strIdCreator: req.userData.strMatricula}).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            error: error
        });
    });
});

//get groups Im part of
//----------------------------------------------------------
router.get('/Mine', checkAuth, function (req, res, next) {
    Group.find({
        strParticipants: {
            $all: [req.userData.strMatricula]
        },
        strIdCreator: { $ne: req.userData.strMatricula}
    }).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            message: "you cannot be part of a group you created"
        });
    })
});

//get details of a certain group
//----------------------------------------------------------
router.get('/:id', checkAuth, function (req, res, next) {
    if(!req.params.id) {
        return res.status(400).json({
            message: "no group was provided"
        });
    }

    //to store the data that we are going to send back
    let resultGroup;
    Group.findOne({
        _id: req.params.id
    }).then((result) => {
        // to store the fetch group
        let fetchGroup = result;
        //enter the info
        resultGroup = {
            _id: result._id,
            strName: result.strName,
            strSubjects: []
        };

        let fetchSubject;
        //itarate of the fetch group to see details of subjects
        fetchGroup.strSubjects.forEach((doc, index) => {
            Subject.findOne({_id: doc}).select('strName arrQuizzes').then((result) => {
                fetchSubject = result;
                Grade.find({
                    strIdGroup: fetchGroup._id,
                    strIdSubject: fetchSubject._id,
                    strIdUser: req.userData.strMatricula
                }).count().then((result) => {
                    let percentage = (result * 100) / fetchSubject.arrQuizzes.length
                    obj = {
                        strName: fetchSubject.strName,
                        _id: fetchSubject._id,
                        intCompleted: percentage
                    }
                    resultGroup.strSubjects.push(obj);
                    if(resultGroup.strSubjects.length === fetchGroup.strSubjects.length) {
                        return res.status(200).json(resultGroup);
                    }
                });
            });
        });
    }).catch((error) => {
        return res.status(404).json({
            message: "no group was found"
        });
    })
});

//----------------------------------------------------------
router.delete('/delete', checkAuth, function (req, res, next) {
    if(!req.body.strGrpKey) {
        return res.status(400).json({
            message: "empty group key to delete"
        });
    }

    Group.findOneAndRemove({
        strIdCreator: req.userData.strMatricula,
        strGrpKey: req.body.strGrpKey
    }).then((result) => {
        if(!result) {
            return res.status(404).json({
                message: "no group found"
            });
        }

        return res.status(200).json({
            message: "group deleted successfully"
        });
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
    //find by key and user created
});

//----------------------------------------------------------
router.post('/create', checkAuth, function (req, res, next) {
    //Check if any missing field
    if (!req.body.strGrpKey || !req.body.strName) {
        return res.status(400).json({
            message: 'missing field'
        });
    }

    //create a group object
    let newGroup = {
        strName: req.body.strName,
        strGrpKey: req.body.strGrpKey,
        strIdCreator: req.userData.strMatricula
    };
    //inserted
    Group.create(newGroup).then((result) => {
        return res.status(200).json({
            message: "Group created successfully"
        });
    }).catch((error) => {
        return res.status(403).json({
            message: "Group already exists"
        });
    });
});

//----------------------------------------------------------
router.put('/join', checkAuth,(req, res, next) => {

    //check body
    if(!req.body.strGrpKey) {
        return res.status(400).json({
            message: "No group key giving"
        });
    }


    let groupFetch;
    Group.findOne({strGrpKey: req.body.strGrpKey})
        .then((group) => {
            if(!group) {
                return res.status(401).json({
                    message: "no group found"
                });
            }
            return group;
        }).then((result) => {
        groupFetch = result;
        if(groupFetch.strIdCreator === req.userData.strMatricula) {
            return res.status(402).json({
                message: "You cannot be part of a group you created"
            });
        }

        if (groupFetch.strParticipants.includes(
            req.userData.strMatricula
        )) {
            return res.status(402).json({
                message: "You are already part of this group"
            });
        }else {
            groupFetch.strParticipants.push(req.userData.strMatricula);
            Group.updateOne({strGrpKey: req.body.strGrpKey}, groupFetch)
                .then((result) => {
                    return res.status(200).json({
                        message: "You have been added to the group"
                    });
            }).catch((error) => {
                return res.status(500).json({
                    message: error
                })
            });
        }
    }).catch((error) => {
        return res.status(500).json({
            message: error
        });
    });
});

/* Add subject to group */
//----------------------------------------------------------
router.post('/addSubject', checkAuth, function (req, res, next) {
    if(!req.body.strIdGroup || !req.body.strIdSubject) {
        return res.status(404).json({
            message: "missing a field"
        });
    }

    let fetchSubject, fetchGroup;
    //search for the subject
    Subject.findOne({
        _id: req.body.strIdSubject,
        strIdCreator: req.userData.strMatricula
    }).then((result) => {
        fetchSubject = result;
        //Search for the group
        Group.findOne({
            _id: req.body.strIdGroup,
            strIdCreator: req.userData.strMatricula
        }).then((result) => {
            fetchGroup = result;
            if(
                fetchGroup.strSubjects.includes(fetchSubject._id)
            ) {
                return res.status(400).json({
                    message: "the subject is already part of the group"
                });
            } else {
                //update the group
                fetchGroup.strSubjects.push(fetchSubject._id);
                Group.findByIdAndUpdate(
                    {_id: fetchGroup._id},
                    fetchGroup
                ).then((result) => {
                    return res.status(200).json({
                        message: "subject was added to the group"
                    });
                }).catch((error) => {
                    return res.status(500).json({
                        message: error
                    });
                });
            }
        }).catch((error) => {
            return res.status(404).json({
                message: "no group was found"
            });
        })
    }).catch((error) => {
        return res.status(404).json({
            message: "no subject was found"
        });
    })
});

/* Remove a subject from a group */
//----------------------------------------------------------
router.post('/removeSubject', checkAuth, (req, res, next) => {
    if(!req.body.strIdGroup || !req.body.strIdSubject) {
        return res.status(404).json({
            message: "missing a field"
        });
    }

    let fetchSubject, fetchGroup;
    //search for the subject
    Subject.findOneAndDelete({
        _id: req.body.strIdSubject,
        strIdCreator: req.userData.strMatricula
    }).then((result) => {
        fetchSubject = result;
        Group.findOne({
            _id: req.body.strIdGroup,
            strIdCreator: req.userData.strMatricula
        }).then((result) => {
            fetchSubject = result;
            if(
                !fetchGroup.strSubjects.includes(fetchSubject._id)
            ) {
                return res.status(400).json({
                    message: "the subject is not part of the group"
                });
            } else {
                //update the group
                let index = fetchGroup.strSubjects.indexOf(fetchSubject._id);
                fetchGroup.strSubjects.splice(index,1);
                Group.findByIdAndUpdate(
                    {_id: fetchGroup._id},
                    fetchGroup
                ).then((result) => {
                    return res.status(200).json({
                        message: "subject remove from group"
                    });
                }).catch((error) => {
                    return res.status(500).json({
                        message: error
                    });
                });
            }
        }).catch((error) => {
            return res.status(404).json({
                message: "no group found"
            });
        })
    }).catch((error) => {
        return res.status(404).json({
            message: "no subject was found"
        });
    })
});

module.exports = router;
