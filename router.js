const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authenticate = require('./authenticate');
const Folders = require('./models/folder');
const Files = require('./models/file');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    res.send("Welcome Nithin");
});

router.get('/check', authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.send("Protected Route Working")
});

/* User Authentication */
router.post('/auth/signIn', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: "Please fill all the fields!"});
        return;
    }

    if (username !== process.env.USER_HANDLE || password !== process.env.PASSWORD) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: "Incorrect Credentials!"});
        return;
    }

    const token = jwt.sign({_id: password}, process.env.JWT_KEY);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({token});
});

/* Creating a new File */
router.post('/create/newFile', authenticate.verifyUser, (req, res, next) => {
    var file_path = req.body.path + req.body.name;
    Files.findOne({path: file_path}).then((file) => {
        if (file) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "File name already exists"});
            return;
        }

        Files.create(req.body.file).then((file) => {
            Folders.findOneAndUpdate({path: req.body.path}, {
                $push: {files: file._id}
            }, {new: true}, (err, result) => {
                if (err) {
                    res.statusCode = 422;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: "Cannot append the file to parent directory"});
                    return;
                }
            });

            console.log("New File Created Successfully");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({file, msg: "File created Successfully"})
        }, (err) => next(err));
    }, (err) => next(err)).catch((err) => next(err));
});

/* Creating a new Folder */
router.post('/create/newFolder', authenticate.verifyUser, (req, res, next) => {
    Folders.findOne({path : req.body.path}).then((folder) => {
        if (folder) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "Folder name already exists"});
            return;
        }

        // if there is no folder with that name then we proceed to create a new one
        Folders.create(req.body).then((folder) => {
            //we also need to add it in it's parent directory list of folders
            var curr_dir = req.body.path;
            var parent_dir = "/" + curr_dir.split('/').slice(1, -2).join('/') + "/";
            if (parent_dir === "//") {
                parent_dir = "/";
            }
            Folders.findOneAndUpdate({path: parent_dir}, {
                $push: {folders: folder._id}
            }, {new: true}, (err, result) => {
                if (err) {
                    res.statusCode = 422;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: "Cannot append the folder to parent directory"});
                    return;
                }
            });
            console.log("New Folder created successfully");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({folder});
        }, (err) => next(err));
    }, (err) => next(err)).catch((err) => next(err));
});

/*Getting all the files and folders */
router.post('/getFiles', authenticate.verifyUser, (req, res, next) => {
    const{ path } = req.body;
    Folders.findOne({path: path})
    .populate("folders")
    .populate("files")
    .then((folder) => {
        if (!folder) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "Folder you are trying to access is not present"});
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({folder});
    });
});


module.exports = router;