const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json()); //to decode the jsons from the bodys
app.use(bodyParser.urlencoded({ extend: false}));

//connection to mongoDB
mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW +'@quizzlet-adxqe.mongodb.net/Quizzlet')
    .then(() => {
        console.log('Connected to our database');
    }).catch(() => {
        console.log('connection failed');
    });

//Routes
const userRoutes = require('./routes/UserRoutes');
const groupRoutes = require('./routes/GroupRoutes');
const subjectRoutes = require('./routes/SubjectRoutes');
const quizRoutes = require('./routes/QuizRoutes');

//Set headers for the requests
//----------------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    next();
});

//Routes to use
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);
//Angular
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

 module.exports = app;
