//how you can upload fromlocal to server 
//localfileuplod function and 
//postman-post type-body-type- form-data - name the key to {file (bc we mantion ->const file = req.files.  file  )}
//next at value collum post your img or video
//inshore that you make one folder name files in controller (all file's go to that forlder bc we mention name her {const file = req.  files  .file})

const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

//localfileupload -> handler function (pc to file upload)
exports.localFileUpload = async (req, res) => {
    try {
        //fetch file from request
        //it's syntax remember for upload file from local storage
        const file = req.files.file;
        console.log("File received -> ", file);

        //create path where file need to be stored on server
        //__dirname --> current working directry(here controller) ne show kare
        //Date.now() alway's give diffrent number so
        let path =
            __dirname + "/files/" + Date.now()  +
            // here write bc file name thi  jpg kadh va ke aa type che
            `.${file.name.split(".")[1]}`;
        console.log("PATH-> ", path);

        //add path to the move function (move that file)
        file.mv(path, (err) => {
            console.log(err);
        });

        //create a successful response
        res.json({
            success: true,
            message: "Local File Uploaded Successfully",
        });
    } catch (error) {
        console.log("Not able to upload the file on server");
        console.log(error);
    }
};

//image uplod to cloudinary -->data fetch --> validatiion{file formate support kare ke nay}
//upload to clodinary --> db save --> success responce
// what should you write in postman
// post-->url like /upload/imageupload --> body--> from-data --> at key write name,tags,email and at imageFile and select file


//make function say type aa supported array ma ave ke nay?
function isFileTypeSupported(Filetype, supportedTypes) {
    return supportedTypes.includes(Filetype);
}

function isLargeFile(fileSize) {
    // converting bytes ito megabytes
    const mbSize = fileSize / (1024 * 1024);
    console.log("filesize is --> ", mbSize);
    return mbSize > 5;
}

// this functio we upload to cloudinary so use many time so we can make function just copy and past
async function uploadFileToCloudinary(file, folder, quality) {
    // const options = {folder};
    
    // // auto detect file type when you work with cloudinary
    // options.resource_type = "auto";
    
    const options = { 
        folder: folder,
        resource_type: "auto",

        // these 3 lines will help to keep the original filename in the database
        public_id: file.name,
        use_filename: true,
        unique_filename: false
    };

    console.log("temp file path", file.tempFilePath);

    if (quality) {
        options.quality = quality;
    } 

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


// imageUpload handler
exports.imageUpload = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);


        // here imageFile show the name of we file upload
        const file = req.files.imageFile;
        console.log(file);

        //Validation {kya kya time support kare}
        const supportedTypes = ["jpg", "jpeg", "png"];
        //apdi file type kadvi
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        //file format is supported  
        console.log("Uploading to Cloudinary");
        //here mention the folder u creat at cloudinary { sahdevFile } & name give at key { here file }
        const response = await uploadFileToCloudinary(file, "sahdevFile");
        console.log(response);

        //Save entry in DB
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded",
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


//step's fetch data -->video duration(size) --> upload to cludinary --> db save --> success full responce 

//videoUpload Handler
exports.videoUpload = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

        //Validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        // add a upper limit of 5MB for Video
        const fileSize = file.size;
        if(isLargeFile(fileSize)){
            return res.status(400).json({
                success: false,
                message: 'Files greater than 5mb are not supported'
            })
        }

        //file format and size are supported
        console.log("Uploading to Cloudinary");

        const response = await uploadFileToCloudinary(file, "sahdevFile");
        console.log(response);

        //Saving Entry in DB
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Video Successfully Uploaded",
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


//imageSizeReducer handler
exports.imageSizeReducer = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        //add a upper limit of 5MB for image
        const fileSize = file.size;
        if (isLargeFile(fileSize)) {
            return res.status(400).json({
                success: false,
                message: "Files greater than 5mb are not supported",
            });
        }

        //file format and size are supported
        console.log("Uploading to Cloudinary");


        //COMPRESS using width and height - options = {width: 800, height: 600}
        //compressing using quality property of options objects
        const response = await uploadFileToCloudinary(file, "sahdevFile", 30);
        console.log(response);

        // Saving Entry in DB
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded",
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            
        });
    }
};