const mongoose = require('mongoose');

// hyyNENMTWt3B8H1e
const url = 'mongodb+srv://nekhlesh:hyyNENMTWt3B8H1e@cluster0.meelq6m.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {

    console.log("Successfully connected to database!! ");
})
    .catch((err) => {
        if (err) {
            console.log("Error occured while connecting to database!");
        }
    })

module.exports = mongoose;