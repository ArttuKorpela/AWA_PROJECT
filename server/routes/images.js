const express = require('express');
const router = express.Router();
const Image = require('../Models/Image');
const multer = require("multer");
const upload = multer();
const { v4: uuidv4 } = require('uuid');

router.post('/upload/', upload.single("image"), async (req, res, next)=>{
    if (!req.file) {
        return res.status(400).json({success: false, message: 'No file provided.'});
    }
    const image = new Image({
        name: `${uuidv4()}.${req.file.mimetype.split('/')[1]}`,
        data: req.file.buffer,
        contentType: req.file.mimetype,
    });

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

router.get('/:name', async (req, res) => {
    console.log(req.params)
    const { name: imagename } = req.params
    const image = await Image.findOne({name: imagename});
    if (!image) {
        return res.status(404).json({success: false, message: 'Image not found.'});
    }
    res.set('Content-Type', image.contentType);
    res.send(image.data);
});

module.exports = router;