const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const folderSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        required: true
    },

    folders: [{
        type: ObjectId,
        ref: "Folder"
    }],

    files: [{
        type: ObjectId,
        ref: "File"
    }],

    path: {
        type: String,
        required: true,
        unique: true,
    },

    url: {
        type: String,
    }
}, {
    timestamps: true
});

var Folders = mongoose.model("Folder", folderSchema);
module.exports = Folders;