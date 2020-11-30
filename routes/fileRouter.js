const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cloudinary = require('cloudinary').v2;
const Folders = require('../models/folder');
const Files = require('../models/file');

var router = express.Router();
router.use(bodyParser.json());

cloudinary.config({
    
});
/* User Authentication */
router.post('/auth/signIn', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: "Please fill all the fields!" });
        return;
    }

    if (username !== process.env.USER_HANDLE || password !== process.env.PASSWORD) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: "Incorrect Credentials!" });
        return;
    }

    const token = jwt.sign({ _id: password }, process.env.JWT_KEY);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ token });
});

/* Creating a new File */
router.post('/create/newFile', authenticate.verifyUser, (req, res, next) => {
    var file_path = req.body.file.path;
    Files.findOne({ path: file_path }).then((file) => {
        if (file) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: "File name already exists" });
            return;
        }

        Files.create(req.body.file).then((file) => {
            Folders.findOneAndUpdate({ path: req.body.path }, {
                $push: { files: file._id }
            }, { new: true }, (err, result) => {
                if (err) {
                    res.statusCode = 422;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: "Cannot append the file to parent directory" });
                    return;
                }
            });

            console.log("New File Created Successfully");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ file });
        }, (err) => next(err));
    }, (err) => next(err)).catch((err) => next(err));
});

/*Getting all the files and folders */
router.post('/getFiles', authenticate.verifyUser, (req, res, next) => {
    const { path } = req.body;
    Folders.findOne({ path: path })
        .populate("folders")
        .populate("files")
        .then((folder) => {
            if (!folder) {
                res.statusCode = 422;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: "Folder you are trying to access is not present" });
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ folder });
        });
});

/* Deleting a File */
router.post('/deleteFile', authenticate.verifyUser, (req, res, next) => {
    const { id, path } = req.body;
    
    console.log(id, path);
    const parent_dir = path.split("/").slice(0, -1).join("/") + "/";

    Folders.findOneAndUpdate({ path: parent_dir }, {
        $pull: { files: id }
    }, { new: true }, (err, result) => {
        if (err) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: "Cannot find the parent directory" });
            return;
        }
    });

    Files.deleteOne({ _id: id }).then(() => {
        console.log('File deleted in mongodb');
        cloudinary.uploader.destroy("myFiles" + path, function (error, result) {
            console.log(result, error);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        });
    });
});

module.exports = router;