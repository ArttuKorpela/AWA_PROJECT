const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require("mongoose")
const body = expressValidator.body;
const validationResult = expressValidator.validationResult;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');dotenv.config();
const Users = require('../Models/Users');
const Like =require('../Models/Like');
const Match = require('../Models/Match');
const Chat = require('../Models/Chat');
const Image = require('../Models/Image');
const passport = require('../passportConfig');
const {matches} = require("validator");




//The secret key is used to sign the JWTokens. It is held in the .env file
const router = express.Router();
const secret_key = process.env.SECRET;
if (!secret_key) {
  console.error("Fatal Error: SECRET is not set in .env file.");
  process.exit(1);
}

//The hash password function is used to encrypt the password. Bcrypt is used with ten rounds of salting
async function hashPassword(password) {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error(error);
  }
}

//Decode token is used to get the user information stored in the JWToken
//
function decodeToken(token) {
  const payload = token.split('.')[1]; // Get the payload
  const decoded = atob(payload);
  return JSON.parse(decoded);
}

function getHeader(authHeader) {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token from the Authorization header
    // 'Bearer ' length is 7, so we slice from the 7th character to the end
    return  authHeader.slice(7, authHeader.length);
  } else {
    throw new Error("Error with bearer tokens in matches");
  }
}

function createExclusionListWithObjectId(users, ownId) {
  // Convert each user ID in the list to a Mongoose ObjectId, including the user's own ID
  let exclusionList = [];
  if (users) {
    users.forEach(user => exclusionList.push(new mongoose.Types.ObjectId(user.user._id)));
  }

  // Add the user's own ID to the list, also converted to ObjectId
  exclusionList.push(new mongoose.Types.ObjectId(ownId));

  return exclusionList;
}

router.post("/login/", async (req,res) => {
  const email = req.body.email;
  const password= req.body.password;

  try {
    //Check if there's a user with the email
    const existing_user = await Users.findOne({email: email});
    if (existing_user) {
      //If there is an email use bcrypt to compare the pasword to the hashed pasword
      bcrypt.compare(password, existing_user.password, (err, match) => {
        if (err) {throw err}//Wrong password
        if (match) {
          //If both email and password are correct create a token
          const jswToken = {
            id: existing_user._id,
            email: existing_user.email,
          };
          //Sign the token with the secret key that's in the .env file
          jwt.sign(jswToken, String(secret_key), {
            expiresIn: 1200 //Change this to set how long a user can be logged in
          }, (err, token) => {
            if (err) {throw err}
            else {
              res.json({
                success: true,
                token: token
              });
            }
          });

        } else {
          res.status(403).json({success: false, errors: "Wrong password"});
        }
      })
    } else {
      return res.status(400).send({success: false, errors:"No user with this email"});
    }
  } catch(err) {
    return res.status(402).send("Error in login");
  }

});

router.post("/register/",
    body("email")
        .isEmail()
        .withMessage("Invalid email address"),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,./?]/)
        .withMessage('Password must contain at least one symbol (~`!@#$%^&*()-_+={}[]|\\;:"<>,./?)'),
    //Check that the email and password are okay



    async (req,res) => {
      const errors = validationResult(req);

      const email = req.body.email;
      const password_plain = req.body.password;


      try {
        //Check that there isn't already a user with the email
        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
          return res.status(403).json({message:"Email taken"})
        }else if (!errors.isEmpty()){
          //If there were errors in the email and password validation
          console.log(errors.array())
          return res.status(400).json({ errors: errors.array() });
        }
        else{

          const first_name = req.body.first_name;
          const last_name = req.body.last_name;
          const punchline = req.body.punchline;
          const bio = req.body.bio;
          const pic_url = req.body.picture_url;
          //Hash the pasword before saving
          const hashed_password = await hashPassword(password_plain);
          //Generate a new user with the data sent in the POST request
          const newUser = new Users({
            email: email,
            password: hashed_password,
            first_name: first_name,
            last_name: last_name,
            punchline: punchline,
            bio: bio,
            picture_url: pic_url

          })
          //Save the user in the database
          await newUser.save();
          res.status(200).json({message:'User created'});
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
      }
    });

  router.post("/user/",passport.authenticate('jwt',{session: false}),(req,res) =>{
    //The users own ID and matches ID's should be excluded
    const authHeader = req.headers.authorization;
    const user = decodeToken(getHeader(authHeader)); //Get user info from the token
    const idList = createExclusionListWithObjectId(req.body.matches, user.id); // Generate a list of ID's

    Users.aggregate([
      { $match: { _id: { $nin: idList } } }, //Match to find id set of id's and then exclude the ones in the list
      {$sample: {size: 1}} //get one user.
    ]).then(randomUsers => {
      if(randomUsers.length) { //Check that there are returned user(s)
        res.status(200).json({success: true, user: randomUsers[0] });
      } else {
        res.status(404).json({success: false, user: null });
      }
    })
      .catch(err => {
        console.error('Error fetching random user:', err);
      });
  })

  //This GET request is just for the profile page to show all relevant information of the current user
  router.get("/profile", passport.authenticate('jwt',{session: false}),async (req, res) => {
    const authHeader = req.headers.authorization;
    const user = decodeToken(getHeader(authHeader)); //Get the users information extracted from the bearer token

    try {
      const userInfo = await Users.findOne({_id: user.id});

      if (!userInfo) {
        res.status(404).json({message:"No user information found", user: null})
      } else {
        res.status(200).json({message: "User found", user: userInfo})
      }
    } catch (error) {throw new Error("Issue in finding user's info " + error)}

  })
