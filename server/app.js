const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const imageRouter = require('./routes/images')
const matchRouter = require('./routes/matches')
const path = require('path');
const cors = require('cors');
const express = require('express');
const passport = require("./passportConfig");


const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', () => {
    console.log('Connected to MongoDB');
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(passport.initialize());




app.get('/api/private', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user;
    if (user) {
        res.json( {success: true, email: user.data.email});
    } else {
        res.json({success: false});
    }
});

app.use('/api/user', userRoutes);
app.use('/api/images', imageRouter);
app.use('/api/matches', matchRouter);

//CORS
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("..","client","build")));
    app.get("*",(req,res)=> {
        res.sendFile(path.resolve("..","client","build","index.html"))
    });

} else if (process.env.NODE_ENV === "development") {
    var corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
}

module.exports = app;
