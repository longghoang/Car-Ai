const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faceSchema = new Schema({
    descriptors: {
        type: [[Number]],
        required: true
    },
    capturedAt: {
        type: Date,
        default: Date.now
    }
});

const Face = mongoose.model('Face', faceSchema);

module.exports = Face;
