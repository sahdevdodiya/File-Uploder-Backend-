// Note : we reciive img/video and go to server and server to cloudnary and step 3:-> delete from server
//NOTE : we need to also installl that comunicate with file upload
//pakage for file upload --> npm i express-fileupload --> this upload to server data
//pakage --> cludinary --> upload server to cludinary and delete from server


//app create
const express = require("express");
//const cors = require('cors');
const app = express();

// access environment variables 
require("dotenv").config();
const PORT = process.env.PORT || 4000;

//adding middleware
app.use(express.json());
//app.use(cors());

const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

// connecting to DB
const db = require("./config/database");
db.connect();

// connecting to Cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// Mounting Routes
const Upload = require("./routes/FileUpload_");
app.use('/api/v1/upload', Upload);

// Activating Server
app.listen(PORT, () => {
    console.log(`App is running at PORT ${PORT}`);
})