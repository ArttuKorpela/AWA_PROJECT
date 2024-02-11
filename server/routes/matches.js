var express = require('express');
var router = express.Router();
const passport = require('../passportConfig');
const Match = require('../Models/Match');
const Users = require('../Models/Users')

//Decode the JWToken header after authentication to fetch the matches associated to that user.
function decodeToken(token) {
    const payload = token.split('.')[1]; // Get the payload
    const decoded = atob(payload);
    return JSON.parse(decoded);
}



async function getMatchesFromDB(user) {
    return await Match.find({
        $or: [
            {userID_1: user.id},
            {userID_2: user.id}
        ]
    });
}
router.get('/all',passport.authenticate("jwt", {session: false}), async (req, res) => {
    // Extract the Authorization header.
    const authHeader = req.headers.authorization;
    let token;
    let matchList = []; //Used to store all match data to be delivered to user

    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the Authorization header
        // 'Bearer ' length is 7, so we slice from the 7th character to the end
        token = authHeader.slice(7, authHeader.length);
    } else {
        throw new Error("Error with bearer tokens in matches");
    }
    //Finally decode the token
    const user_info = decodeToken(token);
    //Get the matches
    const matches = await getMatchesFromDB(user_info);
    if (matches) {
        Promise.all(Object.values(matches).map(async (match) => { //Going through all the matches to find the opposing users
            let matchObject = {
                user: null,
                chatID: null,
            }
            if (match.userID_1 === user_info.id) { //Query the other users info. Don't send the password and email.
                matchObject.user = await Users.findOne({_id: match.userID_2},{password: 0, email: 0})
            } else if (match.userID_2 === user_info.id) {
                matchObject.user = await Users.findOne({_id: match.userID_1},{password: 0, email: 0})
            } else {
                throw new Error("User ID error in match finding");
            }
            matchObject.chatID = match.chatID;
            matchList.push(matchObject);

        })).then(() => {
             if (matchList[0]) {
                 res.status(200).json({message: "Succes", matches: matchList});
             } else {
                 res.status(404).json({message: "No matches found",matches: null})
                }
            }
        )
    }



});

module.exports = router;