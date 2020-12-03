const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const fileSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        required: true
    },

    path: {
        type: String,
        required: true,
        unique: true
    },

    isShareable: {
        type: Boolean,
        required: true,
        default: false
    },

    url: {
        type: String,
        required: true
    }, 

    size: {
        type: String
    }
}, {
    timestamps: true
});

var Files = mongoose.model("File", fileSchema);
module.exports = Files;