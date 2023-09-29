const express = require('express');
const port = 3000;
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(expressLayouts);

// SETTING VIEW ENGINE AS EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SETTING ROUTES
app.use('/',require('./routes'));

// STARTING SERVER
app.listen(port, (err)=> {
    if(err)
    {
        console.log("Error occured while creating server ");
        return;
    } 
    console.log("Server created successfully at port : ",port);

}); 