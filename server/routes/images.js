const express = require('express');
const router = express.Router();
const Image = require('../Models/Image');
const Users = require('../Models/Users');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const { getHeader, decodeToken } = require("../jwtTokenHandling");
const upload = multer();
//This post request takes an image in formdata and uploads it to the database
router.post('/upload/', upload.single("image"), async (req, res, next)=>{
    if (!req.file) {
        //If no file is provided then return a status 400
        return res.status(400).json({success: false, message: 'No file provided.'});
    }
    //Create a new image object
    const image = new Image({
        name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`, //Generate a unique name and add the filetype
        data: req.file.buffer,
        contentType: req.file.mimetype,
    });

    //Save the imege to the database
    try {
        await image.save();
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, message: error.message});
    }
    return res.status(201).json({
        success: true,
        message: 'Image created successfully.',
        imageName: image.name,
    });
});
//This post request handles the profile picture update.
// It works similarly to the upload request but it removes the previous image
// and updates the users profile_pic to the new picture.
router.post('/update/', upload.single("image"), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided.' });
    }
    try {
        //The user information is taken from the bearer token
        const token = req.body.token;
        const user = decodeToken(token); // Decode the token to access
        const user_info = await Users.findById(user.id);
        //If no user is found then send status 404
        if (!user_info) {
            return res.status(404).json({ message: "Couldn't find user" });
        }
        //A unique name is generated and the file type is added from the original picture
        const imageName = `${uuidv4()}.${req.file.mimetype.split('/')[1]}`;
        const image = new Image({
            name: imageName,
            data: req.file.buffer,
            contentType: req.file.mimetype,
        });

        await image.save();
        //The users previous picture is removed from the database
        if (user_info.picture_url) {
            await Image.deleteOne({ name: user_info.picture_url });
        }
        //The new picture's name is set to the profile
        await Users.findByIdAndUpdate(user_info.id, { $set: { picture_url: imageName } });
        res.status(200).json({ message: "Picture updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//This get request is just used to show the images in the database
//There is no authorization as anyone can see the pictures anyway if logged in.

router.get('/:name', async (req, res) => {
    //Get the name of the picture from the URL
    const { name: imagename } = req.params
    const image = await Image.findOne({name: imagename});
    //Get the picture from the db
    if (!image) {
        return res.status(404).json({success: false, message: 'Image not found.'});
    }
    // set the response content type
    res.set('Content-Type', image.contentType);

    res.send(image.data);
});

module.exports = router;