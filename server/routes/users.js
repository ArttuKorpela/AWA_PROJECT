const express = require('express');
const expressValidator = require('express-validator');
const body = expressValidator.body;
const validationResult = expressValidator.validationResult;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');dotenv.config();
const Users = require('../Models/Users');
const passport = require('../passportConfig'); //test
console.log(passport)




const router = express.Router();
const secret_key = process.env.SECRET;
if (!secret_key) {
  console.error("Fatal Error: SECRET is not set in .env file.");
  process.exit(1);
}


async function hashPassword(password) {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error(error);
  }
}

router.post("/login/", async (req,res) => {
  const email = req.body.email;
  const password= req.body.password;

  try {
    const existing_user = await Users.findOne({email: email});
    if (existing_user) {
      bcrypt.compare(password, existing_user.password, (err, match) => {
        if (err) {throw err}
        if (match) {

          const jswToken = {
            id: existing_user._id,
            email: existing_user.email,
          };

          jwt.sign(jswToken, String(secret_key), {
            expiresIn: 1200
          }, (err, token) => {
            if (err) {throw err}
            else {
              res.json({
                success: true,
                token: token
              });
            };
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




    async (req,res) => {
      const errors = validationResult(req);

      const email = req.body.email;
      const password_plain = req.body.password;


      try {
        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
          return res.status(403).json({message:"Email taken"})
        }else if (!errors.isEmpty()){
          console.log(errors.array())
          return res.status(400).json({ errors: errors.array() });
        }
        else{

          const first_name = req.body.first_name;
          const last_name = req.body.last_name;
          const punchline = req.body.punchline;
          const bio = req.body.bio;
          const pic_url = req.body.picture_url;
          const hashed_password = await hashPassword(password_plain);
          const newUser = new Users({
            email: email,
            password: hashed_password,
            first_name: first_name,
            last_name: last_name,
            punchline: punchline,
            bio: bio,
            picture_url: pic_url

          })
          await newUser.save();
          res.status(200).json({message:'User created'});
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
      }
    });

  router.post("/user/",passport.authenticate('jwt',{session: false}),(req,res) =>{
    Users.aggregate([
      {$sample: {size: 1}} //get one user. Implement $match here to exclude duplicates
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



module.exports = router;