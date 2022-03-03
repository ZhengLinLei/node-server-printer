const SERVER_CONFIG = require('./config/server');

// ====================


const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const body_parser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const Controller = require('./controllers/controller');

const app = express();


// Variables
app.set('port', process.env.PORT || SERVER_CONFIG['port']);
app.set('welcome-text',  SERVER_CONFIG['welcome-text']
                        .replace('$port', SERVER_CONFIG['port'])
                        || 'Welcome to node server');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// Middlewares
app.use(cors());
app.use(body_parser.json()); // Post and Get parser
app.use(body_parser.urlencoded({extended: true}))

// Routes
app.use(routes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), ()=>{
    Controller.cleanTMP_(); // Remove all temporal files
    // Server activated
    console.log(app.get('welcome-text'));
});