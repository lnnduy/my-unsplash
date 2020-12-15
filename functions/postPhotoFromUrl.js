const cloudinary = require("cloudinary").v2;

const Photo = require("../models/photo");
const Account = require("../models/account");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const postPhotoFromUrl = async (req, res) => {
  try {
    const { label, url } = req.body;
    const uploadResult = await cloudinary.uploader.upload(url, {
      public_id: "lnnduy/my-unsplash/" + req.user._id + "_" + Date.now(),
      overwrite: true,
      resource_type: "image",
    });

    const photo = new Photo({
      label,
      publicId: uploadResult.public_id,
      url: uploadResult.url,
    });
    const account = await Account.findById(req.user._id);

    await photo.save();

    account.photos.push(photo._id);

    await account.save();

    res.json({
      success: true,
      data: photo,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = postPhotoFromUrl;
