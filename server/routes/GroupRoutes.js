const express = require('express');

const router = express.Router();

const Group = require('../models/group');
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

module.exports = router;