//The POST request below is used to update the profile the user
router.post("/update", passport.authenticate('jwt',{session: false}),async (req, res) => {
  const authHeader = req.headers.authorization;
  const user = decodeToken(getHeader(authHeader)); //Get the users information extracted from the bearer token
  const field = req.body.field; // Get the field that's going to be updated
  const value = req.body.value; // Get the value


  try {
    // The user passes the field (for example: first_name) and the value to be put to that field (for example: Arttu)
    //Now they are put into an update object that will be passed onto the Mongoose findByIdAndUpdate function.
    const updateObject = { $set: { [field]: value } };
    //Uses
    const userInfo = await Users.findByIdAndUpdate(user.id, updateObject, { new: true });
    //If the userInfo isn't returned that means the user or the field weren't found
    if (!userInfo) {
      res.status(404).json({message:"No user information found", user: null})
    } else {
      res.status(200).json({message: "User found and updated", user: userInfo})
    }
  } catch (error) {throw new Error("Issue in finding user's info " + error)}

});




 //This POST request is used to check if the users have liked each other.
  router.post("/match/",passport.authenticate('jwt', {session: false}), async (req, res) => {
      const userID = req.body.userID;
      const likeID = req.body.likeID;

      //The Like table is queried to find if likes already exist
      const new_like = await Like.findOne({liker:userID,liked:likeID})
      const reverse_like = await Like.findOne({liker:likeID, liked: userID})

      //If a new_like is found it means the user has liked the user before so no action is taken
      if (new_like) {
        res.status(200).json({message: "like already exists"});
      }
      //If there is no like made before and there doesn't exist a reverse like then a like is created
      else if (!reverse_like) {
        const like = new Like({liker:userID, liked:likeID})
        await like.save();
        res.status(200).json({message: "Like created"});
      }
      else {
        //A match is found! Create the like, Match and Chat tables.
        const like = new Like({liker:userID, liked:likeID});
        await like.save();
        const chat = new Chat({messages:[]}); //Initialize with an empty array
        const saved_chat = await chat.save();
        const match = new Match({
          userID_1: userID,
          userID_2: likeID,
          chatID: saved_chat._id //save the chat id to the match
        });
        await match.save();
        res.status(201).json({message: "A match was found!", chatID: saved_chat._id});
      }
  })

  //This delete request is ONLY used in testing at the moment. It doesn't delete matches or chats.
  router.delete("/",passport.authenticate('jwt', {session: false}), async (req, res) => {
    const authHeader = req.headers.authorization;
    const user = decodeToken(getHeader(authHeader));
    try {
      await Image.deleteOne({name: user.picture_url});
      await Users.deleteOne({_id: user.id})
      res.status(200).json({message: "user with id " + user.id + " deleted"})
    } catch (e) {
      res.status(404).json({message: "No user found"})
    }
  })


module.exports = router;