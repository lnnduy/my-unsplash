const cloudinary = require("cloudinary").v2;

const Photo = require("../models/photo");
const Account = require("../models/account");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const checkPassword = async (req, res) => {
  try {
    const { confirmPassword } = req.body;
    const account = await Account.findById(req.user._id);

    if (await account.comparePassword(confirmPassword))
      res.json({
        success: true,
      });
    else
      res.json({
        success: false,
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

module.exports = checkPassword;
