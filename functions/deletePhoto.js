const cloudinary = require("cloudinary").v2;

const Account = require("../models/account");
const Photo = require("../models/photo");

const deletePhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photo.findById(photoId);
    const publicId = photo.publicId;

    await photo.delete();

    const account = await Account.findById(req.user._id);

    account.photos.remove(photoId);

    await account.save();

    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = deletePhoto;
