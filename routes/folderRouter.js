const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cloudinary = require('cloudinary').v2;
const Folders = require('../models/folder');
const Files = require('../models/file');

var router = express.Router();
router.use(bodyParser.json());

//require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Creating a new Folder */
router.post('/create/newFolder', authenticate.verifyUser, (req, res, next) => {
    Folders.findOne({ path: req.body.path }).then((folder) => {
        if (folder) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: "Folder name already exists" });
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
            Folders.findOneAndUpdate({ path: parent_dir }, {
                $push: { folders: folder._id }
            }, { new: true }, (err, result) => {
                if (err) {
                    res.statusCode = 422;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: "Cannot append the folder to parent directory" });
                    return;
                }
            });
            console.log("New Folder created successfully");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ folder });
        }, (err) => next(err));
    }, (err) => next(err)).catch((err) => next(err));
});


/* Downloading a Folder */
router.post('/downloadFolder', authenticate.verifyUser, (req, res, next) => {
    const { path } = req.body;
    Folders.findOne({ path }).then((folder) => {
        if (!folder) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "Folder not present"});
            return;
        }

        if (folder.folders.length == 0 && folder.files.length == 0) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: "Cannot download empty folder"});
            return;
        }
        var url = cloudinary.utils.download_zip_url({
            prefixes: ['myFiles' + path]
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({url});
    });
});

/* Async while loop */
function asyncLoop(iterations, func, callback, foo) {
    var done = false;
    var loop = {
        next: function () {
            if (done) {
                return;
            }

            if (iterations) {
                func(loop);

            } else {
                done = true;
                if (callback) callback(foo);
            }
        },

        isEnd: function () {
            return done;
        },

        refresh: function (it) {
            iterations = it;
        },

        break: function () {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

function bfs (_id ,callback){
    var q = [], subFolders = [], subFiles = [];
    q.push(_id);

    asyncLoop(q.length, function (loop) {
        subFolders.push(q[0]);
        Folders.findOne({ _id: q[0] }).lean().exec(function (err, folder) {
            if (!folder) {
                q.shift();
                loop.next()
            }
            else {
                var sub_folders = folder.folders;
                var sub_files = folder.files;
                if (sub_files.length > 0) {
                    sub_files.forEach(file => {
                        subFiles.push(file);
                    });
                }
                if (err) {
                    console.log(err);
                }
                else {
                    q.shift();
                    loop.refresh(sub_folders.length + q.length);
                    if (sub_folders.length > 0) {
                        sub_folders.forEach(element => {
                            q.push(element);
                        });
                    }
                    loop.next();
                }
            }
        });
    },function(){ callback(subFolders, subFiles) });

}

/* Deleting a Folder */
router.post('/deleteFolder', authenticate.verifyUser, (req, res, next) => {
    const { path } = req.body;

    if (path === "/") {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: "You cannot delete root folder!"});
        return;
    }

    var parent_dir = "/" + path.split('/').slice(1, -2).join('/') + "/";
    if (parent_dir === "//") {
        parent_dir = "/";
    }

    Folders.findOne({ path: path }).lean().exec(function (err, root) {
        if (err) {
            res.statusCode = 422;
            res.setHeader('Content-Type', 'application/json');
            res.json({err});
            return;
        }

        Folders.findOneAndUpdate({ path: parent_dir }, {
            $pull: { folders: root._id }
        }, { new: true }, (err, result) => {
            if (err) {
                res.statusCode = 422;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: "Cannot delete the folder from parent directory" });
                return;
            }
        });

        bfs(root._id, (folders, files) => {
            console.log(folders);
            console.log(files);

            Folders.deleteMany({_id: { $in: folders}}, function (err) {
                if(err) console.log(err);
                console.log("SubFolders deleted");
            });
            Files.deleteMany({_id: { $in: files}}, function (err) {
                if(err) console.log(err);
                console.log("SubFiles deleted");
            });

            cloudinary.api.delete_resources_by_prefix('myFiles' + path, (err, result) => {
                console.log(result, err);
                cloudinary.api.delete_folder('myFiles' + path, (err, result) => {
                    console.log(result, err);
                });
            });
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "Folder deleted!"});
    });
});

module.exports = router;