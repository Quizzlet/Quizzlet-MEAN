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
const questionRoues = require('./routes/QuestionRoutes');

//Set headers for the requests
//----------------------------------------------------------
app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//Routes to use
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoues);

//Angular
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

module.exports = app;
