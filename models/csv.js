const mongoose = require('mongoose');

const csvSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    headerRow: {
        type : [Object],
    },
    dataRow: {
        type: [Object],
    },
}, {
    timestamps : true,
});

module.exports = mongoose.model('CSV', csvSchema);