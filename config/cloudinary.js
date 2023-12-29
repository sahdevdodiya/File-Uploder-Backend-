const cloudinary = require("cloudinary").v2;

require("dotenv").config();

exports.cloudinaryConnect = () => {
  try {

    //.config mrthod ma you need to define 3 thing's -> cloud anme,api key, api secret
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log(error);
  }
};