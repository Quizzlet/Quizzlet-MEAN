const express = require('express');

const router = express.Router();

const Subject = require('../models/subject');
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

//----------------------------------------------------------
router.delete('/delete', checkAuth, function (req, res, next) {

    if(!req.body.id) {
        return res.status(400).json({
            message: "no id was provided"
        });
    }

    Subject.findByIdAndRemove({_id: req.body.id}).then((result) => {
        if(!result) {
           return res.status(404).json({
               message: "no subject found"
           });
        }

        return res.status(200).json({
            message: "subject deleted successfully"
        });
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

module.exports = router;
